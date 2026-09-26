/* HYPER-PHYSICS · content/material-properties.js — how materials respond to magnetic
 * fields (dia-, para- and ferromagnetism) and how some lose all electrical resistance. */
Hyper.add(

{
  id: 'magnetic-materials', parent: 'material-properties', title: 'Dia-, para- and ferromagnetism', level: 2,
  short: 'All materials respond to a magnetic field: most very weakly, pushed away (diamagnets) or pulled in (paramagnets); a few — iron, cobalt, nickel — enormously, because their atomic magnets line up by themselves in domains.',
  keywords: ['magnetism', 'diamagnetism', 'paramagnetism', 'ferromagnetism', 'magnetization', 'susceptibility', 'relative permeability', 'magnetic domains', 'hysteresis', 'coercivity', 'remanence', 'Curie temperature', 'Curie law', 'exchange interaction', 'soft magnet', 'hard magnet', 'antiferromagnetism', 'ferrimagnetism'],
  prereq: ['magnetic-field', 'electron-spin', 'solenoid'],
  related: ['superconductivity', 'transformers', 'lenzs-law', 'pauli-exclusion', 'temperature'],
  body: `
Hold a strong magnet near a paperclip and it jumps; near a sheet of aluminium, nothing seems to happen; near a slab of pyrolytic graphite, the graphite is gently pushed away. Every material responds to a magnetic field, but in three very different ways.

### Where atomic magnetism comes from
Electrons are tiny magnets, both because they orbit and because of their [[electron-spin|spin]]; the natural unit is the Bohr magneton, $\\mu_B = 9.27\\times10^{-24}\\ \\mathrm{J/T}$. In most atoms the electrons pair up with opposite spins and their moments cancel. Atoms with unpaired electrons — iron, cobalt, nickel, the rare earths — keep a net moment of a few $\\mu_B$.

A material in a field is described by its **magnetization** $M$, the magnetic moment per unit volume (in A/m). With $H$ the field set up by currents in the coils, the field inside the material is

$$B = \\mu_0 (H + M) = \\mu_0 (1 + \\chi) H = \\mu_0 \\mu_r H$$

where the **susceptibility** $\\chi = M/H$ measures the response and $\\mu_r = 1 + \\chi$ is the relative permeability.

### Diamagnetism: $\\chi$ small and negative
Switching on a field induces tiny extra orbital currents in every atom, and by [[lenzs-law|Lenz's law]] they oppose the change. So every material is slightly **diamagnetic**, pushed out of strong fields: $\\chi \\approx -9 \\times 10^{-6}$ for water and copper, $-1.7\\times10^{-4}$ for bismuth. The effect is weak, but a 16 T magnet can levitate a living frog, whose water is repelled more strongly than gravity pulls it. A superconductor is the perfect diamagnet, $\\chi = -1$ (see [[superconductivity]]).

### Paramagnetism: $\\chi$ small and positive
In materials whose atoms carry permanent moments, a field tends to line the moments up, while thermal jostling scrambles them. The result is a weak attraction, $\\chi \\approx 10^{-5}$ to $10^{-3}$ (aluminium $2.2\\times10^{-5}$), which grows as the temperature falls — **Curie's law**:

$$\\chi = \\frac{C}{T}$$

Liquid oxygen at 90 K is paramagnetic enough ($\\chi \\approx 4\\times10^{-3}$) to hang as a bridge between the poles of a magnet.

### Ferromagnetism: order by itself
In iron, cobalt and nickel a quantum effect, the **exchange interaction** (a consequence of the [[pauli-exclusion|exclusion principle]] and the electric repulsion between electrons), makes neighbouring spins line up parallel with no field at all. The crystal splits into **domains**, micrometres to millimetres across, each magnetized to saturation but pointing in different directions, so an ordinary iron nail shows no net magnetism. An applied field moves the **domain walls**, growing the domains that point its way, and finally rotates them: $\\mu_r$ reaches thousands, up to the **saturation magnetization** — $\\mu_0 M_s = 2.2$ T for iron, where every atomic moment (2.2 $\\mu_B$ per atom) points the same way.

Walls snag on defects, so the magnetization lags behind the field: the **hysteresis loop**. What remains at zero field is the **remanence**; the reverse field needed to wipe it out is the **coercivity**.

| Material | Coercivity | Remanence | Use |
|---|---|---|---|
| silicon steel (soft) | about 40 A/m | — | transformer and motor cores |
| alnico | about 50 kA/m | 1.2 T | guitar pickups, sensors |
| barium ferrite | about 250 kA/m | 0.4 T | fridge magnets, small motors |
| neodymium–iron–boron (hard) | 1000 kA/m or more | 1.3 T | electric-car motors, wind turbines, earbuds |

Soft magnets, with narrow loops, waste little energy each cycle in a [[transformers|transformer]]; hard magnets, with wide loops, make permanent magnets.

### The Curie temperature
Heat destroys the order. Above the **Curie temperature** a ferromagnet becomes an ordinary paramagnet: iron at 770 °C, nickel at 358 °C, cobalt at 1115 °C, gadolinium at just 20 °C. Related orderings exist: in **antiferromagnets** (manganese oxide, chromium) neighbouring spins alternate and cancel; in **ferrimagnets** such as magnetite, the original lodestone, they alternate but do not cancel.

> [!key] Diamagnet: weakly repelled, χ < 0, in all matter. Paramagnet: weakly attracted, χ > 0, falling as 1/T. Ferromagnet: spontaneously ordered domains, huge and hysteretic response below the Curie temperature.
`,
  ideas: [
    'Magnetization M adds to the applied field: B = μ₀(H + M) = μ₀(1 + χ)H.',
    'Diamagnetism (χ ≈ −10⁻⁵) is present in all matter: induced currents oppose the field.',
    'Paramagnetism (χ ≈ +10⁻⁵ to 10⁻³) comes from permanent atomic moments partly aligned against thermal disorder: χ = C/T.',
    'Ferromagnets align spontaneously in domains through the exchange interaction; a field moves domain walls, giving huge magnetization and hysteresis.',
    'Above the Curie temperature a ferromagnet loses its order and becomes paramagnetic.'
  ],
  pitfalls: [
    'Only iron-like materials are magnetic — Every material responds to a field; most do so a million times more weakly than iron.',
    'An unmagnetized iron nail has no magnetic order — Each domain inside it is magnetized to saturation; the domains simply point in different directions and cancel.',
    'Diamagnetism happens only in superconductors — Superconductors are the extreme case; water, copper, carbon and your body are all weakly diamagnetic.'
  ],
  formulas: [
    {
      name: 'Field inside a magnetized material',
      expr: 'B = mu0*(1 + chi)*H', tex: 'B = \\mu_0 (1 + \\chi) H',
      vars: {
        B: { name: 'magnetic field in the material', q: 'bfield', unit: 'T' },
        chi: { name: 'magnetic susceptibility', q: 'none', value: 4999, signed: true, tex: '\\chi' },
        H: { name: 'applied magnetizing field', q: 'hfield', unit: 'A/m', value: 200 },
        mu0: { const: 'mu0' }
      },
      note: 'For a linear material. Defaults: a soft-iron core ($\\mu_r = 5000$) in a coil giving $H = 200$ A/m. For ferromagnets $\\chi$ depends on the field and saturates; for dia- and paramagnets it is tiny and constant.',
      stories: {
        B: 'A coil produces a magnetizing field of {H} in a core of susceptibility {chi}. What field B does the core carry?',
        chi: 'A core in a magnetizing field of {H} carries {B}. What is its susceptibility?'
      }
    },
    {
      name: 'Curie\'s law for a paramagnet',
      expr: 'chi = C/T', tex: '\\chi = \\frac{C}{T}',
      vars: {
        chi: { name: 'magnetic susceptibility', q: 'none', tex: '\\chi' },
        C: { name: 'Curie constant', q: 'dtemp', unit: 'K', value: 0.35 },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 90 }
      },
      note: 'Defaults: liquid oxygen near its boiling point. Above the Curie temperature of a ferromagnet the law becomes $\\chi = C/(T - T_C)$.',
      stories: { chi: 'A paramagnetic material has a Curie constant of {C}. What is its susceptibility at {T}?', T: 'At what temperature does a paramagnet with Curie constant {C} reach a susceptibility of {chi}?' }
    },
    {
      name: 'Saturation magnetization',
      expr: 'Ms = n*mu', tex: 'M_s = n\\, \\mu',
      vars: {
        Ms: { name: 'saturation magnetization', q: 'hfield', unit: 'A/m', tex: 'M_s' },
        n: { name: 'magnetic atoms per unit volume', q: 'numberdensity', unit: '1/m³', value: 8.49e28 },
        mu: { name: 'magnetic moment per atom', q: 'mdipole', unit: 'µB', value: 2.2, tex: '\\mu' }
      },
      note: 'Every atomic moment aligned. Defaults: iron, 2.2 Bohr magnetons per atom; $\\mu_0 M_s \\approx 2.2$ T. Nickel: 0.6 $\\mu_B$, cobalt: 1.7 $\\mu_B$.',
      stories: { Ms: 'A ferromagnet has {n} atoms per cubic metre, each carrying {mu}. What is its saturation magnetization?', mu: 'A ferromagnet with {n} atoms per m³ saturates at {Ms}. What moment does each atom carry?' }
    }
  ],
  examples: [
    {
      title: 'Why transformers have iron cores',
      q: 'A coil gives $H = 200$ A/m. Find the field B with an air core and with a soft-iron core of $\\mu_r = 5000$.',
      steps: [
        'Air ($\\chi \\approx 0$): $B = \\mu_0 H = 1.257\\times10^{-6} \\times 200 = 2.5\\times10^{-4}\\ \\mathrm{T}$.',
        'Iron: $B = \\mu_0 \\mu_r H = 5000 \\times 2.5\\times10^{-4} = 1.26\\ \\mathrm{T}$.',
        'The aligned domains multiply the field 5000 times, which is why motors and transformers guide their flux through iron — until it saturates near 2 T.'
      ],
      a: '0.25 mT in air; about 1.26 T in the iron.'
    },
    {
      title: 'Iron with every atom aligned',
      q: 'Iron has $8.49\\times10^{28}$ atoms per m³, each with a moment of 2.2 $\\mu_B$. Find the saturation magnetization and $\\mu_0 M_s$.',
      steps: [
        'Moment per atom: $2.2 \\times 9.27\\times10^{-24} = 2.04\\times10^{-23}\\ \\mathrm{A\\,m^2}$.',
        '$M_s = n\\mu = 8.49\\times10^{28} \\times 2.04\\times10^{-23} = 1.73\\times10^{6}\\ \\mathrm{A/m}$.',
        '$\\mu_0 M_s = 1.257\\times10^{-6} \\times 1.73\\times10^{6} = 2.2\\ \\mathrm{T}$ — the ceiling for any iron-cored electromagnet.'
      ],
      a: '$M_s$ ≈ 1.7 × 10⁶ A/m, $\\mu_0 M_s$ ≈ 2.2 T.'
    }
  ],
  quiz: [
    { q: 'A bismuth rod hung between the poles of a strong magnet…', choices: ['is strongly attracted', 'is weakly attracted', 'is weakly pushed out of the strongest field', 'is unaffected'], a: 2,
      why: 'Bismuth is diamagnetic ($\\chi = -1.7\\times10^{-4}$): induced orbital currents oppose the field, so it moves towards weaker field.' },
    { q: 'A steel permanent magnet is heated above its Curie temperature and cooled with no field around. It is now…', choices: ['a stronger magnet', 'unchanged', 'demagnetized', 'a superconductor'], a: 2,
      why: 'Above the Curie temperature the spontaneous order vanishes; on cooling, domains form again in random directions, so the net magnetization is gone.' },
    { q: 'Transformer cores are made of "soft" magnetic material because…', choices: ['it is cheaper', 'its narrow hysteresis loop wastes little energy each cycle', 'it keeps its magnetization when the current stops', 'it is not magnetic'], a: 1,
      why: 'The area of the hysteresis loop is the energy lost per cycle, 50 or 60 times a second. A soft magnet has low coercivity and a thin loop.' },
    { q: 'Diamagnetism occurs only in superconductors.', a: false,
      why: 'All matter is diamagnetic to some degree; in most materials it is simply outweighed by paramagnetism or ferromagnetism, or too weak to notice.' },
    { q: 'An iron nail becomes a magnet when a strong magnet is brought near. What happens inside it?', choices: ['Iron atoms become magnetic for the first time', 'Domains aligned with the field grow at the expense of others', 'Electrons flow from the magnet into the nail', 'The nail becomes a superconductor'], a: 1,
      why: 'Each domain was already magnetized. The field moves the domain walls so that domains pointing its way grow, giving a net magnetization.' }
  ],
  applications: ['Transformer, motor and generator cores of soft silicon steel.', 'Neodymium magnets in electric-vehicle motors, wind turbines and loudspeakers.', 'Magnetic recording in hard disks, and the giant magnetoresistance read heads that sense it.', 'Magnetic separation of scrap and ores.'],
  history: 'Pierre Curie measured the temperature dependence of paramagnetism and the loss of ferromagnetism in the 1890s. Pierre Weiss proposed magnetic domains and an internal ordering field in 1907; Heisenberg traced that field to the quantum exchange interaction in 1928.',
  sim: 'nc-domains'
},

