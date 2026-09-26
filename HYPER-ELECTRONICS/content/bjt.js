/* HYPER-ELECTRONICS · content/bjt.js — bipolar junction transistors: how they work,
 * their regions of operation, and their use as switches, amplifiers and followers. */
Hyper.add(

{
  id: 'bjt-operation', parent: 'bjt', title: 'How a bipolar transistor works', level: 1,
  short: 'Two p–n junctions sharing a very thin middle layer: the base–emitter voltage sets a collector current about a hundred times larger than the base current that flows with it.',
  keywords: ['bipolar junction transistor', 'BJT', 'NPN', 'PNP', 'current gain', 'beta', 'hFE', 'base', 'collector', 'emitter', 'Vbe', 'transconductance', 'Ebers–Moll', '2N2222', 'BC547'],
  prereq: ['pn-diode', 'semiconductor-basics', 'physics:pn-junction', 'math:exponential-functions'],
  related: ['bjt-regions', 'mosfet-operation', 'bjt-switch', 'diode-models'],
  body: `
A bipolar junction transistor (BJT) is a sandwich of three doped layers. In the common **NPN** type a heavily doped n-type **emitter** is followed by a thin, lightly doped p-type **base** and a larger n-type **collector**. That makes two [[pn-diode|p–n junctions]] back to back — yet two diodes wired back to back do *not* make a transistor. Everything depends on the base being thin: a micrometre or less.

### What happens inside
Forward-bias the base–emitter junction — the base about 0.65 V above the emitter, for silicon — and the emitter floods the base with electrons. In a diode they would recombine. Here the base is so thin and so lightly doped that almost all of them diffuse straight across it. If the collector is more positive than the base, the base–collector junction is reverse biased, and its electric field sweeps every electron that reaches it into the collector. So the collector current is set by how many electrons the emitter injects, and that is controlled by the base–emitter voltage exactly as in a diode:

$$I_C = I_S\\,e^{V_{BE}/V_T}, \\qquad V_T = \\frac{kT}{q} \\approx 25.9\\ \\mathrm{mV}\\ \\text{at 300 K}$$

$I_S$ is tiny — around $10^{-14}$ A for a small transistor — so nothing much happens below 0.5 V, and then the current rises fast: **every 60 mV more on the base multiplies the collector current by ten**. This is the physics of [[physics:semiconductors|semiconductors]] and the [[physics:pn-junction|p–n junction]] put to work.

### Current gain
A few carriers go astray: holes injected from the base back into the emitter, and electrons that recombine in the base. Together they make the **base current**, which is roughly a fixed fraction of the collector current:

$$I_C = \\beta I_B, \\qquad I_E = I_C + I_B, \\qquad \\alpha = \\frac{I_C}{I_E} = \\frac{\\beta}{\\beta + 1}$$

β (printed $h_{FE}$ on datasheets) is typically 100–300 for small-signal parts. A **BC547B** is sorted into the range 200–450; a **2N2222A** is specified at 100–300 at 150 mA. β is *not* a precise number: it varies threefold between parts of one type, rises with temperature, and falls at very small and very large currents. Good circuits never depend on its exact value (see [[bjt-biasing]]).

Two views of the same device are both useful:
- **Current-controlled**: a base current $I_B$ lets a collector current $\\beta I_B$ flow. Simple, and good enough for [[bjt-switch|switches]].
- **Voltage-controlled**: $V_{BE}$ sets $I_C$ exponentially, and $I_B$ is a by-product. This is the view amplifiers need, because the **transconductance** $g_m = \\mathrm{d}I_C/\\mathrm{d}V_{BE} = I_C/V_T$ — about 39 mS per milliampere of collector current — sets their gain.

### PNP, temperature and ratings
A **PNP** transistor (BC557, 2N2907) is the mirror image: every voltage and current reversed, the emitter at the most positive point, the base pulled about 0.65 V *below* it to turn it on. The arrow on the emitter always points the way conventional current flows through it — out of an NPN, into a PNP.

At constant current, $V_{BE}$ falls by about 2 mV per °C. A warm transistor therefore draws more current at the same base voltage, which can run away in power stages. Datasheet limits to respect: the collector current (100 mA for a BC547, about 600 mA for a 2N2222A), the collector–emitter breakdown voltage $V_{CEO}$ (45 V and 40 V) and the power the package can shed.

> [!key] The collector current is controlled by the base–emitter junction; the collector only collects. As long as the collector–base junction stays reverse biased, the collector voltage hardly matters — the transistor behaves like a current source.
`,
  ideas: [
    'A BJT is two junctions sharing a very thin base; the thinness is what lets the emitter\'s electrons reach the collector.',
    'The base–emitter voltage sets the collector current exponentially: 60 mV more gives ten times the current.',
    'The base current is a small by-product, about I_C/β, with β typically 100–300 and poorly controlled.',
    'In the active region the collector behaves as a current source: its voltage hardly changes the current.',
    'Transconductance g_m = I_C/V_T, about 39 mS per mA, sets the gain of every BJT amplifier.'
  ],
  pitfalls: [
    'The base current is amplified and flows out of the collector — The collector current is drawn from the collector supply; the base current only controls it. In an NPN, both leave through the emitter.',
    'β is a fixed property of the part number — It varies about threefold between samples and changes with current and temperature. Design so that its exact value does not matter.',
    'V_BE is always 0.7 V — It is 0.6–0.75 V depending on current and temperature (about −2 mV/°C). 0.65 V is a fine estimate at milliamps, but amplifiers rely on the exponential law.'
  ],
  formulas: [
    {
      name: 'Current gain',
      expr: 'Ic = beta*Ib', tex: 'I_C = \\beta I_B',
      vars: {
        Ic: { name: 'collector current', q: 'current', unit: 'mA', tex: 'I_C' },
        beta: { name: 'current gain (h_FE)', value: 150, tex: '\\beta' },
        Ib: { name: 'base current', q: 'current', unit: 'µA', value: 20, tex: 'I_B' }
      },
      note: 'Valid in the active region only. In saturation the collector current is set by the external circuit and is smaller than βI_B.',
      stories: {
        Ic: 'A transistor with a current gain of {beta} is fed {Ib} of base current and stays in its active region. What is its collector current?',
        Ib: 'A transistor with β = {beta} must carry {Ic} in its active region. How much base current does that take?'
      }
    },
    {
      name: 'The exponential law of the base–emitter junction',
      expr: 'Ic = Is*exp(Vbe/VT)', tex: 'I_C = I_S \\exp\\left(\\frac{V_{BE}}{V_T}\\right)',
      vars: {
        Ic: { name: 'collector current', q: 'current', unit: 'mA', tex: 'I_C' },
        Is: { name: 'saturation current (a device constant)', q: 'current', unit: 'A', value: 1e-14, tex: 'I_S' },
        Vbe: { name: 'base–emitter voltage', q: 'voltage', unit: 'V', value: 0.65, min: 0, max: 1.2, tex: 'V_{BE}' },
        VT: { name: 'thermal voltage kT/q', q: 'voltage', unit: 'mV', value: 25.85, tex: 'V_T' }
      },
      note: 'The Ebers–Moll forward law, valid in the active region. Solving for V_BE gives V_T ln(I_C/I_S): about 60 mV more per decade of current.',
      practice: { unknowns: ['Ic', 'Vbe'] },
      stories: { Vbe: 'A small transistor has I_S = {Is} and a thermal voltage of {VT}. What base–emitter voltage makes it carry {Ic}?' }
    },
    {
      name: 'Thermal voltage',
      expr: 'VT = kB*T/qe', tex: 'V_T = \\frac{k_B T}{e}',
      vars: {
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', tex: 'V_T' },
        kB: { const: 'kB' },
        T: { name: 'junction temperature', q: 'temperature', unit: 'K', value: 300, tex: 'T' },
        qe: { const: 'qe' }
      },
      note: '25.7 mV at 25 °C, 25.9 mV at 27 °C (300 K), 32 mV at 100 °C.'
    },
    {
      name: 'Transconductance',
      expr: 'gm = Ic/VT', tex: 'g_m = \\frac{I_C}{V_T}',
      vars: {
        gm: { name: 'transconductance', q: 'conductance', unit: 'mS', tex: 'g_m' },
        Ic: { name: 'collector current', q: 'current', unit: 'mA', value: 1, tex: 'I_C' },
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', value: 25.85, tex: 'V_T' }
      },
      note: 'How many milliamps of collector current change per millivolt at the base. It depends only on the collector current, not on the transistor type.',
      stories: { gm: 'A transistor is biased at {Ic}. What is its transconductance at room temperature ({VT})?' }
    }
  ],
  examples: [
    {
      title: 'Sixty millivolts per decade',
      q: 'A transistor carries 1.00 mA at $V_{BE} = 0.650$ V (300 K). What base–emitter voltage gives 10 mA? What current flows at 0.600 V?',
      steps: [
        'From $I_C = I_S e^{V_{BE}/V_T}$, the ratio of two currents is $I_2/I_1 = e^{(V_2 - V_1)/V_T}$, so $\\Delta V_{BE} = V_T \\ln(I_2/I_1)$.',
        'For a factor of ten: $\\Delta V_{BE} = 25.85\\ \\mathrm{mV} \\times \\ln 10 = 59.5\\ \\mathrm{mV}$, so $V_{BE} = 0.7095\\ \\mathrm{V}$.',
        'At 0.600 V the voltage is 50 mV lower: $I_C = 1\\ \\mathrm{mA} \\times e^{-50/25.85} = 1\\ \\mathrm{mA} \\times 0.145 = 0.145\\ \\mathrm{mA}$.',
        'So a 110 mV span of base voltage covers a 70-fold span of current — which is why a transistor must never be driven from a stiff voltage source without something to limit the current.'
      ],
      a: 'About 0.71 V for 10 mA; 0.145 mA at 0.600 V.'
    },
    {
      title: 'How much base current?',
      q: 'A BC547B (β between 200 and 450) must carry 20 mA in its active region. What range of base current might it need? And if you supplied a fixed 70 µA, what could the collector current be?',
      steps: [
        'With the largest β: $I_B = 20\\ \\mathrm{mA}/450 = 44\\ \\mu\\mathrm{A}$. With the smallest: $20\\ \\mathrm{mA}/200 = 100\\ \\mu\\mathrm{A}$.',
        'With a fixed $I_B = 70\\ \\mu\\mathrm{A}$, $I_C = \\beta I_B$ ranges from $200 \\times 70\\ \\mu\\mathrm{A} = 14\\ \\mathrm{mA}$ to $450 \\times 70\\ \\mu\\mathrm{A} = 31.5\\ \\mathrm{mA}$.',
        'A design that sets the base current and trusts β gets a collector current anywhere in a 2:1 range — the reason amplifiers are biased with feedback instead.'
      ],
      a: '44–100 µA; with 70 µA fixed, anywhere from 14 to 31.5 mA.'
    }
  ],
  quiz: [
    { q: 'Why can\'t you make a working transistor by connecting two separate diodes anode to anode?', choices: ['Their forward voltages differ', 'The carriers injected by one junction must cross a very thin base to reach the other; in separate diodes they recombine long before', 'Diodes cannot be reverse biased', 'It works, but only as a PNP'], a: 1,
      why: 'Transistor action needs the emitter\'s carriers to diffuse across the base before they recombine, which requires a base far thinner than their diffusion length. Two packaged diodes are just two diodes.' },
    { q: 'Raising $V_{BE}$ by 120 mV multiplies the collector current by about…', choices: ['2', '10', '100', '1000'], a: 2,
      why: 'About 60 mV per decade at room temperature, so 120 mV is two decades: a factor of 100.' },
    { q: 'In the active region the collector current depends strongly on the collector voltage.', a: false,
      why: 'Only weakly, through the Early effect. The collector current is set by the base–emitter junction; the reverse-biased collector just collects.' },
    { q: 'A transistor with β = 100 has a base current of 1.5 mA and is in its active region. What is its emitter current?', answer: 151.5, unit: 'mA',
      why: 'I_C = βI_B = 150 mA, and the emitter carries both: I_E = I_C + I_B = 151.5 mA.' },
    { q: 'At a collector current of 2 mA (room temperature) the transconductance is about…', choices: ['2 mS', '13 mS', '77 mS', '2 S'], a: 2,
      why: 'g_m = I_C/V_T = 2 mA / 25.85 mV = 77 mS, whatever the transistor type.' }
  ],
  applications: ['Switching LEDs, relays and small motors from logic outputs.', 'Audio and sensor amplifiers, and the input stages of many op-amps.', 'Temperature sensing: the −2 mV/°C drift of V_BE is used in thermometer chips and bandgap voltage references.', 'Current sources, current mirrors and the output stages of power amplifiers.'],
  history: 'John Bardeen and Walter Brattain demonstrated the point-contact transistor at Bell Labs in December 1947; William Shockley worked out the junction transistor, the direct ancestor of the BJT, early in 1948. The three shared the 1956 Nobel Prize in Physics.',
  sim: 'tr-bjt-curves'
},

{
  id: 'bjt-regions', parent: 'bjt', title: 'Cut-off, active and saturation', level: 1,
  short: 'A BJT works in one of three regions: off, amplifying with the collector current set by the base, or fully on with only a few tenths of a volt across it. The output characteristic and the load line show which.',
  keywords: ['cut-off', 'active region', 'saturation', 'output characteristic', 'load line', 'Q-point', 'operating point', 'Vce(sat)', 'Early effect', 'safe operating area', 'SOA', 'forced beta'],
  prereq: ['bjt-operation', 'resistance-ohms-law', 'math:linear-functions'],
  related: ['bjt-switch', 'common-emitter', 'bjt-biasing', 'heat-sinks'],
  body: `
Which region a transistor is in depends on the state of its two junctions:

| Region | Base–emitter | Base–collector | Behaviour |
|---|---|---|---|
| Cut-off | off, below about 0.5 V | reverse | no collector current except nanoamps of leakage: an open switch |
| Active | forward | reverse | $I_C = \\beta I_B$: a controlled current source — the amplifying region |
| Saturation | forward | forward | $V_{CE}$ collapses to 0.05–0.3 V and $I_C$ is set by the external circuit: a closed switch |

A fourth, the *reverse-active* region with collector and emitter swapped, works too, but with a β of only a few; you meet it only by mistake.

### The output characteristic
The standard picture plots collector current against collector–emitter voltage, one curve per base current. Each curve climbs steeply from the origin — that steep part is saturation — bends over at a few tenths of a volt, and then runs nearly flat: the active region, where $I_C \\approx \\beta I_B$ whatever $V_{CE}$ is. Cut-off is the strip along the horizontal axis.

The flat parts are not perfectly flat. As $V_{CE}$ rises, the base–collector depletion layer widens and eats into the base, fewer carriers are lost, and $I_C$ creeps up. This is the **Early effect**. Extended backwards, the sloping curves meet near $-V_A$, the Early voltage (50–150 V for small transistors), and the transistor's output resistance is $r_o = V_A/I_C$.

### The load line
A transistor never works alone. With a collector resistor $R_C$ to the supply, [[kirchhoffs-laws|Kirchhoff's voltage law]] ties it to the circuit:

$$V_{CE} = V_{CC} - I_C R_C$$

On the characteristic that is a straight line — the **load line** — from $V_{CE} = V_{CC}$ (no current) to $I_C = V_{CC}/R_C$ (transistor shorted). The transistor must be on its own curve for the base current *and* on the load line, so the operating point, the **Q-point**, is where they cross. More base current slides the Q-point up the line towards saturation; none drops it to cut-off.

- **A switch** uses the two ends of the line: cut-off and deep saturation. Both dissipate little, because either the current or the voltage is nearly zero.
- **An amplifier** uses the middle: a Q-point about half-way along, so the signal can swing both ways before it clips against saturation at one end or cut-off at the other.

### Saturation, and how to recognise it
The transistor saturates when the base current is more than the collector circuit can use: $\\beta I_B > (V_{CC} - V_{CE(sat)})/R_C$. The collector current is then set by the load, and the ratio $I_C/I_B$ — the **forced β** — is below the real β. Datasheets give $V_{CE(sat)}$ at a stated forced β, usually 10: for a 2N2222A, at most 0.3 V at 150 mA and 1 V at 500 mA.

### Limits: the safe operating area
Every point on the graph costs power $P = V_{CE} I_C$. The rated dissipation is a hyperbola on the characteristic (625 mW for a 2N2222A in its TO-92 package at 25 °C), and together with the maximum current and $V_{CEO}$ it bounds the **safe operating area**. A load line may cross the hyperbola briefly while switching; a Q-point must not sit beyond it.

> [!tip] Along any load line the power is largest half-way, at $V_{CE} = V_{CC}/2$, where it reaches $V_{CC}^2/4R_C$. If that is within the rating, no Q-point on the line can overheat the transistor.
`,
  ideas: [
    'Cut-off: no current. Active: I_C = βI_B. Saturation: V_CE of a few tenths of a volt and I_C set by the circuit.',
    'The load line V_CE = V_CC − I_C R_C joins V_CC on the voltage axis to V_CC/R_C on the current axis.',
    'The Q-point is where the transistor\'s curve meets the load line.',
    'Switches live at the two ends of the load line; amplifiers in the middle.',
    'In saturation the forced β, I_C/I_B, is well below the transistor\'s β.'
  ],
  pitfalls: [
    'Saturation in a BJT means the same as saturation in a MOSFET — The words are swapped: a saturated BJT is fully on (a closed switch), while a MOSFET in its saturation region is acting as a current source, like a BJT\'s active region.',
    'More base current always means more collector current — Only in the active region. Once saturated, the load sets the current and extra base current is wasted.',
    'A transistor rated 625 mW can sit anywhere below its maximum current and voltage — Current and voltage together must stay under the power hyperbola, derated as the air warms.'
  ],
  formulas: [
    {
      name: 'The load line',
      expr: 'Vce = Vcc - Ic*Rc', tex: 'V_{CE} = V_{CC} - I_C R_C',
      vars: {
        Vce: { name: 'collector–emitter voltage', q: 'voltage', unit: 'V', tex: 'V_{CE}' },
        Vcc: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{CC}' },
        Ic: { name: 'collector current', q: 'current', unit: 'mA', value: 5, tex: 'I_C' },
        Rc: { name: 'collector resistor', q: 'resistance', unit: 'kΩ', value: 1.2, tex: 'R_C' }
      },
      stories: {
        Vce: 'A transistor with a {Rc} collector resistor on a {Vcc} supply carries {Ic}. What is its collector–emitter voltage?',
        Rc: 'You want a transistor carrying {Ic} to sit at {Vce} on a {Vcc} supply. What collector resistor do you need?'
      }
    },
    {
      name: 'Base current at the edge of saturation',
      expr: 'Ib = (Vcc - Vcesat)/(beta*Rc)', tex: 'I_{B} = \\frac{V_{CC} - V_{CE(sat)}}{\\beta R_C}',
      vars: {
        Ib: { name: 'base current that just saturates it', q: 'current', unit: 'µA', tex: 'I_{B}' },
        Vcc: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{CC}' },
        Vcesat: { name: 'saturation voltage', q: 'voltage', unit: 'V', value: 0.2, tex: 'V_{CE(sat)}' },
        beta: { name: 'current gain', value: 150, tex: '\\beta' },
        Rc: { name: 'collector resistor', q: 'resistance', unit: 'kΩ', value: 1.2, tex: 'R_C' }
      },
      note: 'Any more base current than this and the transistor saturates. A switch is designed with several times more.'
    },
    {
      name: 'Power dissipated in the transistor',
      expr: 'P = Vce*Ic', tex: 'P = V_{CE}\\,I_C',
      vars: {
        P: { name: 'power dissipated', q: 'power', unit: 'mW' },
        Vce: { name: 'collector–emitter voltage', q: 'voltage', unit: 'V', value: 6, tex: 'V_{CE}' },
        Ic: { name: 'collector current', q: 'current', unit: 'mA', value: 5, tex: 'I_C' }
      },
      note: 'The base current adds V_BE·I_B, usually negligible except in saturated switches with a low forced β.'
    },
    {
      name: 'Output resistance from the Early effect',
      expr: 'ro = VA/Ic', tex: 'r_o = \\frac{V_A}{I_C}',
      vars: {
        ro: { name: 'output resistance', q: 'resistance', unit: 'kΩ', tex: 'r_o' },
        VA: { name: 'Early voltage', q: 'voltage', unit: 'V', value: 100, tex: 'V_A' },
        Ic: { name: 'collector current', q: 'current', unit: 'mA', value: 1, tex: 'I_C' }
      }
    }
  ],
  examples: [
    {
      title: 'Reading the load line',
      q: 'A transistor with β = 100 has $R_C = 1\\ \\mathrm{k\\Omega}$ to a 12 V supply. Find the Q-point for base currents of 50 µA and 200 µA.',
      steps: [
        'The load line runs from 12 V (no current) to $12\\ \\mathrm{V}/1\\ \\mathrm{k\\Omega} = 12\\ \\mathrm{mA}$ (transistor shorted).',
        '50 µA: assume active, $I_C = 100 \\times 50\\ \\mu\\mathrm{A} = 5\\ \\mathrm{mA}$, so $V_{CE} = 12 - 5 \\times 1 = 7\\ \\mathrm{V}$. Well above 0.2 V, so the assumption holds.',
        '200 µA: $\\beta I_B = 20\\ \\mathrm{mA}$ — more than the 12 mA the load line allows. The transistor saturates: $V_{CE} \\approx 0.2\\ \\mathrm{V}$ and $I_C = (12 - 0.2)/1\\ \\mathrm{k\\Omega} = 11.8\\ \\mathrm{mA}$.',
        'The forced β is $11.8\\ \\mathrm{mA}/0.2\\ \\mathrm{mA} = 59$, below the transistor\'s 100 — the signature of saturation.'
      ],
      a: '50 µA: active, 5 mA at 7 V. 200 µA: saturated, 11.8 mA at about 0.2 V.'
    },
    {
      title: 'Is the Q-point safe?',
      q: 'A 2N2222A in TO-92 (625 mW at 25 °C, derated by 5 mW/°C above that) sits at $V_{CE} = 10$ V, $I_C = 80$ mA. Is that allowed? What current is safe at 10 V in a 50 °C enclosure?',
      steps: [
        '$P = 10\\ \\mathrm{V} \\times 80\\ \\mathrm{mA} = 0.8\\ \\mathrm{W}$: above the 625 mW rating even at 25 °C.',
        'At 50 °C the allowance is $625 - 5 \\times (50 - 25) = 500\\ \\mathrm{mW}$.',
        'At 10 V that permits $500\\ \\mathrm{mW}/10\\ \\mathrm{V} = 50\\ \\mathrm{mA}$ — with no margin. Design for 30–40 mA, or use a larger package.'
      ],
      a: 'No: 0.8 W is too much. At 50 °C and 10 V, 50 mA is the absolute limit.'
    }
  ],
  quiz: [
    { q: 'The Q-point sits at $V_{CE} = V_{CC}$. The transistor is…', choices: ['saturated', 'cut off', 'in the middle of the active region', 'in breakdown'], a: 1,
      why: 'No voltage is dropped across R_C, so no collector current flows: the load line\'s end on the voltage axis is cut-off.' },
    { q: 'A transistor with β = 200 has $R_C = 2.2\\ \\mathrm{k\\Omega}$ to 5 V and a base current of 100 µA. It is…', choices: ['cut off', 'active, with I_C = 20 mA', 'saturated, with I_C ≈ 2.2 mA', 'destroyed'], a: 2,
      why: 'The load allows at most (5 − 0.2)/2.2 kΩ ≈ 2.2 mA, far below βI_B = 20 mA. The transistor saturates and the load sets the current.' },
    { q: 'In saturation, doubling the base current doubles the collector current.', a: false,
      why: 'In saturation the collector current is limited by the load; extra base current only drives it slightly deeper into saturation.' },
    { q: 'Doubling $R_C$ makes the load line…', choices: ['steeper, with the same V_CC end', 'shallower: its current-axis end halves while the V_CC end stays put', 'shift parallel to itself', 'unchanged'], a: 1,
      why: 'The ends are V_CC and V_CC/R_C. Doubling R_C halves the current intercept and pivots the line about V_CC.' },
    { q: 'Why does a transistor switch run cool even while carrying a large current?', choices: ['Because V_CE(sat) is small, so V_CE·I_C is small', 'Because β is high', 'Because the base current cools it', 'Because the load line avoids the safe operating area'], a: 0,
      why: 'Saturated, the transistor has only a few tenths of a volt across it, so the product V_CE·I_C stays small; off, no current flows at all.' }
  ],
  applications: ['Choosing a Q-point for maximum undistorted swing in an amplifier.', 'Checking that a switch really saturates at the worst-case β and temperature.', 'Verifying a power transistor against its safe operating area.', 'Reading a curve tracer or the "typical characteristics" graphs of a datasheet.'],
  sim: 'tr-bjt-curves'
},

{
  id: 'bjt-switch', parent: 'bjt', title: 'The BJT as a switch', level: 1,
  short: 'Drive enough base current to saturate the transistor and it connects a load to ground with only a fraction of a volt across it — the standard way to let a logic pin switch a relay, an LED string or a small motor.',
  keywords: ['transistor switch', 'low-side switch', 'base resistor', 'forced beta', 'saturation', 'relay driver', 'LED driver', 'flyback diode', 'GPIO', 'Vce(sat)', 'storage time', 'ULN2003', 'high-side switch'],
  prereq: ['bjt-regions', 'resistance-ohms-law', 'leds'],
  related: ['mosfet-switch', 'darlington', 'flyback-diode', 'relays', 'pull-resistors'],
  body: `
A microcontroller pin can supply perhaps 10–20 mA at 3.3 V or 5 V. A relay coil wants 30–80 mA at 12 V; a string of LEDs, a buzzer or a small solenoid wants more. A small NPN transistor bridges the gap. The pin drives the base through a resistor, the load hangs between the positive supply and the collector, and the emitter goes to ground. This **low-side switch** is the most built transistor circuit of all.

### The design, step by step
1. **Collector current** — from the load, not from the transistor: $I_C = (V_{CC} - V_\\text{load} - V_{CE(sat)})/R$. A 12 V relay with a 400 Ω coil takes 30 mA.
2. **Base current** — enough to saturate the worst transistor at the lowest temperature. The usual rule is a **forced β of 10 to 20**: $I_B = I_C/10$ gives a hard switch with the datasheet's $V_{CE(sat)}$; $I_C/20$ still works for most small transistors at moderate currents.
3. **Base resistor** — $R_B = (V_\\text{drive} - V_{BE})/I_B$, with $V_{BE}$ about 0.7–0.8 V in saturation. Round *down* to a standard value, so the base current rises rather than falls.
4. **The checks** — the pin must supply $I_B$; the transistor's current and $V_{CEO}$ ratings must exceed the load's; the dissipation $P \\approx V_{CE(sat)}I_C$ must suit the package.

### What makes it reliable
- **Inductive loads need a [[flyback-diode|flyback diode]].** A relay coil or motor keeps its current flowing when the transistor turns off. With nowhere to go, the collector voltage leaps far above the supply until the transistor breaks down — every single time it switches off. A diode across the load, cathode to the supply, gives the current a path: a 1N4148 for a small relay, a 1N4007 or a Schottky for larger coils.
- **A pull-down resistor** of 10–100 kΩ from base to emitter keeps the transistor off while the microcontroller boots and its pins float (see [[pull-resistors]]).
- **Saturation is slow to end.** A saturated transistor stores charge in its base, and turning it off takes the *storage time* — a couple of hundred nanoseconds for a 2N2222A, microseconds when it is heavily overdriven. Irrelevant for a relay, significant for fast PWM. A small speed-up capacitor across $R_B$, or a Schottky diode from base to collector (a Baker clamp) that stops it saturating deeply, cures it.
- **Know when to stop.** A 2N2222A is comfortable up to 300–500 mA, where $V_{CE(sat)}$ approaches 1 V and the base current needed grows awkward for a logic pin. For amperes, use a [[darlington|Darlington]] or, better, a [[mosfet-switch|logic-level MOSFET]].

### High-side switching
To switch the positive side of a load (so that its other end can stay grounded), use a PNP transistor with its emitter at the supply, turned on by pulling its base *down*. If the load supply is higher than the logic voltage, the logic pin cannot turn the PNP off: add a small NPN to pull the PNP's base down, and a resistor from the PNP's base to its emitter to turn it off.

> [!tip] ULN2003 and ULN2803 chips hold seven or eight Darlington low-side switches with base resistors and flyback diodes built in — the robust, lazy way to drive relays and unipolar stepper motors from logic.
`,
  ideas: [
    'Work out the collector current from the load, then give the base about a tenth of it (forced β ≈ 10).',
    'R_B = (V_drive − V_BE)/I_B; round down to the next standard value.',
    'A saturated switch dissipates only V_CE(sat)·I_C — milliwatts to a few hundred milliwatts.',
    'Every inductive load needs a flyback diode; every floating base needs a pull-down.',
    'Above a few hundred milliamps, a logic-level MOSFET is usually the better switch.'
  ],
  pitfalls: [
    'Choosing R_B from β = I_C/I_B with the typical β — The switch then fails with a low-β sample or in the cold. Design with a forced β of 10–20, well below the minimum β.',
    'A larger base resistor saves power, so bigger is better — Only down to the point where it still saturates. Beyond that V_CE rises to volts and the transistor dissipates far more than the base current saved.',
    'The flyback diode is optional for a small relay — Without it the collector is driven into avalanche breakdown at every turn-off. It may work for weeks before the transistor fails.'
  ],
  formulas: [
    {
      name: 'Base resistor for a saturated switch',
      expr: 'Rb = (Vin - Vbe)*bf/Ic', tex: 'R_B = \\frac{(V_{\\text{in}} - V_{BE})\\,\\beta_{\\text{f}}}{I_C}',
      vars: {
        Rb: { name: 'base resistor', q: 'resistance', unit: 'kΩ', tex: 'R_B' },
        Vin: { name: 'logic high voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{\\text{in}}' },
        Vbe: { name: 'base–emitter voltage in saturation', q: 'voltage', unit: 'V', value: 0.75, tex: 'V_{BE}' },
        bf: { name: 'forced β (design value, 10–20)', value: 10, tex: '\\beta_{\\text{f}}' },
        Ic: { name: 'collector (load) current', q: 'current', unit: 'mA', value: 30, tex: 'I_C' }
      },
      note: 'Round the result down to a standard value. Check that the pin can deliver the base current (V_in − V_BE)/R_B.',
      stories: { Rb: 'A {Vin} logic pin must switch a {Ic} relay through an NPN transistor with a forced β of {bf} (V_BE ≈ {Vbe}). What base resistor?' }
    },
    {
      name: 'Current through an LED switched by a transistor',
      expr: 'Ic = (Vcc - Vf - Vcesat)/R', tex: 'I_C = \\frac{V_{CC} - V_f - V_{CE(sat)}}{R}',
      vars: {
        Ic: { name: 'LED current', q: 'current', unit: 'mA', tex: 'I_C' },
        Vcc: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{CC}' },
        Vf: { name: 'LED forward voltage', q: 'voltage', unit: 'V', value: 2, tex: 'V_f' },
        Vcesat: { name: 'transistor saturation voltage', q: 'voltage', unit: 'V', value: 0.1, tex: 'V_{CE(sat)}' },
        R: { name: 'series resistor', q: 'resistance', unit: 'Ω', value: 150 }
      },
      stories: { R: 'An LED ({Vf}) is switched from a {Vcc} supply by a transistor with V_CE(sat) = {Vcesat}. What series resistor gives {Ic}?' }
    },
    {
      name: 'Dissipation in a saturated switch',
      expr: 'P = Vcesat*Ic + Vbe*Ib', tex: 'P = V_{CE(sat)}\\,I_C + V_{BE}\\,I_B',
      vars: {
        P: { name: 'power dissipated', q: 'power', unit: 'mW' },
        Vcesat: { name: 'saturation voltage', q: 'voltage', unit: 'V', value: 0.15, tex: 'V_{CE(sat)}' },
        Ic: { name: 'collector current', q: 'current', unit: 'mA', value: 100, tex: 'I_C' },
        Vbe: { name: 'base–emitter voltage', q: 'voltage', unit: 'V', value: 0.8, tex: 'V_{BE}' },
        Ib: { name: 'base current', q: 'current', unit: 'mA', value: 10, tex: 'I_B' }
      }
    }
  ],
  examples: [
    {
      title: 'A relay from a 3.3 V pin',
      q: 'A 12 V relay has a 400 Ω coil. Drive it from a 3.3 V microcontroller pin with a 2N2222A.',
      steps: [
        'Coil current: $12\\ \\mathrm{V}/400\\ \\Omega = 30\\ \\mathrm{mA}$ (the 0.1 V across the saturated transistor makes no practical difference).',
        'Forced β of 10: $I_B = 3\\ \\mathrm{mA}$.',
        '$R_B = (3.3 - 0.75)\\ \\mathrm{V}/3\\ \\mathrm{mA} = 850\\ \\Omega$; round down to 820 Ω, giving $I_B = 2.55/820 = 3.1\\ \\mathrm{mA}$ — easy for the pin.',
        'Fit a 1N4148 across the coil (cathode to +12 V) and a 47 kΩ pull-down from base to ground; the pull-down steals only $0.75/47\\ \\mathrm{k} = 16\\ \\mu\\mathrm{A}$.',
        'Dissipation: about $0.1\\ \\mathrm{V} \\times 30\\ \\mathrm{mA} = 3\\ \\mathrm{mW}$.'
      ],
      a: 'R_B = 820 Ω (3.1 mA of base current), a 1N4148 flyback diode and a 47 kΩ pull-down.'
    },
    {
      title: 'Too little base drive',
      q: 'A 12 V, 250 mA solenoid valve (48 Ω) is switched by a 2N2222A (β at least 100 at this current) with $R_B = 10\\ \\mathrm{k\\Omega}$ from a 5 V pin. What happens, and how do you fix it?',
      steps: [
        '$I_B = (5 - 0.7)/10\\ \\mathrm{k\\Omega} = 0.43\\ \\mathrm{mA}$, so even the minimum β allows only $100 \\times 0.43 = 43\\ \\mathrm{mA}$ — far short of 250 mA.',
        'The transistor stays in its active region: $V_{CE} = 12 - 0.043 \\times 48 = 9.9\\ \\mathrm{V}$, and it dissipates $9.9 \\times 0.043 = 0.43\\ \\mathrm{W}$ while the valve does not open.',
        'For a forced β of 20: $I_B = 12.5\\ \\mathrm{mA}$ and $R_B = (5 - 0.8)/12.5\\ \\mathrm{mA} = 336\\ \\Omega$; use 330 Ω (12.7 mA — within a typical pin\'s 20 mA). $V_{CE(sat)}$ is then about 0.3 V: 75 mW. Add a flyback diode across the coil.',
        'Or use a logic-level MOSFET and forget about base current altogether.'
      ],
      a: 'It sits half on (about 43 mA, 0.4 W of heat). Use R_B ≈ 330 Ω and a flyback diode, or a MOSFET.'
    }
  ],
  quiz: [
    { q: 'Why design a switch for a forced β of 10 when the transistor\'s β is 200?', choices: ['To make it switch faster', 'So that it saturates for every sample and temperature, with the datasheet\'s low V_CE(sat)', 'Because β drops to exactly 10 in saturation', 'To protect the microcontroller pin'], a: 1,
      why: 'The generous base current covers the spread in β, its fall at low temperature and high current, and gives the low V_CE(sat) the datasheet specifies at I_C/I_B = 10.' },
    { q: 'A relay driver without a flyback diode works at first and fails after some weeks. The most likely cause?', choices: ['The relay coil wore out', 'Collector–emitter breakdown from the inductive spike at every turn-off', 'The base resistor overheated', 'Too much base current'], a: 1,
      why: 'The coil current, suddenly interrupted, drives the collector up until the transistor avalanches. Each event damages it a little.' },
    { q: 'A saturated transistor carries 100 mA with $V_{CE} = 0.2$ V. Roughly what does it dissipate (ignore the base)?', answer: 20, unit: 'mW',
      why: 'P = V_CE·I_C = 0.2 V × 100 mA = 20 mW.' },
    { q: 'A larger base resistor always makes the switch more efficient, because less base current is wasted.', a: false,
      why: 'Once the base current falls below what saturation needs, V_CE rises to volts and the transistor dissipates far more than the few milliwatts of base drive saved.' },
    { q: 'The load is connected between +12 V and the collector; the logic pin is 3.3 V. With the transistor off, the collector sits at…', choices: ['0 V', '3.3 V', 'about 12 V', 'about 0.7 V'], a: 2,
      why: 'No current flows, so there is no drop across the load and the collector is pulled up to the supply. A logic input connected there would see 12 V — beware.' }
  ],
  applications: ['Relay and solenoid drivers on microcontroller boards.', 'LED indicators and small LED strings at more current than a pin can supply.', 'Buzzers, small fans and low-voltage lamps.', 'Level shifting: an open-collector transistor lets 3.3 V logic pull a 5 V or 12 V line low.'],
  sim: 'tr-bjt-switch'
},

{
  id: 'bjt-biasing', parent: 'bjt', title: 'Biasing a BJT amplifier', level: 2,
  short: 'Setting the steady collector current and voltage an amplifier works around — and making them independent of β and temperature with a voltage divider and an emitter resistor.',
  keywords: ['bias', 'biasing', 'Q-point', 'operating point', 'voltage divider bias', 'emitter degeneration', 'emitter resistor', 'thermal runaway', 'beta independence', 'stiff divider', 'collector feedback'],
  prereq: ['bjt-regions', 'voltage-divider', 'thevenin-norton'],
  related: ['common-emitter', 'emitter-follower', 'current-mirrors', 'negative-feedback'],
  body: `
An amplifier handles signals that swing both ways around a steady **operating point** (the Q-point): a quiescent collector current, typically 0.1–10 mA, and a collector voltage roughly half-way between its limits. Biasing means choosing resistors that put the Q-point there — and keep it there when β changes threefold from one transistor to the next and $V_{BE}$ drifts by 2 mV per °C.

### What does not work: base-current bias
The obvious circuit feeds the base from the supply through one resistor, so $I_B = (V_{CC} - V_{BE})/R_B$ and $I_C = \\beta I_B$. The collector current is then *proportional to β*, and swapping the transistor can push the Q-point from near cut-off to saturation. Worse, β rises with temperature: $I_C$ rises, the transistor warms, and in power stages that is the start of **thermal runaway**.

### What does: a divider plus an emitter resistor
Hold the **base voltage** fixed with a [[voltage-divider|divider]] — $R_1$ from the supply, $R_2$ to ground — and put a resistor $R_E$ in the emitter. The emitter sits one $V_{BE}$ below the base, so the emitter current is set by Ohm's law, not by β:

$$V_B \\approx V_{CC}\\,\\frac{R_2}{R_1 + R_2}, \\qquad I_C \\approx I_E = \\frac{V_B - V_{BE}}{R_E}$$

This is [[negative-feedback|negative feedback]]: if $I_C$ tries to rise, the drop across $R_E$ rises, $V_{BE}$ shrinks and pulls it back. The exact result uses the [[thevenin-norton|Thévenin equivalent]] of the divider — $V_{th}$ behind $R_{th} = R_1 \\parallel R_2$ — and shows the small dependence on β that remains:

$$I_E = \\frac{V_{th} - V_{BE}}{R_E + R_{th}/(\\beta + 1)}$$

As long as $R_{th}/(\\beta + 1) \\ll R_E$, β hardly matters.

### Rules of thumb
- **$V_E$ of 1–2 V**, or about a tenth of the supply. A 0.1 V change in $V_{BE}$ — 50 °C of warming — then moves the current by only 5–10 %.
- **A stiff divider**: its current at least ten times the base current, which is the same as $R_2 \\lesssim \\beta_\\text{min} R_E/10$.
- **$V_C$ midway** between about $V_E + 0.5$ V and $V_{CC}$, for the largest symmetrical swing.
- **Choose $I_C$ for the job**: more current gives lower noise from a low-impedance source and a faster transistor; less gives lower power and a higher input impedance.

Other schemes: **collector feedback** (a resistor from collector to base — simple, reasonably stable, and it also lowers the gain), **split supplies** with the base returned to ground through a resistor, and **current-mirror** bias inside integrated circuits (see [[current-mirrors]]).

> [!warn] Check the bias at the worst case, not on the bench. A Q-point that looks right at 20 °C may sit in saturation at 60 °C inside a box, or with the next batch of transistors. The emitter resistor is what saves you.
`,
  ideas: [
    'Bias sets the quiescent collector current and voltage that the signal swings around.',
    'Base-current bias makes I_C proportional to β — avoid it.',
    'With a divider and an emitter resistor, I_C ≈ (V_B − V_BE)/R_E, almost independent of β.',
    'Keep V_E at 1–2 V and the divider current ten times the base current.',
    'Put V_C half-way between saturation and the supply for the largest swing.'
  ],
  pitfalls: [
    'The collector current is set by β and the base resistor — Only in the poor base-current bias. In divider bias it is set by V_B and R_E, which is the point.',
    'Very large divider resistors save power with no drawback — A weak divider sags with the base current, and the Q-point then depends on β again.',
    'The DC operating point does not affect the signal — It sets r_e (and so the gain), the input impedance, the noise and how far the output can swing before clipping.'
  ],
  formulas: [
    {
      name: 'Base voltage from the divider (no load)',
      expr: 'Vth = Vcc*R2/(R1 + R2)', tex: 'V_{th} = V_{CC}\\,\\frac{R_2}{R_1 + R_2}',
      vars: {
        Vth: { name: 'Thévenin (unloaded) base voltage', q: 'voltage', unit: 'V', tex: 'V_{th}' },
        Vcc: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{CC}' },
        R1: { name: 'upper divider resistor', q: 'resistance', unit: 'kΩ', value: 100, tex: 'R_1' },
        R2: { name: 'lower divider resistor', q: 'resistance', unit: 'kΩ', value: 18, tex: 'R_2' }
      }
    },
    {
      name: 'Emitter current with divider bias',
      expr: 'Ie = (Vth - Vbe)/(Re + Rth/(beta + 1))', tex: 'I_E = \\frac{V_{th} - V_{BE}}{R_E + R_{th}/(\\beta + 1)}',
      vars: {
        Ie: { name: 'emitter current (≈ collector current)', q: 'current', unit: 'mA', tex: 'I_E' },
        Vth: { name: 'divider Thévenin voltage', q: 'voltage', unit: 'V', value: 1.831, tex: 'V_{th}' },
        Vbe: { name: 'base–emitter voltage', q: 'voltage', unit: 'V', value: 0.65, tex: 'V_{BE}' },
        Re: { name: 'emitter resistor', q: 'resistance', unit: 'kΩ', value: 1.2, tex: 'R_E' },
        Rth: { name: 'divider Thévenin resistance R₁ ∥ R₂', q: 'resistance', unit: 'kΩ', value: 15.25, tex: 'R_{th}' },
        beta: { name: 'current gain', value: 200, tex: '\\beta' }
      },
      note: 'Try β = 100 and β = 400: the current changes by only a few per cent when R_th/(β + 1) is much smaller than R_E.',
      practice: { unknowns: ['Ie', 'Re'] },
      stories: { Re: 'A divider biases a transistor with V_th = {Vth} behind R_th = {Rth} (β = {beta}, V_BE = {Vbe}). What emitter resistor sets {Ie}?' }
    },
    {
      name: 'Collector–emitter voltage at the Q-point',
      expr: 'Vce = Vcc - Ic*(Rc + Re)', tex: 'V_{CE} = V_{CC} - I_C\\,(R_C + R_E)',
      vars: {
        Vce: { name: 'collector–emitter voltage', q: 'voltage', unit: 'V', tex: 'V_{CE}' },
        Vcc: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{CC}' },
        Ic: { name: 'collector current', q: 'current', unit: 'mA', value: 0.926, tex: 'I_C' },
        Rc: { name: 'collector resistor', q: 'resistance', unit: 'kΩ', value: 5.6, tex: 'R_C' },
        Re: { name: 'emitter resistor', q: 'resistance', unit: 'kΩ', value: 1.2, tex: 'R_E' }
      },
      note: 'Treats I_E ≈ I_C, which is within 1 % for β above 100.'
    }
  ],
  examples: [
    {
      title: 'Biasing a BC547B at 1 mA from 12 V',
      q: 'Design divider bias for a BC547B (β 200–450, take 200 as the worst case) at $I_C \\approx 1$ mA from a 12 V supply, with the collector near the middle of its swing.',
      steps: [
        'Emitter voltage about a tenth of the supply: $V_E = 1.2$ V, so $R_E = 1.2\\ \\mathrm{V}/1\\ \\mathrm{mA} = 1.2\\ \\mathrm{k\\Omega}$. Then $V_B = 1.2 + 0.65 = 1.85$ V.',
        'Collector midway between $V_E$ and the supply: $V_C = (12 + 1.2)/2 = 6.6$ V, so $R_C = (12 - 6.6)/1\\ \\mathrm{mA} = 5.4\\ \\mathrm{k\\Omega}$ → 5.6 kΩ.',
        'Divider current about 100 µA, twenty times the 5 µA base current: $R_2 = 1.85\\ \\mathrm{V}/0.1\\ \\mathrm{mA} = 18.5\\ \\mathrm{k\\Omega}$ → 18 kΩ; $R_1 = (12 - 1.85)/0.1\\ \\mathrm{mA} = 101.5\\ \\mathrm{k\\Omega}$ → 100 kΩ.',
        { text: 'Check with the Thévenin equivalent: $V_{th} = 12 \\times 18/118 = 1.831$ V, $R_{th} = 100 \\parallel 18 = 15.25\\ \\mathrm{k\\Omega}$.', tex: 'I_E = \\frac{1.831 - 0.65}{1200 + 15250/201} = \\frac{1.181}{1276\\ \\Omega} = 0.926\\ \\mathrm{mA}' },
        'With β = 100 it would be 0.874 mA; with β = 400, 0.954 mA. A fourfold change of β moves the current by under 9 %. $V_C = 12 - 0.926 \\times 5.6 = 6.8$ V.'
      ],
      a: 'R₁ = 100 kΩ, R₂ = 18 kΩ, R_C = 5.6 kΩ, R_E = 1.2 kΩ: I_C ≈ 0.93 mA, V_C ≈ 6.8 V.'
    },
    {
      title: 'The same job with base-current bias',
      q: 'Bias the same transistor at 1 mA with a single base resistor from 12 V (and $R_C = 5.6$ kΩ, no emitter resistor). What happens when β is 100 or 400 instead of 200?',
      steps: [
        'For β = 200: $I_B = 5\\ \\mu\\mathrm{A}$, so $R_B = (12 - 0.65)/5\\ \\mu\\mathrm{A} = 2.27\\ \\mathrm{M\\Omega}$.',
        'β = 100: $I_C = 0.5$ mA and $V_C = 12 - 2.8 = 9.2$ V — the Q-point has moved far up.',
        'β = 400: $I_C = 2$ mA would need $V_C = 12 - 11.2 = 0.8$ V — the transistor is on the edge of saturation.',
        'The same parts give an amplifier that works, one with little headroom, and one that barely amplifies at all.'
      ],
      a: 'I_C swings from 0.5 to 2 mA with β — unusable. Divider bias held it within ±5 %.'
    }
  ],
  quiz: [
    { q: 'With divider bias and an emitter resistor, the collector current is set mainly by…', choices: ['β and the base resistor', 'the base voltage minus V_BE, divided by R_E', 'the collector resistor', 'the supply voltage alone'], a: 1,
      why: 'The emitter follows the base 0.65 V lower, and R_E turns that voltage into a current. β only enters through the small R_th/(β + 1) term.' },
    { q: 'You double $R_E$ and leave everything else unchanged. The collector current…', choices: ['roughly halves', 'doubles', 'is unchanged', 'drops to zero'], a: 0,
      why: 'I ≈ (V_B − V_BE)/R_E, so doubling R_E roughly halves it.' },
    { q: 'Making the divider resistors very large saves power without any drawback.', a: false,
      why: 'A high-resistance divider is loaded by the base current, so V_B — and the Q-point — start to depend on β again.' },
    { q: 'Why keep $V_E$ at a volt or more rather than 0.1 V?', choices: ['To raise the gain', 'So that the drift of V_BE with temperature is a small fraction of V_E', 'To protect the base', 'To reduce noise'], a: 1,
      why: 'V_BE falls about 2 mV/°C. With V_E = 1.2 V a 0.1 V drift changes I_E by 8 %; with V_E = 0.1 V it would double it.' },
    { q: 'A divider holds the base at 2.4 V, $R_E = 1.5$ kΩ and $V_{BE} = 0.65$ V. What is the collector current (ignore base current)?', answer: 1.17, unit: 'mA',
      why: 'I_E = (2.4 − 0.65)/1.5 kΩ = 1.17 mA, and I_C ≈ I_E.' }
  ],
  applications: ['Every discrete transistor amplifier: microphone preamplifiers, RF stages, sensor front ends.', 'Setting the idle current of power output stages (with a V_BE multiplier).', 'Temperature-stable current sources built from one transistor and an emitter resistor.'],
  sim: 'tr-ce-amp'
},

{
  id: 'common-emitter', parent: 'bjt', title: 'The common-emitter amplifier', level: 2,
  short: 'The classic single-transistor voltage amplifier: the input drives the base, the output is taken from the collector, inverted and magnified by roughly R_C/R_E.',
  keywords: ['common emitter', 'CE amplifier', 'voltage gain', 'emitter degeneration', 'bypass capacitor', 'small-signal model', 're', 'transconductance', 'input impedance', 'coupling capacitor', 'clipping', 'Miller effect', 'inverting amplifier'],
  prereq: ['bjt-biasing', 'bjt-operation', 'rc-high-pass'],
  related: ['emitter-follower', 'differential-pair', 'negative-feedback', 'decibels', 'bode-plots'],
  body: `
Bias a transistor in the middle of its active region, add a small signal to its base voltage, and the emitter current follows the signal. The same current flows through the collector resistor, so the collector voltage moves too — by much more than the base did, and in the opposite direction: more base voltage, more current, more drop across $R_C$, a lower collector. The common-emitter stage **amplifies and inverts**.

### The gain
For small signals the transistor behaves like a tiny resistance in its emitter, $r_e = V_T/I_C$ (26 Ω at 1 mA), in series with whatever lies between emitter and ground. A small change $v_\\text{in}$ at the base drives an emitter current $v_\\text{in}/(r_e + R_E)$, and the same current through $R_C$ gives

$$A_v = \\frac{v_\\text{out}}{v_\\text{in}} = -\\frac{R_C}{r_e + R_E} \\approx -\\frac{R_C}{R_E}\\quad (R_E \\gg r_e)$$

The approximation is the thing to remember: **the gain is a ratio of two resistors**, independent of β and nearly independent of temperature. The price is that it is modest — with the $R_E$ that stable [[bjt-biasing|bias]] needs, often only 3–10.

### More gain: bypassing the emitter
Put a large capacitor $C_E$ across all or part of $R_E$. At DC it is open, so the bias is untouched; at signal frequencies it shorts the bypassed part, and the gain rises towards

$$A_v = -\\frac{R_C}{r_e} = -g_m R_C$$

— about −200 for 5.6 kΩ at 1 mA. But $r_e$ depends on the instantaneous current, so a large swing sees a different gain on its two halves: the output comes out lopsided, distorted. The usual compromise **splits** $R_E$: a small unbypassed part sets a predictable gain; the rest, bypassed, sets the bias. The bypass capacitor must be large: its reactance has to stay small compared with $r_e$ plus the unbypassed part down to the lowest frequency of interest.

### Input, output and bandwidth
- **Input impedance**: the divider in parallel with what the base presents, $R_\\text{in} = R_1 \\parallel R_2 \\parallel (\\beta + 1)(r_e + R_E)$ — typically a few kilohms to a few tens of kilohms.
- **Output impedance**: about $R_C$. A load $R_L$ appears in parallel with $R_C$ and lowers the gain; follow the stage with an [[emitter-follower]] to drive low impedances.
- **Coupling capacitors** block the DC between stages and form [[rc-high-pass|high-pass filters]] with the input and load resistances: $f_c = 1/(2\\pi R_\\text{in} C_\\text{in})$ must sit well below the lowest frequency you care about.
- **The high-frequency limit** comes from the small collector–base capacitance, which the stage's own gain multiplies — the **Miller effect**. A 4 pF capacitance in a stage with a gain of 100 loads the input like 400 pF.

### Clipping
The collector can only move between the supply (transistor cut off) and a few tenths of a volt above the emitter (saturated). A Q-point too near either end, or too big a signal, flattens one side of the output. At high gain the exponential law itself shows: the output's two halves differ in size long before either clips. The simulation shows all three.

> [!tip] Design order: choose $I_C$ and the bias network, set the gain with the unbypassed emitter resistance, then choose the capacitors from the lowest frequency you need.
`,
  ideas: [
    'The output is inverted: more base voltage means a lower collector voltage.',
    'The gain is −R_C/(r_e + R_E) ≈ −R_C/R_E: a resistor ratio, independent of β.',
    'r_e = V_T/I_C: 26 Ω at 1 mA.',
    'Bypassing R_E raises the gain towards −g_m R_C, at the price of distortion.',
    'Input impedance R₁∥R₂∥(β+1)(r_e+R_E); output impedance ≈ R_C.'
  ],
  pitfalls: [
    'The gain is β — β is a current gain; the voltage gain is set by R_C and the emitter resistance, and for the fully bypassed stage by g_m R_C.',
    'Bypassing the emitter completely is free gain — It makes the gain depend on the signal level, so large signals are distorted, and the gain drifts with temperature and bias.',
    'A load does not change the gain — Any load appears in parallel with R_C: a load equal to R_C halves the gain.'
  ],
  formulas: [
    {
      name: 'Voltage gain of a common-emitter stage',
      expr: 'Av = -Rc/(re + Re)', tex: 'A_v = -\\frac{R_C}{r_e + R_E}',
      vars: {
        Av: { name: 'voltage gain', signed: true, tex: 'A_v' },
        Rc: { name: 'collector resistor (in parallel with any load)', q: 'resistance', unit: 'kΩ', value: 5.6, tex: 'R_C' },
        re: { name: 'intrinsic emitter resistance V_T/I_C', q: 'resistance', unit: 'Ω', value: 26, tex: 'r_e' },
        Re: { name: 'unbypassed emitter resistance', q: 'resistance', unit: 'Ω', value: 220, tex: 'R_E' }
      },
      note: 'Mid-band gain, where the coupling and bypass capacitors are effectively short circuits. The minus sign is the inversion.',
      stories: { Re: 'A common-emitter stage has R_C = {Rc} and r_e = {re}. What unbypassed emitter resistance gives a gain of {Av}?' }
    },
    {
      name: 'Intrinsic emitter resistance',
      expr: 're = VT/Ic', tex: 'r_e = \\frac{V_T}{I_C}',
      vars: {
        re: { name: 'intrinsic emitter resistance', q: 'resistance', unit: 'Ω', tex: 'r_e' },
        VT: { name: 'thermal voltage', q: 'voltage', unit: 'mV', value: 25.85, tex: 'V_T' },
        Ic: { name: 'collector current', q: 'current', unit: 'mA', value: 1, tex: 'I_C' }
      },
      note: 'The reciprocal of the transconductance g_m.'
    },
    {
      name: 'Input resistance at the base',
      expr: 'Rb = (beta + 1)*(re + Re)', tex: 'R_{b} = (\\beta + 1)(r_e + R_E)',
      vars: {
        Rb: { name: 'resistance looking into the base', q: 'resistance', unit: 'kΩ', tex: 'R_{b}' },
        beta: { name: 'current gain', value: 200, tex: '\\beta' },
        re: { name: 'intrinsic emitter resistance', q: 'resistance', unit: 'Ω', value: 28.4, tex: 'r_e' },
        Re: { name: 'unbypassed emitter resistance', q: 'resistance', unit: 'Ω', value: 220, tex: 'R_E' }
      },
      note: 'The stage\'s input resistance is this in parallel with the bias divider R₁ ∥ R₂.'
    },
    {
      name: 'Low-frequency corner of a coupling capacitor',
      expr: 'fc = 1/(2*pi*Rin*C)', tex: 'f_c = \\frac{1}{2\\pi R_{\\text{in}} C}',
      vars: {
        fc: { name: 'corner (−3 dB) frequency', q: 'frequency', unit: 'Hz', tex: 'f_c' },
        Rin: { name: 'resistance the capacitor feeds', q: 'resistance', unit: 'kΩ', value: 11.7, tex: 'R_{\\text{in}}' },
        C: { name: 'coupling capacitor', q: 'capacitance', unit: 'µF', value: 1 }
      },
      stories: { C: 'An amplifier stage has an input resistance of {Rin}. What coupling capacitor puts the −3 dB corner at {fc}?' }
    }
  ],
  examples: [
    {
      title: 'Gain, input resistance and headroom',
      q: 'The stage biased on the previous page (12 V, $R_1$ = 100 kΩ, $R_2$ = 18 kΩ, $R_C$ = 5.6 kΩ) has its emitter resistance split into 220 Ω unbypassed and 1 kΩ bypassed, giving $I_C \\approx 0.91$ mA, β = 200. Find the gain, the input resistance, a coupling capacitor for 20 Hz, and the largest undistorted output.',
      steps: [
        '$r_e = 25.85\\ \\mathrm{mV}/0.91\\ \\mathrm{mA} = 28.4\\ \\Omega$.',
        { text: 'Gain, with the 1 kΩ bypassed:', tex: 'A_v = -\\frac{5600}{28.4 + 220} = -22.5' },
        'Input resistance: $(\\beta + 1)(r_e + R_E) = 201 \\times 248 = 49.9\\ \\mathrm{k\\Omega}$, in parallel with $100 \\parallel 18 = 15.25\\ \\mathrm{k\\Omega}$: $R_\\text{in} = 11.7\\ \\mathrm{k\\Omega}$.',
        'Coupling capacitor: $C = 1/(2\\pi \\times 11.7\\ \\mathrm{k\\Omega} \\times 20\\ \\mathrm{Hz}) = 0.68\\ \\mu\\mathrm{F}$; use 1 µF.',
        'Headroom: $V_C \\approx 6.9$ V and $V_E \\approx 1.1$ V. Downwards the collector can fall to about 1.4 V (5.5 V of swing), upwards to 12 V (5.1 V). So about ±5 V peak out, i.e. ±0.22 V in.'
      ],
      a: 'A_v ≈ −22.5, R_in ≈ 11.7 kΩ, C_in = 1 µF, about ±5 V of undistorted output.'
    }
  ],
  quiz: [
    { q: 'A CE stage has $R_C = 10$ kΩ and an unbypassed $R_E = 1$ kΩ at $I_C = 1$ mA. Its voltage gain is about…', choices: ['+10', '−10', '−385', '−0.1'], a: 1,
      why: '−R_C/(r_e + R_E) = −10 000/1026 ≈ −9.7. −385 would be the gain with R_E fully bypassed (g_m R_C).' },
    { q: 'Bypassing the whole emitter resistor with a large capacitor…', choices: ['changes the DC bias point', 'raises the gain to about −g_m R_C but makes it depend on the signal level (distortion)', 'lowers the gain', 'makes the amplifier non-inverting'], a: 1,
      why: 'The capacitor only acts on AC, so the bias is unchanged; the gain is then set by r_e, which varies with the instantaneous current.' },
    { q: 'The output of a common-emitter amplifier is in phase with its input.', a: false,
      why: 'It is inverted: when the base rises, more current flows and the collector falls.' },
    { q: 'Connecting a 10 kΩ load to the output of a stage with $R_C = 10$ kΩ…', choices: ['changes nothing', 'halves the gain', 'doubles the gain', 'makes the gain zero'], a: 1,
      why: 'The load is in parallel with R_C: 10 kΩ ∥ 10 kΩ = 5 kΩ, so the gain halves.' },
    { q: 'An amplifier input resistance is 10 kΩ. What coupling capacitor gives a −3 dB corner at 20 Hz?', answer: 0.8, unit: 'µF',
      why: 'C = 1/(2π × 10 kΩ × 20 Hz) = 0.80 µF. In practice you would fit 1 µF for margin.' }
  ],
  applications: ['Microphone and sensor preamplifiers.', 'RF and IF gain stages in radios.', 'The voltage-gain stage inside many op-amps and audio power amplifiers.', 'Inverting level shifters and simple comparators.'],
  sim: 'tr-ce-amp'
},

{
  id: 'emitter-follower', parent: 'bjt', title: 'The emitter follower', level: 2,
  short: 'Take the output from the emitter and the transistor copies the input voltage, 0.65 V lower, while delivering β times more current: a buffer with a high input and a low output impedance.',
  keywords: ['emitter follower', 'common collector', 'buffer', 'voltage follower', 'output impedance', 'input impedance', 'unity gain', 'pass transistor', 'Zener regulator', 'base stopper', 'impedance conversion'],
  prereq: ['bjt-operation', 'bjt-biasing', 'thevenin-norton'],
  related: ['common-emitter', 'push-pull', 'darlington', 'zener-regulator', 'voltage-follower'],
  body: `
Connect the collector straight to the supply, put the load in the emitter, and drive the base. The emitter sits one diode drop below the base and follows every move it makes — hence **emitter follower**, or **common-collector** amplifier, since the collector is common to input and output at signal frequencies. The voltage gain is just under 1, but the current gain is β + 1: the source supplies only the small base current, while the load current comes from the supply through the collector.

### Gain and impedances
With $r_e = V_T/I_E$ and an emitter resistance $R_E$ (including any external load in parallel):

$$A_v = \\frac{R_E}{r_e + R_E} \\approx 1, \\qquad R_\\text{in} = (\\beta + 1)(r_e + R_E), \\qquad R_\\text{out} = r_e + \\frac{R_S}{\\beta + 1}$$

Seen from the input, every resistance in the emitter is **multiplied** by β + 1; seen from the output, the resistance $R_S$ of whatever drives the base is **divided** by β + 1. That is the whole point: a 10 kΩ source followed by a transistor with β = 100 becomes a source of about 100 Ω. The follower is an **impedance converter**, which is why it appears after high-impedance stages, after [[voltage-divider|dividers]] and references, and in the output stage of almost every amplifier.

### Uses
- **Buffer**: drive a cable, a low-impedance load or an ADC input from a weak source without loading it.
- **Simple regulator**: a Zener holds the base at $V_Z$, and the emitter delivers $V_Z - 0.65$ V at amperes while the Zener carries only milliamps — the ancestor of every [[linear-regulators|linear regulator]].
- **Push-pull outputs**: an NPN follower for the positive half and a PNP follower for the negative half make the classic [[push-pull]] stage.

### Limitations
- **The 0.65 V offset**, and its −2 mV/°C drift. An op-amp [[voltage-follower]] removes both by putting the transistor inside a feedback loop.
- **It sources strongly but sinks only through $R_E$.** When the input falls faster than $R_E$ can discharge the load's capacitance, the transistor cuts off and the output lags behind. With a resistive load to ground, the most negative load current is limited by $R_E$ and the negative supply. Push-pull fixes this asymmetry.
- **Headroom**: the output cannot rise above about $V_{CC} - 0.7$ V, less whatever drop the base drive needs.
- **It can oscillate** at tens of megahertz with capacitive loads or long leads to the base. A **base stopper** of 47–220 Ω in series with the base, right at the transistor, is the standard cure.

> [!key] A follower gives you current, not voltage. Use a common-emitter stage when you need gain, and a follower after it when you need to drive something.

The simulation on the [[common-emitter]] page shows the emitter of that stage tracking its base: every common-emitter amplifier has a follower hidden inside it.
`,
  ideas: [
    'The emitter follows the base about 0.65 V lower: voltage gain just below 1.',
    'Resistance in the emitter looks β + 1 times larger from the base.',
    'Source resistance at the base looks β + 1 times smaller from the emitter.',
    'Followers buffer weak sources, make simple regulators, and form push-pull output stages.',
    'A single follower sources current well but sinks it only through its emitter resistor.'
  ],
  pitfalls: [
    'A follower is useless because it has no voltage gain — Its value is current gain and impedance conversion: it lets a weak source drive a heavy load.',
    'The output can reach the supply — It stops about 0.7 V short (more with a resistor feeding the base), and 0.65 V below the input at all times.',
    'A follower driving a capacitor falls as fast as it rises — Falling edges are limited by R_E discharging the capacitance, because the transistor cannot pull down.'
  ],
  formulas: [
    {
      name: 'Voltage gain of an emitter follower',
      expr: 'Av = Re/(re + Re)', tex: 'A_v = \\frac{R_E}{r_e + R_E}',
      vars: {
        Av: { name: 'voltage gain', tex: 'A_v' },
        Re: { name: 'total emitter resistance (with the load)', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_E' },
        re: { name: 'intrinsic emitter resistance V_T/I_E', q: 'resistance', unit: 'Ω', value: 26, tex: 'r_e' }
      }
    },
    {
      name: 'Input resistance of a follower',
      expr: 'Rin = (beta + 1)*(re + Re)', tex: 'R_{\\text{in}} = (\\beta + 1)(r_e + R_E)',
      vars: {
        Rin: { name: 'input resistance at the base', q: 'resistance', unit: 'kΩ', tex: 'R_{\\text{in}}' },
        beta: { name: 'current gain', value: 100, tex: '\\beta' },
        re: { name: 'intrinsic emitter resistance', q: 'resistance', unit: 'Ω', value: 26, tex: 'r_e' },
        Re: { name: 'emitter resistance (with the load)', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_E' }
      },
      note: 'Any bias resistors at the base appear in parallel with this.'
    },
    {
      name: 'Output resistance of a follower',
      expr: 'Rout = re + Rs/(beta + 1)', tex: 'R_{\\text{out}} = r_e + \\frac{R_S}{\\beta + 1}',
      vars: {
        Rout: { name: 'output resistance at the emitter', q: 'resistance', unit: 'Ω', tex: 'R_{\\text{out}}' },
        re: { name: 'intrinsic emitter resistance', q: 'resistance', unit: 'Ω', value: 2.6, tex: 'r_e' },
        Rs: { name: 'resistance of the source driving the base', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_S' },
        beta: { name: 'current gain', value: 100, tex: '\\beta' }
      },
      stories: { Rout: 'A {Rs} source drives an emitter follower with β = {beta} running at a current where r_e = {re}. What output resistance does the combination present?' }
    }
  ],
  examples: [
    {
      title: 'A Zener and a transistor make a regulator',
      q: 'Make about 5.5 V at up to 0.5 A from a 12 V supply with a 6.2 V Zener (needs at least 5 mA) and a BD139 (β at least 40 at 0.5 A). Size the Zener\'s feed resistor and find the dissipations.',
      steps: [
        'Output: $6.2 - 0.75 \\approx 5.45$ V ($V_{BE}$ is larger at 0.5 A than at a milliamp).',
        'Worst-case base current at full load: $0.5\\ \\mathrm{A}/(40 + 1) = 12.2\\ \\mathrm{mA}$.',
        'The resistor must feed that plus the Zener\'s 5 mA: $R \\le (12 - 6.2)\\ \\mathrm{V}/17.2\\ \\mathrm{mA} = 337\\ \\Omega$ → 330 Ω (17.6 mA).',
        'Transistor: $(12 - 5.45) \\times 0.5 = 3.3\\ \\mathrm{W}$ — it needs a heat sink. Zener with no load (all 17.6 mA): $6.2 \\times 17.6\\ \\mathrm{mA} = 0.11\\ \\mathrm{W}$. Resistor: $5.8 \\times 17.6\\ \\mathrm{mA} = 0.10\\ \\mathrm{W}$.',
        'The Zener sees only milliamps of variation while the load changes by half an ampere — the follower\'s current gain at work.'
      ],
      a: 'A 330 Ω feed resistor; about 5.45 V out; 3.3 W in the transistor (heat sink needed), 0.11 W in the Zener.'
    },
    {
      title: 'Buffering a divider for an ADC',
      q: 'A 10 kΩ / 10 kΩ divider ($R_{th}$ = 5 kΩ) must drive an ADC that wants a low source impedance. A BC547 follower (β ≥ 200) runs at 1 mA. What source resistance does the ADC now see?',
      steps: [
        '$r_e = 25.85\\ \\mathrm{mV}/1\\ \\mathrm{mA} = 25.9\\ \\Omega$.',
        '$R_\\text{out} = 25.9 + 5000/201 = 25.9 + 24.9 = 51\\ \\Omega$.',
        'A hundred times lower than the divider on its own — at the cost of a 0.65 V offset that drifts with temperature, which a software calibration or an op-amp follower removes.'
      ],
      a: 'About 51 Ω, instead of 5 kΩ.'
    }
  ],
  quiz: [
    { q: 'The voltage gain of an emitter follower is…', choices: ['about −R_C/R_E', 'slightly less than +1', 'about β', 'exactly 0.65'], a: 1,
      why: 'The emitter follows the base with a constant offset, so small changes pass through almost unchanged: A_v = R_E/(r_e + R_E), just under 1 and not inverted.' },
    { q: 'A follower with β = 150 has 1 kΩ in its emitter. Looking into the base you see roughly…', choices: ['1 kΩ', '6.7 Ω', '151 kΩ', '150 Ω'], a: 2,
      why: 'Resistance in the emitter is multiplied by β + 1: 151 × 1 kΩ ≈ 151 kΩ (plus a little for r_e).' },
    { q: 'An emitter follower is useless because it has no voltage gain.', a: false,
      why: 'It has current gain and converts a high source impedance into a low one — exactly what a buffer, a regulator pass transistor or an output stage needs.' },
    { q: 'An NPN follower with $R_E = 1$ kΩ to −5 V drives a 10 nF load. Its falling edges are…', choices: ['as sharp as its rising edges', 'slower, limited by R_E discharging the capacitor', 'inverted', 'amplified'], a: 1,
      why: 'The transistor can only push current into the load. On a falling input it cuts off and the capacitor discharges through R_E: τ = 10 µs here.' },
    { q: 'A 4.7 kΩ source drives a follower with β = 100 at $I_E = 5$ mA. What is its output resistance?', answer: 51.7, unit: 'Ω',
      why: 'r_e = 25.85 mV/5 mA = 5.2 Ω; R_S/(β + 1) = 4700/101 = 46.5 Ω; total 51.7 Ω.' }
  ],
  applications: ['Buffers after dividers, references and high-impedance sensors.', 'Pass transistors in simple and classic linear regulators.', 'Output stages of op-amps and audio amplifiers.', 'Cable and LED drivers from weak sources.'],
  sim: { id: 'tr-ce-amp', params: { view: 'follower' } }
},

{
  id: 'darlington', parent: 'bjt', title: 'Darlington pairs', level: 2,
  short: 'Two transistors, the first feeding its emitter current into the base of the second, act as one transistor with a current gain in the thousands — at the cost of a larger base voltage and a saturation voltage that never drops much below 0.7 V.',
  keywords: ['Darlington', 'Darlington pair', 'super beta', 'TIP120', 'TIP122', 'ULN2003', 'ULN2803', 'Sziklai pair', 'complementary feedback pair', 'high-gain transistor', 'relay driver array'],
  prereq: ['bjt-switch', 'emitter-follower'],
  related: ['mosfet-switch', 'push-pull', 'heat-sinks'],
  body: `
Sometimes one transistor's β is not enough. A 3 A motor switched by a power transistor with β = 50 needs 60 mA of base current — more than a logic pin can give. Put a second transistor in front: its emitter feeds the base of the output transistor, and the two collectors are tied together. The first transistor multiplies the input current, the second multiplies that:

$$\\beta_\\text{total} = \\beta_1\\beta_2 + \\beta_1 + \\beta_2 \\approx \\beta_1\\beta_2$$

Transistors with β of 50 and 100 make 5150: 3 A for under a milliamp of input.

### What you pay
- **Two base–emitter drops in series.** The input must sit about 1.2–1.5 V above the emitter to turn the pair on — more at high current (the TIP120's datasheet allows up to 2.5 V at 3 A).
- **It cannot saturate fully.** The output transistor's collector can never fall below the driver's saturation voltage plus the output transistor's own $V_{BE}$: $V_{CE(sat)} \\ge V_{CE(sat)1} + V_{BE2} \\approx 0.7$–0.9 V, and in practice 1–2 V at amperes. At 3 A that is 3–6 W of heat a MOSFET would not produce.
- **Slow turn-off.** When the input is removed, the output transistor's stored base charge has no fast way out, because the driver cannot pull the base down. Integrated Darlingtons such as the TIP120 add resistors from each base to its emitter (about 8 kΩ and 120 Ω) to drain it.
- **Leakage multiplies**: the first transistor's leakage is amplified by the second.

### Where Darlingtons still win
- **ULN2003 and ULN2803 arrays**: seven or eight Darlingtons with input resistors and flyback diodes, around 500 mA per channel, driven directly by 3.3 V or 5 V logic. The standard relay and unipolar-stepper driver.
- **Followers** that need a very high input impedance, and power-amplifier output stages.
- **Awkward gate drive**: a Darlington turns on from a small current at any drive above about 1.4 V, whereas a standard MOSFET wants 10 V on its gate.

### The Sziklai pair
A PNP driver with an NPN output (or the reverse) — the **complementary feedback pair** — also gives about $\\beta_1\\beta_2$, but has only **one** $V_{BE}$ at its input and behaves like a single transistor of the driver's polarity. It turns up in audio output stages, where its better thermal behaviour matters.

> [!tip] For switching more than a few hundred milliamps from logic, compare a Darlington's $V_{CE(sat)} \\times I$ with a [[mosfet-switch|logic-level MOSFET's]] $I^2R_{DS(on)}$. At 3 A: a TIP120 dissipates about 2 V × 3 A = 6 W; an IRLZ44N about $3^2 \\times 0.025 = 0.23$ W.

The name comes from Sidney Darlington of Bell Labs, who patented the connection in 1953.
`,
  ideas: [
    'Two cascaded transistors multiply their gains: β ≈ β₁β₂, in the thousands.',
    'The input needs two V_BE drops, about 1.2–1.5 V.',
    'V_CE(sat) cannot fall below about 0.7–0.9 V, so a Darlington switch runs warmer than a single transistor or a MOSFET.',
    'Integrated Darlingtons include base–emitter resistors to speed up turn-off.',
    'ULN2003/ULN2803 arrays are the classic logic-to-relay driver.'
  ],
  pitfalls: [
    'A Darlington saturates to 0.1 V like a small transistor — Its output transistor\'s V_CE can never drop below its own V_BE plus the driver\'s V_CE(sat); expect 1–2 V at amperes.',
    'With a huge β, the base drive no longer matters — The input still needs about 1.4 V or more, and a flyback diode is still essential for inductive loads.',
    'The headline power rating means it will stay cool — "65 W" assumes an ideal heat sink; in free air a TO-220 part manages about 2 W.'
  ],
  formulas: [
    {
      name: 'Current gain of a Darlington pair',
      expr: 'beta = b1*b2 + b1 + b2', tex: '\\beta = \\beta_1\\beta_2 + \\beta_1 + \\beta_2',
      vars: {
        beta: { name: 'overall current gain', tex: '\\beta' },
        b1: { name: 'current gain of the driver transistor', value: 50, tex: '\\beta_1' },
        b2: { name: 'current gain of the output transistor', value: 100, tex: '\\beta_2' }
      }
    },
    {
      name: 'Dissipation of a switched Darlington',
      expr: 'P = Vcesat*Ic', tex: 'P = V_{CE(sat)}\\,I_C',
      vars: {
        P: { name: 'power dissipated', q: 'power', unit: 'W' },
        Vcesat: { name: 'saturation voltage', q: 'voltage', unit: 'V', value: 2, tex: 'V_{CE(sat)}' },
        Ic: { name: 'load current', q: 'current', unit: 'A', value: 3, tex: 'I_C' }
      },
      note: 'Compare with I²R_DS(on) for a MOSFET at the same current.'
    }
  ],
  examples: [
    {
      title: 'A TIP120 switching a solenoid',
      q: 'A 5 V Arduino pin switches a 12 V, 2 A solenoid through a TIP120 (β at least 1000; $V_{BE}$ about 1.8 V and $V_{CE(sat)}$ about 1.5 V at 2 A; $R_{\\theta JA}$ = 62.5 °C/W). Choose the base resistor and check the heat.',
      steps: [
        'Minimum base current $2\\ \\mathrm{A}/1000 = 2\\ \\mathrm{mA}$; overdrive 2.5 times for margin: 5 mA.',
        '$R_B = (5 - 1.8)\\ \\mathrm{V}/5\\ \\mathrm{mA} = 640\\ \\Omega$ → 680 Ω, giving 4.7 mA — easy for the pin.',
        'Dissipation: $1.5\\ \\mathrm{V} \\times 2\\ \\mathrm{A} = 3\\ \\mathrm{W}$. In free air that is a $3 \\times 62.5 = 188$ °C rise — impossible. It needs a heat sink with a total junction-to-air resistance under about $(125 - 40)/3 = 28$ °C/W: a small clip-on fin will do.',
        'The solenoid sees only about 10.5 V, and it still needs a flyback diode.'
      ],
      a: 'R_B = 680 Ω, a flyback diode, and a small heat sink for the 3 W the TIP120 dissipates.'
    }
  ],
  quiz: [
    { q: 'Two transistors with β = 40 and β = 80 form a Darlington. The combined gain is…', choices: ['120 (they add)', 'about 3300 (they multiply)', '80 (the larger one)', '40 (the smaller one)'], a: 1,
      why: '40 × 80 + 40 + 80 = 3320: the first transistor\'s emitter current is the second one\'s base current.' },
    { q: 'Why can\'t a Darlington\'s $V_{CE}$ fall to 0.1 V like a single saturated transistor?', choices: ['Its β is too high', 'The output transistor\'s V_CE cannot drop below its own V_BE plus the driver\'s V_CE(sat)', 'The internal resistors prevent it', 'It can if the base current is large enough'], a: 1,
      why: 'The driver\'s collector is tied to the output collector, so V_CE(output) = V_CE(driver) + V_BE(output) ≥ about 0.7–0.9 V.' },
    { q: 'A TIP120 switching 4 A needs a heat sink even though it is fully on.', a: true,
      why: 'With V_CE(sat) of 2–4 V at that current it dissipates 8 W or more — far beyond the 2 W a TO-220 can shed in free air.' },
    { q: 'A ULN2003 is a good choice for…', choices: ['a 20 A motor', 'six 12 V relays drawing 40 mA each, driven from a microcontroller', 'a 1 GHz amplifier', 'a precision current source'], a: 1,
      why: 'Seven 500 mA Darlington channels with built-in base resistors and flyback diodes: made for relays, lamps and stepper windings driven by logic.' }
  ],
  applications: ['Relay, solenoid and stepper drivers (ULN2003, ULN2803).', 'Simple high-current switches from logic, where a little heat is acceptable.', 'Output stages and high-impedance followers.', 'Touch switches: the gain is enough to switch on the tiny current through a fingertip.'],
  sim: { id: 'tr-bjt-switch', params: { part: 'tip120' } }
}

);
