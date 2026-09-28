/* HYPER-FEYNMAN · content/spin-states.js — Spin and two-state systems (FLP III-5 to III-12):
 * Stern–Gerlach filters for spin one and spin one-half, amplitudes in time, the Hamiltonian matrix, the ammonia
 * maser, two-state systems everywhere and the hyperfine splitting of hydrogen. Simulations in sims/spin-states.js. */
Hyper.add(

{
  id: 'stern-gerlach-filters', parent: 'spin-states', title: 'Spin one: filtering atoms', level: 2,
  short: 'A magnet with a sharply non-uniform field sorts atoms of spin one into three beams: +, 0 and −. Chains of such filters, turned at different angles, show how quantum amplitudes transform from one set of states to another — and that blocking a beam can let more atoms through.',
  keywords: ['Stern–Gerlach', 'spin one', 'filter', 'base states', 'magnetic moment', 'rotation matrix', 'beam splitting', 'space quantization', 'field gradient', 'transformation of amplitudes', 'wide-open filter', 'Feynman apparatus S T U'],
  prereq: ['probability-amplitudes', 'physics:electron-spin', 'math:matrix-multiplication'],
  related: ['spin-half', 'hamiltonian-matrix', 'paramagnetism-nmr', 'magnetism-of-matter', 'angular-momentum-quantum', 'polarization-feyn', 'physics:quantum-numbers', 'math:linear-transformations'],
  body: `
An atom with a magnetic moment behaves like a tiny compass needle. In a uniform magnetic field it is only twisted; in a field that is much stronger on one side than the other it is also pushed — towards the strong side or away from it, depending on which way the needle points. In 1922 Otto Stern and Walther Gerlach sent silver atoms between the poles of such a magnet. Needles pointing every which way would have smeared the beam into a band. Instead it split into separate spots: the direction of an atom's magnet is quantised.

### Three beams
Feynman built his course on quantum mechanics around an idealised version of their magnet. Take atoms of **spin one** — total angular momentum one unit of $\\hbar$ ([[?hbar]]). In a magnet whose field grows sharply upwards they come out in exactly **three** beams: the component of the magnetic moment along the field can take only three values, so each atom goes up (the **+** beam), straight on (**0**) or down (**−**). The push comes from the [[?gradient]] of the field, not from the field itself:

$$F_z = \\mu_z\\,\\frac{\\partial B}{\\partial z}$$

Two more magnets bend the three beams back together, and a mask where they are apart can block any of them. The result is a **filter**. Feynman called one such apparatus S, a second one T and a third U, each of which may be turned about the beam's axis.

### Filters in series
Put two filters in a row, both upright. If S lets through only its + beam, T passes every one of those atoms through its + beam and none through 0 or −: atoms from a + beam are in a definite state, and asking the same question again gets the same answer. Now turn T by an angle $\\alpha$. The atoms are no longer sure of anything at T, but quantum mechanics gives the fractions exactly. For each pair of beams there is an [[?amplitude]] $\\langle jT\\,|\\,iS\\rangle$ — the amplitude that an atom in state $i$ of S is found in state $j$ of T — and the nine of them form a 3 × 3 [[?matrix]]. The fractions are their [[?absolute-square|absolute squares]]:

$$P_{+}=\\left(\\frac{1+\\cos\\alpha}{2}\\right)^2,\\qquad P_{0}=\\frac{\\sin^2\\alpha}{2},\\qquad P_{-}=\\left(\\frac{1-\\cos\\alpha}{2}\\right)^2$$

| T turned by | into + | into 0 | into − |
|---|---|---|---|
| 0° | 1 | 0 | 0 |
| 30° | 0.871 | 0.125 | 0.004 |
| 60° | 0.563 | 0.375 | 0.063 |
| 90° | 0.25 | 0.5 | 0.25 |
| 180° | 0 | 0 | 1 |

Each row adds up to 1. Turned right over, T simply calls S's + beam its − beam.

### Blocking a beam can let atoms through
Let S pass only +, and let U — upright like S — pass only −. Nothing gets through: + and − exclude each other. Now put T between them, turned by 90°, with **all three beams open**. T sorts the atoms into three beams and puts them back together, and still nothing reaches the end. The three ways through T cannot be told apart, so their amplitudes add ([[?sum]]):

$$\\langle -U\\,|\\,+S\\rangle = \\sum_{j=+,0,-} \\langle -U\\,|\\,jT\\rangle\\langle jT\\,|\\,+S\\rangle$$

At $\\alpha = 90°$ the three terms are $+\\tfrac14$, $-\\tfrac12$ and $+\\tfrac14$: they cancel, exactly as if T were not there. A wide-open filter does nothing. Now **block T's 0 beam**. The middle term is gone, the total amplitude is $\\tfrac12$, and a quarter of the atoms leaving S reach the end. Closing a path let atoms through — something bullets, whose probabilities only ever add, could never do.

### Base states
The three beams of any one filter are a complete set of [[?base-states|base states]]: every state of a spin-one atom is a [[?superposition]] of +, 0 and −, described by three amplitudes. A filter turned another way gives another complete set, and the matrix $\\langle jT|iS\\rangle$ translates between them the way a rotation matrix converts the components of a [[?vector]]. The rule in the sum above — put in a complete set of states and add — is the machinery for the rest of quantum mechanics, as [[spin-half]] and [[hamiltonian-matrix]] go on to show.

> [!tip] In the simulation the atoms from the oven pass S, T and U in turn. It starts with T turned by 90° and its 0 beam blocked: a quarter of S's atoms arrive. Click the mask on T's 0 beam to open it — and the arrivals stop.

> [!key] Which states a filter picks out depends on how it is turned. The amplitudes for going from one filter's states to another's form a matrix; when several ways through are open, their amplitudes add — so a wide-open filter changes nothing, and blocking a beam can change everything.
`,
  ideas: [
    'A non-uniform magnetic field pushes an atom according to the component of its magnetic moment along the field; spin-one atoms come out in exactly three beams.',
    'Filters in series: a second filter turned by α sends S\'s + atoms into its +, 0 and − beams with probabilities ((1 + cos α)/2)², sin²α/2 and ((1 − cos α)/2)².',
    'The amplitudes ⟨jT|iS⟩ form a matrix that transforms the description from one filter\'s base states to another\'s.',
    'A wide-open filter changes nothing: the amplitudes of its indistinguishable beams add back to the original.',
    'Blocking one beam of a middle filter can let atoms through that were cancelled before.'
  ],
  pitfalls: [
    'A filtered + atom still has a hidden 0 or − part that a turned filter reveals — The atom is in a definite state, + for S; a turned filter T asks a different question, and only amplitudes (not a hidden list of answers) decide what it answers.',
    'Blocking a beam can only reduce the number of atoms getting through — Only if probabilities added. Amplitudes of indistinguishable paths can cancel, and removing one of them can raise the total.',
    'The three beams mean the atom is a little magnet pointing in one of three directions — The component along the field takes three values whichever way the magnet is turned; the atom has no classical direction that the filter merely reads off.'
  ],
  formulas: [
    {
      name: 'Spin one: probability of keeping the + state in a turned filter',
      expr: 'P = ((1 + cos(alpha))/2)^2', tex: 'P_{+} = \\left(\\dfrac{1 + \\cos\\alpha}{2}\\right)^2',
      vars: {
        P: { name: 'probability that a + atom of S passes the + beam of T', min: 0, max: 1, tex: 'P_{+}' },
        alpha: { name: 'angle T is turned relative to S', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\alpha' }
      },
      note: 'Rotation about the beam axis. The other two beams get sin²α/2 (0) and ((1 − cos α)/2)² (−).',
      stories: {
        P: 'Atoms from the + beam of S enter a filter T turned by {alpha}. What fraction leaves through T\'s + beam?',
        alpha: 'A fraction {P} of S\'s + atoms leaves through T\'s + beam. By what angle is T turned?'
      }
    },
    {
      name: 'Spin one: probability of going into the 0 beam',
      expr: 'P0 = sin(alpha)^2/2', tex: 'P_{0} = \\dfrac{\\sin^2\\alpha}{2}',
      vars: {
        P0: { name: 'probability that a + atom of S leaves through the 0 beam of T', min: 0, max: 0.5, tex: 'P_{0}' },
        alpha: { name: 'angle T is turned relative to S', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\alpha' }
      },
      note: 'Largest (one half) at 90°. Two angles, α and 180° − α, give the same fraction.',
      stories: { P0: 'What fraction of S\'s + atoms goes through the 0 beam of a filter turned by {alpha}?' }
    },
    {
      name: 'How far a Stern–Gerlach magnet pushes an atom',
      expr: 'z = mu*G*L^2/(2*m*v^2)', tex: 'z = \\dfrac{\\mu_z\\, G\\, L^2}{2 m v^2}',
      vars: {
        z: { name: 'sideways deflection at the end of the magnet', q: 'length', unit: 'mm' },
        mu: { name: 'component of the magnetic moment along the field', q: 'mdipole', unit: 'µB', value: 1, tex: '\\mu_z' },
        G: { name: 'field gradient ∂B/∂z', unit: 'T/m', value: 1000 },
        L: { name: 'length of the magnet', q: 'length', unit: 'cm', value: 3.5 },
        m: { name: 'mass of the atom', q: 'mass', unit: 'u', value: 108 },
        v: { name: 'speed of the atoms', q: 'speed', unit: 'm/s', value: 550 }
      },
      note: 'Constant force F = μ_z ∂B/∂z for a time L/v: z = ½(F/m)(L/v)². The beams separate by twice this for moments of ±μ.',
      stories: {
        z: 'Silver atoms ({m}, moment {mu}) cross a magnet {L} long with a gradient of {G} at {v}. How far is each pushed sideways?',
        G: 'Atoms of mass {m} and moment {mu} fly at {v} through a magnet {L} long. What gradient pushes them {z} aside?'
      }
    }
  ],
  examples: [
    {
      title: 'Sharing out the atoms at 60°',
      q: '10 000 atoms leave the + beam of S and enter T, turned by 60°. How many leave through each of T\'s beams?',
      steps: [
        '$\\cos 60° = 0.5$, so $P_+ = (1.5/2)^2 = 0.5625$.',
        '$P_0 = \\sin^2 60°/2 = 0.75/2 = 0.375$.',
        '$P_- = (0.5/2)^2 = 0.0625$. Check: $0.5625 + 0.375 + 0.0625 = 1$.'
      ],
      a: 'About 5625 through +, 3750 through 0 and 625 through − (with the usual statistical scatter of about ±50).'
    },
    {
      title: 'The blocked beam that lets atoms through',
      q: 'S passes +, T is turned by 90°, U is upright and passes only −. What fraction of the atoms leaving S reach the end with T wide open, and with T\'s 0 beam blocked?',
      steps: [
        'At 90° the amplitudes from $+S$ into T are $\\tfrac12$, $\\tfrac{1}{\\sqrt2}$, $\\tfrac12$ (for +, 0, −) up to signs; from T\'s beams into $-U$ they are $\\tfrac12$, $-\\tfrac{1}{\\sqrt2}$, $\\tfrac12$.',
        'Multiply along each way: $+\\tfrac14$ (via +), $-\\tfrac12$ (via 0), $+\\tfrac14$ (via −).',
        'All open: $\\tfrac14 - \\tfrac12 + \\tfrac14 = 0$ — nothing arrives, as without T.',
        'Block 0: $\\tfrac14 + \\tfrac14 = \\tfrac12$; squared, $\\tfrac14$.'
      ],
      a: 'None with T wide open; one quarter with T\'s 0 beam blocked.'
    },
    {
      title: 'How big is the split?',
      q: 'Silver atoms (108 u) with a moment of one Bohr magneton fly at 550 m/s through a magnet 3.5 cm long with a gradient of 1000 T/m (10 T per centimetre). How far is each pushed aside?',
      steps: [
        'Force $F = \\mu_z G = 9.27\\times10^{-24} \\times 1000 = 9.27\\times10^{-21}$ N; acceleration $F/m = 9.27\\times10^{-21}/1.79\\times10^{-25} = 5.2\\times10^{4}$ m/s².',
        'Time in the magnet $L/v = 0.035/550 = 6.4\\times10^{-5}$ s.',
        '$z = \\tfrac12 \\times 5.2\\times10^4 \\times (6.4\\times10^{-5})^2 = 1.05\\times10^{-4}$ m.'
      ],
      a: 'About 0.1 mm each way — a split of a fifth of a millimetre, visible as two separate traces on a plate.'
    }
  ],
  quiz: [
    { q: 'S passes only +. T is identical and upright but passes only 0. What fraction of S\'s atoms gets through T?', choices: ['none', 'one third', 'one half', 'all'], a: 0, why: 'An atom in the + state of S is certainly + in an identical filter; its amplitude for 0 is zero.' },
    { q: 'T is turned by 180° (upside down). Where do the + atoms of S go?', choices: ['all through T\'s − beam', 'all through T\'s + beam', 'a third through each beam', 'half through + and half through −'], a: 0, why: 'At α = 180°, P₋ = ((1 − cos 180°)/2)² = 1: turned over, T calls S\'s up its down.' },
    { q: 'Between S (passing +) and U (upright, passing −) a filter T turned by 60° is placed with all three beams open. What fraction reaches the end?', choices: ['none', '0.375', '0.25', '0.0625'], a: 0, why: 'A wide-open filter changes nothing: the three indistinguishable ways add back to the amplitude without T, which is zero.' },
    { q: 'At α = 90°, what fraction of S\'s + atoms leave through T\'s 0 beam?', answer: 0.5, why: 'P₀ = sin²90°/2 = 1/2.' },
    { q: 'Why do spin-one atoms make exactly three beams, not a smear?', choices: ['the component of the moment along the field can take only three values', 'the magnet has three poles', 'the atoms collide into three groups', 'the oven emits three kinds of atom'], a: 0, why: 'The quantised component of angular momentum (+ħ, 0, −ħ) gives three forces, whatever the orientation of the magnet.' }
  ],
  problems: [
    { q: 'By what angle must T be turned so that exactly half of the + atoms from S pass T\'s + beam?', answer: 65.5, unit: '°', tol: 0.01, hint: 'Solve ((1 + cos α)/2)² = 0.5.',
      steps: ['$(1 + \\cos\\alpha)/2 = \\sqrt{0.5} = 0.7071$.', '$\\cos\\alpha = 0.4142$, so $\\alpha = 65.5°$.'] },
    { q: 'S passes +, T is turned by 60° and passes only 0, U is upright and passes only +. What fraction of the atoms leaving S reach the end?', answer: 0.1406, unit: '', tol: 0.02, hint: 'Only one way through T is open, so multiply the two probabilities.',
      steps: ['From $+S$ into $0T$: $\\sin^2 60°/2 = 0.375$.', 'From $0T$ into $+U$ (U upright, T turned by 60° relative to it): again $0.375$.', '$0.375 \\times 0.375 = 0.1406$.'] }
  ],
  applications: [
    'Caesium beam clocks select atoms by their magnetic state with Stern–Gerlach-type magnets before and after the microwave cavity.',
    'Rabi\'s molecular-beam magnetic resonance method (1938) — the ancestor of NMR, MRI and atomic clocks — is a chain of Stern–Gerlach filters with a radio-frequency field between them.',
    'Measuring a quantum bit in a chosen basis is, in principle, a filter turned to that basis; quantum computers rotate states the way these filters are turned.'
  ],
  history: 'Otto Stern and Walther Gerlach did the experiment in Frankfurt in 1922 with silver atoms and saw the beam split in two. At the time it was read as proof of the "space quantisation" of the old quantum theory; the electron spin that actually explains it was proposed by George Uhlenbeck and Samuel Goudsmit in 1925. Stern received the Nobel Prize in Physics for 1943, for the molecular-beam method and the magnetic moment of the proton. Feynman\'s three-beam filter that recombines its beams is an idealised apparatus, used to make the logic of amplitudes as clear as possible.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 5 (Spin One) — filtering atoms with a Stern–Gerlach apparatus, filters in series, base states, interfering amplitudes and transforming to a turned apparatus.',
    'Vol. III, ch. 3 (Probability Amplitudes) — the rules for combining amplitudes used here.',
    'Vol. II, ch. 35 (Paramagnetism and Magnetic Resonance) — quantised magnetic states, the Stern–Gerlach experiment and Rabi\'s molecular-beam method.'
  ],
  sim: 'spin-sg-one'
},

{
  id: 'spin-half', parent: 'spin-states', title: 'Spin one-half', level: 2,
  short: 'Electrons, protons, neutrons and silver atoms have spin one-half: a Stern–Gerlach magnet splits them into just two beams. The amplitude to pass a filter tilted by θ is cos(θ/2) — so a full turn of 360° changes the sign of the amplitude, and a filter at 90° slipped between two crossed filters lets atoms through.',
  keywords: ['spin one-half', 'spin 1/2', 'two beams', 'up and down', 'half angle', 'spinor', 'rotation by 360 degrees', 'crossed filters', 'three filters', 'silver atoms', 'electron spin', 'qubit', 'Pauli'],
  prereq: ['stern-gerlach-filters', 'probability-amplitudes', 'math:complex-numbers'],
  related: ['hamiltonian-matrix', 'amplitudes-in-time', 'polarization-feyn', 'hyperfine-21cm', 'exclusion-principle', 'identical-particles', 'physics:electron-spin', 'physics:polarization'],
  body: `
Silver has 47 electrons. All but one are paired, their magnets cancelling, and the odd one out gives the atom its magnetic moment. That electron has **spin one-half**: its angular momentum along any axis you choose to measure is $+\\hbar/2$ or $-\\hbar/2$, nothing else. So Stern and Gerlach saw **two** spots, not three. Electrons, protons, neutrons and quarks — all the particles matter is built from — are spin one-half.

### Two beams, two base states
A spin-one-half filter has two beams, **+** ("up") and **−** ("down"). Any state is a [[?superposition]] of the two [[?base-states|base states]], so it takes only two amplitudes to describe it — the simplest system quantum mechanics has, today called a qubit. Turn a second filter T by an angle $\\theta$ about the beam axis. An atom that left S's + beam passes T's + beam with [[?amplitude]] and probability

$$\\langle +T\\,|\\,+S\\rangle = \\cos\\frac{\\theta}{2},\\qquad P_{+} = \\cos^2\\frac{\\theta}{2}$$

and T's − beam with probability $\\sin^2(\\theta/2)$. The **half angle** is the signature of spin one-half. At 90° the atoms divide equally; at 180°, with T upside down, all go into its − beam. (For spin one, the + fraction was $\\cos^4(\\theta/2)$; for spin $j$ it is $\\cos^{4j}(\\theta/2)$.)

| T tilted by | 0° | 60° | 90° | 120° | 180° |
|---|---|---|---|---|---|
| passes T's + beam | 1 | 0.75 | 0.5 | 0.25 | 0 |

### A turn of 360° is not nothing
Turning the coordinates about the field axis by an angle $\\phi$ multiplies the two amplitudes by $e^{-i\\phi/2}$ and $e^{+i\\phi/2}$ — [[?rotating-arrow|arrows]] that turn half as fast as the apparatus ([[?euler-formula]]). Put $\\phi = 360°$: both amplitudes change sign. A full turn brings a spin-one-half state back to minus itself; only a second full turn restores it. On its own the sign is invisible — probabilities are [[?absolute-square|absolute squares]] — but it shows when a turned beam interferes with an unturned one. In 1975 neutron interferometer experiments (by Helmut Rauch's group and by Samuel Werner and colleagues) turned the neutron spins in one arm with a magnetic field and found the interference reversed at 360° and restored at 720°.

### Every state points somewhere
For spin one-half, every pair of amplitudes is "up" along *some* direction: a spin pointing at polar angle $\\theta$ and azimuth $\\phi$ has $C_+ = \\cos(\\theta/2)\\,e^{-i\\phi/2}$ and $C_- = \\sin(\\theta/2)\\,e^{+i\\phi/2}$ ([[?complex-number|complex numbers]], whose relative [[?phase]] sets $\\phi$). There is no spin-one-half state that is not "+" for some filter. That is why a two-state system of any kind can be pictured as an arrow — see [[two-state-systems]].

### Three filters
Let S pass +, and let U, turned by 180°, pass its own + beam — which is S's −. Nothing gets through: crossed filters. Now slip a filter T at 90° between them. S's atoms pass T with probability $\\cos^2 45° = \\tfrac12$, and T's atoms pass U with probability $\\cos^2 45° = \\tfrac12$: a **quarter** of them now get through. Adding a filter, which can only remove atoms, has let atoms through. T erased the fact "up along z" and replaced it with "up along x", which has an even chance of being up along −z. With $N$ filters at equal steps the fraction is

$$P = \\left[\\cos\\frac{\\pi}{2(N+1)}\\right]^{2(N+1)}$$

which rises towards 1 as $N$ grows ([[?limit]]): 25 % for one filter, 42 % for two, 78 % for nine. Light does the same with polarisers — 0°, 45°, 90° — at half the angles, because a photon's polarisation behaves like a spin-one-half arrow turned twice as fast ([[polarization-feyn]]).

> [!tip] In the simulation the crossed filters start with one filter at 90° between them. Turn it towards 0° or 180° and watch the counts fall to zero; then add more filters and watch nearly all the atoms creep round from up to down.

> [!key] Spin one-half: two base states, amplitudes $\\cos(\\theta/2)$ and $\\sin(\\theta/2)$ for a filter tilted by $\\theta$. The half angle makes a 360° turn change the sign — and makes every state "up" along some direction.
`,
  ideas: [
    'Spin-one-half particles make two beams: the component of spin along any axis is +ħ/2 or −ħ/2.',
    'A + atom passes a filter tilted by θ with amplitude cos(θ/2) and probability cos²(θ/2).',
    'Turning by 360° multiplies a spin-one-half amplitude by −1; only 720° restores it — seen in neutron interference.',
    'Every spin-one-half state is "up" along some direction in space.',
    'A filter at 90° between two crossed filters lets a quarter of the atoms through; many small steps let almost all through.'
  ],
  pitfalls: [
    'Spin one-half means the particle spins at half a turn per second — It means the angular momentum along any axis is ±ħ/2; nothing is literally a spinning ball, and the value is the same for every electron.',
    'A turn of 360° must return everything exactly to what it was — For spin one-half the amplitudes change sign; the effect is invisible alone but real in interference.',
    'A middle filter can only remove atoms, so three filters must pass fewer than two — Each filter changes the state it passes on; the middle filter replaces "up along z" with a state that has a chance of being down along z.'
  ],
  formulas: [
    {
      name: 'Spin one-half: probability of passing a tilted filter',
      expr: 'P = cos(theta/2)^2', tex: 'P_{+} = \\cos^2\\dfrac{\\theta}{2}',
      vars: {
        P: { name: 'probability that a + atom passes the + beam of the tilted filter', min: 0, max: 1, tex: 'P_{+}' },
        theta: { name: 'angle between the two filters', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'The − beam gets sin²(θ/2). Compare spin one: ((1 + cos θ)/2)² = cos⁴(θ/2).',
      stories: {
        P: 'Electrons polarised up along z meet a filter tilted by {theta}. What fraction passes its + beam?',
        theta: 'A fraction {P} of + atoms passes a tilted filter. By what angle is it tilted?'
      }
    },
    {
      name: 'Three filters: a middle one between crossed filters',
      expr: 'P = sin(theta)^2/4', tex: 'P = \\dfrac{\\sin^2\\theta}{4}',
      vars: {
        P: { name: 'fraction of the atoms leaving the first filter that pass the last', min: 0, max: 0.25 },
        theta: { name: 'angle of the middle filter (the last is at 180°)', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'cos²(θ/2) · cos²((180° − θ)/2) = cos²(θ/2) sin²(θ/2) = sin²θ/4. Without the middle filter, zero.',
      stories: {
        P: 'Crossed spin filters (0° and 180°) have a third filter at {theta} between them. What fraction of the atoms leaving the first passes the last?',
        theta: 'With a middle filter between crossed filters, {P} of the atoms get through. At what angle is it?'
      }
    },
    {
      name: 'Many small steps: N filters evenly spaced from up to down',
      expr: 'P = cos(pi/(2*(N + 1)))^(2*(N + 1))', tex: 'P = \\left[\\cos\\dfrac{\\pi}{2(N+1)}\\right]^{2(N+1)}',
      vars: {
        P: { name: 'fraction passing all the filters (of those leaving the first)', min: 0, max: 1 },
        N: { name: 'number of filters between the crossed pair', int: true, value: 9, min: 0, max: 200 }
      },
      note: 'N + 1 steps of 180°/(N + 1), each passed with probability cos²(90°/(N + 1)). Tends to 1 as N grows.',
      stories: { P: '{N} filters are spaced evenly between a filter passing up and one passing down. What fraction gets through them all?' }
    }
  ],
  examples: [
    {
      title: 'Tilted by 60°, then back',
      q: 'Electrons polarised up along z pass a filter tilted by 60°; those that pass meet an upright filter passing up. What fraction of the original electrons passes both?',
      steps: [
        'First filter: $\\cos^2 30° = 0.75$.',
        'The survivors are "up at 60°"; the upright filter is tilted by $-60°$ relative to them: again $0.75$.',
        '$0.75 \\times 0.75 = 0.5625$.'
      ],
      a: '56 %: the tilted filter has made a quarter of the up electrons fail an upright test they would all have passed.'
    },
    {
      title: 'Two filters between crossed ones',
      q: 'Between a filter passing up (0°) and one passing down (180°) put filters at 60° and 120°. What fraction of the atoms leaving the first gets through?',
      steps: [
        'Three steps of 60°, each passed with probability $\\cos^2 30° = 0.75$.',
        '$0.75^3 = 0.4219$ — the formula with $N = 2$.'
      ],
      a: 'About 42 %, against 25 % with one middle filter and 0 with none.'
    },
    {
      title: 'The sign of a full turn',
      q: 'A spin state has amplitudes $C_+ = 1$, $C_- = 0$. What are they after the apparatus is turned by 360° about the field axis? And what probabilities?',
      steps: [
        'The amplitudes become $e^{-i\\phi/2}C_+$ and $e^{i\\phi/2}C_-$ with $\\phi = 2\\pi$.',
        '$e^{-i\\pi} = -1$, so $C_+ \\to -1$, $C_- \\to 0$.',
        'Probabilities $|{-1}|^2 = 1$ and $0$: unchanged.'
      ],
      a: 'The state becomes minus itself, with the same probabilities; the sign shows only in interference.'
    }
  ],
  quiz: [
    { q: 'An up atom meets a filter tilted by 180°. What happens?', choices: ['it certainly leaves through the − beam', 'it certainly passes the + beam', 'even chances', 'it is absorbed by the magnet'], a: 0, why: 'cos²(90°) = 0 for +; sin²(90°) = 1 for −.' },
    { q: 'What fraction of up atoms passes a filter tilted by 90°?', answer: 0.5, why: 'cos²45° = 1/2.' },
    { q: 'Turning a spin-one-half state by 360° returns its amplitudes exactly to what they were.', a: false, why: 'They change sign (e^{−iπ} = −1). Only a 720° turn restores them.' },
    { q: 'Crossed filters (up, then down) pass nothing. A filter at 90° is put between them. What fraction of the atoms leaving the first now gets through?', choices: ['one quarter', 'none', 'one half', 'one eighth'], a: 0, why: 'cos²45° × cos²45° = 1/4.' },
    { q: 'For spin one-half, every state is "up" along some direction.', a: true, why: 'Any pair (C₊, C₋) can be written as cos(θ/2)e^{−iφ/2}, sin(θ/2)e^{iφ/2} up to an overall phase: up along (θ, φ).' }
  ],
  problems: [
    { q: 'By what angle must a filter be tilted so that 90 % of up atoms pass its + beam?', answer: 36.9, unit: '°', tol: 0.01, hint: 'cos²(θ/2) = 0.9.',
      steps: ['$\\cos(\\theta/2) = \\sqrt{0.9} = 0.9487$.', '$\\theta/2 = 18.43°$, so $\\theta = 36.9°$.'] },
    { q: 'Five filters are spaced evenly between a filter passing up and one passing down. What fraction of the atoms leaving the first passes all of them?', answer: 0.66, unit: '', tol: 0.02, hint: 'Six steps of 30°.',
      steps: ['Each step passes $\\cos^2 15° = 0.9330$.', '$0.9330^6 = 0.66$.'] }
  ],
  applications: [
    'Magnetic resonance imaging and NMR flip proton spins — spin one-half — with radio waves.',
    'Spin-polarised electrons and neutrons probe magnetic materials; spin filters are the basis of the read heads in hard disks (spin valves).',
    'A spin one-half is the model qubit of quantum computing: every single-qubit gate is a turn of the arrow.'
  ],
  history: 'Stern and Gerlach saw the two beams of silver in 1922; in 1927 T. E. Phipps and J. B. Taylor found the same two beams with hydrogen atoms, whose single electron has no orbital angular momentum in the ground state — the splitting comes from the electron itself. Uhlenbeck and Goudsmit proposed the electron\'s spin in 1925 and Wolfgang Pauli gave it its two-component mathematics in 1927. The sign change under a 360° turn was confirmed with neutron interferometers in 1975.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 6 (Spin One-Half) — transforming amplitudes to a turned apparatus, rotations about the z-axis, rotations of 180° and 90°, and arbitrary rotations.',
    'Vol. III, ch. 5 (Spin One) — the filters, base states and transformation rules that this chapter applies to two beams.',
    'Vol. III, ch. 11 (More Two-State Systems) — the Pauli spin matrices and the polarisation states of the photon.'
  ],
  sim: 'spin-sg-half'
},

{
  id: 'amplitudes-in-time', parent: 'spin-states', title: 'How amplitudes change in time', level: 3,
  short: 'A state of definite energy E has an amplitude that turns like a clock hand, e^{−iEt/ħ}, at frequency E/h — and its probabilities never change: it is stationary. Mix two energies and the arrows turn at different rates, so probabilities beat at the difference frequency. Travelling waves, forces and precessing spins all follow.',
  keywords: ['stationary state', 'time dependence', 'e^{-iEt/hbar}', 'phase', 'energy and frequency', 'beats', 'Bohr frequency', 'de Broglie wave', 'classical limit', 'precession', 'Larmor frequency', 'superposition of energies', 'particle in a box'],
  prereq: ['probability-amplitudes', 'algebra-complex-numbers', 'wave-and-particle'],
  related: ['hamiltonian-matrix', 'spin-half', 'beats-feyn', 'schrodinger-equation-feyn', 'classical-limit', 'paramagnetism-nmr', 'math:eulers-formula', 'physics:wavefunction'],
  body: `
### A stationary state
Take an atom at rest in a state of definite energy $E$. Feynman's starting point is that the amplitude to find it in that state at time $t$ is

$$C(t) = C(0)\\,e^{-iEt/\\hbar}$$

an [[?amplitude]] of fixed length whose direction turns like a clock hand ([[?rotating-arrow]], [[?euler-formula]]) at frequency $f = E/h$. The [[?probability]] $|C|^2$ never changes, which is why such a state is called **stationary**. If $E$ includes the rest energy $mc^2$ the frequency is enormous: $2.3\\times10^{23}$ Hz for a proton. Nothing observable depends on it. Shifting the zero of energy by $V_0$ multiplies every amplitude by the same factor $e^{-iV_0t/\\hbar}$, and turning all the arrows together changes no probability. Only **differences** of energy show.

### Two energies: beats
Now mix two stationary states with energies $E_1$ and $E_2$. Their arrows turn at different rates. The probability of anything that involves both — finding the particle at a given place, or in some third state — contains an interference term $2|a_1a_2|\\cos\\left((E_2-E_1)t/\\hbar + \\delta\\right)$, which rises and falls at the **beat frequency**

$$f = \\frac{E_2 - E_1}{h}$$

just as two tuning forks of slightly different pitch beat ([[beats-feyn]]). This is Bohr's rule seen from inside: the light an atom emits when it drops from $E_2$ to $E_1$ has the frequency at which its charge sloshes while it is in a mixture of the two states.

The simulation puts an electron in a box 0.6 nm wide. The lowest state has $E_1 = 1.04$ eV and the next $E_2 = 4.18$ eV. Alone, each gives a still cloud of probability, even though its arrow spins. Mixed, the cloud sloshes from wall to wall once every $h/(E_2 - E_1) = 1.32$ fs.

### A particle on the move
For an atom moving with momentum $p$ along $x$ the amplitude is a travelling wave,

$$C(x,t) \\propto e^{-i(Et - px)/\\hbar}$$

— a [[?wave-function]] with wavelength $\\lambda = h/p$. The arrows turn in time at $E/h$ and in space at $p/h$ turns per metre. A packet of such waves travels at the group velocity $dE/dp$ ([[?derivative]]), which is the particle's ordinary velocity.

### Potential energy and force
Where the potential energy is $V$, the total energy stays $E$ but the kinetic part $E - V$ is smaller, so the momentum is smaller and the wavelength longer. A wave crossing a slope in $V$ bends like light entering glass — towards the side where its wavelength is shorter, the side of lower potential energy. Feynman showed that this bending is Newton's $F = -dV/dx$ when the wavelength is short compared with the distance over which $V$ changes: classical mechanics is the short-wavelength limit ([[classical-limit]]).

### A spin that precesses
A spin one-half in a magnetic field $B$ has two stationary states, up and down, with energies $\\mp\\mu B$. A spin pointing sideways is an equal mixture of them. As their arrows turn at different rates, the [[?phase]] between them grows at $2\\mu B/\\hbar$ — and a changing phase between $C_+$ and $C_-$ *is* a turning direction ([[spin-half]]). The spin precesses about the field at

$$f = \\frac{2\\mu B}{h}$$

42.58 MHz per tesla for a proton — the radio frequency of every MRI scanner — and 28.0 GHz per tesla for an electron.

> [!key] A state of definite energy is stationary: its amplitude turns at E/h and its probabilities never change. Everything that moves in quantum mechanics — beats, precessing spins, sloshing charge, travelling particles — comes from arrows turning at different rates.
`,
  ideas: [
    'A state of definite energy E has an amplitude proportional to e^{−iEt/ħ}: an arrow turning at E/h with a constant length.',
    'Only energy differences are observable; adding a constant to every energy turns all arrows together.',
    'A superposition of two energies beats: probabilities oscillate at (E₂ − E₁)/h — the frequency of the light emitted between the levels.',
    'A moving particle\'s amplitude is a wave e^{−i(Et − px)/ħ}; its bending where the potential changes reproduces F = −dV/dx in the classical limit.',
    'A spin one-half in a field B precesses at 2μB/h: 42.58 MHz per tesla for protons.'
  ],
  pitfalls: [
    'If the arrow of a stationary state turns, something about the atom must be changing — Every probability is the square of a length, and the length does not change; only a phase, which alone is unobservable, turns.',
    'The frequency E/h of a single state can be measured — Only differences of energy (beats) are observable; the zero of energy, and with it E/h, is arbitrary.',
    'A superposition of energies is a state that is "really" in one of them, we just do not know which — A mixture of that kind would not beat; the sloshing comes from the interference of the two arrows.'
  ],
  formulas: [
    {
      name: 'Beat frequency of two stationary states (Bohr\'s rule)',
      expr: 'f = dE/h', tex: 'f = \\dfrac{\\Delta E}{h}',
      vars: {
        f: { name: 'beat (and emitted-light) frequency', q: 'frequency', unit: 'THz' },
        dE: { name: 'energy difference E₂ − E₁', q: 'energy', unit: 'eV', value: 3.13, tex: '\\Delta E' },
        h: { const: 'h' }
      },
      note: 'The same relation gives the frequency of the photon emitted or absorbed between the two levels.',
      stories: { f: 'Two stationary states differ by {dE}. At what frequency does a mixture of them beat?', dE: 'A superposition beats at {f}. How far apart are the two energies?' }
    },
    {
      name: 'Energy levels of a particle in a box',
      expr: 'E = n^2*h^2/(8*m*L^2)', tex: 'E_n = \\dfrac{n^2 h^2}{8 m L^2}',
      vars: {
        E: { name: 'energy of the level', q: 'energy', unit: 'eV', tex: 'E_n' },
        n: { name: 'level number', int: true, value: 2, min: 1, max: 50 },
        h: { const: 'h' },
        m: { const: 'me', name: 'mass of the particle', tex: 'm' },
        L: { name: 'width of the box', q: 'length', unit: 'nm', value: 0.6 }
      },
      note: 'Hard walls: a whole number of half wavelengths fits in L. The simulation mixes two of these levels.',
      stories: { E: 'An electron sits in level {n} of a box {L} wide. What is its energy?', L: 'Level {n} of an electron in a box has energy {E}. How wide is the box?' }
    },
    {
      name: 'Precession of a spin one-half in a magnetic field',
      expr: 'f = 2*mu*B/h', tex: 'f = \\dfrac{2\\mu B}{h}',
      vars: {
        f: { name: 'precession frequency', q: 'frequency', unit: 'MHz' },
        mu: { name: 'magnetic moment (proton: 1.4106 × 10⁻²⁶ J/T)', q: 'mdipole', unit: 'J/T', value: 1.4106e-26, tex: '\\mu' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1.5 },
        h: { const: 'h' }
      },
      note: 'The up and down states differ in energy by 2μB. Electron: μ = 9.285 × 10⁻²⁴ J/T, 28.0 GHz per tesla.',
      stories: { f: 'At what frequency do protons precess in an MRI magnet of {B}?', B: 'Protons are to precess at {f}. What field is needed?' }
    },
    {
      name: 'How fast the arrow of a particle at rest turns',
      expr: 'f = m*c^2/h', tex: 'f = \\dfrac{mc^2}{h}',
      vars: {
        f: { name: 'frequency of the amplitude', q: 'frequency', unit: 'Hz' },
        m: { name: 'rest mass', q: 'mass', unit: 'u', value: 1.00728 },
        c: { const: 'c' },
        h: { const: 'h' }
      },
      note: 'Unobservable by itself: only differences of such frequencies matter.',
      stories: { f: 'How many times a second does the amplitude of a particle of mass {m} at rest turn round?' }
    }
  ],
  examples: [
    {
      title: 'The clock inside an electron',
      q: 'How fast does the amplitude of an electron at rest turn, counting its rest energy of 0.511 MeV?',
      steps: [
        '$f = E/h = 0.511\\times10^{6}\\ \\mathrm{eV} / 4.136\\times10^{-15}\\ \\mathrm{eV\\,s}$.',
        '$f = 1.24\\times10^{20}$ Hz: one turn every $8\\times10^{-21}$ s.'
      ],
      a: 'About 1.2 × 10²⁰ turns a second — and no experiment can see it, because only differences of such rates are observable.'
    },
    {
      title: 'A sloshing electron in a box',
      q: 'An electron in a box 0.6 nm wide is put in an equal mixture of its two lowest states. How often does its probability cloud slosh, and what light would it emit?',
      steps: [
        '$E_1 = h^2/(8mL^2) = (6.626\\times10^{-34})^2/(8 \\times 9.109\\times10^{-31} \\times (0.6\\times10^{-9})^2) = 1.67\\times10^{-19}$ J $= 1.045$ eV.',
        '$E_2 = 4E_1 = 4.18$ eV, so $E_2 - E_1 = 3.13$ eV.',
        'Period $h/(E_2 - E_1) = 4.136\\times10^{-15}/3.13 = 1.32\\times10^{-15}$ s.',
        'Wavelength of the matching light $hc/\\Delta E = 1240\\ \\mathrm{eV\\,nm}/3.13\\ \\mathrm{eV} = 396$ nm.'
      ],
      a: 'Once every 1.32 fs — the frequency of violet light at 396 nm.'
    },
    {
      title: 'The radio frequency of an MRI scanner',
      q: 'Protons have μ = 1.4106 × 10⁻²⁶ J/T. At what frequency do they precess in 1.5 T and in 3 T?',
      steps: [
        '$f = 2\\mu B/h = 2 \\times 1.4106\\times10^{-26} \\times 1.5 / 6.626\\times10^{-34} = 6.39\\times10^{7}$ Hz.',
        'The frequency is proportional to $B$: at 3 T, $1.28\\times10^{8}$ Hz.'
      ],
      a: '63.9 MHz at 1.5 T and 127.7 MHz at 3 T — in the FM radio band, which is why MRI rooms are shielded.'
    }
  ],
  quiz: [
    { q: 'An atom is in a stationary state. The probability of finding it at a given place…', choices: ['never changes', 'oscillates at E/h', 'decreases as the arrow turns', 'is zero between turns'], a: 0, why: 'The amplitude only turns; its length — and so every probability — stays fixed.' },
    { q: 'Every energy in a problem is raised by the same constant V₀. What changes that could be measured?', choices: ['nothing', 'all frequencies of emitted light rise by V₀/h', 'the probabilities', 'the wavelengths of moving particles'], a: 0, why: 'All arrows turn faster by the same amount; differences, and so everything observable, are unchanged.' },
    { q: 'A superposition of states with energies 2 eV and 5 eV beats at what frequency, in THz?', answer: 725, unit: 'THz', why: 'f = (5 − 2) eV / 4.136 × 10⁻¹⁵ eV s = 7.25 × 10¹⁴ Hz.' },
    { q: 'A particle moves into a region of higher potential energy (but still less than its total energy). Its wavelength…', choices: ['gets longer', 'gets shorter', 'stays the same', 'becomes imaginary'], a: 0, why: 'Less kinetic energy means less momentum, and λ = h/p grows.' },
    { q: 'Doubling the magnetic field doubles the precession frequency of a spin.', a: true, why: 'The up and down energies are ∓μB, so their difference, and f = 2μB/h, is proportional to B.' }
  ],
  problems: [
    { q: 'An electron in a box 1.0 nm wide is put in a mixture of its two lowest states. What is the period of the sloshing, in femtoseconds?', answer: 3.67, unit: 'fs', tol: 0.02, hint: 'E_n = n²h²/(8mL²); period h/(E₂ − E₁).',
      steps: ['$E_1 = h^2/(8mL^2) = 6.02\\times10^{-20}$ J $= 0.376$ eV.', '$E_2 - E_1 = 3E_1 = 1.128$ eV.', 'Period $= 4.136\\times10^{-15}/1.128 = 3.67\\times10^{-15}$ s.'] },
    { q: 'What magnetic field makes protons (μ = 1.4106 × 10⁻²⁶ J/T) precess at 100 MHz?', answer: 2.35, unit: 'T', tol: 0.02, hint: 'B = hf/(2μ).',
      steps: ['$B = hf/(2\\mu) = 6.626\\times10^{-34} \\times 10^{8}/(2 \\times 1.4106\\times10^{-26})$.', '$B = 2.35$ T.'] }
  ],
  applications: [
    'Atomic clocks count the beats between two energy levels of caesium (9 192 631 770 per second defines the second).',
    'MRI and NMR listen to proton spins precessing at 2μB/h; the frequency tells where the proton is and what surrounds it.',
    'Quantum beats between close levels are used in spectroscopy to measure splittings too small to resolve in a spectrum.'
  ],
  history: 'Niels Bohr\'s rule that light of frequency (E₂ − E₁)/h is emitted between two levels (1913) came before quantum mechanics; Louis de Broglie\'s waves (1924) and Erwin Schrödinger\'s equation (1926) explained it. Felix Bloch and Edward Purcell observed nuclear magnetic resonance in bulk matter in 1946, and shared the 1952 Nobel Prize for it.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 7 (The Dependence of Amplitudes on Time) — atoms at rest and stationary states, uniform motion, potential energy and energy conservation, forces and the classical limit, and the precession of a spin one-half particle.',
    'Vol. I, ch. 48 (Beats) — adding two waves of nearly equal frequency.',
    'Vol. II, ch. 35 (Paramagnetism and Magnetic Resonance) — precession of magnetic moments and nuclear magnetic resonance.'
  ],
  sim: 'spin-stationary'
},

{
  id: 'hamiltonian-matrix', parent: 'spin-states', title: 'The Hamiltonian matrix', level: 3,
  short: 'How do amplitudes change in time? iħ dCᵢ/dt = Σⱼ Hᵢⱼ Cⱼ: the Hamiltonian matrix tells each amplitude how it is fed by the others. For two states coupled by −A, the stationary states are the sum and the difference, with energies E₀ − A and E₀ + A — and a system started in one state flip-flops to the other at frequency 2A/h.',
  keywords: ['Hamiltonian', 'Hamiltonian matrix', 'Schrödinger equation', 'two-state system', 'coupling', 'flip-flop', 'stationary states', 'eigenvalue', 'energy splitting', 'Rabi oscillation', 'base states', 'state vector', 'Hermitian'],
  prereq: ['amplitudes-in-time', 'spin-half', 'math:matrices', 'math:eigenvalues'],
  related: ['ammonia-maser', 'two-state-systems', 'hyperfine-21cm', 'stern-gerlach-filters', 'schrodinger-equation-feyn', 'operators-feyn', 'resonance-feyn', 'physics:schrodinger-equation', 'math:linear-transformations'],
  body: `
Stationary states are the easy case. What if a system is *not* in a state of definite energy — an ammonia molecule known to have its nitrogen on top, an electron known to sit on one of two protons? Feynman's answer is the most compact statement of quantum dynamics.

### States as lists of amplitudes
Choose a complete set of [[?base-states|base states]] $|i\\rangle$ — the beams of a filter, the places an electron can sit, whatever is convenient. Any state $|\\psi\\rangle$ is then described by its amplitudes $C_i = \\langle i|\\psi\\rangle$ ([[?bra-ket]]), as a [[?vector]] is described by its [[?components]]. Feynman asked what the "true" base states of the world are, and answered that nobody knows and nothing depends on it: we pick a set, and can change to any other with a transformation matrix like those of [[stern-gerlach-filters]].

### How the amplitudes change
Over a short time $\\Delta t$ each amplitude changes by an amount proportional to $\\Delta t$ and fed by all the amplitudes:

$$C_i(t+\\Delta t) = \\sum_j \\left[\\delta_{ij} - \\frac{i}{\\hbar} H_{ij}\\,\\Delta t\\right] C_j(t)$$

The [[?kronecker-delta]] $\\delta_{ij}$ says that to first order nothing happens; the numbers $H_{ij}$ say how fast amplitude leaks from state $j$ into state $i$. Letting $\\Delta t \\to 0$ gives a set of [[?differential-equation|differential equations]]:

$$i\\hbar\\,\\frac{dC_i}{dt} = \\sum_j H_{ij}\\,C_j$$

The array $H_{ij}$ is the **Hamiltonian [[?matrix]]**. For the total probability $\\sum|C_i|^2$ to stay 1 it must be [[?hermitian]]: $H_{ji} = H_{ij}^*$. A diagonal element $H_{ii}$ is the energy state $i$ would have if left alone; the off-diagonal elements couple the states. Everything about a system is in its $H$ — and finding it is the hard part. For simple systems Feynman guessed its form from symmetry and took the numbers from experiment.

### Two states
The simplest interesting case: two base states with the same energy $E_0$ and an amplitude to hop between them, written $-A$:

$$H = \\begin{pmatrix} E_0 & -A \\\\ -A & E_0 \\end{pmatrix}$$

Look for stationary states $C_i = a_i e^{-iEt/\\hbar}$. Substituting turns the equations into the [[?eigenvalue]] problem of the matrix, with two solutions:

| stationary state | amplitudes | energy |
|---|---|---|
| the sum | $a_1 = a_2 = 1/\\sqrt2$ | $E_0 - A$ |
| the difference | $a_1 = -a_2 = 1/\\sqrt2$ | $E_0 + A$ |

The coupling splits one energy into two, $2A$ apart.

### Flip-flop
Start the system surely in state 1. That is not stationary: it is the sum plus the difference, and the two turn at different rates. The result is

$$C_1 = e^{-iE_0t/\\hbar}\\cos\\frac{At}{\\hbar},\\qquad C_2 = i\\,e^{-iE_0t/\\hbar}\\sin\\frac{At}{\\hbar}$$

The probability flows entirely into state 2 after $t = h/4A$ and back again ([[?sine-cosine]]): it sloshes at $f = 2A/h$, the splitting divided by $h$. Two identical pendulums joined by a weak spring do the same — the swinging passes from one to the other and back at a rate set by the coupling.

### Unequal energies
If the diagonal energies differ by $\\delta = H_{11} - H_{22}$, the stationary energies are $\\bar E \\pm \\tfrac12\\sqrt{\\delta^2 + 4A^2}$ ([[?square-root]]) and the transfer is incomplete: at most

$$P_{\\mathrm{max}} = \\frac{4A^2}{\\delta^2 + 4A^2}$$

of the probability reaches state 2. States far apart in energy hardly mix; states of equal energy mix completely.

> [!tip] In the simulation, drag the coupling A and the difference δ. With δ = 0 the probability swings completely from one state to the other; raise δ and the swing becomes smaller and faster. Start in a stationary state and nothing moves at all.

> [!key] iħ dC/dt = HC: the Hamiltonian matrix tells every amplitude how it is fed by the others. Two equal states coupled by −A become the sum (E₀ − A) and the difference (E₀ + A); started in one of them, a system flip-flops at 2A/h.
`,
  ideas: [
    'A state is a list of amplitudes on a chosen set of base states, like the components of a vector.',
    'The amplitudes obey iħ dCᵢ/dt = Σⱼ Hᵢⱼ Cⱼ; the Hamiltonian matrix H must be Hermitian so that probability is conserved.',
    'Stationary states are the eigenvectors of H and their energies its eigenvalues.',
    'Two equal states coupled by −A split into the sum (E₀ − A) and the difference (E₀ + A).',
    'Started in one base state, the system flip-flops completely at 2A/h; with unequal energies the swing is partial, at most 4A²/(δ² + 4A²).'
  ],
  pitfalls: [
    'The base states are the states the system is really in — They are a chosen description; the stationary states of a coupled pair are mixtures of them, and a system prepared in one of them does not stay there.',
    'The coupling A makes state 1 decay into state 2 for good — Nothing is lost: the probability swings back and forth for ever (until something else, such as radiation or a collision, interferes).',
    'A bigger energy difference δ makes the transfer faster and so more complete — The oscillation is faster but smaller: at most 4A²/(δ² + 4A²) reaches the other state.'
  ],
  derivation: {
    title: 'Stationary states and the flip-flop of two coupled states',
    steps: [
      { text: 'Put the guess Cᵢ = aᵢ e^{−iEt/ħ} into iħ dCᵢ/dt = Σ Hᵢⱼ Cⱼ. The derivative brings down −iE/ħ, and iħ times that is E; the turning factor cancels on both sides.', tex: 'E\\,a_i = \\sum_j H_{ij}\\,a_j' },
      { text: 'For two states with H₁₁ = H₂₂ = E₀ and H₁₂ = H₂₁ = −A this is a pair of equations.', tex: '(E - E_0)\\,a_1 = -A\\,a_2,\\qquad (E - E_0)\\,a_2 = -A\\,a_1' },
      { text: 'Multiply them together and divide by a₁a₂: the energy can only be E₀ − A or E₀ + A.', tex: '(E - E_0)^2 = A^2 \\;\\Rightarrow\\; E = E_0 \\mp A' },
      { text: 'Put each energy back into either equation to get the amplitudes: E₀ − A needs a₂ = a₁ (the sum), E₀ + A needs a₂ = −a₁ (the difference).', tex: 'E_0 - A:\\; a_1 = a_2,\\qquad E_0 + A:\\; a_1 = -a_2' },
      { text: 'State 1 is half the sum plus half the difference (in amplitudes). Each part turns at its own rate; adding the two exponentials gives a cosine (Euler\'s formula).', tex: 'C_1 = \\tfrac12\\left(e^{-i(E_0-A)t/\\hbar} + e^{-i(E_0+A)t/\\hbar}\\right) = e^{-iE_0t/\\hbar}\\cos\\frac{At}{\\hbar}' },
      { text: 'Subtracting instead gives the amplitude for state 2; its square sin²(At/ħ) rises from 0 to 1 in t = πħ/2A = h/4A.', tex: '|C_2|^2 = \\sin^2\\frac{At}{\\hbar} = \\tfrac12\\left(1 - \\cos\\frac{2At}{\\hbar}\\right)' }
    ]
  },
  formulas: [
    {
      name: 'Flip-flop frequency of two equal coupled states',
      expr: 'f = 2*A/h', tex: 'f = \\dfrac{2A}{h}',
      vars: {
        f: { name: 'frequency of the probability swing', q: 'frequency', unit: 'GHz' },
        A: { name: 'coupling (amplitude per unit time × ħ to hop)', q: 'energy', unit: 'eV', value: 5e-6 },
        h: { const: 'h' }
      },
      note: 'Equal diagonal energies. 2A is also the energy splitting of the two stationary states.',
      stories: { f: 'Two states of equal energy are coupled with A = {A}. How often does the probability swing back and forth?', A: 'A two-state system flip-flops at {f}. What is the coupling A?' }
    },
    {
      name: 'Splitting of the stationary states',
      expr: 'dE = sqrt(d^2 + 4*A^2)', tex: '\\Delta E = \\sqrt{\\delta^2 + 4A^2}',
      vars: {
        dE: { name: 'energy difference of the two stationary states', q: 'energy', unit: 'eV', tex: '\\Delta E' },
        d: { name: 'difference of the diagonal energies H₁₁ − H₂₂', q: 'energy', unit: 'eV', value: 3e-5, signed: true, tex: '\\delta' },
        A: { name: 'coupling', q: 'energy', unit: 'eV', value: 2e-5 }
      },
      note: 'With δ = 0 the splitting is 2A; with δ ≫ A it is nearly δ. The probability oscillates at ΔE/h.',
      stories: { dE: 'Two states differ in energy by {d} and are coupled by A = {A}. How far apart are the stationary states?' }
    },
    {
      name: 'How much probability can cross (Rabi\'s formula)',
      expr: 'Pmax = 4*A^2/(d^2 + 4*A^2)', tex: 'P_{\\mathrm{max}} = \\dfrac{4A^2}{\\delta^2 + 4A^2}',
      vars: {
        Pmax: { name: 'largest probability of reaching state 2 from state 1', min: 0, max: 1, tex: 'P_{\\mathrm{max}}' },
        d: { name: 'difference of the diagonal energies', q: 'energy', unit: 'eV', value: 3e-5, signed: true, tex: '\\delta' },
        A: { name: 'coupling', q: 'energy', unit: 'eV', value: 2e-5 }
      },
      note: 'Started in state 1: P₂(t) = P_max sin²(πΔE t/h). Half the probability crosses when δ = 2A.',
      stories: { Pmax: 'States with an energy difference of {d} are coupled by {A}. At most, what probability of the second state does a system started in the first reach?' }
    }
  ],
  examples: [
    {
      title: 'A flip-flop in numbers',
      q: 'Two states of equal energy are coupled with A = 5 µeV. How often does the probability swing, and when is the system first certainly in state 2?',
      steps: [
        '$f = 2A/h = 2 \\times 5\\times10^{-6}\\ \\mathrm{eV} / 4.136\\times10^{-15}\\ \\mathrm{eV\\,s} = 2.42\\times10^{9}$ Hz.',
        'Complete transfer at $t = h/4A = 4.136\\times10^{-15}/(2\\times10^{-5}) = 2.07\\times10^{-10}$ s.'
      ],
      a: '2.42 GHz; certainly in state 2 after 0.21 ns.'
    },
    {
      title: 'When the energies differ',
      q: 'Now H₁₁ − H₂₂ = 30 µeV and A = 20 µeV. What is the splitting, how often does the probability oscillate, and how much crosses?',
      steps: [
        '$\\Delta E = \\sqrt{30^2 + 4\\times20^2} = \\sqrt{900 + 1600} = 50\\ \\mu$eV.',
        'Oscillation at $\\Delta E/h = 50\\times10^{-6}/4.136\\times10^{-15} = 1.21\\times10^{10}$ Hz.',
        '$P_{\\mathrm{max}} = 1600/2500 = 0.64$.'
      ],
      a: 'Split by 50 µeV; the probability swings at 12.1 GHz, and at most 64 % reaches state 2.'
    },
    {
      title: 'Checking a stationary state',
      q: 'Show that the sum state (1, 1)/√2 is stationary for H = [[E₀, −A], [−A, E₀]].',
      steps: [
        'Multiply: first row $E_0 \\cdot 1 + (-A)\\cdot 1 = E_0 - A$; second row $(-A)\\cdot 1 + E_0 \\cdot 1 = E_0 - A$.',
        'So $H(1,1) = (E_0 - A)(1,1)$: the vector comes back multiplied by a number — an eigenvector with eigenvalue $E_0 - A$.',
        'Its amplitudes then just turn together as $e^{-i(E_0 - A)t/\\hbar}$, and the probabilities stay ½ and ½.'
      ],
      a: 'It is stationary, with energy E₀ − A.'
    }
  ],
  quiz: [
    { q: 'A two-state system with equal energies and coupling A starts in state 1. When is it first certainly in state 2?', choices: ['t = h/4A', 't = h/2A', 't = h/A', 'never'], a: 0, why: 'P₂ = sin²(At/ħ) reaches 1 when At/ħ = π/2, i.e. t = πħ/2A = h/4A.' },
    { q: 'With H₁₂ = −A and A > 0, which stationary state has the lower energy?', choices: ['the sum, a₁ = a₂', 'the difference, a₁ = −a₂', 'state 1 alone', 'they have equal energy'], a: 0, why: 'H(1, 1) = (E₀ − A)(1, 1): the sum has energy E₀ − A.' },
    { q: 'If the energy difference δ is much larger than 2A, a system started in state 1…', choices: ['stays mostly in state 1', 'moves completely to state 2 more quickly', 'moves completely to state 2 more slowly', 'decays'], a: 0, why: 'P_max = 4A²/(δ² + 4A²) is small when δ ≫ 2A: far-apart states barely mix.' },
    { q: 'The Hamiltonian matrix must be Hermitian (Hⱼᵢ = Hᵢⱼ*) for the total probability to stay constant.', a: true, why: 'Then d/dt Σ|Cᵢ|² = 0; a non-Hermitian H would create or destroy probability.' },
    { q: 'Equal states coupled by A = 10 µeV. At what frequency does the probability swing, in GHz?', answer: 4.84, unit: 'GHz', why: 'f = 2A/h = 2 × 10⁻⁵ eV / 4.136 × 10⁻¹⁵ eV s = 4.84 × 10⁹ Hz.' }
  ],
  problems: [
    { q: 'Two equal states are coupled with A = 20 µeV. At what frequency does the probability swing between them?', answer: 9.67, unit: 'GHz', tol: 0.02, hint: 'f = 2A/h.',
      steps: ['$f = 2 \\times 20\\times10^{-6}/4.136\\times10^{-15}$.', '$f = 9.67\\times10^{9}$ Hz.'] },
    { q: 'Two states differ in energy by 10 µeV and are coupled by A = 5 µeV. What is the largest probability of finding the system in state 2 if it starts in state 1?', answer: 0.5, unit: '', tol: 0.01, hint: 'P_max = 4A²/(δ² + 4A²).',
      steps: ['$4A^2 = 100$, $\\delta^2 = 100$ (in µeV²).', '$P_{\\mathrm{max}} = 100/200 = 0.5$.'] }
  ],
  applications: [
    'Every two-level atom driven by a laser or a radio field flip-flops by these equations (Rabi oscillations) — the basis of atomic clocks, NMR pulses and quantum-computer gates.',
    'Quantum chemistry writes a molecule\'s Hamiltonian matrix in a basis of atomic orbitals and finds its energies as eigenvalues.',
    'Neutrino oscillations are a flip-flop between flavour states whose masses differ.'
  ],
  history: 'Werner Heisenberg\'s matrix mechanics (1925, with Max Born and Pascual Jordan) first wrote quantum mechanics in terms of arrays of numbers; Schrödinger\'s wave equation (1926) turned out to be the same theory. Isidor Rabi worked out the flip-flop of a spin driven by an oscillating field in 1937, the basis of his resonance method.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 8 (The Hamiltonian Matrix) — amplitudes and vectors, resolving state vectors, what the base states of the world are, how states change with time, the Hamiltonian matrix, and the ammonia molecule as the first example.',
    'Vol. III, ch. 11 (More Two-State Systems) — the general solution of the two-state equations.',
    'Vol. III, ch. 7 (The Dependence of Amplitudes on Time) — the stationary states the matrix produces.'
  ],
  sim: 'spin-flipflop'
},

{
  id: 'ammonia-maser', parent: 'spin-states', title: 'The ammonia maser', level: 3,
  short: 'The nitrogen atom of ammonia can sit on either side of the plane of its three hydrogens. Tunnelling couples the two states and splits the energy by about 10⁻⁴ eV — a 23.87 GHz line. An electric field pushes the levels apart, a non-uniform field sorts the molecules, and a resonant cavity makes the upper ones give up their energy: the maser.',
  keywords: ['ammonia', 'NH3', 'inversion', 'maser', 'microwave', '23.87 GHz', 'Townes', 'stimulated emission', 'electric dipole moment', 'state selection', 'resonant cavity', 'tunnelling', 'Stark effect', 'population inversion'],
  prereq: ['hamiltonian-matrix', 'amplitudes-in-time', 'physics:lasers'],
  related: ['two-state-systems', 'bosons-and-lasers', 'tunnelling-feyn', 'resonance-feyn', 'stern-gerlach-filters', 'hyperfine-21cm', 'physics:quantum-tunneling', 'physics:electromagnetic-waves'],
  body: `
### Two states of one molecule
Ammonia, NH₃, is a low pyramid: three hydrogen atoms form a triangle and the nitrogen sits above or below its centre. Fix the direction in which the molecule spins about its axis; then there are two base states — **1**, nitrogen on one side of the hydrogen plane, and **2**, nitrogen on the other. They are mirror images, so they have the same energy $E_0$. Classically the nitrogen could never pass from one side to the other: the plane of hydrogens is a barrier it has too little energy to cross. Quantum mechanically it tunnels through ([[tunnelling-feyn]]), which gives an [[?amplitude]] $-A$ to go from 1 to 2. The Hamiltonian [[?matrix]] is exactly the two-state one of [[hamiltonian-matrix]]:

$$H = \\begin{pmatrix} E_0 & -A \\\\ -A & E_0 \\end{pmatrix}$$

The stationary states are the difference, $|\\mathrm{I}\\rangle$, at $E_0 + A$, and the sum, $|\\mathrm{II}\\rangle$, at $E_0 - A$. In neither is the nitrogen on one side. The splitting is measured: ammonia absorbs microwaves of **23.87 GHz** (wavelength 1.26 cm), so $2A = hf = 9.87\\times10^{-5}$ eV. A molecule prepared with its nitrogen up turns over completely in $h/4A \\approx 21$ ps.

### In an electric field
The electrons crowd towards the nitrogen, so the molecule has an electric dipole moment $\\mu = 1.47$ D $= 4.90\\times10^{-30}$ C·m along its axis. In a field $\\mathcal{E}$, state 1 gains energy $\\mu\\mathcal{E}$ and state 2 loses it:

$$H = \\begin{pmatrix} E_0 + \\mu\\mathcal{E} & -A \\\\ -A & E_0 - \\mu\\mathcal{E} \\end{pmatrix},\\qquad E = E_0 \\pm \\sqrt{A^2 + \\mu^2\\mathcal{E}^2}$$

In a weak field the levels move by only $\\pm\\mu^2\\mathcal{E}^2/2A$, quadratically ([[?small-approximation]]); in a strong one ($\\mu\\mathcal{E} \\gg A$) they move linearly and the stationary states become nearly 1 and 2. The crossover, $\\mu\\mathcal{E} = A$, comes at about 16 kV/cm. (Feynman's model leaves out the molecule's rotation, which in a real maser reduces the effective dipole.)

### Sorting the molecules
The upper level *rises* with the field, so in a non-uniform field those molecules are pushed towards weaker field, while lower-state molecules are pulled towards stronger field. The force is minus the [[?gradient]] of the energy:

$$F = -\\nabla E = \\mp\\frac{\\mu^2}{2A}\\,\\nabla(\\mathcal{E}^2)$$

It is the Stern–Gerlach idea with an electric field ([[stern-gerlach-filters]]). In the first maser, electrodes around the beam made a field that was zero on the axis and grew outwards: upper-state molecules were steered onto the axis and into a cavity, lower-state ones thrown aside.

### The cavity: stimulated emission
The cavity is a metal box resonant at 23.87 GHz. Its oscillating field $2\\mathcal{E}_0\\cos\\omega t$ couples states I and II; at resonance a molecule that enters in state I is found in state II after a time $T$ with probability

$$P_{\\mathrm{I}\\to\\mathrm{II}} = \\sin^2\\frac{\\mu\\mathcal{E}_0 T}{\\hbar}$$

and each molecule that drops hands its energy $hf$ to the field. A stronger field makes the drops faster, which strengthens the field: **M**icrowave **A**mplification by **S**timulated **E**mission of **R**adiation. It works only because the lower-state molecules were removed — with equal numbers, absorption would cancel emission. Off resonance the drop probability falls; the resonance is about $1/T$ wide, so molecules spending 0.2 ms in the cavity fix the frequency to a few kilohertz.

| quantity | value |
|---|---|
| inversion frequency $f$ | 23.87 GHz |
| splitting $2A = hf$ | $9.87\\times10^{-5}$ eV |
| wavelength $c/f$ | 1.26 cm |
| dipole moment $\\mu$ | 1.47 D |
| field where $\\mu\\mathcal{E} = A$ | ≈ 16 kV/cm |
| time to turn over, $h/4A$ | 21 ps |

> [!tip] Two simulations: the molecule, its nitrogen flip-flopping and its two levels spreading apart as you raise the field; and the maser, where a beam is sorted and the upper-state molecules give up their energy in the cavity.

> [!key] Ammonia is a two-state system: nitrogen up or down, coupled by tunnelling, split by 2A = hf (23.87 GHz). A field pushes the stationary states apart, its gradient sorts them, and a resonant cavity makes the upper ones emit.
`,
  ideas: [
    'Ammonia\'s two base states — nitrogen on one side of the hydrogen plane or the other — have equal energy and are coupled by tunnelling.',
    'The stationary states are the sum and the difference, split by 2A = hf with f = 23.87 GHz.',
    'In an electric field the energies are E₀ ± √(A² + μ²ℰ²): quadratic in weak fields, linear in strong ones.',
    'A non-uniform field pushes the upper state towards weak field and the lower towards strong field, separating them.',
    'In a resonant cavity the upper-state molecules are stimulated to emit: the maser, the first device of its kind.'
  ],
  pitfalls: [
    'The nitrogen sits on one side and occasionally jumps — In a stationary state it is on both sides at once (the sum or the difference); only a molecule prepared on one side flip-flops.',
    'Any gas of ammonia molecules amplifies 23.87 GHz waves — In equilibrium slightly more molecules are in the lower state, so the gas absorbs; amplification needs the upper state sorted out first.',
    'The energy splitting grows in proportion to the electric field from the start — In weak fields (μℰ ≪ A) the shift is quadratic, μ²ℰ²/2A; only in strong fields is it linear.'
  ],
  formulas: [
    {
      name: 'The inversion frequency',
      expr: 'f = 2*A/h', tex: 'f = \\dfrac{2A}{h}',
      vars: {
        f: { name: 'frequency of the ammonia line', q: 'frequency', unit: 'GHz' },
        A: { name: 'tunnelling coupling A', q: 'energy', unit: 'eV', value: 4.936e-5 },
        h: { const: 'h' }
      },
      note: 'The energy splitting of the two stationary states is 2A; a photon of frequency 2A/h is absorbed or emitted.',
      stories: { A: 'Ammonia absorbs at {f}. What is the tunnelling coupling A?', f: 'The nitrogen of a molecule tunnels with A = {A}. At what frequency does it absorb?' }
    },
    {
      name: 'The two levels in an electric field',
      expr: 'dE = 2*sqrt(A^2 + (mu*Ef)^2)', tex: '\\Delta E = 2\\sqrt{A^2 + \\mu^2\\mathcal{E}^2}',
      vars: {
        dE: { name: 'energy difference of the two stationary states', q: 'energy', unit: 'eV', tex: '\\Delta E' },
        A: { name: 'tunnelling coupling', q: 'energy', unit: 'eV', value: 4.936e-5 },
        mu: { name: 'electric dipole moment', q: 'dipole', unit: 'D', value: 1.47, tex: '\\mu' },
        Ef: { name: 'electric field', q: 'efield', unit: 'kV/cm', value: 20, tex: '\\mathcal{E}' }
      },
      note: 'Feynman\'s two-state model (rotation ignored). ΔE = 2A in zero field; ≈ 2μℰ in a strong field.',
      stories: { dE: 'Ammonia (A = {A}, μ = {mu}) sits in a field of {Ef}. How far apart are its two levels?', Ef: 'In what field are the two levels of ammonia (A = {A}, μ = {mu}) {dE} apart?' }
    },
    {
      name: 'The chance of emitting in the cavity (at resonance)',
      expr: 'P = sin(mu*E0*T/hbar)^2', tex: 'P_{\\mathrm{I}\\to\\mathrm{II}} = \\sin^2\\dfrac{\\mu\\mathcal{E}_0 T}{\\hbar}',
      vars: {
        P: { name: 'probability that an upper-state molecule has dropped', min: 0, max: 1, tex: 'P_{\\mathrm{I}\\to\\mathrm{II}}' },
        mu: { name: 'electric dipole moment', q: 'dipole', unit: 'D', value: 1.47, min: 0, max: 2, tex: '\\mu' },
        E0: { name: 'half the amplitude of the cavity field (ℰ = 2ℰ₀ cos ωt)', q: 'efield', unit: 'V/m', value: 0.1, min: 0, max: 0.15, tex: '\\mathcal{E}_0' },
        T: { name: 'time spent in the cavity', q: 'time', unit: 'ms', value: 0.2, min: 0, max: 0.3 },
        hbar: { const: 'hbar' }
      },
      note: 'Exactly at 23.87 GHz. The molecule is certainly in the lower state when μℰ₀T/ħ = π/2.',
      stories: { P: 'Upper-state ammonia (μ = {mu}) spends {T} in a cavity field with ℰ₀ = {E0}. What is the chance it has emitted?', E0: 'Molecules spend {T} in the cavity. What field ℰ₀ gives each a chance {P} of emitting?' }
    }
  ],
  examples: [
    {
      title: 'From the line to the coupling',
      q: 'Ammonia absorbs at 23.87 GHz. Find A, the wavelength, and the time a molecule prepared with its nitrogen up takes to turn over.',
      steps: [
        '$2A = hf = 6.626\\times10^{-34} \\times 2.387\\times10^{10} = 1.582\\times10^{-23}$ J $= 9.87\\times10^{-5}$ eV, so $A = 4.94\\times10^{-5}$ eV.',
        '$\\lambda = c/f = 3.00\\times10^8/2.387\\times10^{10} = 1.26$ cm.',
        'Complete turn-over at $h/4A = 1/(2f) = 2.1\\times10^{-11}$ s.'
      ],
      a: 'A ≈ 4.9 × 10⁻⁵ eV; λ = 1.26 cm; about 21 ps to turn over.'
    },
    {
      title: 'The levels in 20 kV/cm',
      q: 'How far apart are ammonia\'s two levels in a field of 20 kV/cm, in the two-state model? What frequency does that correspond to?',
      steps: [
        '$\\mu\\mathcal{E} = 4.90\\times10^{-30} \\times 2.0\\times10^{6} = 9.81\\times10^{-24}$ J $= 6.12\\times10^{-5}$ eV.',
        '$\\Delta E = 2\\sqrt{(4.94\\times10^{-5})^2 + (6.12\\times10^{-5})^2} = 1.57\\times10^{-4}$ eV.',
        '$f = \\Delta E/h = 1.57\\times10^{-4}/4.136\\times10^{-15} = 3.8\\times10^{10}$ Hz.'
      ],
      a: '1.57 × 10⁻⁴ eV apart — the line would move from 23.9 to 38 GHz (a real molecule, rotating, shifts less).'
    },
    {
      title: 'How strong must the cavity field be?',
      q: 'Molecules spend 0.2 ms in the cavity. What field amplitude ℰ₀ makes an upper-state molecule certain to drop? What chance does 0.1 V/m give?',
      steps: [
        'Certain when $\\mu\\mathcal{E}_0T/\\hbar = \\pi/2$: $\\mathcal{E}_0 = \\pi\\hbar/(2\\mu T) = \\pi \\times 1.055\\times10^{-34}/(2 \\times 4.90\\times10^{-30} \\times 2\\times10^{-4}) = 0.169$ V/m.',
        'With 0.1 V/m the angle is $4.90\\times10^{-30} \\times 0.1 \\times 2\\times10^{-4}/1.055\\times10^{-34} = 0.93$ rad, and $\\sin^2 0.93 = 0.64$.'
      ],
      a: 'A tiny 0.17 V/m flips every molecule; 0.1 V/m gives a 64 % chance.'
    }
  ],
  quiz: [
    { q: 'In a non-uniform electric field, molecules in the upper state are pushed…', choices: ['towards weaker field', 'towards stronger field', 'not at all', 'along the field lines'], a: 0, why: 'Their energy E₀ + √(A² + μ²ℰ²) rises with the field, and a force points down the energy slope.' },
    { q: 'In zero field, where is the nitrogen in a stationary state?', choices: ['on both sides at once (the sum or the difference of the two base states)', 'always above the plane', 'always below the plane', 'in the plane of the hydrogens'], a: 0, why: 'The stationary states are (|1⟩ ± |2⟩)/√2: equal amplitudes for both sides.' },
    { q: 'In a very strong electric field, the stationary states become…', choices: ['nearly the base states 1 and 2, with energies linear in the field', 'the sum and the difference, unchanged', 'a single state', 'three states'], a: 0, why: 'When μℰ ≫ A the diagonal terms dominate; the coupling only mixes the states slightly.' },
    { q: 'A beam with equal numbers of upper- and lower-state molecules would amplify 23.87 GHz microwaves.', a: false, why: 'Stimulated emission by the upper state is cancelled by absorption by the lower; the separator is what makes the maser work.' },
    { q: 'What is the wavelength of the ammonia line, in centimetres?', answer: 1.26, unit: 'cm', why: 'λ = c/f = 3.00 × 10⁸/2.387 × 10¹⁰ m = 1.26 cm.' }
  ],
  problems: [
    { q: 'In the two-state model (A = 4.94 × 10⁻⁵ eV, μ = 1.47 D), in what electric field are ammonia\'s two levels twice as far apart as in zero field?', answer: 27.9, unit: 'kV/cm', tol: 0.02, hint: '2√(A² + μ²ℰ²) = 4A.',
      steps: ['$\\sqrt{A^2 + \\mu^2\\mathcal{E}^2} = 2A$ gives $\\mu\\mathcal{E} = \\sqrt3\\,A = 1.370\\times10^{-23}$ J.', '$\\mathcal{E} = 1.370\\times10^{-23}/4.90\\times10^{-30} = 2.79\\times10^{6}$ V/m $= 27.9$ kV/cm.'] },
    { q: 'Molecules cross a cavity 12 cm long at 600 m/s. What field amplitude ℰ₀ makes each upper-state molecule certain to drop? (μ = 1.47 D)', answer: 0.169, unit: 'V/m', tol: 0.02, hint: 'T = L/v; then μℰ₀T/ħ = π/2.',
      steps: ['$T = 0.12/600 = 2.0\\times10^{-4}$ s.', '$\\mathcal{E}_0 = \\pi\\hbar/(2\\mu T) = 3.313\\times10^{-34}/1.961\\times10^{-33} = 0.169$ V/m.'] }
  ],
  applications: [
    'Masers are very low-noise microwave amplifiers, and hydrogen masers are among the most stable clocks over hours to days — used to time radio telescopes that observe together and in satellite navigation.',
    'The maser led directly to the laser (1960) — the same idea with light, and with the population of the upper state raised by pumping instead of sorting.',
    'Ammonia\'s inversion lines are used by radio astronomers as thermometers of cold interstellar gas.'
  ],
  history: 'Claude Cleeton and Neil Williams at the University of Michigan observed ammonia absorbing microwaves of about 1.25 cm in 1934 — the beginning of microwave spectroscopy. In 1954 Charles Townes, James Gordon and Herbert Zeiger at Columbia University made the first maser with a sorted beam of ammonia molecules; Nikolay Basov and Alexander Prokhorov in Moscow worked out the same principle independently. Townes, Basov and Prokhorov shared the 1964 Nobel Prize in Physics. Feynman used the ammonia molecule as his main example of a two-state system in volume III of his lectures.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 9 (The Ammonia Maser) — the states of an ammonia molecule, the molecule in a static electric field, transitions in a time-dependent field, transitions at and off resonance, and the absorption of light.',
    'Vol. III, ch. 8 (The Hamiltonian Matrix) — the ammonia molecule as the first example of a Hamiltonian.'
  ],
  sim: ['spin-ammonia', 'spin-maser']
},

{
  id: 'two-state-systems', parent: 'spin-states', title: 'Two-state systems everywhere', level: 3,
  short: 'The same two-by-two story appears again and again: an electron shared by two protons (the one-electron bond of H₂⁺), benzene\'s two Kekulé structures, dye molecules, pions exchanged between nucleons, a spin in a magnetic field, the polarisation of a photon, neutral K mesons. Two equal states coupled by A become E₀ − A and E₀ + A.',
  keywords: ['two-state system', 'hydrogen molecular ion', 'H2+', 'chemical bond', 'bonding orbital', 'antibonding orbital', 'benzene', 'Kekulé structures', 'resonance energy', 'dyes', 'nuclear force', 'Yukawa', 'pion exchange', 'K meson', 'Pauli matrices', 'photon polarisation'],
  prereq: ['hamiltonian-matrix', 'ammonia-maser', 'physics:bohr-model'],
  related: ['hyperfine-21cm', 'spin-half', 'polarization-feyn', 'hydrogen-and-periodic-table', 'exclusion-principle', 'electrons-in-crystals', 'tunnelling-feyn', 'math:eigenvalues'],
  body: `
Ammonia is not special. Whenever two states are made equal in energy by symmetry and there is some way to get from one to the other, the same two-by-two [[?matrix]] appears, with the same result: the energy $E_0$ splits into $E_0 - A$ and $E_0 + A$, whose stationary states are the sum and the difference. Feynman went through a gallery of examples.

### The hydrogen molecular ion: a bond from one electron
Two protons and one electron. Base state 1: the electron in the ground state around proton 1; state 2: around proton 2. Far apart, the two have the same energy. Close together, the electron can tunnel from one proton to the other, with an amplitude $-A$ that grows roughly like $e^{-D/a_0}$ as the separation $D$ shrinks ([[?exponential]]; $a_0 = 0.53$ Å is the Bohr radius). The stationary states:

- the **sum** (bonding): the two clouds add and pile charge up between the protons, where it attracts both; energy $E_0 - A$;
- the **difference** (antibonding): the clouds cancel on the midplane, leaving a node; energy $E_0 + A$.

Add the protons' repulsion $e^2/4\\pi\\varepsilon_0D$, and the bonding energy has a minimum — a chemical bond made of one shared electron. The simplest two-state estimate, with hydrogen ground states as the base states, puts the minimum at 1.32 Å and 1.76 eV deep; the exact values are 1.06 Å and 2.79 eV. The antibonding curve has no minimum: in that state the ion flies apart. An electron placed on one proton hops to the other in a fraction of a femtosecond.

### Nuclear forces
A neutron and a proton can swap identities by passing a charged pion: (proton here, neutron there) and (neutron here, proton there) are two states coupled by exchange. In Hideki Yukawa's theory (1935) the coupling falls off like $e^{-r/r_0}/r$, with a range set by the mass of the exchanged particle, $r_0 = \\hbar/mc \\approx 1.4$ fm for the pion — the size of a nucleus.

### Benzene and dyes
Benzene, C₆H₆, is a ring of six carbons. Drawn with alternating single and double bonds, there are two ways to do it — Kekulé's two structures — equal in energy by symmetry. Treated as two base states, the ring settles into their sum, lower by $A$. Two things follow, and both are seen. All six carbon–carbon bonds are equal, 139.7 pm long, between a single bond (154 pm) and a double one (134 pm). And benzene is extra stable: adding hydrogen to it releases about 150 kJ/mol less than three separate double bonds would — about 1.6 eV per molecule, which in this picture is $A$.

In some dyes a charge can sit at either of two equivalent ends of the molecule. Light of energy $2A$ lifts the molecule from the sum state to the difference state; when $2A$ is 2–3 eV the absorption is in the visible, and the dye is coloured.

### A gallery
| system | the two base states | splitting |
|---|---|---|
| ammonia | nitrogen up / down | $9.9\\times10^{-5}$ eV (23.87 GHz) |
| H₂⁺ at 1.06 Å | electron on proton 1 / on proton 2 | about 12 eV |
| benzene | the two Kekulé structures | $A \\approx 1.6$ eV (from the resonance energy) |
| electron in 1 T | spin up / down | $1.16\\times10^{-4}$ eV (28 GHz) |
| photon | polarised along x / along y | none in empty space |
| neutral K meson | K⁰ / anti-K⁰ | $3.5\\times10^{-6}$ eV |

Hydrogen's ground state, with two spins, has four states; it is the subject of [[hyperfine-21cm]].

### Every two-state system is a spin
Any 2 × 2 [[?hermitian]] Hamiltonian is a number times the unit matrix plus a combination of the three Pauli matrices $\\sigma_x, \\sigma_y, \\sigma_z$ — which is the Hamiltonian of a spin one-half in a magnetic field pointing in some direction. So every two-state system behaves like a spin in a fictitious field: its state is an arrow ([[spin-half]]) precessing about that field, and ammonia's flip-flop is such a precession seen side-on.

> [!tip] In the simulations, pull the two protons of H₂⁺ apart and watch the bonding and antibonding clouds and their energy curves; then let a molecule with two equivalent structures — benzene or a dye — flip-flop between them.

> [!key] Two equal states and a coupling A give two stationary states, the sum at E₀ − A and the difference at E₀ + A. Shared electrons make bonds this way, resonance steadies benzene, exchanged pions hold nuclei together — and all of them are, mathematically, a spin one-half.
`,
  ideas: [
    'Two states made equal by symmetry and coupled by an amplitude −A always give stationary states at E₀ − A (the sum) and E₀ + A (the difference).',
    'In H₂⁺ the sum piles the electron between the protons: with the proton repulsion it has a minimum — a one-electron chemical bond.',
    'Benzene\'s two Kekulé structures mix; the mixture has six equal bonds and is stabilised by about 1.6 eV.',
    'Exchanging a particle of mass m gives a force of range ħ/mc: about 1.4 fm for the pion.',
    'Every 2 × 2 Hamiltonian is a spin one-half in some effective magnetic field.'
  ],
  pitfalls: [
    'Benzene flips back and forth between its two Kekulé structures — In its ground state it is in the stationary sum of them, all the time; the flipping happens only if it were prepared in one structure.',
    'A bond forms because the electron spends half its time on each atom — It forms because the amplitudes add: the sum state has extra charge between the protons and lower energy than either atom\'s state.',
    'The antibonding state is just a weaker bond — It has no energy minimum at all: an H₂⁺ ion in that state comes apart.'
  ],
  formulas: [
    {
      name: 'Light that flips a two-state molecule',
      expr: 'lambda = h*c/(2*A)', tex: '\\lambda = \\dfrac{hc}{2A}',
      vars: {
        lambda: { name: 'wavelength absorbed', q: 'length', unit: 'nm', tex: '\\lambda' },
        h: { const: 'h' },
        c: { const: 'c' },
        A: { name: 'coupling of the two structures', q: 'energy', unit: 'eV', value: 1.1 }
      },
      note: 'The photon energy equals the splitting 2A of the stationary states (the simplest model of a dye).',
      stories: { lambda: 'A dye molecule has two equivalent structures coupled with A = {A}. What wavelength does it absorb?', A: 'A dye absorbs most strongly at {lambda}. What coupling A does the two-state model give?' }
    },
    {
      name: 'Range of a force carried by an exchanged particle',
      expr: 'r0 = hbar/(m*c)', tex: 'r_0 = \\dfrac{\\hbar}{mc}',
      vars: {
        r0: { name: 'range of the force', q: 'length', unit: 'fm', tex: 'r_0' },
        hbar: { const: 'hbar' },
        m: { name: 'mass of the exchanged particle', q: 'mass', unit: 'MeV/c²', value: 139.57 },
        c: { const: 'c' }
      },
      note: 'Yukawa: the exchange amplitude falls off as e^{−r/r₀}/r. Pion (139.6 MeV/c²): 1.41 fm.',
      stories: { r0: 'A force is carried by a particle of mass {m}. What is its range?', m: 'A force has a range of {r0}. What mass must the exchanged particle have?' }
    },
    {
      name: 'Resonance energy per mole',
      expr: 'Em = NA*A', tex: 'E_m = N_A A',
      vars: {
        Em: { name: 'stabilisation per mole', q: 'molarenergy', unit: 'kJ/mol', tex: 'E_m' },
        NA: { const: 'NA' },
        A: { name: 'lowering of each molecule by the mixing', q: 'energy', unit: 'eV', value: 1.57 }
      },
      note: 'Chemists measure A per mole, from heats of hydrogenation; 1 eV per molecule is 96.5 kJ/mol.',
      stories: { A: 'Benzene is stabilised by {Em}. What is that per molecule?', Em: 'Mixing two structures lowers each molecule by {A}. How much is that per mole?' }
    }
  ],
  examples: [
    {
      title: 'Benzene\'s resonance energy',
      q: 'Adding hydrogen to one C=C double bond (in cyclohexene) releases about 120 kJ/mol; adding hydrogen to benzene, 208 kJ/mol. How much is benzene stabilised, per mole and per molecule?',
      steps: [
        'Three separate double bonds would release $3 \\times 120 = 360$ kJ/mol.',
        'Benzene releases $360 - 208 = 152$ kJ/mol less: it started that much lower.',
        'Per molecule: $1.52\\times10^{5}/6.022\\times10^{23} = 2.52\\times10^{-19}$ J $= 1.58$ eV.'
      ],
      a: 'About 150 kJ/mol, or 1.6 eV per molecule — the A of the two-state picture.'
    },
    {
      title: 'The colour of a two-state dye',
      q: 'A dye with two equivalent structures has A = 1.1 eV. What light does it absorb, and what colour does it look?',
      steps: [
        '$2A = 2.2$ eV; $\\lambda = hc/2A = 1240\\ \\mathrm{eV\\,nm}/2.2\\ \\mathrm{eV} = 564$ nm.',
        'It absorbs yellow-green; white light minus yellow-green looks purple-magenta.'
      ],
      a: 'It absorbs near 564 nm and looks magenta.'
    },
    {
      title: 'The range of the nuclear force',
      q: 'Estimate the range of a force carried by pions (mass 139.6 MeV/c²).',
      steps: [
        '$r_0 = \\hbar/mc = \\hbar c/(mc^2)$, with $\\hbar c = 197.3$ MeV·fm.',
        '$r_0 = 197.3/139.6 = 1.41$ fm.'
      ],
      a: 'About 1.4 fm — comparable with the radius of a proton, and why nuclear forces vanish a few femtometres away.'
    }
  ],
  quiz: [
    { q: 'In the hydrogen molecular ion, which stationary state piles the electron up between the protons?', choices: ['the sum (bonding), at E₀ − A', 'the difference (antibonding), at E₀ + A', 'both equally', 'neither'], a: 0, why: 'In the sum the two clouds add in the middle; in the difference they cancel there.' },
    { q: 'Why does H₂⁺ in the antibonding state come apart?', choices: ['its energy falls steadily as the protons separate — there is no minimum', 'the electron leaves the molecule', 'the protons attract too strongly', 'the state is not stationary'], a: 0, why: 'E₀ + A plus the proton repulsion only decreases with distance: the protons are pushed apart.' },
    { q: 'Why are all six C–C bonds in benzene the same length?', choices: ['the ground state is an equal mixture of the two Kekulé structures', 'the molecule flips between structures too fast to see', 'carbon forms only one kind of bond', 'hydrogen atoms even them out'], a: 0, why: 'The stationary state is the sum, in which each bond is single in one structure and double in the other.' },
    { q: 'Any two-state system can be described as a spin one-half in some (possibly fictitious) magnetic field.', a: true, why: 'Every Hermitian 2 × 2 matrix is a constant plus a combination of the Pauli matrices — a spin Hamiltonian.' },
    { q: 'If the coupling A of a two-state dye doubles, the wavelength it absorbs…', choices: ['halves', 'doubles', 'is unchanged', 'quadruples'], a: 0, why: 'λ = hc/2A.' }
  ],
  problems: [
    { q: 'A two-state dye absorbs most strongly at 520 nm. What coupling A does that imply?', answer: 1.19, unit: 'eV', tol: 0.02, hint: '2A = hc/λ.',
      steps: ['$2A = 1239.8\\ \\mathrm{eV\\,nm}/520\\ \\mathrm{nm} = 2.384$ eV.', '$A = 1.19$ eV.'] },
    { q: 'What is the range of a force carried by a particle of mass 770 MeV/c² (the ρ meson)?', answer: 0.256, unit: 'fm', tol: 0.02, hint: 'r₀ = ħc/(mc²), ħc = 197.3 MeV·fm.',
      steps: ['$r_0 = 197.3/770 = 0.256$ fm.'] }
  ],
  applications: [
    'Bonding and antibonding orbitals — the sum and the difference — are the starting point of the chemistry of every covalent bond.',
    'Cyanine dyes — photographic sensitisers and fluorescent labels in biology — share a charge between two equivalent ends of the molecule, and their colour is set by how strongly the two structures are coupled.',
    'Neutral K and B meson oscillations — two-state flip-flops — revealed the violation of CP symmetry.'
  ],
  history: 'Øyvind Burrau solved the hydrogen molecular ion exactly in 1927. August Kekulé proposed the benzene ring in 1865 and, in 1872, that it switches between two structures; Linus Pauling\'s theory of resonance in the 1930s described it as a mixture instead. Hideki Yukawa predicted the pion in 1935; it was found in cosmic rays in 1947. Murray Gell-Mann and Abraham Pais worked out the two-state behaviour of neutral K mesons in 1955.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 10 (Other Two-State Systems) — the hydrogen molecular ion, nuclear forces, the hydrogen molecule, the benzene molecule, dyes, and a spin one-half in a magnetic field.',
    'Vol. III, ch. 11 (More Two-State Systems) — the Pauli spin matrices, the polarisation states of the photon and the neutral K meson.'
  ],
  sim: ['spin-h2plus', 'spin-benzene']
},

{
  id: 'hyperfine-21cm', parent: 'spin-states', title: 'The hyperfine splitting of hydrogen', level: 3,
  short: 'In hydrogen\'s ground state the spins of the electron and the proton interact: three states with the spins "parallel" lie 5.9 µeV above one with them "antiparallel". The flip between them emits radio waves of 1420 MHz — the 21-cm line — by which astronomers map the hydrogen of the Milky Way. A magnetic field splits the levels further.',
  keywords: ['hyperfine structure', '21-cm line', '1420 MHz', 'hydrogen', 'electron spin', 'proton spin', 'triplet', 'singlet', 'Zeeman effect', 'Breit–Rabi', 'Pauli matrices', 'radio astronomy', 'spiral arms', 'galactic rotation', 'Doppler shift', 'hydrogen maser'],
  prereq: ['spin-half', 'hamiltonian-matrix', 'two-state-systems'],
  related: ['paramagnetism-nmr', 'magnetic-moment-g2', 'angular-momentum-quantum', 'hydrogen-and-periodic-table', 'ammonia-maser', 'physics:hydrogen-spectrum', 'physics:doppler-effect', 'physics:em-spectrum'],
  body: `
Hydrogen's ground state looks like the simplest thing in physics: one electron in its lowest orbit around one proton. But both particles have spin one-half, and both are magnets. How their spins lie relative to each other changes the energy by a tiny amount — about six millionths of an electronvolt — and that difference, radiated as radio waves 21 cm long, lets astronomers see the hydrogen of the whole galaxy.

### Four spin states
With two spins, each up or down, there are four [[?base-states|base states]]: $|{++}\\rangle$, $|{+-}\\rangle$, $|{-+}\\rangle$, $|{--}\\rangle$ (electron first). Rather than work out the magnetic interaction in detail, Feynman guessed the form of the Hamiltonian from symmetry. The energy can depend only on the *relative* orientation of the spins, and the simplest such quantity is the [[?dot-product]] of the two spin [[?operator|operators]]:

$$H = A\\,\\boldsymbol{\\sigma}_e\\cdot\\boldsymbol{\\sigma}_p$$

where each $\\boldsymbol{\\sigma}$ stands for the three Pauli matrices acting on one particle's spin. On the four states, $\\boldsymbol{\\sigma}_e\\cdot\\boldsymbol{\\sigma}_p$ gives $+1$ on $|{++}\\rangle$ and $|{--}\\rangle$, $-1$ on $|{+-}\\rangle$ and $|{-+}\\rangle$, and swaps those two with amplitude 2. So the 4 × 4 [[?matrix]] falls apart into two single states and a two-state system — the ammonia problem once more ([[two-state-systems]]).

### Triplet and singlet
| stationary state | energy | total spin |
|---|---|---|
| $\\lvert{++}\\rangle$ | $A$ | 1 |
| $(\\lvert{+-}\\rangle + \\lvert{-+}\\rangle)/\\sqrt2$ | $A$ | 1 |
| $\\lvert{--}\\rangle$ | $A$ | 1 |
| $(\\lvert{+-}\\rangle - \\lvert{-+}\\rangle)/\\sqrt2$ | $-3A$ | 0 |

Three states share the energy $A$; together they behave like one particle of spin one (the triplet, $F = 1$). One lies $4A$ lower (the singlet, $F = 0$). The measured splitting is

$$4A = hf,\\qquad f = 1420.405\\,751\\,768\\ \\mathrm{MHz}$$

— among the most precisely measured numbers in physics, thanks to the hydrogen maser — so $4A = 5.87\\times10^{-6}$ eV, and the photon's wavelength $c/f$ is **21.1 cm**.

### In a magnetic field
Add a field $B$. Each spin now has an energy from its own magnetic moment; the electron's moment is 658 times the proton's and points opposite to its spin. $|{++}\\rangle$ and $|{--}\\rangle$ stay stationary, their energies moving in straight lines; the other two mix differently as the field grows, with energies $-A \\pm 2A\\sqrt{1 + x^2}$, where $x = (|\\mu_e| + \\mu_p)B/2A$ ([[?square-root]], [[?eigenvalue]]). Around 0.05 T the field and the spin–spin coupling are comparable; in stronger fields the four levels group into two pairs — electron up and electron down — each pair split slightly by the proton. This diagram of four curving levels is measured in atomic beams, and the simulation draws it.

### The line in the sky
In the thin gas between the stars, collisions put hydrogen atoms into the triplet. The spontaneous flip to the singlet is extraordinarily slow — about once in 11 million years for a given atom — but there is so much hydrogen that the line is easily detected, and 21-cm waves pass through the dust that hides most of the galaxy from optical telescopes. The motion of each cloud shifts the frequency ([[physics:doppler-effect|Doppler]]):

$$v_r = c\\,\\frac{f_0 - f}{f_0}$$

— 4.74 kHz lower for each km/s of speed away from us ([[?proportional]]). The Milky Way's disc rotates, so along each direction clouds at different distances move at different line-of-sight speeds, and the spectrum shows a peak for each spiral arm crossed. With a model of the rotation, speeds become distances and peaks become a map: that is how the spiral arms of our galaxy were first charted in the 1950s.

> [!tip] Two simulations: the four levels of hydrogen in a magnetic field, with each state's spins drawn; and a radio telescope looking through a rotating galaxy, turning the 21-cm spectrum into a map of its arms.

> [!key] Two spins one-half make four states: a triplet at A and a singlet at −3A. The gap 4A = 5.9 µeV is the 1420 MHz, 21-cm line — a clock standard, and the light by which we map the galaxy's hydrogen.
`,
  ideas: [
    'The electron and proton spins give hydrogen\'s ground state four base states: ++, +−, −+, −−.',
    'The Hamiltonian guessed from symmetry, H = A σₑ·σₚ, gives a triplet (three states at A, total spin 1) and a singlet (one state at −3A, spin 0).',
    'The splitting 4A = 5.87 µeV corresponds to 1420.4 MHz, a wavelength of 21.1 cm.',
    'In a magnetic field the levels spread: two move linearly, two mix and curve (the Breit–Rabi diagram); they regroup by the electron\'s spin above about 0.05 T.',
    'The 21-cm line, Doppler-shifted by the rotation of the galaxy, maps the hydrogen of the Milky Way.'
  ],
  pitfalls: [
    'The upper hyperfine level is the state with the two spins "parallel", and there is only one of it — There are three triplet states, including (+− + −+)/√2, which has the spins opposite along z yet belongs with ++ and −−.',
    'Hydrogen radiates 21 cm because it is hot — The line comes from cold gas; the upper level is only 5.9 µeV (about 0.07 K × k_B) above the lower, so collisions populate it even at 50 K.',
    'The Doppler shift of the line gives the distance of a cloud directly — It gives the line-of-sight velocity; a distance needs a model of the galaxy\'s rotation (and inside the Sun\'s orbit each velocity has two possible distances).'
  ],
  derivation: {
    title: 'Triplet and singlet from σₑ·σₚ',
    steps: [
      { text: 'σₑ·σₚ = σₓσₓ + σᵧσᵧ + σ_zσ_z, each Pauli matrix acting on its own particle. σ_z gives +1 on up and −1 on down; σₓ flips a spin; σᵧ flips it and multiplies by i (up → down) or −i (down → up).', tex: '\\sigma_x|+\\rangle = |-\\rangle,\\qquad \\sigma_y|+\\rangle = i\\,|-\\rangle,\\qquad \\sigma_y|-\\rangle = -i\\,|+\\rangle,\\qquad \\sigma_z|\\pm\\rangle = \\pm|\\pm\\rangle' },
      { text: 'On |++⟩ the z parts give (+1)(+1) = 1. The x parts turn it into |−−⟩, the y parts into i·i|−−⟩ = −|−−⟩: those two cancel.', tex: '\\boldsymbol{\\sigma}_e\\cdot\\boldsymbol{\\sigma}_p\\,|{++}\\rangle = |{++}\\rangle' },
      { text: 'On |+−⟩ the z parts give (+1)(−1) = −1; the x parts give |−+⟩ and the y parts i·(−i)|−+⟩ = |−+⟩, which add.', tex: '\\boldsymbol{\\sigma}_e\\cdot\\boldsymbol{\\sigma}_p\\,|{+-}\\rangle = -|{+-}\\rangle + 2|{-+}\\rangle' },
      { text: 'So the sum and the difference of |+−⟩ and |−+⟩ come back multiplied by −1 + 2 = 1 and −1 − 2 = −3: they are the stationary states (eigenvectors), just as for ammonia.', tex: '\\boldsymbol{\\sigma}_e\\cdot\\boldsymbol{\\sigma}_p\\left(|{+-}\\rangle \\pm |{-+}\\rangle\\right) = (-1 \\pm 2)\\left(|{+-}\\rangle \\pm |{-+}\\rangle\\right)' },
      { text: 'Multiply by A: |++⟩, |−−⟩ and the sum at +A, the difference at −3A. The gap is 4A, and it is measured as h × 1420.4 MHz.', tex: 'E_{\\text{triplet}} - E_{\\text{singlet}} = A - (-3A) = 4A = hf' }
    ]
  },
  formulas: [
    {
      name: 'The hyperfine frequency',
      expr: 'f = 4*A/h', tex: 'f = \\dfrac{4A}{h}',
      vars: {
        f: { name: 'frequency of the line', q: 'frequency', unit: 'MHz' },
        A: { name: 'spin–spin coupling A', q: 'energy', unit: 'eV', value: 1.4686e-6 },
        h: { const: 'h' }
      },
      note: 'The singlet lies 4A below the triplet. Measured: 1420.405 751 768 MHz.',
      stories: { A: 'Hydrogen\'s hyperfine line is at {f}. What is the coupling A?', f: 'For a coupling A = {A}, what is the frequency of the hyperfine line?' }
    },
    {
      name: 'The wavelength of the line',
      expr: 'lambda = c/f', tex: '\\lambda = \\dfrac{c}{f}',
      vars: {
        lambda: { name: 'wavelength', q: 'length', unit: 'cm', tex: '\\lambda' },
        c: { const: 'c' },
        f: { name: 'frequency', q: 'frequency', unit: 'MHz', value: 1420.406 }
      },
      stories: { lambda: 'What is the wavelength of radio waves of {f}?' }
    },
    {
      name: 'Line-of-sight velocity from the observed frequency',
      expr: 'v = c*(f0 - f)/f0', tex: 'v_r = c\\,\\dfrac{f_0 - f}{f_0}',
      vars: {
        v: { name: 'velocity away from us', q: 'speed', unit: 'km/s', signed: true, tex: 'v_r' },
        c: { const: 'c' },
        f0: { name: 'rest frequency of the line', q: 'frequency', unit: 'MHz', value: 1420.406, fixed: true, tex: 'f_0' },
        f: { name: 'observed frequency', q: 'frequency', unit: 'MHz', value: 1420.0 }
      },
      note: 'Non-relativistic Doppler shift; positive v_r means receding (a lower frequency).',
      stories: { v: 'A hydrogen cloud\'s line is observed at {f}. How fast is it moving along the line of sight?', f: 'A cloud recedes at {v}. At what frequency is its 21-cm line observed?' }
    },
    {
      name: 'Line-of-sight velocity in a galaxy with a flat rotation curve',
      expr: 'vr = V0*(R0/R - 1)*sin(l)', tex: 'v_r = V_0\\left(\\dfrac{R_0}{R} - 1\\right)\\sin l',
      vars: {
        vr: { name: 'line-of-sight velocity of the gas', q: 'speed', unit: 'km/s', signed: true, tex: 'v_r' },
        V0: { name: 'orbital speed of the gas and of the Sun', q: 'speed', unit: 'km/s', value: 220, tex: 'V_0' },
        R0: { name: 'Sun\'s distance from the galactic centre', q: 'length', unit: 'kpc', value: 8.2, tex: 'R_0' },
        R: { name: 'gas cloud\'s distance from the centre', q: 'length', unit: 'kpc', value: 6 },
        l: { name: 'galactic longitude of the line of sight', q: 'angle', unit: '°', value: 30, min: 0, max: 90 }
      },
      note: 'Everything circles at the same speed V₀. The largest v_r along a line of sight comes from the tangent point, R = R₀ sin l, where v_r = V₀(1 − sin l).',
      stories: { vr: 'Looking at longitude {l}, a cloud {R} from the centre (Sun at {R0}, rotation {V0}) moves how fast along the line of sight?', R: 'At longitude {l} the 21-cm line shows gas moving at {vr}. How far from the centre is it (Sun at {R0}, rotation {V0})?' }
    }
  ],
  examples: [
    {
      title: 'From the splitting to 21 cm',
      q: 'The hyperfine line is at 1420.4 MHz. Find A, the splitting 4A in eV and the wavelength.',
      steps: [
        '$4A = hf = 4.136\\times10^{-15}\\ \\mathrm{eV\\,s} \\times 1.4204\\times10^{9}\\ \\mathrm{Hz} = 5.87\\times10^{-6}$ eV.',
        '$A = 1.47\\times10^{-6}$ eV — thirty times smaller than ammonia\'s $A$.',
        '$\\lambda = c/f = 3.00\\times10^{8}/1.4204\\times10^{9} = 0.211$ m.'
      ],
      a: '4A = 5.87 µeV; λ = 21.1 cm.'
    },
    {
      title: 'A receding cloud',
      q: 'A cloud\'s 21-cm line is seen at 1420.00 MHz. How fast is it moving along the line of sight?',
      steps: [
        '$f_0 - f = 1420.406 - 1420.000 = 0.406$ MHz.',
        '$v_r = c\\,(f_0 - f)/f_0 = 2.998\\times10^{5}\\ \\mathrm{km/s} \\times 0.406/1420.406 = 85.7$ km/s.'
      ],
      a: 'Receding at about 86 km/s.'
    },
    {
      title: 'The tangent point',
      q: 'Looking at galactic longitude 30°, with the Sun 8.2 kpc from the centre and everything circling at 220 km/s, what is the fastest line-of-sight velocity, and where is that gas?',
      steps: [
        'The line of sight passes closest to the centre at $R = R_0\\sin l = 8.2 \\times 0.5 = 4.1$ kpc.',
        'There $v_r = V_0(R_0/R - 1)\\sin l = 220 \\times (2 - 1) \\times 0.5 = 110$ km/s.',
        'In frequency: $110 \\times 4.74$ kHz $= 0.52$ MHz below 1420.41 MHz.'
      ],
      a: '110 km/s, from gas 4.1 kpc from the centre (7.1 kpc from us) — the highest-velocity edge of the spectrum in that direction.'
    }
  ],
  quiz: [
    { q: 'How many of hydrogen\'s four spin states share the upper hyperfine energy?', choices: ['three', 'one', 'two', 'four'], a: 0, why: 'The triplet: ++, −− and (+− + −+)/√2 all have energy A.' },
    { q: 'How far below the triplet is the singlet?', choices: ['4A', 'A', '2A', '3A'], a: 0, why: 'The triplet is at A and the singlet at −3A.' },
    { q: 'What is the wavelength of 1420.4 MHz radio waves, in centimetres?', answer: 21.1, unit: 'cm', why: 'λ = c/f = 2.998 × 10⁸/1.4204 × 10⁹ m = 0.211 m.' },
    { q: 'The 21-cm line from a cloud moving away from us is observed at a lower frequency than 1420.4 MHz.', a: true, why: 'Receding sources are red-shifted: f = f₀(1 − v/c).' },
    { q: 'Why can the 21-cm line reveal hydrogen across the whole galaxy?', choices: ['radio waves of 21 cm pass through interstellar dust', 'the hydrogen is hot enough to glow', 'each atom flips many times a second', 'the line is ultraviolet'], a: 0, why: 'Dust grains are far smaller than 21 cm and barely scatter it; visible light is blocked.' }
  ],
  problems: [
    { q: 'A cloud\'s 21-cm line is observed at 1420.900 MHz. What is its line-of-sight velocity (positive = receding)?', answer: -104.3, unit: 'km/s', tol: 0.02, hint: 'v = c(f₀ − f)/f₀ with f₀ = 1420.406 MHz.',
      steps: ['$f_0 - f = -0.494$ MHz.', '$v_r = 2.998\\times10^{5} \\times (-0.494)/1420.406 = -104$ km/s: approaching.'] },
    { q: 'At galactic longitude 45°, with R₀ = 8.2 kpc and a flat rotation at 220 km/s, what is the largest line-of-sight velocity of the gas?', answer: 64.4, unit: 'km/s', tol: 0.02, hint: 'At the tangent point R = R₀ sin l, v_r = V₀(1 − sin l).',
      steps: ['$\\sin 45° = 0.7071$.', '$v_r = 220 \\times (1 - 0.7071) = 64.4$ km/s, at $R = 5.8$ kpc.'] }
  ],
  applications: [
    'Hydrogen masers, oscillating at the hyperfine frequency, are the clocks of radio telescopes that observe together across continents.',
    '21-cm rotation curves of other galaxies stay flat far beyond their visible stars — one of the main pieces of evidence for dark matter.',
    'Radio telescopes search for 21-cm light from the universe\'s first billion years, stretched by cosmic expansion to below 200 MHz.',
    'The plaques on the Pioneer 10 and 11 spacecraft (1972–73) use the hydrogen hyperfine transition as their unit of length and time.'
  ],
  history: 'Hendrik van de Hulst, prompted by Jan Oort, predicted in 1944 that the line should be observable from interstellar hydrogen. Harold Ewen and Edward Purcell at Harvard detected it in March 1951, and groups in the Netherlands (Muller and Oort) and Australia (Christiansen and Hindman) confirmed it within weeks. By 1958 Oort, Frank Kerr and Gart Westerhout had combined Dutch and Australian surveys into the first map of the Milky Way\'s spiral arms. Norman Ramsey, Daniel Kleppner and H. Mark Goldenberg built the hydrogen maser in 1960.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 12 (The Hyperfine Splitting in Hydrogen) — base states for two spin-one-half particles, the Hamiltonian guessed from symmetry, the energy levels, and the splitting in a magnetic field (the Zeeman effect).',
    'Vol. III, ch. 10 (Other Two-State Systems) — a spin one-half in a magnetic field, the building block used here.',
    'Vol. III, ch. 11 (More Two-State Systems) — the Pauli spin matrices that appear in the Hamiltonian.'
  ],
  sim: ['spin-hyperfine', 'spin-galaxy']
}

);