{
  id: 'superconductivity', parent: 'material-properties', title: 'Superconductivity', level: 3,
  short: 'Below a critical temperature some materials lose all electrical resistance and push magnetic fields out. Electrons pair up and move as one quantum state — the physics behind MRI magnets and the LHC.',
  keywords: ['superconductivity', 'superconductor', 'critical temperature', 'zero resistance', 'Meissner effect', 'Cooper pairs', 'BCS theory', 'energy gap', 'critical field', 'type I', 'type II', 'flux quantum', 'vortices', 'Josephson effect', 'SQUID', 'high-temperature superconductor', 'YBCO', 'MRI', 'levitation'],
  prereq: ['resistivity', 'magnetic-materials', 'free-electron-model'],
  related: ['quantum-tunneling', 'lenzs-law', 'solenoid', 'particle-accelerators', 'fermi-energy'],
  body: `
In 1911 Heike Kamerlingh Onnes, having just learned to liquefy helium, measured the resistance of mercury as he cooled it. At 4.2 K it did not dwindle gradually — it vanished. Currents set going in superconducting rings have since run for years with no measurable decay.

### Two defining properties
- **Zero resistance** below a **critical temperature** $T_c$.
- **The Meissner effect** (1933): a superconductor expels a magnetic field from its interior, even when it is cooled with the field already present. It is a perfect diamagnet ($\\chi = -1$, see [[magnetic-materials]]), which is why a small magnet floats above a cooled superconducting disc. A merely perfect conductor would only *freeze in* whatever field it held; expelling it shows that the superconducting state is a new thermodynamic phase.

| Material | $T_c$ | Notes |
|---|---|---|
| aluminium | 1.2 K | type I; qubits |
| mercury | 4.15 K | the first, 1911 |
| lead | 7.2 K | type I |
| niobium | 9.25 K | type II; accelerator cavities |
| niobium–titanium | about 9.5 K | MRI and LHC magnet wire |
| niobium–tin | 18 K | high-field magnets |
| magnesium diboride | 39 K | found in 2001 |
| YBa₂Cu₃O₇ (YBCO) | 92 K | above liquid nitrogen's 77 K |
| HgBa₂Ca₂Cu₃O₈ | 133 K | record at ordinary pressure |
| lanthanum hydride | about 250 K | only at 170 GPa |

### Critical field
A strong enough field destroys superconductivity. For a **type I** superconductor, roughly

$$B_c(T) = B_c(0)\\left[1 - \\left(\\frac{T}{T_c}\\right)^2\\right]$$

with $B_c(0)$ only 0.01–0.1 T (0.08 T for lead). **Type II** superconductors let the field in gradually above a lower critical field, as a lattice of thin **vortices**, each carrying exactly one **flux quantum**

$$\\Phi_0 = \\frac{h}{2e} = 2.07\\times10^{-15}\\ \\mathrm{Wb}$$

and stay superconducting up to tens of teslas. Niobium–titanium works to about 10 T at 4 K, which is what makes superconducting magnets possible — provided the vortices are pinned by defects so they cannot drift and dissipate energy.

### Cooper pairs: the BCS theory
The explanation came in 1957 from John Bardeen, Leon Cooper and Robert Schrieffer. An electron moving through the lattice slightly pulls the positive ions towards it; the lingering distortion attracts a second electron. This weak, lattice-mediated attraction binds electrons with opposite momenta and spins into **Cooper pairs**, spread over hundreds of nanometres. Pairs behave as bosons and condense into a single coherent quantum state; to scatter one electron you must break a pair, which costs an **energy gap** $2\\Delta$, with $\\Delta \\approx 1.76\\, k_B T_c$ — about 1.4 meV in niobium. At low temperature there is simply no thermal energy to pay it, so nothing scatters and the resistance is exactly zero. The flux quantum $h/2e$, with its charge $2e$, is direct evidence that the carriers are pairs. The copper-oxide "high-$T_c$" superconductors discovered in 1986 also use pairs, but what binds them is still debated.

### Uses
- **MRI scanners**: coils of niobium–titanium in liquid helium carry persistent currents that give steady 1.5–3 T fields.
- **Particle accelerators**: the LHC's 1232 dipoles at 1.9 K; superconducting niobium cavities accelerate the beams.
- **SQUIDs**, rings interrupted by thin insulating barriers that pairs [[quantum-tunneling|tunnel]] through (Josephson junctions), detect fields a billion times weaker than the Earth's — including the fields of the brain.
- **Superconducting qubits** in quantum computers, and superconducting cables, fault-current limiters and maglev trains.

> [!fact] The discovery of YBCO in 1987 moved superconductivity above the boiling point of liquid nitrogen, a coolant cheaper than milk.
`,
  ideas: [
    'Below a critical temperature a superconductor has exactly zero resistance.',
    'It also expels magnetic fields (Meissner effect): a perfect diamagnet, not just a perfect conductor.',
    'A strong enough field destroys superconductivity; type II materials admit quantized flux vortices and survive high fields.',
    'BCS theory: lattice vibrations bind electrons into Cooper pairs, separated from excited states by an energy gap of about $3.5\\,k_BT_c$.',
    'The flux quantum h/2e shows the charge carriers are pairs.'
  ],
  pitfalls: [
    'A superconductor is just a very good conductor — Its resistance is exactly zero, and it expels magnetic fields, which a perfect conductor would not do.',
    'Superconductors float above magnets because they are magnetic — They are the opposite: perfect diamagnets that exclude the field, which pushes them away (and flux pinning holds them in place).',
    'High-temperature superconductors work at room temperature — "High" means above about 30 K; the best at ordinary pressure need 133 K, and the hydrides that approach room temperature need enormous pressures.'
  ],
  formulas: [
    {
      name: 'Critical field and temperature',
      expr: 'Bc = Bc0*(1 - (T/Tc)^2)', tex: 'B_c = B_{c0}\\left[1 - \\left(\\frac{T}{T_c}\\right)^2\\right]',
      vars: {
        Bc: { name: 'critical field at temperature T', q: 'bfield', unit: 'mT', tex: 'B_c' },
        Bc0: { name: 'critical field at absolute zero', q: 'bfield', unit: 'mT', value: 80, tex: 'B_{c0}' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 4.2 },
        Tc: { name: 'critical temperature', q: 'temperature', unit: 'K', value: 7.2, tex: 'T_c' }
      },
      note: 'Type I superconductors; defaults: lead in liquid helium. Aluminium: 10 mT and 1.2 K; mercury: 41 mT and 4.15 K.',
      stories: {
        Bc: 'Lead (critical field {Bc0} at absolute zero, critical temperature {Tc}) is cooled to {T}. Above what field does it stop superconducting?',
        T: 'Up to what temperature can a lead sample (critical field {Bc0} at absolute zero, critical temperature {Tc}) stay superconducting in a field of {Bc}?'
      }
    },
    {
      name: 'BCS energy gap',
      expr: 'Delta = 1.764*kB*Tc', tex: '\\Delta = 1.764\\, k_B T_c',
      vars: {
        Delta: { name: 'energy gap (half the pair-breaking energy)', q: 'energy', unit: 'eV', tex: '\\Delta' },
        Tc: { name: 'critical temperature', q: 'temperature', unit: 'K', value: 9.25, tex: 'T_c' },
        kB: { const: 'kB' }
      },
      note: 'Weak-coupling BCS value. Breaking a pair costs $2\\Delta$: about 2.8 meV in niobium, a photon of 680 GHz.',
      stories: { Delta: 'Estimate the BCS energy gap of a superconductor with a critical temperature of {Tc}.' }
    },
    {
      name: 'Flux vortices through a type II superconductor',
      expr: 'N = 2*qe*B*A/h', tex: 'N = \\frac{B A}{\\Phi_0} = \\frac{2 e B A}{h}',
      vars: {
        N: { name: 'number of flux vortices', q: 'count' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1 },
        A: { name: 'area', q: 'area', unit: 'mm²', value: 1 },
        qe: { const: 'qe' },
        h: { const: 'h' }
      },
      note: 'Each vortex carries one flux quantum $\\Phi_0 = h/2e = 2.07\\times10^{-15}$ Wb.',
      stories: { N: 'A type II superconductor sits in a field of {B}. How many flux vortices thread an area of {A}?', B: 'Imaging shows {N} vortices in {A} of a superconducting film. What is the field?' }
    }
  ],
  examples: [
    {
      title: 'Lead in liquid helium',
      q: 'Lead has $T_c = 7.2$ K and $B_c(0) = 80$ mT. What is its critical field at 4.2 K, and could it carry a lab magnet\'s 0.5 T?',
      steps: [
        '$(T/T_c)^2 = (4.2/7.2)^2 = 0.340$.',
        '$B_c = 80 \\times (1 - 0.340) = 53\\ \\mathrm{mT}$.',
        'Far below 0.5 T: a type I superconductor like lead is useless for magnets. That job needs type II alloys such as niobium–titanium, which survive about 10 T.'
      ],
      a: 'About 53 mT — far too low for a 0.5 T magnet.'
    },
    {
      title: 'Breaking pairs with light',
      q: 'Niobium has $T_c = 9.25$ K. Estimate the energy gap and the lowest photon frequency that can break a Cooper pair.',
      steps: [
        '$\\Delta = 1.764\\, k_B T_c = 1.764 \\times 8.617\\times10^{-5} \\times 9.25 = 1.41\\times10^{-3}\\ \\mathrm{eV}$ (measured about 1.5 meV).',
        'Pair breaking needs $2\\Delta = 2.8\\ \\mathrm{meV} = 4.5\\times10^{-22}$ J.',
        '$f = 2\\Delta/h = 4.5\\times10^{-22}/6.63\\times10^{-34} = 6.8\\times10^{11}$ Hz — far infrared. Below this frequency a superconductor absorbs almost nothing, which is why niobium makes excellent low-loss microwave cavities.'
      ],
      a: 'Δ ≈ 1.4 meV; photons above about 680 GHz break pairs.'
    }
  ],
  quiz: [
    { q: 'What distinguishes a superconductor from an imaginary "perfect conductor"?', choices: ['Its resistance is lower', 'It expels a magnetic field even when cooled in that field', 'It conducts heat better', 'It only works with direct current'], a: 1,
      why: 'A perfect conductor would trap whatever field it had when its resistance vanished. A superconductor actively expels the field: the Meissner effect.' },
    { q: 'Why was the discovery of YBCO ($T_c$ = 92 K) so important?', choices: ['It was the first superconductor', 'It can be cooled with cheap liquid nitrogen (77 K) instead of liquid helium', 'It works at room temperature', 'It is a type I superconductor'], a: 1,
      why: 'Liquid nitrogen is plentiful and cheap; liquid helium is scarce and expensive and needs much more elaborate cryostats.' },
    { q: 'The flux quantum of a superconductor is $h/2e$ rather than $h/e$. This shows that…', choices: ['electrons have spin ½', 'the current is carried by pairs of electrons', 'flux is not quantized', 'the field is halved inside'], a: 1,
      why: 'Flux quantization depends on the charge of the carriers; the factor 2 reveals charge $2e$ — Cooper pairs.' },
    { q: 'A current set going in a superconducting ring keeps flowing for years with no battery.', a: true, why: 'With exactly zero resistance nothing dissipates the current; MRI magnets run for years in this persistent mode.' },
    { q: 'Raising the temperature of a superconductor towards $T_c$ makes its critical field…', choices: ['larger', 'smaller, reaching zero at $T_c$', 'unchanged', 'negative'], a: 1, why: '$B_c = B_c(0)[1 - (T/T_c)^2]$ falls to zero at $T_c$: the warmer it is, the more easily a field destroys it.' }
  ],
  applications: ['MRI scanners and NMR spectrometers with persistent-current magnets.', 'Accelerator magnets and radio-frequency cavities (LHC, European XFEL).', 'SQUID magnetometers for brain imaging and geophysics.', 'Superconducting qubits, single-photon detectors and fusion magnets.'],
  history: 'Kamerlingh Onnes won the 1913 Nobel Prize; Walther Meissner and Robert Ochsenfeld found flux expulsion in 1933; Bardeen, Cooper and Schrieffer\'s 1957 theory won the 1972 prize; Georg Bednorz and Alex Müller found the first copper-oxide superconductor in 1986 and were honoured the following year.'
}

);
