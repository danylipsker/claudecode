/* HYPER-PHYSICS · content/electrostatics.js — charges at rest: forces, fields,
 * potential, capacitance and stored energy. */
Hyper.add(

{
  id: 'electric-charge', parent: 'electrostatics', title: 'Electric charge', level: 1,
  short: 'A basic property of matter that comes in two kinds, positive and negative, always in whole multiples of the electron\'s charge, and is never created or destroyed.',
  keywords: ['charge', 'static electricity', 'coulomb', 'elementary charge', 'electron', 'proton', 'conductor', 'insulator', 'induction', 'triboelectric', 'polarization', 'conservation of charge'],
  prereq: ['force', 'math:scientific-notation'],
  related: ['coulombs-law', 'electric-current', 'free-electron-model', 'quarks', 'antimatter'],
  body: `
Rub a balloon on a wool jumper and it clings to the wall; run a plastic comb through dry hair and it lifts scraps of paper off the table. These party tricks reveal a property of matter as basic as mass: **electric charge**. Every experiment finds exactly two kinds, which Benjamin Franklin named *positive* and *negative*, and one simple rule: **like charges repel, unlike charges attract**. How strongly they do so is the subject of [[coulombs-law|Coulomb's law]].

### Where charge lives
Ordinary matter is made of protons (charge $+e$), electrons ($-e$) and neutrons (no charge). An atom has as many electrons as protons, so it is neutral, and so is almost everything around you. Charging an object nearly always means moving **electrons**: they occupy the outside of atoms and some are held loosely, while the protons are locked away in nuclei. A rubbed balloon is negative because it has pulled electrons off the wool; the wool is left positive by exactly the same amount.

### Quantized and conserved
Two facts have held in every experiment ever done.

- **Charge is quantized.** A free particle or object always carries a whole-number multiple of the **elementary charge**:
$$Q = n e, \\qquad e = 1.602 \\times 10^{-19}\\ \\mathrm{C}$$
Quarks carry $\\pm\\tfrac13 e$ or $\\pm\\tfrac23 e$, but they are only ever found bound in groups whose total is a whole multiple of $e$ (see [[quarks]]).
- **Charge is conserved.** The total charge of an isolated system never changes. Charge can be shuffled from place to place, and particle–antiparticle pairs can be created or annihilated, but the books always balance.

The SI unit, the **coulomb** (C), is enormous next to everyday static electricity: it is the charge of $6.24 \\times 10^{18}$ protons. A well-rubbed balloon carries about 0.1 µC, a thundercloud separates tens of coulombs, and a phone battery sends roughly 10 000 C round its circuit on one full charge — in a circuit, though, the charge flows round and nothing is left charged (see [[electric-current]]).

### Conductors and insulators
In a **conductor** such as a metal, some electrons are free to wander through the whole piece, so added charge spreads over the surface almost instantly. In an **insulator** — glass, plastic, rubber, dry air — electrons stay bound to their atoms and charge stays where it was put. That is why a plastic rod can be charged by rubbing but a metal spoon held in the hand cannot: its charge simply drains away through you. [[semiconductors|Semiconductors]] fall in between, and the reason lies in [[band-theory|energy bands]].

### Three ways to charge something
1. **Friction** (the triboelectric effect): two different materials touch and electrons move to the one that holds them more tightly.
2. **Conduction**: touching a charged object lets some of its charge flow across.
3. **Induction**: hold a charged rod near a metal object and its free electrons shift towards or away from the rod. Connect the far side to earth for a moment, break the connection, then take the rod away — the object is left with a charge **opposite** to the rod's, and the rod never touched it.

> [!why] A charged comb attracts neutral paper because it **polarizes** it: the paper's charges shift very slightly, leaving the unlike charge a little nearer the comb than the like charge. The attraction to the nearer charge beats the repulsion from the farther one, because the electric force weakens with distance.
`,
  ideas: [
    'There are two kinds of charge; like charges repel and unlike charges attract.',
    'Charge is quantized: free objects carry whole multiples of $e = 1.602 \\times 10^{-19}$ C.',
    'Charge is conserved: it moves around but the total never changes.',
    'Objects are charged by moving electrons, not protons.',
    'Charged objects attract neutral ones by polarizing them.'
  ],
  pitfalls: [
    'A positively charged object has gained protons — It has lost electrons. Protons are bound in nuclei and essentially never move in static electricity.',
    'Neutral objects feel no electric force — A charged object polarizes a neutral one and then attracts it; that is how a balloon sticks to a wall.',
    'Charging creates charge — Rubbing only separates charge that was already there. The rubbing cloth ends up with the opposite charge, equal in size.'
  ],
  formulas: [
    {
      name: 'Charge as a count of elementary charges',
      expr: 'Q = n*qe', tex: 'Q = n e',
      vars: {
        Q: { name: 'size of the charge', q: 'charge', unit: 'nC' },
        n: { name: 'number of electrons added or removed', q: 'count', value: 3.12e11 },
        qe: { const: 'qe' }
      },
      note: 'Use the size of the charge; the sign only says whether electrons were added (negative) or removed (positive).',
      stories: {
        Q: 'Rubbing a balloon moves {n} electrons onto it. How big is its charge?',
        n: 'A plastic rod has a charge of size {Q}. How many electrons does that represent?'
      }
    }
  ],
  examples: [
    {
      title: 'How many electrons on a balloon?',
      q: 'A rubbed balloon carries a charge of $-50$ nC. How many extra electrons is that, what is their total mass, and what fraction of the balloon\'s roughly $3.5 \\times 10^{23}$ atoms does it amount to?',
      steps: [
        '$n = \\dfrac{|Q|}{e} = \\dfrac{50 \\times 10^{-9}}{1.602 \\times 10^{-19}} = 3.12 \\times 10^{11}$ electrons.',
        'Their mass: $3.12 \\times 10^{11} \\times 9.11 \\times 10^{-31}\\ \\mathrm{kg} = 2.8 \\times 10^{-19}\\ \\mathrm{kg}$ — far too little to weigh.',
        'Fraction: $3.12 \\times 10^{11} / 3.5 \\times 10^{23} \\approx 10^{-12}$, about one extra electron per million million atoms.'
      ],
      a: 'About $3 \\times 10^{11}$ electrons — one per trillion atoms, yet enough to hold the balloon on a wall.'
    },
    {
      title: 'Sharing charge by contact',
      q: 'Two identical metal spheres carry $+6$ nC and $-2$ nC. They are touched together and separated. What charge does each end with?',
      steps: [
        'Charge is conserved: the total is $+6 + (-2) = +4$ nC.',
        'Identical conductors in contact share charge equally (by symmetry they end at the same potential).',
        'Each sphere ends with $+4/2 = +2$ nC. Electrons flowed from the negative sphere to the positive one until the imbalance was shared.'
      ],
      a: '$+2$ nC each.'
    }
  ],
  quiz: [
    { q: 'A glass rod rubbed with silk becomes positively charged. What happened?', choices: ['Protons moved from the silk to the glass', 'Electrons moved from the glass to the silk', 'Positive charge was created in the glass by friction', 'Electrons were destroyed in the glass'], a: 1,
      why: 'Only electrons move easily, and charge is neither created nor destroyed. The glass lost electrons to the silk, which is left with an equal negative charge.' },
    { q: 'An oil drop could carry a charge of $4.0 \\times 10^{-19}$ C.', a: false,
      why: '$4.0 \\times 10^{-19} / 1.602 \\times 10^{-19} = 2.5$, not a whole number. Millikan found that every drop\'s charge was a whole multiple of $e$.' },
    { q: 'Two identical metal spheres carrying $+8$ nC and $-4$ nC touch and are separated. Each now has…', choices: ['+2 nC', '+4 nC', '+6 nC', '+8 nC and −4 nC, unchanged'], a: 0,
      why: 'The total $+4$ nC is conserved and shared equally between identical spheres.' },
    { q: 'A negatively charged rod is held near (not touching) a metal can on an insulating stand. The side of the can nearer the rod becomes…', choices: ['negative', 'positive', 'neutral', 'positive only if the can is earthed'], a: 1,
      why: 'The rod repels the can\'s free electrons to the far side, leaving the near side positive. The can as a whole is still neutral — this separation is the first step of charging by induction.' },
    { q: 'Why does a charged comb attract a small scrap of uncharged paper?', choices: ['The paper becomes charged by the air', 'The comb polarizes the paper, and the nearer unlike charge is attracted more than the farther like charge is repelled', 'Gravity between comb and paper', 'All objects attract charged objects equally'], a: 1,
      why: 'Polarization puts unlike charge slightly closer; because the force falls with distance, attraction wins.' }
  ],
  applications: [
    'Laser printers and photocopiers place toner exactly where a drum has been charged by light.',
    'Electrostatic precipitators remove soot and dust from power-station exhaust by charging the particles.',
    'Powder coating and car-body spray painting charge the paint so it wraps evenly round the earthed metal.',
    'Anti-static straps and conductive flooring protect electronics and prevent sparks near fuel.'
  ],
  history: 'Benjamin Franklin introduced the terms positive and negative in the 1740s and proposed that electricity is a single fluid that is conserved. Robert Millikan\'s oil-drop experiment (1909–1913) showed directly that charge comes in whole multiples of one elementary charge.'
},

{
  id: 'coulombs-law', parent: 'electrostatics', title: 'Coulomb\'s law', level: 1,
  short: 'The force between two point charges is proportional to each charge and to the inverse square of their separation — repulsive for like charges, attractive for unlike.',
  keywords: ['Coulomb', 'inverse square', 'electrostatic force', 'point charge', 'superposition', 'k', '8.99e9', 'permittivity', 'torsion balance'],
  prereq: ['electric-charge', 'newtons-third-law', 'math:vectors'],
  related: ['newtons-law-of-gravitation', 'electric-field', 'electric-potential-energy', 'gauss-law'],
  body: `
Two small charged objects push or pull on each other along the line joining them. In 1785 Charles-Augustin de Coulomb measured the force with a delicate torsion balance and found it proportional to each charge and inversely proportional to the **square of the distance**:

$$F = k\\,\\frac{|q_1 q_2|}{r^2}, \\qquad k = \\frac{1}{4\\pi\\varepsilon_0} = 8.99 \\times 10^{9}\\ \\mathrm{N\\,m^2/C^2}$$

Here $\\varepsilon_0 = 8.85 \\times 10^{-12}\\ \\mathrm{F/m}$ is the permittivity of free space. The force acts along the line between the charges — apart for like charges, together for unlike ones. Each charge feels a force of the same size in the opposite direction, as [[newtons-third-law|Newton's third law]] demands, even when one charge is far bigger than the other.

### Inverse square
Double the separation and the force falls to a quarter; triple it and it falls to a ninth. [[newtons-law-of-gravitation|Gravity]] follows the same law for the same geometric reason: the influence of a point source spreads over spheres whose area grows as $r^2$ — an idea made precise by [[gauss-law|Gauss's law]].

### How strong?
The constant $k$ is huge. Two charges of 1 C held 1 m apart would push each other with $9 \\times 10^{9}$ N, the weight of about a million tonnes. Two 1 µC charges 1 m apart feel 9 mN; bring them to 1 cm and the force is 90 N. This is why matter in bulk is so precisely neutral: even a tiny imbalance of charge gives noticeable forces.

Next to gravity, electricity is overwhelmingly strong. In a hydrogen atom the electric attraction between electron and proton is $8.2 \\times 10^{-8}$ N, which is $2.3 \\times 10^{39}$ times their gravitational attraction. Gravity only rules the large-scale universe because matter is almost perfectly neutral: electric forces cancel, gravitational forces all add up.

### Many charges: superposition
The force on one charge from several others is the [[math:vector-addition|vector sum]] of the forces each would exert on its own. Nothing more is needed for any arrangement of point charges, though for continuous distributions the sum becomes an integral and the [[electric-field|field]] description is more convenient.

### Inside a material
Between two charges immersed in an insulator the force is reduced by the material's [[dielectrics|dielectric constant]] $\\kappa$, because the molecules around them polarize and partly screen them. For water $\\kappa \\approx 80$: the attraction between a sodium and a chloride ion drops 80-fold, one reason salt dissolves so readily.

> [!note] The law is exact for point charges at rest and for uniformly charged spheres measured centre to centre. When charges move quickly, magnetic forces join in — see [[lorentz-force]].
`,
  ideas: [
    'The force is proportional to the product of the charges and to $1/r^2$.',
    'Like charges repel, unlike attract; the force acts along the line joining them.',
    'The two charges feel equal and opposite forces.',
    'Forces from several charges add as vectors (superposition).',
    'The electric force dwarfs gravity; gravity wins on large scales only because matter is neutral.'
  ],
  pitfalls: [
    'The bigger charge feels the bigger force — Both feel exactly the same size of force, in opposite directions.',
    'Doubling the distance halves the force — It quarters it: the force goes as $1/r^2$.',
    'Adding forces from several charges by adding magnitudes — Forces are vectors; directions matter and forces can partly cancel.'
  ],
  formulas: [
    {
      name: 'Coulomb\'s law',
      expr: 'F = ke*q1*q2/r^2', tex: 'F = k\\,\\frac{q_1 q_2}{r^2}',
      vars: {
        F: { name: 'force (positive = repulsion, negative = attraction)', q: 'force', unit: 'N', signed: true },
        q1: { name: 'first charge', q: 'charge', unit: 'uC', value: 3, signed: true },
        q2: { name: 'second charge', q: 'charge', unit: 'uC', value: -2, signed: true },
        r: { name: 'separation (centre to centre)', q: 'length', unit: 'cm', value: 10 },
        ke: { const: 'ke' }
      },
      note: 'With signed charges the sign of $F$ tells the direction: positive means the charges repel, negative that they attract.',
      stories: {
        F: 'Two small charged spheres, {q1} and {q2}, are {r} apart, centre to centre. What force does each exert on the other?',
        r: 'Two point charges, {q1} and {q2}, exert a force of {F} on each other (negative means attraction). How far apart are they?',
        q2: 'A charge of {q1} exerts a force of {F} on a second charge {r} away (negative means attraction). What is the second charge?'
      }
    },
    {
      name: 'Electric force compared with gravity',
      expr: 'N = ke*q1*q2/(G*m1*m2)', tex: 'N = \\frac{F_e}{F_g} = \\frac{k\\,q_1 q_2}{G\\,m_1 m_2}',
      vars: {
        N: { name: 'ratio of the electric to the gravitational force' },
        q1: { name: 'first charge', q: 'charge', unit: 'e', value: 1 },
        q2: { name: 'second charge', q: 'charge', unit: 'e', value: 1 },
        m1: { name: 'first mass', q: 'mass', unit: 'u', value: 0.000548580 },
        m2: { name: 'second mass', q: 'mass', unit: 'u', value: 1.00728 },
        ke: { const: 'ke' },
        G: { const: 'G' }
      },
      note: 'The distance cancels because both forces are inverse-square. The defaults are an electron and a proton.',
      stories: { N: 'How many times stronger is the electric force than the gravitational force between particles of charge {q1} and {q2} and masses {m1} and {m2}?' },
      practice: { unknowns: ['N'] }
    }
  ],
  examples: [
    {
      title: 'Inside a hydrogen atom',
      q: 'In hydrogen the electron is on average about $5.29 \\times 10^{-11}$ m from the proton. How big is the electric force between them?',
      steps: [
        '$F = k\\dfrac{e^2}{r^2} = 8.99 \\times 10^{9} \\times \\dfrac{(1.602 \\times 10^{-19})^2}{(5.29 \\times 10^{-11})^2}$.',
        'Numerator: $8.99 \\times 10^{9} \\times 2.57 \\times 10^{-38} = 2.31 \\times 10^{-28}$; denominator $2.80 \\times 10^{-21}$.',
        '$F = 8.2 \\times 10^{-8}$ N, attractive. Tiny in everyday terms, it gives the electron (mass $9.1 \\times 10^{-31}$ kg) an acceleration of about $10^{23}\\ \\mathrm{m/s^2}$.'
      ],
      a: '$8.2 \\times 10^{-8}$ N, attractive.'
    },
    {
      title: 'Three charges in a line',
      q: 'A $+4$ µC charge sits at $x = 0$, a $+1$ µC charge at $x = 0.20$ m and a $-2$ µC charge at $x = 0.50$ m. What is the net force on the $+1$ µC charge?',
      steps: [
        'From the $+4$ µC charge, 0.20 m away: $F = \\dfrac{8.99 \\times 10^{9} \\times 4 \\times 10^{-6} \\times 1 \\times 10^{-6}}{0.20^2} = 0.899$ N, repulsive, so pointing in $+x$.',
        'From the $-2$ µC charge, 0.30 m away: $F = \\dfrac{8.99 \\times 10^{9} \\times 2 \\times 10^{-6} \\times 1 \\times 10^{-6}}{0.30^2} = 0.200$ N, attractive, so also towards $+x$.',
        'Both point the same way, so they add: $F = 0.899 + 0.200 = 1.10$ N in the $+x$ direction.'
      ],
      a: '1.10 N towards $+x$.'
    }
  ],
  quiz: [
    { q: 'The distance between two charges is tripled. The force between them becomes…', choices: ['one third', 'one sixth', 'one ninth', 'three times smaller squared, then doubled'], a: 2,
      why: '$F \\propto 1/r^2$, so tripling $r$ divides the force by 9.' },
    { q: 'Charge A is +8 µC and charge B is +1 µC. Compared with the force A exerts on B, the force B exerts on A is…', choices: ['8 times larger', 'the same size, opposite direction', '8 times smaller', 'zero, since B is so small'], a: 1,
      why: 'Newton\'s third law: the force depends on the product $q_1 q_2$, which is the same for both.' },
    { q: 'Both charges are doubled and their separation is doubled. The force…', choices: ['is unchanged', 'doubles', 'quadruples', 'halves'], a: 0,
      why: 'The product of charges grows by 4 and $r^2$ grows by 4: the factors cancel.' },
    { q: '+4 µC sits at $x = 0$ and +1 µC at $x = 0.30$ m. Where between them would a third charge feel no net force?', choices: ['0.10 m', '0.15 m', '0.20 m', '0.24 m'], a: 2,
      why: 'Set $4/x^2 = 1/(0.30 - x)^2$, so $2(0.30 - x) = x$ and $x = 0.20$ m — closer to the smaller charge, as it must be.' },
    { q: 'Between an electron and a proton, the electric force is about how many times the gravitational force?', choices: ['$10^{3}$', '$10^{12}$', '$10^{39}$', 'They are about equal'], a: 2,
      why: 'The ratio is $2.3 \\times 10^{39}$, whatever the distance, because both forces fall as $1/r^2$.' }
  ],
  applications: [
    'Chemistry: the forces holding atoms, molecules and ionic crystals together are Coulomb forces.',
    'Electrostatic loudspeakers and MEMS actuators move parts with forces between charged plates.',
    'Inkjet printers steer charged droplets.'
  ],
  history: 'Joseph Priestley guessed the inverse-square law in 1767 by analogy with gravity, and Henry Cavendish confirmed it in unpublished work around 1773. Coulomb published his torsion-balance measurements in 1785, and the law bears his name.',
  sim: 'em1-coulomb'
},

{
  id: 'electric-field', parent: 'electrostatics', title: 'Electric field', level: 1,
  short: 'The force per unit charge that a charge would feel at each point in space: a vector field set up by all the other charges.',
  keywords: ['electric field', 'field lines', 'test charge', 'N/C', 'V/m', 'superposition', 'dipole', 'Faraday', 'field strength'],
  prereq: ['coulombs-law', 'math:scalar-vector-fields', 'math:vector-addition'],
  related: ['gauss-law', 'electric-potential', 'gravitational-field', 'electromagnetic-waves'],
  body: `
[[coulombs-law|Coulomb's law]] describes a force between two charges acting across empty space. The **field** picture splits that into two steps: every charge sets up an **electric field** $\\vec E$ in the space around it, and any other charge placed there feels a force from the field at its own position:

$$\\vec F = q\\,\\vec E \\qquad\\Leftrightarrow\\qquad \\vec E = \\frac{\\vec F}{q}$$

The field is the force **per unit charge** a small positive test charge would feel. Its unit is the newton per coulomb, N/C, which is exactly the same as the volt per metre, V/m. A positive charge is pushed along $\\vec E$; a negative charge, such as an electron, is pushed the opposite way.

### Field of a point charge
Divide Coulomb's force by the test charge and the field at distance $r$ from a charge $Q$ is

$$E = k\\frac{|Q|}{r^2}$$

pointing straight away from a positive charge and straight towards a negative one. The fields of several charges add as vectors (superposition), so any arrangement can be built up one charge at a time. Two opposite charges close together — a **dipole**, the pattern of many molecules — give a field that falls off faster, as $1/r^3$, because from far away the two charges almost cancel.

### Field lines
Michael Faraday pictured the field with **lines of force** that follow the direction of $\\vec E$:

- they start on positive charges and end on negative ones (or run off to infinity);
- the number leaving or arriving at a charge is proportional to its size;
- where lines crowd together the field is strong, where they spread out it is weak;
- they never cross, because the field has only one direction at each point.

Between two large, flat, oppositely charged plates the lines run straight across, evenly spaced: the field there is **uniform**, the same everywhere. This is how particle beams are steered and how a [[capacitance|capacitor]] works.

### Typical field strengths
| Situation | $E$ (V/m) |
|---|---|
| Fair-weather field near the ground | 100–150 |
| Under a thundercloud | about $10^{4}$ |
| Breakdown of dry air (sparks) | $3 \\times 10^{6}$ |
| Across a cell membrane (70 mV over 7 nm) | $10^{7}$ |
| At the electron in a hydrogen atom | $5 \\times 10^{11}$ |

### Is the field real?
For charges at rest the field could be seen as bookkeeping for Coulomb forces. But when a charge moves, the change in its field spreads outward at the speed of light, and fields carry energy and momentum of their own. An [[electromagnetic-waves|electromagnetic wave]] is a field that has left its charges behind.

> [!tip] In the simulation, drag the charges and watch the field lines rearrange. The probe shows $\\vec E$ at one point. Switch to two like charges and hunt for the spot where their fields cancel.
`,
  ideas: [
    'The field is the force per unit positive charge: $\\vec E = \\vec F/q$.',
    'A point charge makes a radial field of strength $kQ/r^2$.',
    'Fields of several charges add as vectors.',
    'Field lines start on + and end on −, never cross, and crowd where the field is strong.',
    'A negative charge feels a force opposite to the field.'
  ],
  pitfalls: [
    'The field at a point depends on the test charge put there — The field is set up by the other charges; doubling the test charge doubles the force but leaves $E$ unchanged.',
    'Field lines are paths that charges follow — They give the direction of the force, hence of the acceleration, not of the velocity. A charge moving sideways curves across the lines.',
    'Where there are no field lines drawn there is no field — Lines are a sample; the field exists between them too.'
  ],
  formulas: [
    {
      name: 'Force on a charge in a field',
      expr: 'F = q*E', tex: 'F = qE',
      vars: {
        F: { name: 'force (along the field if positive)', q: 'force', unit: 'N', signed: true },
        q: { name: 'charge', q: 'charge', unit: 'uC', value: 2, signed: true },
        E: { name: 'field strength', q: 'efield', unit: 'kV/m', value: 10 }
      },
      stories: {
        F: 'A dust grain carrying {q} drifts into a region where the field is {E}. How big is the electric force on it?',
        E: 'A charge of {q} feels a force of {F}. How strong is the field there?'
      }
    },
    {
      name: 'Field of a point charge',
      expr: 'E = ke*Q/r^2', tex: 'E = k\\frac{Q}{r^2}',
      vars: {
        E: { name: 'field strength', q: 'efield', unit: 'N/C' },
        Q: { name: 'size of the source charge', q: 'charge', unit: 'nC', value: 10 },
        r: { name: 'distance from the charge', q: 'length', unit: 'cm', value: 30 },
        ke: { const: 'ke' }
      },
      note: 'Also valid outside a uniformly charged sphere, with $r$ measured from its centre.',
      stories: {
        E: 'How strong is the electric field {r} from a small sphere carrying {Q}?',
        r: 'How far from a {Q} point charge has its field fallen to {E}?',
        Q: 'The field {r} from a small charged ball is {E}. What charge does the ball carry?'
      }
    },
    {
      name: 'Acceleration of an electron in a field',
      expr: 'a = qe*E/me', tex: 'a = \\frac{eE}{m_e}',
      vars: {
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²' },
        E: { name: 'field strength', q: 'efield', unit: 'V/m', value: 1000 },
        qe: { const: 'qe' },
        me: { const: 'me' }
      },
      note: 'Non-relativistic: fine while the electron stays well below the speed of light.',
      stories: { a: 'An electron sits in a uniform field of {E}. What is its acceleration?' }
    }
  ],
  examples: [
    {
      title: 'Midway between two opposite charges',
      q: 'Charges of $+4$ nC and $-4$ nC are 10 cm apart. What is the field halfway between them?',
      steps: [
        'Each charge is 5 cm from the midpoint: $E_1 = E_2 = \\dfrac{8.99 \\times 10^{9} \\times 4 \\times 10^{-9}}{0.05^2} = 1.44 \\times 10^{4}$ N/C.',
        'Directions: the field of the positive charge points away from it, towards the negative one; the field of the negative charge points towards itself — the same direction.',
        'They add: $E = 2.88 \\times 10^{4}$ N/C, pointing towards the negative charge.'
      ],
      a: '$2.9 \\times 10^{4}$ N/C, towards the negative charge.'
    },
    {
      title: 'Millikan\'s balancing act',
      q: 'An oil drop of radius 1.0 µm (density 900 kg/m³) carries three extra electrons. What field between horizontal plates holds it still, and what voltage is that for plates 1.0 cm apart?',
      steps: [
        'Mass: $m = \\tfrac43\\pi r^3 \\rho = \\tfrac43\\pi (10^{-6})^3 \\times 900 = 3.77 \\times 10^{-15}$ kg; weight $mg = 3.70 \\times 10^{-14}$ N.',
        'Balance: $qE = mg$ with $q = 3e = 4.81 \\times 10^{-19}$ C, so $E = \\dfrac{3.70 \\times 10^{-14}}{4.81 \\times 10^{-19}} = 7.7 \\times 10^{4}$ V/m.',
        'For a uniform field, $V = Ed = 7.7 \\times 10^{4} \\times 0.010 = 770$ V. The top plate must be positive, so the upward force on the negative drop balances gravity.'
      ],
      a: '$7.7 \\times 10^{4}$ V/m, about 770 V across the plates.'
    }
  ],
  quiz: [
    { q: 'At point P the field is 500 N/C pointing east. A charge of $-2$ nC placed at P feels a force of…', choices: ['1 µN east', '1 µN west', '250 N/C west', '1000 N east'], a: 1,
      why: '$F = qE = 2 \\times 10^{-9} \\times 500 = 10^{-6}$ N, and a negative charge is pushed against the field.' },
    { q: 'The test charge placed at a point is doubled. The electric field at that point…', choices: ['doubles', 'halves', 'is unchanged', 'quadruples'], a: 2,
      why: 'The field is made by the other charges. The force doubles, but force per charge does not change.' },
    { q: 'Two field lines can cross where the fields of two charges meet.', a: false,
      why: 'At each point the total field has a single direction, so exactly one line passes through it.' },
    { q: 'Midway between two equal positive charges, the electric field is…', choices: ['twice that of one charge', 'zero', 'directed towards either charge', 'infinite'], a: 1,
      why: 'The two fields are equal in size and point in opposite directions, so they cancel.' },
    { q: 'You move to half the distance from a point charge. The field becomes…', choices: ['twice as strong', 'four times as strong', 'half as strong', 'unchanged'], a: 1,
      why: '$E \\propto 1/r^2$: halving $r$ multiplies $E$ by 4.' }
  ],
  applications: [
    'Cathode-ray tubes, electron microscopes and mass spectrometers steer charged beams with fields.',
    'Electric fish sense prey through tiny distortions of a field they make themselves.',
    'Lightning rods work by concentrating the field at a sharp point, starting a discharge on the rod\'s terms.'
  ],
  sim: { id: 'em1-field', params: { preset: 'dipole' } }
},

{
  id: 'gauss-law', parent: 'electrostatics', title: 'Gauss\'s law', level: 2,
  short: 'The electric flux out of any closed surface equals the charge inside divided by ε₀ — a counting rule for field lines that makes symmetric fields easy.',
  keywords: ['Gauss', 'electric flux', 'closed surface', 'Gaussian surface', 'pillbox', 'line charge', 'sheet of charge', 'conductor', 'Faraday cage', 'shielding', 'divergence'],
  prereq: ['electric-field', 'math:flux-integrals', 'math:surface-area'],
  related: ['maxwells-equations', 'capacitance', 'math:divergence-theorem', 'gravitational-field'],
  body: `
Field lines suggest a counting rule. Every line that leaves a positive charge has to go somewhere, so if you surround the charge by any closed surface — a sphere, a box, a potato shape — all its lines must pierce that surface on the way out. The idea of "number of lines crossing a surface" is made precise by the **electric flux**. Through a flat area $A$ in a uniform field making an angle $\\theta$ with the area's normal it is $\\Phi_E = EA\\cos\\theta$; in general it is the [[math:flux-integrals|surface integral]] $\\Phi_E = \\int \\vec E \\cdot d\\vec A$.

**Gauss's law** says that the total flux out of any closed surface is fixed by the charge inside it, and by nothing else:

$$\\oint \\vec E \\cdot d\\vec A = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}$$

A charge outside the surface sends lines in on one side and out on the other, so its net flux is zero, however much it distorts the field on the surface. The law holds for every surface and every distribution of charge, and it is the first of [[maxwells-equations|Maxwell's equations]]. Its local form, $\\nabla \\cdot \\vec E = \\rho/\\varepsilon_0$, says that field lines begin and end only on charge (see [[math:divergence|divergence]] and the [[math:divergence-theorem|divergence theorem]]).

### Using it to find fields
Gauss's law is always true, but it only *hands you* $E$ when symmetry lets you pick a surface on which the field is constant and perpendicular (or parallel) to the surface. Then the integral is just $E$ times an area. Three classic cases:

| Charge | Gaussian surface | Field |
|---|---|---|
| Point charge, or uniform sphere (outside) | concentric sphere, area $4\\pi r^2$ | $E = \\dfrac{Q}{4\\pi\\varepsilon_0 r^2}$ |
| Long straight line, $\\lambda$ per metre | coaxial cylinder | $E = \\dfrac{\\lambda}{2\\pi\\varepsilon_0 r}$ |
| Large flat sheet, $\\sigma$ per square metre | a "pillbox" through the sheet | $E = \\dfrac{\\sigma}{2\\varepsilon_0}$ |

The first gives back [[coulombs-law|Coulomb's law]]: the inverse square is simply the area of a sphere. A line's field falls as $1/r$, and a sheet's does not fall at all. Put two oppositely charged sheets side by side and their fields add between them and cancel outside: the field between is uniform, $E = \\sigma/\\varepsilon_0$ — the [[capacitance|parallel-plate capacitor]].

### Conductors
Inside a conductor in equilibrium the field must be zero; otherwise the free electrons would still be moving. A Gaussian surface drawn just inside the metal therefore encloses no net charge, so **any excess charge on a conductor sits on its outer surface**, and just outside, the field is perpendicular to the surface with $E = \\sigma/\\varepsilon_0$.

A hollow metal shell shields its inside from outside fields: this is the **Faraday cage**. It is why people inside a car or aeroplane struck by lightning are safe (the metal body, not the tyres, protects them), and why a phone loses signal in a metal lift.

> [!tip] Switch on the Gaussian sphere in the simulation and drag it around. The flux through it jumps only when a charge crosses its surface — never because of charges outside.
`,
  ideas: [
    'Electric flux counts field lines crossing a surface.',
    'Net flux out of a closed surface is $Q_{\\text{enc}}/\\varepsilon_0$, whatever the shape or the charges outside.',
    'With symmetry, Gauss\'s law gives the field in one line: spheres, lines and sheets.',
    'Excess charge on a conductor lives on its surface, and the field inside is zero.',
    'A closed metal shell screens its interior from outside fields.'
  ],
  pitfalls: [
    'Zero net flux means zero field on the surface — It means equal flux in and out. A charge outside the surface makes a field on it but no net flux.',
    'Gauss\'s law only works for symmetric charges — It is always true; symmetry is only needed to use it as a shortcut for finding $E$.',
    'The field at the surface comes only from the enclosed charge — All charges contribute to $E$; only the net flux is set by the enclosed charge alone.'
  ],
  derivation: {
    title: 'Field of a large charged sheet',
    steps: [
      { text: 'By symmetry the field of a large uniform sheet points straight away from it on both sides, with the same size $E$ at equal distances. Take a cylindrical "pillbox" of end area $A$ straddling the sheet.' },
      { text: 'The curved side is parallel to the field, so no flux crosses it. Each flat end has flux $EA$ outward:', tex: '\\oint \\vec E \\cdot d\\vec A = EA + EA = 2EA' },
      { text: 'The pillbox encloses the charge on area $A$ of the sheet:', tex: 'Q_{\\text{enc}} = \\sigma A' },
      { text: 'Gauss\'s law then gives', tex: '2EA = \\frac{\\sigma A}{\\varepsilon_0} \\;\\Rightarrow\\; E = \\frac{\\sigma}{2\\varepsilon_0}' },
      { text: 'The area cancels, and so does any dependence on distance: the field of an infinite sheet is uniform. Two sheets with $+\\sigma$ and $-\\sigma$ give $\\sigma/\\varepsilon_0$ between them and zero outside.' }
    ]
  },
  formulas: [
    {
      name: 'Gauss\'s law: flux through a closed surface',
      expr: 'Phi = Q/eps0', tex: '\\Phi_E = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}',
      vars: {
        Phi: { name: 'net electric flux out of the surface', q: 'eflux', unit: 'N·m²/C', tex: '\\Phi_E', signed: true },
        Q: { name: 'charge enclosed', q: 'charge', unit: 'nC', value: 10, tex: 'Q_{\\text{enc}}', signed: true },
        eps0: { const: 'eps0' }
      },
      stories: {
        Phi: 'A closed box contains {Q}. What is the total electric flux out of it?',
        Q: 'The net electric flux out of a closed surface is {Phi}. How much charge is inside?'
      }
    },
    {
      name: 'Field of a long line of charge',
      expr: 'E = lambda/(2*pi*eps0*r)', tex: 'E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}',
      vars: {
        E: { name: 'field strength', q: 'efield', unit: 'N/C' },
        lambda: { name: 'charge per unit length', q: 'linecharge', unit: 'nC/m', value: 50 },
        r: { name: 'distance from the line', q: 'length', unit: 'cm', value: 5 },
        eps0: { const: 'eps0' }
      },
      stories: { E: 'A long straight wire carries {lambda}. How strong is its field {r} away?' }
    },
    {
      name: 'Field of a large charged sheet',
      expr: 'E = sigma/(2*eps0)', tex: 'E = \\frac{\\sigma}{2\\varepsilon_0}',
      vars: {
        E: { name: 'field strength', q: 'efield', unit: 'N/C' },
        sigma: { name: 'surface charge density', q: 'surfacecharge', unit: 'uC/m²', value: 1 },
        eps0: { const: 'eps0' }
      },
      note: 'Near a sheet that is large compared with the distance to it. Just outside a conductor, where all the lines leave on one side, the field is twice this: $\\sigma/\\varepsilon_0$.',
      stories: { E: 'A large flat insulating sheet carries {sigma}. How strong is the field near it?' }
    }
  ],
  examples: [
    {
      title: 'A charged metal sphere',
      q: 'A metal sphere of radius 10 cm carries $+20$ nC. Find the field just outside its surface, 30 cm from its centre, and inside it.',
      steps: [
        'The charge sits on the surface, spread evenly by symmetry. Outside, a concentric Gaussian sphere encloses all 20 nC, so $E = kQ/r^2$ as for a point charge.',
        'Just outside ($r = 0.10$ m): $E = \\dfrac{8.99 \\times 10^{9} \\times 2 \\times 10^{-8}}{0.10^2} = 1.8 \\times 10^{4}$ N/C.',
        'At $r = 0.30$ m: $E = \\dfrac{8.99 \\times 10^{9} \\times 2 \\times 10^{-8}}{0.30^2} = 2.0 \\times 10^{3}$ N/C, nine times weaker.',
        'Inside, a Gaussian sphere encloses no charge; by symmetry $E$ would be the same all over it, so $E = 0$.'
      ],
      a: '$1.8 \\times 10^{4}$ N/C at the surface, $2.0 \\times 10^{3}$ N/C at 30 cm, zero inside.'
    },
    {
      title: 'How much charge can a sphere hold?',
      q: 'Air breaks down at about $3 \\times 10^{6}$ V/m. What is the most charge a 10 cm-radius sphere can hold in air?',
      steps: [
        'The field is greatest right at the surface: $E = kQ/R^2$.',
        '$Q_{\\text{max}} = \\dfrac{E_{\\text{max}} R^2}{k} = \\dfrac{3 \\times 10^{6} \\times 0.10^2}{8.99 \\times 10^{9}} = 3.3 \\times 10^{-6}$ C.',
        'Bigger domes hold more (the limit grows as $R^2$), which is why Van de Graaff generators have large, smooth spheres.'
      ],
      a: 'About 3.3 µC.'
    }
  ],
  quiz: [
    { q: 'A closed surface encloses a $+5$ nC charge, and a $-5$ nC charge sits just outside it. The net flux out of the surface is…', choices: ['zero', '$+5\\ \\mathrm{nC}/\\varepsilon_0$', '$+10\\ \\mathrm{nC}/\\varepsilon_0$', 'impossible to say without the shape'], a: 1,
      why: 'Only enclosed charge counts. The outside charge changes the field on the surface but its lines enter and leave, adding no net flux.' },
    { q: 'A Gaussian sphere around a point charge is made twice as big. The flux through it…', choices: ['doubles', 'quadruples', 'falls to a quarter', 'is unchanged'], a: 3,
      why: 'The area grows by 4 and the field falls by 4; the same lines cross it. The flux is $Q/\\varepsilon_0$ for any size.' },
    { q: 'If the net flux through a closed surface is zero, the field is zero everywhere on that surface.', a: false,
      why: 'Zero net flux only means as much flux enters as leaves — for instance around a region with no charge in a uniform field.' },
    { q: 'Where does excess charge on a solid metal ball end up?', choices: ['spread evenly through the volume', 'at the centre', 'on the outer surface', 'half inside, half outside'], a: 2,
      why: 'The field inside a conductor in equilibrium is zero, so by Gauss\'s law no net charge can sit inside.' },
    { q: 'Near a large uniformly charged sheet, moving from 1 cm to 2 cm away, the field…', choices: ['halves', 'quarters', 'stays the same', 'doubles'], a: 2,
      why: 'For a sheet much larger than the distance, $E = \\sigma/2\\varepsilon_0$, independent of distance.' }
  ],
  applications: [
    'Shielded cables and metal equipment cases keep stray fields out of sensitive electronics.',
    'Faraday cages protect people in cars and aircraft struck by lightning, and let engineers test radios without interference.',
    'The same law, with mass in place of charge, gives the gravity inside and outside planets.'
  ],
  history: 'Joseph-Louis Lagrange found the equivalent result for gravity in 1773. Carl Friedrich Gauss formulated it in 1835, though it was only published in 1867, after his death. Faraday\'s ice-pail experiment of 1843 showed that the charge on a closed conductor is always found on its outside.',
  sim: { id: 'em1-field', params: { preset: 'gauss' } }
},

{
  id: 'electric-potential', parent: 'electrostatics', title: 'Electric potential', level: 2,
  short: 'Potential energy per unit charge at each point: the "height" of the electric landscape, measured in volts. The field points downhill.',
  keywords: ['potential', 'voltage', 'volt', 'potential difference', 'equipotential', 'gradient', 'V = kQ/r', 'uniform field', 'earth', 'ground'],
  prereq: ['electric-field', 'electric-potential-energy', 'math:gradient'],
  related: ['capacitance', 'ohms-law', 'gravitational-potential', 'math:line-integrals'],
  body: `
Lifting a stone against gravity stores energy; pushing a positive charge against an electric field does the same. The **electric potential** $V$ at a point is the [[electric-potential-energy|potential energy]] per unit charge that a test charge would have there:

$$V = \\frac{U}{q}$$

Its unit, the joule per coulomb, is the **volt** (V). Like height on a map, only differences have meaning; the zero is a choice — the earth for circuits, infinitely far away for isolated charges. The **potential difference** $\\Delta V$ between two points is what a voltmeter reads and what everyday "voltage" means: a 9 V battery gives every coulomb that passes through it 9 J of energy.

### Potential and field
The field points **downhill**, from high potential to low, and its strength is the steepness of the slope:

$$E_x = -\\frac{dV}{dx}, \\qquad \\Delta V = V_B - V_A = -\\int_A^B \\vec E \\cdot d\\vec \\ell$$

In three dimensions the field is minus the [[math:gradient|gradient]] of $V$. In a uniform field, such as between parallel plates, the potential falls steadily and a gap $d$ along the field has $\\Delta V = Ed$. That is why fields are quoted in volts per metre: air breaks down at about 3 MV/m, so a 1 cm spark needs about 30 kV.

### Potential of a point charge
Taking $V = 0$ far away, the potential at distance $r$ from a charge $Q$ is

$$V = k\\frac{Q}{r}$$

It falls off as $1/r$ (not $1/r^2$) and carries the sign of $Q$: positive near positive charges, negative near negative ones. Potential is a **scalar**, so for several charges you simply add numbers — far easier than adding field vectors, and the field can then be found from the slope.

### Equipotentials
Surfaces of equal potential are like contour lines on a map. The field is everywhere **perpendicular** to them, and no work is done moving a charge along one. Around a point charge they are spheres; between parallel plates, planes parallel to the plates. Where they crowd together the field is strong.

A conductor in equilibrium is a single equipotential: if two parts were at different potentials, charge would flow until they were not. That is why a bird on one high-voltage line is safe — both its feet are at the same potential, so no current flows through it. Touching a second wire, or the pole, would be another matter.

### Typical values
| Situation | Potential difference |
|---|---|
| Across a nerve-cell membrane | 70 mV |
| AA cell | 1.5 V |
| Mains supply | 230 V (120 V in North America) |
| Static shock from a door handle | 5–20 kV |
| Van de Graaff generator dome | a few hundred kV |
| Lightning, cloud to ground | around 100 MV |

> [!tip] In the simulation, turn on the equipotentials: they are always at right angles to the field lines, and closest together where the field is strongest.
`,
  ideas: [
    'Potential is potential energy per unit charge, in volts (J/C).',
    'Only potential differences are physical; the zero is a choice.',
    'The field points from high to low potential, and $E$ is the slope: $E = -dV/dx$.',
    'Potentials of several charges add as plain numbers.',
    'Equipotentials are perpendicular to field lines; a conductor is one equipotential.'
  ],
  pitfalls: [
    'Zero potential means zero field — Midway between $+Q$ and $-Q$ the potential is zero but the field is strong. The field is the slope of $V$, not its value.',
    'Potential and potential energy are the same thing — Potential belongs to a point in space; potential energy belongs to a charge placed there: $U = qV$.',
    'High voltage alone is what makes a shock dangerous — The harm comes from current through the body, which needs both a large voltage and a source able to drive current. A static spark of 10 kV carries very little charge.'
  ],
  derivation: {
    title: 'The potential of a point charge, from its field',
    steps: [
      { text: 'Start from the definition, with the zero of potential infinitely far away:', tex: 'V(r) = V(\\infty) - \\int_\\infty^{r} \\vec E \\cdot d\\vec \\ell = -\\int_\\infty^{r} \\vec E \\cdot d\\vec \\ell' },
      { text: 'The result does not depend on the path, so come in along a radius, where $\\vec E \\cdot d\\vec \\ell = E\\,dr\'$ with $E = kQ/r\'^2$:', tex: 'V(r) = -\\int_\\infty^{r} \\frac{kQ}{r\'^2}\\,dr\'' },
      { text: 'Integrate ([[math:improper-integrals|an improper integral]], which converges):', tex: 'V(r) = -kQ\\left[-\\frac{1}{r\'}\\right]_\\infty^{r} = \\frac{kQ}{r}' },
      { text: 'Going the other way, the slope gives back the field: $E = -dV/dr = kQ/r^2$.' }
    ]
  },
  formulas: [
    {
      name: 'Potential of a point charge',
      expr: 'V = ke*Q/r', tex: 'V = k\\frac{Q}{r}',
      vars: {
        V: { name: 'potential (zero far away)', q: 'voltage', unit: 'V', signed: true },
        Q: { name: 'charge', q: 'charge', unit: 'nC', value: 5, signed: true },
        r: { name: 'distance from the charge', q: 'length', unit: 'cm', value: 10 },
        ke: { const: 'ke' }
      },
      stories: {
        V: 'What is the electric potential {r} from a small sphere carrying {Q}?',
        r: 'At what distance from a {Q} charge is the potential {V}?'
      }
    },
    {
      name: 'Potential difference in a uniform field',
      expr: 'V = E*d', tex: 'V = E d',
      vars: {
        V: { name: 'potential difference', q: 'voltage', unit: 'kV' },
        E: { name: 'field strength', q: 'efield', unit: 'MV/m', value: 3 },
        d: { name: 'distance along the field', q: 'length', unit: 'mm', value: 10 }
      },
      note: 'Only for a uniform field, such as between large parallel plates. About 3 MV/m breaks down dry air.',
      stories: {
        V: 'A spark jumps a {d} gap once the field reaches {E}. What voltage does it take?',
        E: 'Plates {d} apart are held at a potential difference of {V}. How strong is the field between them?',
        d: 'At {E} air breaks down. How long a spark can a {V} supply make?'
      }
    }
  ],
  examples: [
    {
      title: 'Adding potentials',
      q: 'A $+3$ nC charge is 10 cm from point P and a $-2$ nC charge is 20 cm from P. What is the potential at P?',
      steps: [
        'Potentials add as numbers, with their signs: $V = k\\left(\\dfrac{q_1}{r_1} + \\dfrac{q_2}{r_2}\\right)$.',
        '$V = 8.99 \\times 10^{9} \\left(\\dfrac{3 \\times 10^{-9}}{0.10} + \\dfrac{-2 \\times 10^{-9}}{0.20}\\right) = 8.99 \\times 10^{9} \\times 2.0 \\times 10^{-8}$.',
        '$V = 180$ V. No angles were needed — that is the advantage of potential over field.'
      ],
      a: 'About +180 V.'
    },
    {
      title: 'Energy from a potential difference',
      q: 'A 12 V car battery moves 50 C of charge through the starter motor. How much energy does it deliver?',
      steps: [
        'Each coulomb crossing a potential difference of 12 V gains or loses 12 J.',
        '$W = Q\\,\\Delta V = 50 \\times 12 = 600$ J.'
      ],
      a: '600 J.'
    }
  ],
  quiz: [
    { q: 'How much work is needed to move a charge along an equipotential surface?', choices: ['It depends on the charge', 'None', 'It depends on the path', '$qE$ times the distance'], a: 1,
      why: 'The potential energy $qV$ is the same everywhere on the surface, so the field does no net work.' },
    { q: 'The electric field points…', choices: ['from low potential to high potential', 'from high potential to low potential', 'along equipotentials', 'in any direction; potential and field are unrelated'], a: 1,
      why: '$E = -dV/dx$: the field points down the potential slope, the way a positive charge is pushed.' },
    { q: 'Midway between $+Q$ and $-Q$…', choices: ['$V = 0$ and $E = 0$', '$V = 0$ but $E \\ne 0$', '$V \\ne 0$ but $E = 0$', 'neither is zero'], a: 1,
      why: 'The potentials $kQ/r$ and $-kQ/r$ cancel, but both fields point towards $-Q$ and add.' },
    { q: 'You move from 10 cm to 20 cm away from a point charge. The potential…', choices: ['halves', 'quarters', 'doubles', 'is unchanged'], a: 0,
      why: 'Potential goes as $1/r$, while the field goes as $1/r^2$ and would fall to a quarter.' },
    { q: 'Where the electric potential is zero, the electric field must also be zero.', a: false,
      why: 'The field is the slope of the potential, not its value. The potential can pass through zero on a steep slope.' }
  ],
  applications: [
    'Voltmeters, batteries and power supplies are all specified by potential difference.',
    'Electrocardiograms and electroencephalograms record small potential differences on the skin.',
    'Equipotential bonding in bathrooms and on building sites connects metal parts so that no dangerous voltage can appear between them.'
  ],
  sim: { id: 'em1-field', params: { preset: 'dipole', equi: true } }
},

{
  id: 'electric-potential-energy', parent: 'electrostatics', title: 'Electric potential energy', level: 2,
  short: 'The energy stored in an arrangement of charges: positive when like charges are pushed together, negative when unlike charges are bound.',
  keywords: ['potential energy', 'electronvolt', 'eV', 'work', 'binding energy', 'accelerating voltage', 'closest approach', 'Rutherford', 'conservative force'],
  prereq: ['coulombs-law', 'work', 'conservative-forces'],
  related: ['electric-potential', 'gravitational-potential', 'conservation-of-energy', 'bohr-model'],
  body: `
The electric force, like gravity, is [[conservative-forces|conservative]]: the work it does on a charge moving between two points depends only on the endpoints, not on the path. A system of charges therefore has a **potential energy** $U$, and energy is conserved as the charges move: whatever work the field does to add kinetic energy comes out of $U$.

### Two point charges
Bringing charge $q_2$ in from far away to a distance $r$ from $q_1$ takes work

$$U = k\\frac{q_1 q_2}{r}$$

with the zero at infinite separation. The sign carries the physics:

- **Like charges**: $U > 0$. You had to push them together; let go and they fly apart, turning $U$ into kinetic energy.
- **Unlike charges**: $U < 0$. They pulled themselves together, releasing energy; you must supply $|U|$ to pull them apart again.

For hydrogen, the electron and proton at their average separation have $U = -27.2$ eV. Including the electron's kinetic energy, the total is $-13.6$ eV, so 13.6 eV is the energy needed to ionize the atom (see [[bohr-model]]). For three or more charges, add the energy of **every pair** once.

### Charges and potential
A charge $q$ at a point of [[electric-potential|potential]] $V$ has potential energy $U = qV$. Crossing a potential difference $\\Delta V$ changes its potential energy by $q\\,\\Delta V$, and its kinetic energy by the same amount with the opposite sign. Positive charges "fall" towards lower potential; negative charges, electrons included, fall towards higher potential.

### The electronvolt
Atomic energies are awkwardly small in joules, so physicists use the **electronvolt**, the energy an electron gains crossing 1 V:

$$1\\ \\mathrm{eV} = 1.602 \\times 10^{-19}\\ \\mathrm{J}$$

Chemical bonds are a few eV, [[photon|photons]] of visible light 1.6–3.3 eV, medical X-ray photons tens of keV, the products of nuclear decays MeV, and the protons in the Large Hadron Collider 6.8 TeV each.

### Accelerating charges
From rest, a charge $q$ crossing a potential difference $V$ gains kinetic energy $qV$, so $\\tfrac12 mv^2 = qV$. An electron through 1 kV reaches $1.9 \\times 10^{7}$ m/s, 6 % of the speed of light, in a few centimetres. Old television tubes used about 25 kV. Beyond roughly 100 kV the electron's speed approaches $c$ and [[relativistic-energy|relativistic]] formulas are needed.
`,
  ideas: [
    'The electric force is conservative, so charges have potential energy.',
    'For two point charges $U = kq_1q_2/r$: positive for like charges, negative for unlike.',
    'A charge at potential $V$ has $U = qV$; crossing $\\Delta V$ changes its kinetic energy by $-q\\Delta V$.',
    'One electronvolt is the energy of one elementary charge crossing one volt: $1.602 \\times 10^{-19}$ J.'
  ],
  pitfalls: [
    'Electrons gain energy moving to lower potential — Electrons are negative: they gain kinetic energy moving to **higher** potential.',
    'Potential energy belongs to the moving charge alone — It belongs to the system of charges; the formula uses both charges and their separation.',
    'Negative potential energy is impossible — With the zero at infinity, any bound pair of unlike charges has negative $U$.'
  ],
  formulas: [
    {
      name: 'Potential energy of two point charges',
      expr: 'U = ke*q1*q2/r', tex: 'U = k\\frac{q_1 q_2}{r}',
      vars: {
        U: { name: 'potential energy (zero at infinite separation)', q: 'energy', unit: 'eV', signed: true },
        q1: { name: 'first charge', q: 'charge', unit: 'e', value: 1, signed: true },
        q2: { name: 'second charge', q: 'charge', unit: 'e', value: -1, signed: true },
        r: { name: 'separation', q: 'length', unit: 'pm', value: 52.9 },
        ke: { const: 'ke' }
      },
      note: 'The defaults are the electron and proton of a hydrogen atom.',
      stories: {
        U: 'What is the potential energy of charges {q1} and {q2} held {r} apart?',
        r: 'Two charges, {q1} and {q2}, have a potential energy of {U}. How far apart are they?'
      }
    },
    {
      name: 'Kinetic energy gained crossing a potential difference',
      expr: 'K = q*V', tex: 'K = qV',
      vars: {
        K: { name: 'kinetic energy gained', q: 'energy', unit: 'keV' },
        q: { name: 'size of the charge', q: 'charge', unit: 'e', value: 2 },
        V: { name: 'potential difference crossed', q: 'voltage', unit: 'kV', value: 5 }
      },
      note: 'Starting from rest, the charge ends with $K = qV$. In units of $e$ and volts the answer comes straight out in eV.',
      stories: { K: 'An alpha particle (charge {q}) is accelerated from rest through {V}. How much kinetic energy does it gain?' }
    },
    {
      name: 'Speed of an electron accelerated from rest',
      expr: 'v = sqrt(2*qe*V/me)', tex: 'v = \\sqrt{\\frac{2eV}{m_e}}',
      vars: {
        v: { name: 'final speed', q: 'speed', unit: 'm/s' },
        V: { name: 'accelerating voltage', q: 'voltage', unit: 'kV', value: 1 },
        qe: { const: 'qe' },
        me: { const: 'me' }
      },
      note: 'Non-relativistic: within 1 % up to about 5 kV. Far above that, use relativistic energy.',
      stories: {
        v: 'An electron gun accelerates electrons from rest through {V}. How fast do they leave it?',
        V: 'What accelerating voltage gives electrons a speed of {v}?'
      }
    }
  ],
  examples: [
    {
      title: 'Rutherford\'s closest approach',
      q: 'A 5.0 MeV alpha particle (charge $+2e$) heads straight for a gold nucleus ($+79e$). How close does it get?',
      steps: [
        'At closest approach it stops for an instant: all its kinetic energy has become potential energy, $k\\dfrac{(2e)(79e)}{r} = K$.',
        'A handy value: $ke^2 = 1.44\\ \\mathrm{MeV\\,fm}$ (with 1 fm = $10^{-15}$ m).',
        '$r = \\dfrac{2 \\times 79 \\times 1.44\\ \\mathrm{MeV\\,fm}}{5.0\\ \\mathrm{MeV}} = 45.5$ fm.',
        'The gold nucleus has a radius of about 7 fm, so the alpha is turned back long before it touches — which is why Rutherford\'s scattering followed Coulomb\'s law exactly.'
      ],
      a: 'About 46 fm ($4.6 \\times 10^{-14}$ m).'
    },
    {
      title: 'Assembling three charges',
      q: 'Three $+2$ nC charges sit at the corners of an equilateral triangle of side 10 cm. How much work did it take to assemble them from far apart?',
      steps: [
        'There are three pairs, each at 0.10 m: $U_{\\text{pair}} = \\dfrac{8.99 \\times 10^{9} \\times (2 \\times 10^{-9})^2}{0.10} = 3.60 \\times 10^{-7}$ J.',
        '$U = 3 \\times 3.60 \\times 10^{-7} = 1.08 \\times 10^{-6}$ J. Positive: like charges had to be forced together.'
      ],
      a: 'About 1.1 µJ.'
    }
  ],
  quiz: [
    { q: 'An electron and a proton, released from rest, move towards each other. Their electric potential energy…', choices: ['increases', 'decreases (becomes more negative)', 'stays the same', 'first increases, then decreases'], a: 1,
      why: 'For unlike charges $U = -k|q_1q_2|/r$ becomes more negative as $r$ shrinks; the loss appears as kinetic energy.' },
    { q: 'An electron moves from a point at 0 V to a point at +100 V. Its potential energy…', choices: ['increases by 100 eV', 'decreases by 100 eV', 'is unchanged', 'increases by 100 J'], a: 1,
      why: '$\\Delta U = q\\Delta V = (-e)(+100\\ \\mathrm{V}) = -100$ eV. The electron speeds up.' },
    { q: 'The separation of two like charges is halved. Their potential energy…', choices: ['halves', 'doubles', 'quadruples', 'is unchanged'], a: 1,
      why: '$U \\propto 1/r$, so halving $r$ doubles $U$.' },
    { q: 'An alpha particle (charge $+2e$) is accelerated from rest through 1 MV. It gains…', choices: ['0.5 MeV', '1 MeV', '2 MeV', '4 MeV'], a: 2,
      why: '$K = qV = 2e \\times 1\\ \\mathrm{MV} = 2$ MeV.' },
    { q: 'If two point charges have negative potential energy (zero at infinity), they must have opposite signs.', a: true,
      why: '$U = kq_1q_2/r$ is negative only when the product $q_1q_2$ is negative.' }
  ],
  applications: [
    'Electron guns in X-ray tubes, electron microscopes and welding machines.',
    'Particle accelerators quote beam energies in eV, from keV ion implanters to TeV colliders.',
    'Chemical and biological energies — bond strengths, ionization energies — are electric potential energies.'
  ],
  sim: 'em1-coulomb'
},

{
  id: 'capacitance', parent: 'electrostatics', title: 'Capacitance', level: 2,
  short: 'How much charge two conductors hold per volt between them. For parallel plates it grows with area and shrinks with separation.',
  keywords: ['capacitor', 'capacitance', 'farad', 'parallel plate', 'C = Q/V', 'permittivity', 'microfarad', 'picofarad', 'supercapacitor'],
  prereq: ['electric-potential', 'gauss-law'],
  related: ['dielectrics', 'energy-in-capacitor', 'capacitors-combinations', 'rc-circuits', 'reactance'],
  body: `
Any two conductors separated by an insulator can store charge. Connect them to a battery and electrons are pulled off one and pushed onto the other, leaving charges $+Q$ and $-Q$ and a potential difference $V$ between them. Double the voltage and the charge doubles; the ratio is the **capacitance**:

$$C = \\frac{Q}{V}$$

It is measured in **farads** (1 F = 1 C/V). The farad is a huge unit: practical capacitors run from picofarads (pF, $10^{-12}$ F) in radio circuits, through microfarads (µF) in power supplies, to thousands of farads in **supercapacitors**.

### The parallel-plate capacitor
Two flat plates of area $A$ a small distance $d$ apart. The charge spreads over the facing surfaces, and between the plates the field is uniform, $E = \\sigma/\\varepsilon_0 = Q/(\\varepsilon_0 A)$ (from [[gauss-law|Gauss's law]]). The voltage across the gap is $V = Ed = Qd/(\\varepsilon_0 A)$, so

$$C = \\frac{\\varepsilon_0 A}{d}$$

The capacitance depends only on the **geometry** (and on the insulator between the plates — see [[dielectrics]]), not on the charge or voltage. **Bigger plates, closer together** hold more charge per volt: larger plates give the charge more room, and a nearer opposite plate holds more charge in place by attraction for the same voltage.

How big is a farad? With plates 1 mm apart, 1 F needs an area of 113 km², a square more than 10 km on a side. Real capacitors cheat: they roll up long foils separated by films a few micrometres thick, use ceramics with a huge dielectric constant, or — in supercapacitors — store charge in layers a nanometre thick on porous carbon with an internal surface of over 1000 m² per gram.

### Other shapes
An isolated sphere of radius $R$ (with the other "plate" at infinity) has $C = 4\\pi\\varepsilon_0 R$: 111 pF for a sphere of radius 1 m, and only 710 µF for the whole Earth. A coaxial cable has about 100 pF per metre, which whatever drives it must charge and discharge at every change of the signal.

### What capacitors are for
They store energy and release it quickly ([[energy-in-capacitor|energy in a capacitor]]) — camera flashes, defibrillators, pulsed lasers. They smooth the ripple out of rectified power supplies, set time delays together with a resistor ([[rc-circuits]]), block steady current while passing alternating current ([[reactance]]), and tune radios. A capacitance that changes is a sensor: touch screens, condenser microphones and the accelerometer in a phone all measure tiny changes in $C$.

> [!tip] In the simulation, change the plate area and separation and watch $C$, then compare what happens with the battery connected (V fixed) and disconnected (Q fixed).
`,
  ideas: [
    'Capacitance is charge stored per volt: $C = Q/V$, in farads.',
    'For parallel plates $C = \\varepsilon_0 A/d$: bigger and closer means more capacitance.',
    'Capacitance depends on geometry and the insulator, not on the charge or voltage.',
    'A capacitor holds equal and opposite charges; its net charge is zero.'
  ],
  pitfalls: [
    'A capacitor with more charge has more capacitance — $C$ is fixed by the geometry. More charge simply means more voltage.',
    'A charged capacitor has a net charge — The plates carry $+Q$ and $-Q$; what it stores is separated charge and energy.',
    'Capacitance grows with plate separation — It falls: $C \\propto 1/d$.'
  ],
  formulas: [
    {
      name: 'Definition of capacitance',
      expr: 'Q = C*V', tex: 'Q = CV',
      vars: {
        Q: { name: 'charge on each plate', q: 'charge', unit: 'mC' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'uF', value: 100 },
        V: { name: 'voltage across the capacitor', q: 'voltage', unit: 'V', value: 12 }
      },
      stories: {
        Q: 'A {C} capacitor is charged to {V}. How much charge is on each plate?',
        C: 'Charging a capacitor to {V} puts {Q} on its plates. What is its capacitance?',
        V: 'A {C} capacitor holds {Q}. What is the voltage across it?'
      }
    },
    {
      name: 'Parallel-plate capacitor',
      expr: 'C = eps0*A/d', tex: 'C = \\frac{\\varepsilon_0 A}{d}',
      vars: {
        C: { name: 'capacitance', q: 'capacitance', unit: 'pF' },
        A: { name: 'plate area', q: 'area', unit: 'cm²', value: 100 },
        d: { name: 'plate separation', q: 'length', unit: 'mm', value: 1 },
        eps0: { const: 'eps0' }
      },
      note: 'Vacuum (or air) between the plates, and a gap small compared with the plate size.',
      stories: {
        C: 'Two square plates of area {A} are {d} apart in air. What is their capacitance?',
        A: 'What plate area gives {C} with a {d} air gap?',
        d: 'Plates of area {A} are to have a capacitance of {C}. How far apart must they be?'
      }
    },
    {
      name: 'Isolated sphere',
      expr: 'C = 4*pi*eps0*R', tex: 'C = 4\\pi\\varepsilon_0 R',
      vars: {
        C: { name: 'capacitance', q: 'capacitance', unit: 'pF' },
        R: { name: 'radius', q: 'length', unit: 'm', value: 0.1 },
        eps0: { const: 'eps0' }
      },
      stories: { C: 'What is the capacitance of an isolated metal sphere of radius {R}?' }
    }
  ],
  examples: [
    {
      title: 'A home-made capacitor',
      q: 'Two square aluminium plates 20 cm on a side are held 2.0 mm apart in air and connected to 500 V. Find $C$, the charge, and the field between the plates.',
      steps: [
        '$A = 0.20^2 = 0.040\\ \\mathrm{m^2}$, so $C = \\dfrac{8.85 \\times 10^{-12} \\times 0.040}{0.0020} = 1.77 \\times 10^{-10}$ F = 177 pF.',
        '$Q = CV = 1.77 \\times 10^{-10} \\times 500 = 8.9 \\times 10^{-8}$ C, about 89 nC.',
        '$E = V/d = 500 / 0.0020 = 2.5 \\times 10^{5}$ V/m — well below the 3 MV/m that would make the air spark.'
      ],
      a: '177 pF, 89 nC, 250 kV/m.'
    },
    {
      title: 'How big is a farad?',
      q: 'What plate area would a 1 F air-gap capacitor need with its plates 1 mm apart?',
      steps: [
        '$A = \\dfrac{Cd}{\\varepsilon_0} = \\dfrac{1 \\times 10^{-3}}{8.85 \\times 10^{-12}} = 1.13 \\times 10^{8}\\ \\mathrm{m^2}$.',
        'That is 113 km², a square 10.6 km on a side — the size of a city.'
      ],
      a: 'About 113 km².'
    }
  ],
  quiz: [
    { q: 'The plate separation of a parallel-plate capacitor is doubled. Its capacitance…', choices: ['doubles', 'halves', 'quadruples', 'is unchanged'], a: 1,
      why: '$C = \\varepsilon_0 A/d$, inversely proportional to $d$.' },
    { q: 'A capacitor stays connected to a battery whose voltage is doubled. Then…', choices: ['C doubles', 'Q doubles and C is unchanged', 'both Q and C double', 'nothing changes'], a: 1,
      why: 'Capacitance is set by geometry. With twice the voltage, $Q = CV$ doubles.' },
    { q: 'How much charge does a 10 µF capacitor hold at 5 V?', choices: ['2 µC', '50 µC', '0.5 µC', '50 mC'], a: 1,
      why: '$Q = CV = 10\\ \\mathrm{µF} \\times 5\\ \\mathrm{V} = 50\\ \\mathrm{µC}$.' },
    { q: 'A charged capacitor carries a net electric charge.', a: false,
      why: 'Its plates hold $+Q$ and $-Q$. "The charge on a capacitor" means the charge on either plate.' }
  ],
  applications: [
    'Camera flashes, defibrillators and pulsed lasers store energy in capacitors and release it in milliseconds.',
    'Touch screens detect the change in capacitance caused by a finger.',
    'Every memory chip contains billions of tiny capacitors: a DRAM bit is the charge on a capacitor of a few tens of femtofarads.'
  ],
  sim: 'em1-capacitor'
},

{
  id: 'capacitors-combinations', parent: 'electrostatics', title: 'Capacitors in series and parallel', level: 2,
  short: 'Capacitors in parallel add; in series their reciprocals add, the charge is shared and the voltage splits — the opposite of resistors.',
  keywords: ['series', 'parallel', 'equivalent capacitance', 'capacitor network', 'voltage divider', 'product over sum'],
  prereq: ['capacitance', 'electric-potential', 'math:fractions-ratios'],
  related: ['resistors-combinations', 'kirchhoffs-laws', 'energy-in-capacitor'],
  body: `
Circuits often contain several capacitors, and it helps to replace a group by one **equivalent capacitor** that stores the same charge at the same voltage.

### Parallel
Side by side, every capacitor has the **same voltage** $V$ across it. Each stores $Q_i = C_i V$, the total charge is the sum, and so

$$C_{\\text{eq}} = C_1 + C_2 + C_3 + \\cdots$$

Parallel capacitors behave like one capacitor with a larger plate area. The equivalent is **larger** than the largest of them. This is how capacitor "banks" are built for large energy storage.

### Series
End to end, the battery can only move charge on and off the two **outer** plates. Each inner pair of plates is an isolated conductor, joined by a wire, that started neutral; it can only separate its charge by induction, $-Q$ on one plate and $+Q$ on the other. So every capacitor in a series chain carries the **same charge** $Q$, and the voltages add: $V = Q/C_1 + Q/C_2 + \\cdots$, giving

$$\\frac{1}{C_{\\text{eq}}} = \\frac{1}{C_1} + \\frac{1}{C_2} + \\frac{1}{C_3} + \\cdots$$

Series capacitors act like one capacitor with a wider gap, and the equivalent is **smaller** than the smallest. For two, $C_{\\text{eq}} = C_1C_2/(C_1 + C_2)$ — "product over sum". For $n$ identical capacitors, $C/n$.

### How the voltage divides
In series, each capacitor takes $V_i = Q/C_i$: the voltage divides in **inverse** proportion to capacitance, so the smallest capacitor takes the biggest share. That can surprise you: put a 1 µF and a 10 µF capacitor in series across 110 V and the 1 µF one sees 100 V. Engineers put capacitors in series precisely to share a high voltage — but only equal ones, often with balancing resistors, as in high-voltage supplies and supercapacitor packs.

> [!warn] The rules are the **opposite** of those for [[resistors-combinations|resistors]]: capacitors add in parallel and combine as reciprocals in series.

### Reducing a network
Combine any group that is plainly in series or in parallel, redraw the circuit, and repeat until one capacitor is left. Then work back outwards: the charge on a series group is the same for each member, the voltage across a parallel group is the same for each member. Networks that cannot be reduced this way (bridges) need [[kirchhoffs-laws|Kirchhoff's rules]].
`,
  ideas: [
    'Parallel: same voltage, charges add, $C_{\\text{eq}} = C_1 + C_2 + \\cdots$.',
    'Series: same charge, voltages add, $1/C_{\\text{eq}} = 1/C_1 + 1/C_2 + \\cdots$.',
    'Parallel raises the capacitance; series lowers it below the smallest.',
    'In series the smallest capacitor takes the largest voltage.'
  ],
  pitfalls: [
    'Capacitors combine like resistors — The rules are swapped: parallel capacitors add directly, series ones by reciprocals.',
    'Series capacitors share the voltage equally — Only if they are equal. Otherwise $V_i = Q/C_i$ and the small one gets most of it.',
    'Forgetting to invert at the end — $1/C_{\\text{eq}}$ = 0.5 µF⁻¹ means $C_{\\text{eq}}$ = 2 µF, not 0.5 µF.'
  ],
  formulas: [
    {
      name: 'Three capacitors in parallel',
      expr: 'C = C1 + C2 + C3', tex: 'C_{\\text{eq}} = C_1 + C_2 + C_3',
      vars: {
        C: { name: 'equivalent capacitance', q: 'capacitance', unit: 'uF', tex: 'C_{\\text{eq}}' },
        C1: { name: 'first capacitance', q: 'capacitance', unit: 'uF', value: 2 },
        C2: { name: 'second capacitance', q: 'capacitance', unit: 'uF', value: 3 },
        C3: { name: 'third capacitance', q: 'capacitance', unit: 'uF', value: 5 }
      },
      stories: { C: 'Capacitors of {C1}, {C2} and {C3} are connected in parallel. What single capacitor could replace them?' }
    },
    {
      name: 'Two capacitors in series',
      expr: '1/C = 1/C1 + 1/C2', tex: '\\frac{1}{C_{\\text{eq}}} = \\frac{1}{C_1} + \\frac{1}{C_2}', solveFor: 'C',
      vars: {
        C: { name: 'equivalent capacitance', q: 'capacitance', unit: 'uF', tex: 'C_{\\text{eq}}' },
        C1: { name: 'first capacitance', q: 'capacitance', unit: 'uF', value: 3 },
        C2: { name: 'second capacitance', q: 'capacitance', unit: 'uF', value: 6 }
      },
      stories: {
        C: 'A {C1} and a {C2} capacitor are connected in series. What is their equivalent capacitance?',
        C2: 'What capacitor in series with {C1} gives an equivalent of {C}?'
      }
    },
    {
      name: 'Voltage across one of two series capacitors',
      expr: 'V1 = V*C2/(C1 + C2)', tex: 'V_1 = V\\frac{C_2}{C_1 + C_2}',
      vars: {
        V1: { name: 'voltage across the first capacitor', q: 'voltage', unit: 'V' },
        V: { name: 'total voltage', q: 'voltage', unit: 'V', value: 12 },
        C1: { name: 'first capacitance', q: 'capacitance', unit: 'uF', value: 3 },
        C2: { name: 'second capacitance', q: 'capacitance', unit: 'uF', value: 6 }
      },
      note: 'From $V_1 = Q/C_1$ with $Q = C_{\\text{eq}}V$. The voltage share is inversely proportional to capacitance.',
      stories: { V1: 'A {C1} and a {C2} capacitor are in series across {V}. What voltage does the {C1} one take?' }
    }
  ],
  examples: [
    {
      title: 'A small network',
      q: 'A 4 µF capacitor is in series with a parallel pair of 2 µF and 6 µF, and the combination is connected to 12 V. Find the charge and voltage of each capacitor.',
      steps: [
        'Parallel pair: $2 + 6 = 8$ µF.',
        'In series with 4 µF: $C_{\\text{eq}} = \\dfrac{4 \\times 8}{4 + 8} = 2.67$ µF.',
        'Total charge: $Q = C_{\\text{eq}}V = 2.67 \\times 12 = 32$ µC. The 4 µF capacitor and the pair (as a unit) both carry 32 µC.',
        'Voltages: $V_4 = 32/4 = 8$ V; the pair gets $32/8 = 4$ V. Check: $8 + 4 = 12$ V.',
        'Inside the pair, each has 4 V: $Q_2 = 2 \\times 4 = 8$ µC and $Q_6 = 6 \\times 4 = 24$ µC, adding to 32 µC.'
      ],
      a: '4 µF: 32 µC, 8 V. 2 µF: 8 µC, 4 V. 6 µF: 24 µC, 4 V.'
    }
  ],
  quiz: [
    { q: 'Three identical 6 µF capacitors are connected in series. The equivalent capacitance is…', choices: ['18 µF', '6 µF', '2 µF', '0.5 µF'], a: 2,
      why: '$1/C = 3/6$, so $C = 2$ µF — like one capacitor with three times the gap.' },
    { q: 'The same three capacitors in parallel give…', choices: ['18 µF', '6 µF', '2 µF', '216 µF'], a: 0, why: 'In parallel capacitances add: $6 + 6 + 6 = 18$ µF.' },
    { q: 'A 1 µF and a 4 µF capacitor are in series across a battery. Which has the larger voltage across it?', choices: ['the 1 µF', 'the 4 µF', 'both the same', 'it depends on the battery'], a: 0,
      why: 'They carry the same charge, so $V = Q/C$ is larger for the smaller capacitance — four times larger here.' },
    { q: 'In a series chain of uncharged capacitors connected to a battery, every capacitor ends up with the same charge.', a: true,
      why: 'The inner plates are isolated and start neutral, so charge separates on them by induction in equal amounts.' },
    { q: 'Adding another capacitor in parallel with an existing network makes the equivalent capacitance…', choices: ['smaller', 'larger', 'unchanged', 'zero'], a: 1,
      why: 'At the same voltage, the extra capacitor stores extra charge.' }
  ],
  applications: [
    'Capacitor banks for power-factor correction and pulsed-power experiments.',
    'High-voltage probes and supplies use strings of equal series capacitors.',
    'Trimmer circuits combine a fixed and a small variable capacitor to tune radio frequencies.'
  ]
},

{
  id: 'dielectrics', parent: 'electrostatics', title: 'Dielectrics', level: 2,
  short: 'An insulator between capacitor plates polarizes, weakening the field inside and raising the capacitance by its dielectric constant κ.',
  keywords: ['dielectric', 'dielectric constant', 'relative permittivity', 'kappa', 'polarization', 'bound charge', 'dielectric strength', 'breakdown', 'polar molecule'],
  prereq: ['capacitance', 'electric-field'],
  related: ['energy-in-capacitor', 'coulombs-law', 'magnetic-materials'],
  body: `
Slide a sheet of plastic, glass or paper between the plates of a capacitor and its capacitance goes up, by a factor that depends only on the material: the **dielectric constant** $\\kappa$ (also called the relative permittivity $\\varepsilon_r$):

$$C = \\kappa\\, C_0 = \\frac{\\kappa\\,\\varepsilon_0 A}{d}$$

### Why: polarization
An insulator has no free charges, but its molecules still respond to a field. In every atom the electron cloud shifts slightly against the nucleus; and some molecules, such as water, are **polar** — permanent little dipoles — which partly turn to line up with the field. Either way the material becomes **polarized**. In the bulk the shifted charges cancel, but a thin layer of **bound charge** is left on each face: negative next to the positive plate, positive next to the negative plate.

The bound charges make a field of their own that opposes the plates' field, so the field inside is reduced:

$$E = \\frac{E_0}{\\kappa}$$

With the same charge on the plates, a weaker field means a smaller voltage $V = Ed$, and therefore a larger $C = Q/V$. The same screening reduces [[coulombs-law|Coulomb forces]] inside a material by $\\kappa$ — water, with $\\kappa \\approx 80$, weakens the pull between dissolved ions 80-fold.

### Typical values
| Material | κ | Dielectric strength (MV/m) |
|---|---|---|
| Vacuum | 1 exactly | — |
| Dry air | 1.0006 | 3 |
| PTFE (Teflon) | 2.1 | about 60 |
| Paper | about 3.5 | about 16 |
| Glass | 4–10 | 10–40 |
| Mica | 5–7 | above 100 |
| Pure water | 80 | — |
| Barium titanate ceramics | 1000 and more | — |

### Dielectric strength
Every insulator fails if the field is strong enough: electrons are torn loose, a conducting channel forms, and the capacitor **breaks down** — usually for good. The **dielectric strength** is the largest field a material can take, and the maximum voltage across a thickness $d$ is $V_{\\text{max}} = E_{\\text{max}} d$. A thin film with a high dielectric strength lets the plates sit very close without arcing, so a good dielectric raises the capacitance twice over: through $\\kappa$, and by allowing a tiny $d$.

### Battery connected or not?
What happens when a slab is inserted depends on what is held fixed.

- **Isolated capacitor** (charge fixed): $C$ rises by $\\kappa$, so $V$ and $E$ fall by $\\kappa$. The stored energy $Q^2/2C$ falls too — the field pulls the slab in and does work on it.
- **Connected to a battery** (voltage fixed): $E = V/d$ is unchanged. The battery pushes in more charge, and both $Q$ and the stored energy $\\tfrac12 CV^2$ rise by $\\kappa$.

> [!tip] Try both cases in the simulation: charge the capacitor, untick "battery connected", then change the dielectric and watch which quantities move.
`,
  ideas: [
    'A dielectric raises capacitance by its dielectric constant: $C = \\kappa C_0$.',
    'Polarization leaves bound charge on the faces, which weakens the field inside by $\\kappa$.',
    'Every insulator has a dielectric strength beyond which it breaks down.',
    'With charge fixed, inserting a dielectric lowers $V$; with voltage fixed, it raises $Q$.'
  ],
  pitfalls: [
    'A dielectric conducts a little charge between the plates — An ideal dielectric conducts nothing; its charges only shift slightly within each molecule.',
    'A dielectric always lowers the voltage — Only for an isolated capacitor. Connected to a battery, $V$ is fixed and it is $Q$ that rises.',
    'High κ means high dielectric strength — They are separate properties; high-κ ceramics often break down at lower fields than plastics.'
  ],
  formulas: [
    {
      name: 'Parallel plates with a dielectric',
      expr: 'C = kappa*eps0*A/d', tex: 'C = \\frac{\\kappa\\,\\varepsilon_0 A}{d}',
      vars: {
        C: { name: 'capacitance', q: 'capacitance', unit: 'nF' },
        kappa: { name: 'dielectric constant', value: 3.5, min: 1 },
        A: { name: 'plate area', q: 'area', unit: 'cm²', value: 200 },
        d: { name: 'thickness of the dielectric', q: 'length', unit: 'mm', value: 0.1 },
        eps0: { const: 'eps0' }
      },
      stories: {
        C: 'Two foils of area {A} are separated by a {d} film with dielectric constant {kappa}. What is the capacitance?',
        kappa: 'Foils of area {A} separated by a {d} insulating film have a capacitance of {C}. What is the film\'s dielectric constant?'
      }
    },
    {
      name: 'Field reduced by a dielectric (charge fixed)',
      expr: 'E = E0/kappa', tex: 'E = \\frac{E_0}{\\kappa}',
      vars: {
        E: { name: 'field inside the dielectric', q: 'efield', unit: 'kV/m' },
        E0: { name: 'field without the dielectric', q: 'efield', unit: 'kV/m', value: 100 },
        kappa: { name: 'dielectric constant', value: 3.5, min: 1 }
      }
    },
    {
      name: 'Maximum voltage before breakdown',
      expr: 'Vmax = Emax*d', tex: 'V_{\\text{max}} = E_{\\text{max}}\\, d',
      vars: {
        Vmax: { name: 'maximum voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{max}}' },
        Emax: { name: 'dielectric strength', q: 'efield', unit: 'MV/m', value: 16, tex: 'E_{\\text{max}}' },
        d: { name: 'thickness', q: 'length', unit: 'mm', value: 0.1 }
      },
      stories: {
        Vmax: 'A capacitor uses paper {d} thick, with a dielectric strength of {Emax}. What is the highest voltage it can stand?',
        d: 'A film with a dielectric strength of {Emax} must withstand {Vmax}. How thick must it be, at least?'
      }
    }
  ],
  examples: [
    {
      title: 'Designing a paper capacitor',
      q: 'You need 1.0 µF using paper 0.050 mm thick ($\\kappa = 3.5$, dielectric strength 16 MV/m). What foil area is needed, and what is the highest safe voltage?',
      steps: [
        '$A = \\dfrac{Cd}{\\kappa\\varepsilon_0} = \\dfrac{1.0 \\times 10^{-6} \\times 5.0 \\times 10^{-5}}{3.5 \\times 8.85 \\times 10^{-12}} = 1.6\\ \\mathrm{m^2}$.',
        'As a strip 5 cm wide that is 32 m long — which is why such capacitors are rolled up.',
        '$V_{\\text{max}} = E_{\\text{max}} d = 16 \\times 10^{6} \\times 5.0 \\times 10^{-5} = 800$ V. A real design would be rated at perhaps half that.'
      ],
      a: 'About 1.6 m² of foil; breakdown near 800 V.'
    },
    {
      title: 'Isolated or connected?',
      q: 'A 100 pF air capacitor is charged to 50 V. Glass with $\\kappa = 5$ is then slid between the plates. Find $Q$, $V$ and the energy (a) if the battery was disconnected first, (b) if it stays connected.',
      steps: [
        'Before: $Q = 100\\ \\mathrm{pF} \\times 50 = 5.0$ nC and $U = \\tfrac12 QV = 125$ nJ. With the glass, $C = 500$ pF.',
        '(a) $Q$ stays 5.0 nC, so $V = Q/C = 10$ V and $U = \\tfrac12 \\times 5.0\\ \\mathrm{nC} \\times 10\\ \\mathrm{V} = 25$ nJ. The missing 100 nJ went into pulling the glass in.',
        '(b) $V$ stays 50 V, so $Q = 500\\ \\mathrm{pF} \\times 50 = 25$ nC and $U = \\tfrac12 \\times 25\\ \\mathrm{nC} \\times 50\\ \\mathrm{V} = 625$ nJ.',
        'In (b) the battery pushed an extra 20 nC through 50 V, supplying 1000 nJ: half raised the stored energy by 500 nJ, the other half was work done pulling the glass in.'
      ],
      a: '(a) 5 nC, 10 V, 25 nJ. (b) 25 nC, 50 V, 625 nJ.'
    }
  ],
  quiz: [
    { q: 'An isolated charged capacitor has a slab with $\\kappa = 4$ slid between its plates. The voltage across it…', choices: ['rises by 4', 'falls to a quarter', 'is unchanged', 'falls to a half'], a: 1,
      why: '$Q$ is fixed and $C$ rises by 4, so $V = Q/C$ falls to a quarter.' },
    { q: 'Why is the field inside a dielectric weaker than without it?', choices: ['The dielectric conducts some charge away', 'Bound charges on its faces make an opposing field', 'The plates lose charge', 'The dielectric absorbs field lines as heat'], a: 1,
      why: 'Polarization leaves negative bound charge by the positive plate and positive by the negative plate; their field points against the applied one.' },
    { q: 'Water has an unusually large dielectric constant (about 80) mainly because…', choices: ['it conducts electricity', 'its molecules are permanent dipoles that line up with the field', 'it is dense', 'it contains dissolved ions'], a: 1,
      why: 'Water molecules are strongly polar. Rotating to align with the field, they produce a large bound charge.' },
    { q: 'Inserting a dielectric while the capacitor stays connected to its battery decreases the stored energy.', a: false,
      why: 'With $V$ fixed, $U = \\tfrac12 CV^2$ rises by $\\kappa$. The battery supplies twice that increase; the other half is the work done pulling the slab in.' }
  ],
  applications: [
    'Film, ceramic and electrolytic capacitors each use a dielectric chosen for κ, strength or size.',
    'High-voltage cables and transformers rely on the dielectric strength of oil, paper and polymers.',
    'Microwave ovens heat food because water molecules keep turning to follow the oscillating field.',
    'Stud finders sense the change in capacitance when the dielectric behind a wall changes.'
  ],
  sim: { id: 'em1-capacitor', params: { kappa: 3.5 } }
},

{
  id: 'energy-in-capacitor', parent: 'electrostatics', title: 'Energy stored in a capacitor', level: 2,
  short: 'A charged capacitor stores energy ½CV², held in its electric field at a density ½ε₀E² per cubic metre.',
  keywords: ['capacitor energy', '1/2 CV^2', 'energy density', 'electric field energy', 'defibrillator', 'camera flash', 'supercapacitor'],
  prereq: ['capacitance', 'electric-potential', 'math:definite-integral'],
  related: ['dielectrics', 'rc-circuits', 'em-wave-energy', 'energy-in-inductor'],
  body: `
Charging a capacitor takes work: each extra bit of charge must be pushed onto a plate that already repels it. That work is stored, and it comes back when the capacitor discharges — in the flash of a camera, the shock of a defibrillator, or the burst of current from a supercapacitor that helps a hybrid bus pull away.

### How much?
When the capacitor holds charge $q$ its voltage is $q/C$, and moving a further $dq$ across costs $dW = (q/C)\\,dq$. The voltage rises in proportion to the charge, so the average voltage while charging from zero to $V$ is only $V/2$, and the stored energy is

$$U = \\tfrac12 QV = \\tfrac12 CV^2 = \\frac{Q^2}{2C}$$

On a graph of voltage against charge it is the area of the triangle under the line. The energy grows with the **square** of the voltage: the same capacitor at 400 V holds 16 times what it holds at 100 V, which is why energy-storage capacitors are run at the highest voltage their dielectric allows.

### Where is the energy?
In the **field** between the plates. Using $C = \\varepsilon_0A/d$ and $V = Ed$, the energy is $U = \\tfrac12\\varepsilon_0 E^2 \\times Ad$, and $Ad$ is the volume between the plates. So any region of space containing an electric field holds energy at a density

$$u = \\tfrac12 \\varepsilon_0 E^2$$

(times $\\kappa$ inside a [[dielectrics|dielectric]]). This is not special to capacitors: it is part of the energy carried by a [[em-wave-energy|light wave]], and it sets a limit on any air-gap device — at the breakdown field of air, 3 MV/m, the energy density is only about 40 J/m³.

### Real numbers
| Device | C | V | Energy |
|---|---|---|---|
| Ceramic capacitor on a circuit board | 100 nF | 5 V | 1.25 µJ |
| Camera flash | 150 µF | 330 V | 8 J |
| Defibrillator | 200 µF | 1.9 kV | 360 J |
| Supercapacitor cell | 3000 F | 2.7 V | 11 kJ |

The supercapacitor holds about as much energy as an AA battery (about 3 Wh), but can deliver it in seconds and survive a million charge cycles. Per kilogram, though, it stores tens of times less than a lithium-ion cell.

### Energy lost in charging
When a battery charges a capacitor through a resistor, it delivers charge $Q$ at voltage $V$ — energy $QV$ — but the capacitor ends up with only $\\tfrac12 QV$. Exactly half is always turned into heat in the resistance, whatever its value ([[rc-circuits]]).

> [!warn] Large capacitors can hold a dangerous charge long after equipment is switched off and unplugged. Microwave ovens, old televisions and power supplies are discharged through a resistor before anyone works inside them.
`,
  ideas: [
    'Stored energy $U = \\tfrac12 CV^2 = \\tfrac12 QV = Q^2/2C$.',
    'The ½ appears because the voltage rises from zero while charging.',
    'Energy grows with the square of the voltage.',
    'The energy lives in the electric field, at a density $\\tfrac12\\varepsilon_0E^2$.',
    'Charging through a resistor always wastes half the energy the battery supplies.'
  ],
  pitfalls: [
    'The stored energy is $QV$ — That is what the battery supplies; the capacitor keeps only half.',
    'A switched-off device with capacitors is safe to touch — Large capacitors can stay charged for minutes or longer.',
    'Double the voltage, double the energy — The energy goes as $V^2$: it quadruples.'
  ],
  derivation: {
    title: 'Adding the charge a little at a time',
    steps: [
      { text: 'With charge $q$ on the plates, the voltage is $v = q/C$. Moving a further $dq$ from the negative plate to the positive one takes work', tex: 'dW = v\\,dq = \\frac{q}{C}\\,dq' },
      { text: 'Add up the work from an uncharged capacitor to charge $Q$ (a [[math:definite-integral|definite integral]]):', tex: 'U = \\int_0^Q \\frac{q}{C}\\,dq = \\frac{Q^2}{2C}' },
      { text: 'Using $Q = CV$ gives the other forms:', tex: 'U = \\frac{Q^2}{2C} = \\tfrac12 QV = \\tfrac12 C V^2' }
    ]
  },
  formulas: [
    {
      name: 'Energy from capacitance and voltage',
      expr: 'U = 0.5*C*V^2', tex: 'U = \\tfrac12 C V^2',
      vars: {
        U: { name: 'stored energy', q: 'energy', unit: 'J' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'uF', value: 150 },
        V: { name: 'voltage', q: 'voltage', unit: 'V', value: 330 }
      },
      stories: {
        U: 'A camera flash charges a {C} capacitor to {V}. How much energy does the flash have to use?',
        V: 'To what voltage must a {C} capacitor be charged to store {U}?',
        C: 'A defibrillator must store {U} at {V}. What capacitance does it need?'
      }
    },
    {
      name: 'Energy from charge and capacitance',
      expr: 'U = Q^2/(2*C)', tex: 'U = \\frac{Q^2}{2C}',
      vars: {
        U: { name: 'stored energy', q: 'energy', unit: 'J' },
        Q: { name: 'charge on each plate', q: 'charge', unit: 'mC', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'uF', value: 100 }
      },
      note: 'Handy for an isolated capacitor, whose charge stays fixed while $C$ changes.'
    },
    {
      name: 'Energy density of an electric field',
      expr: 'u = 0.5*eps0*E^2', tex: 'u = \\tfrac12 \\varepsilon_0 E^2',
      vars: {
        u: { name: 'energy per unit volume', q: 'energydensity', unit: 'J/m³' },
        E: { name: 'field strength', q: 'efield', unit: 'MV/m', value: 3 },
        eps0: { const: 'eps0' }
      },
      note: 'In vacuum or air. Inside a dielectric multiply by $\\kappa$.',
      stories: { u: 'How much energy per cubic metre is stored in a field of {E}?' }
    }
  ],
  examples: [
    {
      title: 'A camera flash',
      q: 'A flash unit charges a 150 µF capacitor to 330 V and empties it through the lamp in 1 ms. How much energy is released, and what is the average power?',
      steps: [
        '$U = \\tfrac12 CV^2 = \\tfrac12 \\times 150 \\times 10^{-6} \\times 330^2 = 8.2$ J.',
        'Average power: $P = U/t = 8.2 / 0.001 = 8.2$ kW — from a pair of AA cells that could only supply a few watts, because the capacitor took a few seconds to charge.'
      ],
      a: '8.2 J, about 8 kW for a millisecond.'
    },
    {
      title: 'Why capacitors cannot replace fuel',
      q: 'Compare the energy density of an electric field at air\'s breakdown strength (3 MV/m) with that of petrol, about 34 GJ/m³.',
      steps: [
        '$u = \\tfrac12 \\varepsilon_0 E^2 = \\tfrac12 \\times 8.85 \\times 10^{-12} \\times (3 \\times 10^{6})^2 = 40\\ \\mathrm{J/m^3}$.',
        'Ratio: $34 \\times 10^{9} / 40 \\approx 10^{9}$. A whole cubic metre of air-gap capacitor holds as much energy as about one microlitre of petrol — a single small droplet.',
        'Dielectrics with large $\\kappa$ and high strength, and supercapacitors, close part of the gap — but chemical energy remains far denser.'
      ],
      a: 'About 40 J/m³, a billion times less than petrol.'
    }
  ],
  quiz: [
    { q: 'The voltage on a capacitor is doubled. Its stored energy…', choices: ['doubles', 'quadruples', 'halves', 'is unchanged'], a: 1, why: '$U = \\tfrac12 CV^2$ grows as the square of the voltage.' },
    { q: 'An isolated charged parallel-plate capacitor has its plates pulled farther apart. Its stored energy…', choices: ['decreases', 'increases', 'stays the same', 'drops to zero'], a: 1,
      why: '$Q$ is fixed and $C$ falls, so $U = Q^2/2C$ rises. The extra energy is the work you did pulling the attracting plates apart.' },
    { q: 'A battery charges a capacitor through a resistor. What fraction of the energy the battery supplies ends up stored?', choices: ['all of it', 'one half', 'it depends on the resistance', 'one quarter'], a: 1,
      why: 'The battery supplies $QV$; the capacitor stores $\\tfrac12 QV$. The other half is heat, for any resistance.' },
    { q: 'A capacitor charged to $V$ is connected to an identical uncharged one. After the charge shares out, the total stored energy is…', choices: ['the same as before', 'half of what it was', 'a quarter of what it was', 'twice what it was'], a: 1,
      why: 'Charge is conserved, so each ends at $V/2$: $U = 2 \\times \\tfrac12 C (V/2)^2 = \\tfrac14 CV^2$, half the original $\\tfrac12 CV^2$. The rest is lost as heat and radiation in the connecting wires.' },
    { q: 'The energy of a charged capacitor can be regarded as stored in the electric field between its plates.', a: true,
      why: 'Writing $U = \\tfrac12 \\varepsilon_0 E^2 \\times Ad$ shows it as an energy density times the volume the field fills.' }
  ],
  applications: [
    'Defibrillators, camera flashes and pulsed lasers.',
    'Supercapacitors for regenerative braking in buses and trams, and to back up memory.',
    'Smoothing capacitors in power supplies store energy between the peaks of the rectified mains.'
  ],
  sim: 'em1-capacitor'
}

);
