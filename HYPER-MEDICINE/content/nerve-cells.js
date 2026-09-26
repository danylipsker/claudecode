/* HYPER-MEDICINE · content/nerve-cells.js — Brain and Nerves: nerve cells.
 * Neurons, the action potential, and synapses and neurotransmitters.
 * Simulations: sims/neuro.js (neu-reflex, neu-hh, neu-synapse). */
Hyper.add(

{
  id: 'neurons', parent: 'nerve-cells', title: 'Neurons', level: 1,
  short: 'The nerve cell: a cell body that keeps it alive, dendrites that collect signals, and a single axon — up to a metre long — that sends an electrical impulse on. Insulated axons carry signals up to a hundred times faster than bare ones, which is why myelin matters so much.',
  keywords: ['neuron', 'nerve cell', 'axon', 'dendrite', 'myelin', 'node of Ranvier', 'glia', 'Schwann cell', 'oligodendrocyte', 'conduction velocity', 'nerve fibre', 'peripheral neuropathy', 'nerve conduction study', 'Guillain–Barré', 'carpal tunnel'],
  prereq: ['cell-structure', 'membrane-potential', 'tissue-types'],
  related: ['action-potential', 'synapses', 'nervous-system-organization', 'multiple-sclerosis', 'pain', 'type2-diabetes'],
  body: `
Stub your toe in the dark and the news arrives twice. First comes a sharp, exact jolt — you know which toe. About a second later a dull, spreading ache follows. Both messages left the toe at the same instant; they arrived at different times because they travelled on different kinds of nerve fibre. One kind is wrapped in insulation and carries its signal at the speed of a car; the other is bare and carries it at walking pace. That difference is the design of the nerve cell in a single experience.

### The parts of a neuron
- **Dendrites** — branching inputs covered in contacts from other cells ([[synapses|synapses]]); a large neuron in the cortex receives thousands of them.
- **The cell body** — the nucleus and the machinery that makes proteins for the whole cell, including the far end of its axon.
- **The initial segment** — the first stretch of the axon, packed with sodium channels, where the cell "decides" whether to fire an [[action-potential|action potential]].
- **The axon** — a single output cable, from less than a millimetre long to about a metre (from the spinal cord to the toes), ending in terminals that pass the message on.
- **Myelin** — layers of fatty membrane wrapped around many axons, made by glial cells (Schwann cells in the nerves, oligodendrocytes in the brain and spinal cord), with gaps about every millimetre called **nodes of Ranvier**.

Sensory neurons carry information in from the skin, muscles and organs; motor neurons carry commands out to muscles and glands; and interneurons, by far the most numerous, connect neurons to one another inside the brain and spinal cord. Around them are **glial cells**: astrocytes that feed neurons, mop up used transmitter and help form the blood–brain barrier, the myelin makers, and microglia, the brain's immune cells. A careful count (Azevedo and colleagues, 2009) found about 86 billion neurons in an adult brain and roughly as many other cells — the popular claim of ten glia for every neuron is a myth.

### Speed, and why myelin matters
| Fibre type | Myelin | Diameter | Speed | What it carries |
|---|---|---|---|---|
| Aα | thick | 13–20 µm | 70–120 m/s | muscle stretch sensors; commands to muscles |
| Aβ | yes | 6–12 µm | 35–75 m/s | touch, pressure, vibration |
| Aδ | thin | 1–5 µm | 5–30 m/s | sharp pain, cold |
| C | none | 0.2–1.5 µm | 0.5–2 m/s | dull and burning pain, warmth, itch, the autonomic nerves |

In a bare axon the impulse must be regenerated at every point along the membrane, which is slow. In a myelinated axon the current spreads quickly and passively under the insulation and the impulse is rebuilt only at the nodes, so it seems to jump from node to node (**saltatory conduction**). It also saves energy, because ions cross the membrane only at the nodes. Without myelin our nerves would have to be enormously thicker: the squid reaches about 25 m/s with a giant axon half a millimetre across, while a human myelinated fibre a fiftieth of that width manages 60 m/s.

$$t = \\frac{d}{v}$$

A signal from the toe to the spinal cord, about 1 m, takes some 17 ms at 60 m/s but a full second at 1 m/s — the two waves of the stubbed toe.

### Neurons for life
Most neurons are never replaced, and they live only as long as their supply of oxygen and glucose lasts: the brain is about 2 % of body weight but uses about 20 % of the body's energy at rest. A cut axon in a limb can regrow along its old sheath at roughly 1 mm a day, so feeling may return months after an injury; axons in the brain and spinal cord mostly cannot regrow, which is why a spinal cord injury is usually permanent.

### What goes wrong
- **Peripheral neuropathy** — damage to the nerves of the limbs, worst in the longest fibres, so it starts as numbness, tingling or burning in the feet ("stocking" distribution) and later the hands. Worldwide the commonest cause is diabetes; others include heavy alcohol use, vitamin B12 deficiency, some chemotherapy medicines and inherited conditions. Numb feet do not feel blisters or cuts, so daily foot checks matter.
- **Loss of myelin** — in the nerves in Guillain–Barré syndrome, an immune attack that often follows an infection and causes weakness rising from the legs over days; in the brain and spinal cord in [[multiple-sclerosis|multiple sclerosis]].
- **Loss of neurons** — motor neuron disease (ALS), [[parkinsons|Parkinson's disease]] and [[dementia|dementia]].
- **Compression** — carpal tunnel syndrome squeezes the median nerve at the wrist, causing tingling in the thumb and first fingers, often at night.

A **nerve conduction study** measures the speed directly: a nerve is stimulated at two points and the difference in arrival times gives the velocity. Slowing points to damaged myelin; small responses at normal speed point to lost axons.

> [!warn] Weakness or numbness that spreads over hours or days — especially with difficulty breathing, swallowing or speaking — needs emergency care: call your local emergency number. Sudden weakness or numbness of the face, arm or leg on one side may be a [[stroke|stroke]]: call your local emergency number and note the time it started.
`,
  ideas: [
    'A neuron collects inputs on its dendrites, decides at the start of its axon whether to fire, and sends one impulse down a single axon.',
    'Myelin lets the impulse jump from node to node: thick myelinated fibres carry signals at up to about 120 m/s, bare C fibres at 1–2 m/s.',
    'Conduction time is distance divided by speed — which is why fast and slow pain arrive at different moments.',
    'Most neurons are never replaced; axons in the limbs can regrow slowly, those in the brain and spinal cord mostly cannot.',
    'Diabetes is the commonest cause of peripheral neuropathy, which starts in the longest nerves — the feet.'
  ],
  pitfalls: [
    'Nerve signals travel at the speed of electricity in a wire — They are rebuilt by ion channels along the way and travel at 0.5–120 m/s, millions of times slower than a signal in a copper wire.',
    'Glial cells outnumber neurons ten to one — Careful counts find roughly as many glial cells as neurons in the human brain, and glia are active partners, not packing material.',
    'A damaged nerve can never recover — Axons in the limbs can regrow at about a millimetre a day along their old sheath; the brain and spinal cord are the places where regrowth mostly fails.'
  ],
  formulas: [
    {
      name: 'Conduction time along a nerve',
      expr: 't = d/v', tex: 't = \\frac{d}{v}',
      vars: {
        t: { name: 'conduction time', q: 'time', unit: 'ms' },
        d: { name: 'distance along the nerve', q: 'length', unit: 'm', value: 1 },
        v: { name: 'conduction velocity', q: 'speed', unit: 'm/s', value: 60 }
      },
      note: 'Add about 0.5–1 ms for each synapse on the way. Speeds: Aα 70–120 m/s, Aδ 5–30 m/s, unmyelinated C fibres 0.5–2 m/s.',
      practice: { unknowns: ['t', 'v'] },
      stories: { t: 'A signal travels {d} from the toe to the spinal cord along a fibre conducting at {v}. How long does it take?', v: 'A signal takes {t} to travel {d}. How fast does the fibre conduct?' }
    },
    {
      name: 'Conduction velocity from a two-point nerve study',
      expr: 'v = d/(t2 - t1)', tex: 'v = \\frac{d}{t_2 - t_1}',
      vars: {
        v: { name: 'conduction velocity', q: 'speed', unit: 'm/s' },
        d: { name: 'distance between the two stimulation points', q: 'length', unit: 'cm', value: 25 },
        t2: { name: 'latency from the far point (elbow)', q: 'time', unit: 'ms', value: 7.6, tex: 't_2' },
        t1: { name: 'latency from the near point (wrist)', q: 'time', unit: 'ms', value: 3.5, tex: 't_1' }
      },
      note: 'Subtracting the two latencies cancels the time spent at the nerve–muscle junction, which both measurements include. Normal values depend on the nerve, the laboratory and the temperature of the limb; motor fibres of the arm typically conduct above about 50 m/s.',
      practice: { unknowns: ['v', 't2'] },
      stories: { v: 'In a nerve conduction study the muscle responds {t1} after a shock at the wrist and {t2} after a shock at the elbow, {d} further up. What is the conduction velocity?' }
    },
    {
      name: 'Hursh\'s rule for myelinated fibres',
      expr: 'v = k*D', tex: 'v = k\\,D',
      vars: {
        v: { name: 'conduction speed (m/s)' },
        k: { name: 'Hursh factor (m/s per µm)', value: 6, fixed: true },
        D: { name: 'outer fibre diameter (µm)', value: 10 }
      },
      note: 'An empirical rule from measurements on cat nerves (Hursh, 1939): speed grows in proportion to the diameter of a myelinated fibre. In bare fibres it grows only about as the square root of the diameter, which is why thickening an axon is a poor substitute for myelin.',
      stories: { v: 'A myelinated fibre is {D} across. Roughly how fast does it conduct?' }
    }
  ],
  examples: [
    {
      title: 'The stubbed toe',
      q: 'The path from a toe to the spinal cord is about 1.0 m. Sharp pain travels on Aδ fibres at about 15 m/s, dull pain on C fibres at about 1 m/s. When does each signal reach the spinal cord?',
      steps: [
        'Aδ fibres: $t = d/v = 1.0/15 = 0.067$ s, about 67 ms.',
        'C fibres: $t = 1.0/1 = 1.0$ s.',
        'The onward journey up the spinal cord to the brain runs on fast fibres and adds only a few tens of milliseconds to both, so the gap of nearly a second survives.'
      ],
      a: 'About 0.07 s for the sharp pain and 1 s for the dull ache — the "double pain" of a stubbed toe.'
    },
    {
      title: 'Reading a nerve conduction study',
      q: 'The thumb muscle responds 3.5 ms after the median nerve is stimulated at the wrist and 7.6 ms after it is stimulated at the elbow, 25 cm further up. What is the conduction velocity, and what would a result of 30 m/s suggest?',
      steps: [
        'The extra distance is 0.25 m and the extra time $7.6 - 3.5 = 4.1$ ms.',
        '$v = 0.25/0.0041 = 61$ m/s — within the normal range for the arm (typically above about 50 m/s, depending on the laboratory).',
        'A speed of 30 m/s over the forearm would suggest damage to the myelin, as in some inherited or immune neuropathies; a normal speed with a small response points instead to lost axons.'
      ],
      a: 'About 61 m/s, which is normal; a marked slowing suggests demyelination.'
    }
  ],
  quiz: [
    { q: 'Which change would speed up conduction in a nerve fibre the most?', choices: ['Wrapping it in myelin', 'Making it twice as long', 'Adding more dendrites', 'Raising the number of synapses on it'], a: 0,
      why: 'Myelin lets the impulse jump from node to node, raising the speed tens of times. Length changes the travel time, not the speed; dendrites and synapses concern inputs.' },
    { q: 'An axon in the forearm is cut 30 cm from the muscle it controls and is repaired. Regrowing at about 1 mm a day, roughly how many days until it reaches the muscle?', answer: 300, unit: 'day',
      why: '300 mm at 1 mm a day is about 300 days — nearly a year, which is why recovery after a nerve injury is measured in months.' },
    { q: 'Glial cells outnumber neurons in the human brain by about ten to one.', a: false,
      why: 'Modern counts find roughly equal numbers: about 86 billion neurons and a similar number of other cells.' },
    { q: 'Why does diabetic neuropathy usually start in the feet rather than the hands?', choices: ['The longest nerve fibres are the most vulnerable, and those run to the feet', 'The feet have more nerves than the hands', 'Blood sugar is higher in the legs', 'The feet are further from the brain, so signals fade'], a: 0,
      why: 'Damage accumulates along the length of an axon and its supply lines, so the longest fibres — those to the toes — fail first. Signals do not fade with distance; they are regenerated all along the way.' },
    { q: 'You hold a hot mug and first feel a sharp sting, then a burning ache. The ache comes later because…', choices: ['it travels on bare, slow C fibres', 'the brain processes pain twice', 'the second signal starts later', 'burning pain needs a synapse in the brain first'], a: 0,
      why: 'Both start together, but C fibres conduct at 0.5–2 m/s against 5–30 m/s for the thinly myelinated Aδ fibres that carry the sharp sting.' }
  ],
  applications: ['Nerve conduction studies and electromyography to diagnose neuropathies and carpal tunnel syndrome.', 'Daily foot care in diabetes, where numb feet can hide wounds.', 'Nerve repair surgery, timed by the known regrowth rate of axons.', 'Understanding why a local anaesthetic numbs pain before touch: the thin fibres are blocked first.'],
  history: 'Santiago Ramón y Cajal showed around 1890, with Camillo Golgi\'s silver stain, that the nervous system is made of separate cells — the neuron doctrine. The two shared the Nobel Prize in 1906, though Golgi never accepted Cajal\'s view.',
  sim: 'neu-reflex'
},

{
  id: 'action-potential', parent: 'nerve-cells', title: 'The action potential', level: 2,
  short: 'The nerve impulse: a brief, all-or-nothing reversal of the voltage across a neuron\'s membrane, made by sodium channels opening and then potassium channels, that travels down the axon without fading.',
  keywords: ['action potential', 'nerve impulse', 'spike', 'threshold', 'depolarisation', 'repolarisation', 'sodium channel', 'potassium channel', 'refractory period', 'all-or-nothing', 'Hodgkin–Huxley', 'Nernst equation', 'local anaesthetic', 'saltatory conduction'],
  prereq: ['membrane-potential', 'neurons', 'electrolytes', 'chemistry:nernst-equation'],
  related: ['synapses', 'epilepsy', 'pain-relief', 'ecg', 'physics:rc-circuits', 'anaesthesia-surgery'],
  body: `
A dentist injects a little local anaesthetic beside a tooth. Within minutes the lip goes numb and the drill no longer hurts, though the nerves are intact and the brain is wide awake. The medicine has done one precise thing: it has plugged the sodium channels in the nerve's membrane, so the nerve can no longer make the electrical impulse that carries pain. That impulse — the **action potential** — is how every neuron sends a message.

### From rest to spike
At rest the inside of a neuron is about 70 mV negative to the outside (the [[membrane-potential|membrane potential]]). The sodium–potassium pump keeps sodium high outside and potassium high inside, and the resting membrane leaks mainly potassium. Each ion is pulled towards its own **equilibrium potential**, set by its concentration ratio:

$$E = \\frac{RT}{zF} \\ln \\frac{c_\\text{out}}{c_\\text{in}}$$

With typical concentrations this is about −95 mV for potassium and +67 mV for sodium at body temperature. The membrane voltage sits wherever the balance of permeabilities puts it — near potassium's value at rest.

When a stimulus pushes the voltage up to a **threshold** of about −55 mV, the story runs itself:

1. **Depolarisation.** Voltage-gated sodium channels open; sodium rushes in, which raises the voltage, which opens more channels — positive feedback. In under half a millisecond the inside swings to about +30 to +40 mV.
2. **Repolarisation.** Within a millisecond the sodium channels shut themselves (inactivation), and slower voltage-gated potassium channels open; potassium flows out and the voltage falls.
3. **After-hyperpolarisation.** The potassium channels close slowly, so the voltage dips below rest, near potassium's equilibrium, before settling back.

The whole spike lasts 1–2 ms in human neurons. Remarkably few ions move: for a thin axon one impulse changes the sodium inside by well under 1 %, and the pump quietly restores it.

### All or nothing, and the refractory period
A stimulus below threshold fizzles out; any stimulus above it gives the same full-size spike. So a nerve cannot signal "stronger" with a bigger spike. It signals with **more spikes per second** and by recruiting more fibres. For about a millisecond after a spike the inactivated sodium channels cannot reopen at all — the **absolute refractory period** — and for a few milliseconds more a stronger stimulus is needed (the **relative refractory period**). This caps the firing rate at a few hundred per second and makes the impulse travel one way: the membrane just behind it cannot fire again.

### Travelling down the axon
Current from the active patch spreads along the inside of the axon and brings the next patch to threshold, so the spike regenerates itself and arrives at full size a metre away. The membrane behaves like a leaky electrical cable (resistors and capacitors, see [[physics:rc-circuits|RC circuits]]); myelin lowers its capacitance and leak, so the current reaches the next node of Ranvier quickly and the impulse jumps (see [[neurons]]).

### When channels go wrong
- **Blocking sodium channels** stops impulses: local anaesthetics such as lidocaine do it on purpose; tetrodotoxin, the poison of the pufferfish, does it catastrophically. Several anti-seizure medicines and some heart-rhythm medicines work by damping sodium channels a little.
- **Potassium in the blood** sets the resting voltage. Too much (hyperkalaemia) depolarises cells and inactivates their sodium channels, causing weakness and dangerous heart rhythms; see [[electrolytes]].
- **Low calcium** makes nerves over-excitable — tingling around the mouth and fingers and muscle spasms.
- **Inherited channel faults** (channelopathies) cause some epilepsies, periodic paralyses and, strikingly, a rare inability to feel pain at all when one sodium channel of pain nerves is missing.

The same machinery, with calcium channels added, makes the heart's electrical activity — the [[ecg|ECG]] is the sum of action potentials in heart muscle.

> [!warn] Tingling around the mouth that spreads to numbness and weakness after eating pufferfish or shellfish (whose toxins block sodium channels), or sudden muscle weakness with palpitations in someone with kidney disease or taking medicines that raise potassium, can be life-threatening: call your local emergency number.
`,
  ideas: [
    'At rest the inside of a neuron is about 70 mV negative; each ion is pulled towards its own equilibrium potential, given by the Nernst equation.',
    'Above a threshold, sodium channels open in a burst of positive feedback; then they inactivate and potassium channels open, restoring the voltage.',
    'The action potential is all or nothing: intensity is coded by how often neurons fire and how many fire, not by spike size.',
    'The refractory period limits the firing rate and makes impulses travel in one direction.',
    'Local anaesthetics, some anti-seizure and heart-rhythm medicines, and several toxins act on the sodium channel.'
  ],
  pitfalls: [
    'A stronger stimulus makes a bigger action potential — Every spike above threshold is the same size; a stronger stimulus makes spikes come more often.',
    'During each impulse the cell fills with sodium — Only a tiny fraction of the ions move; the concentrations hardly change, and the pump restores them in the background.',
    'The impulse is electricity flowing down the axon like current in a wire — The spike is regenerated at each patch or node by ion channels, which is why it does not fade but also why it is slow.'
  ],
  formulas: [
    {
      name: 'Nernst equation: the equilibrium potential of one ion',
      expr: 'E = R*T/(z*F)*ln(co/ci)', tex: 'E = \\frac{R\\,T}{z\\,F}\\ln\\frac{c_\\text{out}}{c_\\text{in}}',
      vars: {
        E: { name: 'equilibrium potential (inside relative to outside)', q: 'voltage', unit: 'mV', signed: true },
        R: { const: 'R' },
        T: { name: 'body temperature', q: 'temperature', unit: '°C', value: 37 },
        z: { name: 'charge of the ion', value: 1, int: true, signed: true },
        F: { const: 'F' },
        co: { name: 'concentration outside the cell', q: 'concentration', unit: 'mM', value: 145, tex: 'c_\\text{out}' },
        ci: { name: 'concentration inside the cell', q: 'concentration', unit: 'mM', value: 12, tex: 'c_\\text{in}' }
      },
      note: 'Typical values for a mammalian neuron: sodium 145 out, 12 in (+67 mV); potassium 4 out, 140 in (−95 mV); chloride (z = −1) 110 out, 10 in (−64 mV). Laboratory reference ranges for blood potassium are about 3.5–5.0 mmol/L and vary between laboratories.',
      practice: { unknowns: ['E', 'co'] },
      stories: { E: 'An ion of charge {z} is at {co} outside a cell and {ci} inside, at {T}. What is its equilibrium potential?', co: 'At {T} a monovalent ion with {ci} inside has an equilibrium potential of {E}. What is its concentration outside?' }
    },
    {
      name: 'The membrane voltage and the sodium-to-potassium permeability ratio',
      expr: 'Vm = R*T/F*ln((Ko + r*Nao)/(Ki + r*Nai))', tex: 'V_m = \\frac{R\\,T}{F}\\ln\\frac{\\mathrm{[\\ce{K+}]}_o + r\\,\\mathrm{[\\ce{Na+}]}_o}{\\mathrm{[\\ce{K+}]}_i + r\\,\\mathrm{[\\ce{Na+}]}_i}',
      vars: {
        Vm: { name: 'membrane voltage', q: 'voltage', unit: 'mV', signed: true, tex: 'V_m' },
        R: { const: 'R' },
        T: { name: 'body temperature', q: 'temperature', unit: '°C', value: 37 },
        F: { const: 'F' },
        r: { name: 'permeability ratio, sodium to potassium', value: 0.04, tex: 'r' },
        Ko: { name: 'potassium outside', q: 'concentration', unit: 'mM', value: 4, tex: '\\mathrm{[\\ce{K+}]}_o' },
        Ki: { name: 'potassium inside', q: 'concentration', unit: 'mM', value: 140, tex: '\\mathrm{[\\ce{K+}]}_i' },
        Nao: { name: 'sodium outside', q: 'concentration', unit: 'mM', value: 145, tex: '\\mathrm{[\\ce{Na+}]}_o' },
        Nai: { name: 'sodium inside', q: 'concentration', unit: 'mM', value: 12, tex: '\\mathrm{[\\ce{Na+}]}_i' }
      },
      note: 'The Goldman–Hodgkin–Katz equation with chloride left out. At rest r is about 0.04 (−71 mV); at the peak of a spike sodium channels raise it to about 20 (+54 mV). The action potential is this ratio swinging a few hundredfold and back.',
      practice: { unknowns: ['Vm', 'r'] },
      stories: { Vm: 'A neuron at {T} has a sodium-to-potassium permeability ratio of {r}. With the usual concentrations, what is its membrane voltage?', r: 'What sodium-to-potassium permeability ratio gives a membrane voltage of {Vm} with the usual concentrations?' }
    },
    {
      name: 'The fastest possible firing rate',
      expr: 'f = 1/tr', tex: 'f_\\text{max} = \\frac{1}{t_\\text{ref}}',
      vars: {
        f: { name: 'maximum firing rate', q: 'frequency', unit: 'Hz', tex: 'f_\\text{max}' },
        tr: { name: 'absolute refractory period', q: 'time', unit: 'ms', value: 2, tex: 't_\\text{ref}' }
      },
      note: 'An upper bound: the relative refractory period and the time to reach threshold keep most neurons well below it. Typical rates range from a few to about 200 per second; a few specialised cells briefly reach 500 or more.'
    }
  ],
  examples: [
    {
      title: 'Where the spike can go',
      q: 'A neuron has potassium 4 mM outside and 140 mM inside, and sodium 145 mM outside and 12 mM inside. At 37 °C, between which limits can its membrane voltage move?',
      steps: [
        '$RT/F$ at 310 K is $8.314 \\times 310.15 / 96485 = 26.7$ mV.',
        'Potassium: $E_K = 26.7 \\ln(4/140) = 26.7 \\times (-3.56) = -95$ mV.',
        'Sodium: $E_{Na} = 26.7 \\ln(145/12) = 26.7 \\times 2.49 = +67$ mV.',
        'No mix of permeabilities can take the voltage outside these two limits. At rest the membrane is mostly permeable to potassium, so it sits near −70 mV; at the peak of a spike it is mostly permeable to sodium and climbs towards +67 mV, stopping at about +40 mV as the sodium channels inactivate.'
      ],
      a: 'Between about −95 mV and +67 mV; the spike runs from near the bottom limit to near the top one.'
    },
    {
      title: 'The permeability switch',
      q: 'Using the permeability-ratio formula with the same concentrations, find the membrane voltage when the sodium-to-potassium permeability ratio is 0.04 (rest) and 20 (peak of a spike).',
      steps: [
        'Rest: $\\dfrac{4 + 0.04 \\times 145}{140 + 0.04 \\times 12} = \\dfrac{9.8}{140.5} = 0.070$; $V = 26.7 \\ln 0.070 = -71$ mV.',
        'Peak: $\\dfrac{4 + 20 \\times 145}{140 + 20 \\times 12} = \\dfrac{2904}{380} = 7.64$; $V = 26.7 \\ln 7.64 = +54$ mV.',
        'A 500-fold change in the ratio of permeabilities — the sodium channels opening — moves the voltage by 125 mV, without any real change in the concentrations.'
      ],
      a: 'About −71 mV at rest and +54 mV at the peak.'
    }
  ],
  quiz: [
    { q: 'You press harder on a fingertip. How does the touch nerve tell the brain?', choices: ['It fires more action potentials per second, and more fibres join in', 'Each action potential becomes taller', 'Each action potential becomes longer', 'The impulses travel faster'], a: 0,
      why: 'Action potentials are all or nothing and travel at a speed set by the fibre, so intensity is coded by the firing rate and by recruiting more fibres.' },
    { q: 'A second stimulus arrives 0.5 ms after a spike has started. However strong it is, it does not trigger another spike. Why?', choices: ['The sodium channels are inactivated (the absolute refractory period)', 'The cell has run out of sodium', 'The potassium channels are blocked', 'The stimulus is below threshold'], a: 0,
      why: 'Inactivated sodium channels cannot reopen until the membrane has repolarised; the concentrations have hardly changed.' },
    { q: 'Using the Nernst equation at 37 °C (RT/F = 26.7 mV), what is the equilibrium potential of potassium with 4 mM outside and 140 mM inside? (in mV)', answer: -95, unit: 'mV',
      why: '26.7 × ln(4/140) = 26.7 × (−3.56) ≈ −95 mV.' },
    { q: 'How does a local anaesthetic such as lidocaine stop pain?', choices: ['It blocks voltage-gated sodium channels, so the nerve cannot fire', 'It kills the pain nerves in the area', 'It blocks pain receptors in the brain', 'It relaxes the muscles around the nerve'], a: 0,
      why: 'Without working sodium channels the depolarising burst cannot happen, so impulses stop at the numbed stretch of nerve; when the drug is carried away, the nerve works normally again.' },
    { q: 'A high blood potassium makes nerve and muscle cells more excitable at first but can then make them unable to fire.', a: true,
      why: 'Raising outside potassium moves the resting voltage up towards threshold; if it stays up, the sodium channels inactivate and the cells can no longer fire — hence weakness and dangerous heart rhythms.' }
  ],
  applications: ['Local and regional anaesthesia, which block sodium channels in nerves.', 'Anti-seizure medicines that damp repetitive firing.', 'Reading blood potassium and calcium results, which change nerve and heart excitability.', 'Nerve conduction studies, EEG and ECG, which all record action potentials from outside the body.'],
  history: 'Alan Hodgkin and Andrew Huxley recorded from the giant axon of the squid and in 1952 published equations describing how sodium and potassium currents make the action potential — decades before the channels themselves were seen. They shared the 1963 Nobel Prize with John Eccles.',
  sim: 'neu-hh'
},

{
  id: 'synapses', parent: 'nerve-cells', title: 'Synapses and neurotransmitters', level: 2,
  short: 'Where one neuron talks to the next: an electrical impulse releases a chemical messenger that crosses a gap of a few tens of nanometres and acts on receptors. Most medicines for the mind, many poisons and caffeine act here.',
  keywords: ['synapse', 'neurotransmitter', 'receptor', 'vesicle', 'reuptake', 'SSRI', 'dopamine', 'serotonin', 'glutamate', 'GABA', 'acetylcholine', 'acetylcholinesterase', 'caffeine', 'adenosine', 'myasthenia gravis', 'plasticity', 'EPSP'],
  prereq: ['neurons', 'action-potential', 'how-drugs-work'],
  related: ['depression', 'parkinsons', 'dementia', 'addiction', 'pain-relief', 'poisoning-overdose', 'dose-response', 'mental-health-treatment'],
  body: `
Half an hour after a strong coffee you feel more awake. Caffeine has not given you energy; it has blocked a receptor. Through the day your brain builds up **adenosine**, a molecule that tells neurons to quieten down and makes you sleepy. Caffeine has a similar shape, sits in the adenosine receptors without switching them on, and so hides the sleepiness signal for a few hours. That is pharmacology at a **synapse** — the junction where one neuron passes its message to the next.

### How a chemical synapse works
1. An [[action-potential|action potential]] reaches the axon terminal and opens voltage-gated **calcium** channels.
2. Calcium triggers **vesicles** — tiny bubbles each holding a few thousand molecules of transmitter — to fuse with the membrane and release their contents.
3. The transmitter crosses the **synaptic cleft**, a gap of about 20–40 nm, in about half a microsecond.
4. It binds **receptors** on the next cell. Ionotropic receptors are ion channels that open within a millisecond; metabotropic receptors act through chemical relays inside the cell, more slowly and for longer.
5. The signal is ended by **reuptake** transporters that pull the transmitter back into the terminal, by **enzymes** that break it down (acetylcholinesterase splits thousands of acetylcholine molecules a second), or by diffusion away.

The whole process takes about half a millisecond — the synaptic delay — mostly spent on calcium entry and vesicle fusion.

### Adding up the votes
One excitatory synapse nudges the next cell's voltage up by about a millivolt (an EPSP); an inhibitory one pushes it down (an IPSP). A neuron with thousands of synapses fires only when the excitatory inputs arriving close together in time and space outweigh the inhibitory ones enough to reach threshold at the start of its axon. So each neuron is a small decision-maker, and the brain's roughly hundred trillion synapses are where most of its computation — and its learning — happens. Synapses that are used together strengthen (long-term potentiation), the cellular basis of memory proposed by Donald Hebb in 1949.

### The main messengers
| Transmitter | Main jobs | Medicines and substances acting on it |
|---|---|---|
| Glutamate | the main excitatory signal; learning and memory | ketamine and memantine block one of its receptors |
| GABA | the main inhibitory signal in the brain | benzodiazepines, many anaesthetics and alcohol boost its receptor |
| Acetylcholine | nerve-to-muscle signal; the "rest and digest" nerves; attention and memory | muscle relaxants in anaesthesia; cholinesterase inhibitors in Alzheimer's disease and myasthenia; nicotine |
| Dopamine | movement, motivation, learning from reward | levodopa in Parkinson's disease; antipsychotic medicines block its receptors; stimulants raise it |
| Serotonin | mood, sleep, appetite, the gut, nausea | SSRI antidepressants block its reuptake; migraine medicines (triptans) act on its receptors |
| Noradrenaline | alertness; the "fight or flight" nerves | SNRI antidepressants; beta-blockers block its receptors on the heart |
| Endorphins | the body's own pain relief | opioid medicines imitate them; naloxone blocks them |

### What goes wrong
- **Myasthenia gravis** — antibodies attack the acetylcholine receptors of muscle, so muscles tire quickly: drooping eyelids, double vision, weakness that worsens through the day. Cholinesterase inhibitors help by letting more acetylcholine linger.
- **Poisons**: botulinum toxin stops acetylcholine release (paralysis — the same toxin in tiny doses treats muscle spasm and migraine); organophosphate insecticides and nerve agents block acetylcholinesterase, flooding synapses (see [[poisoning-overdose]]).
- **Imbalances** in transmitter systems are part of [[depression|depression]], [[psychosis|psychosis]], [[addiction|addiction]] and [[parkinsons|Parkinson's disease]]; many psychiatric medicines work by adjusting them.

> [!warn] Weakness that spreads, drooping eyelids with difficulty swallowing or breathing, or a suspected poisoning with an insecticide are emergencies: call your local emergency number.

> [!note] Medicines that act on synapses often take weeks to work fully — an SSRI blocks reuptake within hours, but mood improves over two to six weeks as receptors and connections adapt. Starting, changing and stopping them is something to plan with a doctor or pharmacist; see [[mental-health-treatment]].
`,
  ideas: [
    'An impulse opens calcium channels in the terminal; calcium makes vesicles release transmitter into the cleft.',
    'The transmitter acts on receptors — fast ion channels or slower chemical relays — and is cleared by reuptake, enzymes or diffusion.',
    'A neuron fires only when its excitatory inputs outweigh the inhibitory ones enough to reach threshold.',
    'Synapses change with use; strengthening and weakening them is how the brain learns.',
    'Most psychiatric medicines, many anaesthetics and poisons, and caffeine and nicotine act at synapses.'
  ],
  pitfalls: [
    'Depression is simply a lack of serotonin — Serotonin medicines help many people, but depression involves many systems, circuits and life circumstances; the "chemical imbalance" slogan oversimplifies.',
    'Caffeine gives the brain energy — It blocks adenosine receptors, hiding the build-up of sleepiness; the sleep pressure returns when it wears off.',
    'Each synapse fires the next neuron — One synapse usually moves the next cell by about a millivolt; many must act together to reach threshold.'
  ],
  formulas: [
    {
      name: 'Time to diffuse across the cleft',
      expr: 't = x^2/(2*D)', tex: 't = \\frac{x^2}{2D}',
      vars: {
        t: { name: 'typical diffusion time', q: 'time', unit: 'µs' },
        x: { name: 'width of the cleft', q: 'length', unit: 'nm', value: 20 },
        D: { name: 'diffusion coefficient of the transmitter', unit: 'm²/s', value: 4e-10 }
      },
      note: 'Diffusion time grows with the square of the distance: crossing 20 nm takes about half a microsecond, but diffusing 1 mm would take about 20 minutes — why the body needs nerves and blood flow for long distances. D for small transmitters in the cleft is a few times 10⁻¹⁰ m²/s.',
      practice: { unknowns: ['t', 'x'] },
      stories: { t: 'Glutamate with a diffusion coefficient of {D} crosses a cleft {x} wide. Roughly how long does it take?' }
    },
    {
      name: 'Receptor occupancy',
      expr: 'occ = C/(C + Kd)', tex: '\\theta = \\frac{C}{C + K_d}',
      vars: {
        occ: { name: 'fraction of receptors occupied', q: 'ratio', unit: '%', tex: '\\theta' },
        C: { name: 'concentration of the transmitter or medicine', q: 'concentration', unit: 'nM', value: 20 },
        Kd: { name: 'dissociation constant (the concentration for half occupancy)', q: 'concentration', unit: 'nM', value: 5, tex: 'K_d' }
      },
      note: 'The simplest binding law (one molecule per receptor). A lower $K_d$ means a tighter-binding, more potent molecule. Going from 80 % to 95 % occupancy takes about five times the concentration — diminishing returns that shape how medicines are dosed; see [[dose-response]].',
      practice: { unknowns: ['occ', 'C'] },
      stories: { occ: 'A medicine reaches {C} near its receptor, whose dissociation constant is {Kd}. What fraction of the receptors does it occupy?', C: 'What concentration of a medicine with a dissociation constant of {Kd} occupies {occ} of its receptors?' }
    }
  ],
  examples: [
    {
      title: 'Why the synaptic delay is not the gap',
      q: 'Transmitter must cross a 20 nm cleft with a diffusion coefficient of about 4 × 10⁻¹⁰ m²/s. The measured synaptic delay is about 0.5 ms. How much of it is the crossing?',
      steps: [
        '$t = x^2/(2D) = (20 \\times 10^{-9})^2 / (2 \\times 4 \\times 10^{-10}) = 4 \\times 10^{-16} / 8 \\times 10^{-10} = 5 \\times 10^{-7}$ s.',
        'That is 0.5 µs — a thousandth of the synaptic delay.',
        'Almost all the delay is the opening of calcium channels, the calcium signal and the fusion of vesicles with the membrane.'
      ],
      a: 'About 0.5 µs, only about 0.1 % of the half-millisecond delay.'
    },
    {
      title: 'Diminishing returns at the receptor',
      q: 'A medicine binds its receptor with a dissociation constant of 5 nM. What fraction of receptors does 20 nM occupy, and what concentration would be needed for 95 %?',
      steps: [
        '$\\theta = 20/(20 + 5) = 0.80$, so 80 %.',
        'For 95 %: $C/(C + 5) = 0.95$ gives $C = 0.95 \\times 5/0.05 = 95$ nM.',
        'Almost five times the concentration buys 15 more percentage points of occupancy — while side effects from other targets keep rising.'
      ],
      a: '80 % at 20 nM; about 95 nM for 95 %.'
    }
  ],
  quiz: [
    { q: 'A medicine blocks the reuptake transporter for serotonin. What happens at the synapse?', choices: ['Serotonin stays in the cleft longer and keeps acting on receptors', 'Less serotonin is released', 'The receptors are blocked', 'Serotonin is broken down faster'], a: 0,
      why: 'Reuptake is the main way serotonin is cleared; blocking it lets each release act for longer. That is how SSRIs start to work, though the benefit for mood takes weeks.' },
    { q: 'Why does caffeine make you feel less sleepy?', choices: ['It blocks adenosine receptors, hiding the sleepiness signal', 'It adds glucose to the brain', 'It releases extra melatonin', 'It speeds up nerve conduction'], a: 0,
      why: 'Adenosine builds up while you are awake and quietens neurons through its receptors; caffeine occupies those receptors without activating them.' },
    { q: 'One excitatory synapse is normally enough to make the next neuron fire.', a: false,
      why: 'A single synapse moves the voltage by about a millivolt, while threshold is some 15 mV above rest; many inputs must add up.' },
    { q: 'In myasthenia gravis antibodies block acetylcholine receptors on muscle. Why does a cholinesterase inhibitor help?', choices: ['Acetylcholine lasts longer in the cleft, so more reaches the remaining receptors', 'It makes new receptors', 'It removes the antibodies', 'It blocks the nerve impulse'], a: 0,
      why: 'Slowing the breakdown of acetylcholine lets it act repeatedly on the receptors that are still free.' },
    { q: 'A medicine is present at a concentration equal to its dissociation constant. What percentage of its receptors does it occupy?', answer: 50, unit: '%',
      why: 'θ = C/(C + K_d) = K_d/(2K_d) = 0.5 — that is the definition of the dissociation constant.' }
  ],
  applications: ['Antidepressants, antipsychotics, anti-anxiety and sleep medicines, which change synaptic signalling.', 'Muscle relaxants and their reversal in anaesthesia.', 'Treating myasthenia gravis and Parkinson\'s disease.', 'Recognising and treating poisoning by insecticides, nerve agents and botulism.'],
  history: 'Otto Loewi showed in 1921 that a nerve slows a frog\'s heart by releasing a chemical — later identified as acetylcholine — by transferring fluid from one heart to another; he said the experiment came to him in a dream. He shared the 1936 Nobel Prize with Henry Dale.',
  sim: 'neu-synapse'
}

);
