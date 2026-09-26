/* HYPER-ELECTRONICS · content/rf.js — radio and transmission lines: modulation, lines
 * and their characteristic impedance, reflections and matching, and antennas. */
Hyper.add(

{
  id: 'modulation', parent: 'rf', title: 'AM and FM modulation', level: 2,
  short: 'To send sound or data by radio, a high-frequency carrier is made to carry the signal: in AM its amplitude follows the message, in FM its frequency does. Either way sidebands appear around the carrier, and they set the bandwidth a station needs.',
  keywords: ['modulation', 'AM', 'FM', 'amplitude modulation', 'frequency modulation', 'carrier', 'sidebands', 'modulation index', 'modulation depth', 'Carson\'s rule', 'bandwidth', 'envelope detector', 'superheterodyne', 'intermediate frequency', 'deviation', 'ASK', 'FSK', 'PSK', 'QAM'],
  prereq: ['spectrum-harmonics', 'math:trig-identities', 'physics:em-spectrum'],
  related: ['antennas', 'pll', 'lc-oscillators', 'half-wave-rectifier', 'decibels'],
  body: `
A microphone produces audio from about 50 Hz to 15 kHz. Radiated directly it would need antennas kilometres long, and every station would overlap every other. Instead each station uses a **carrier** at its own radio frequency — 198 kHz, 909 kHz, 98.5 MHz — and **modulates** it: changes one of its properties in step with the message. A receiver tunes to one carrier and recovers the message from it.

### Amplitude modulation
In AM the carrier's amplitude follows the audio:

$$s(t) = A_c\\,[1 + m\\cos(2\\pi f_m t)]\\cos(2\\pi f_c t)$$

$m$ is the **modulation depth**, from 0 to 1. Multiply it out with the [[math:trig-identities|product-to-sum identity]] and the signal turns out to be three pure sines: the carrier at $f_c$, and two **sidebands** at $f_c \\pm f_m$, each of amplitude $mA_c/2$. Real audio contains many frequencies, so each sideband becomes a band, and the transmission occupies

$$B = 2f_m$$

— about 9 kHz for European medium-wave stations (whose channels are 9 kHz apart), 10 kHz in the Americas.

The power divides as $P_t = P_c(1 + m^2/2)$: even at full modulation only a third of the power is in the sidebands, and the carrier itself carries no information. That waste, and AM's sensitivity to every crackle of electrical noise (noise adds to the amplitude, which *is* the message), are its weaknesses. Its strength is the receiver. An **envelope detector** — a diode, a capacitor and a resistor, much like a [[half-wave-rectifier|half-wave rectifier]] — recovers the audio. Its time constant must be long compared with the carrier's period and short compared with the audio's; if it is too long, the capacitor cannot follow the envelope down and the peaks of deep modulation are clipped. Over-modulating ($m > 1$) makes the envelope fold through zero, and the detected audio is badly distorted.

### Frequency modulation
In FM the amplitude stays constant and the **instantaneous frequency** swings around the carrier: $f(t) = f_c + \\Delta f\\cos(2\\pi f_m t)$. The **deviation** $\\Delta f$ is proportional to the audio amplitude; the rate of the swing is the audio frequency. Their ratio is the **modulation index**, $\\beta = \\Delta f/f_m$.

The spectrum is no longer three lines: FM produces sidebands at every multiple of $f_m$ on each side of the carrier, with amplitudes given by Bessel functions of β; the carrier's own amplitude even vanishes at particular indices, the first at β = 2.405. In practice almost all the power lies within **Carson's rule**:

$$B \\approx 2(\\Delta f + f_m)$$

Broadcast FM uses $\\Delta f$ = 75 kHz and audio up to 15 kHz: $B \\approx 180$ kHz, in channels 200 kHz apart in the 88–108 MHz band. The extra bandwidth buys noise immunity: the receiver clips the amplitude in a **limiter**, discarding the noise riding on it, and a strong station **captures** the receiver from a weaker one on the same frequency.

### How receivers tune: the superheterodyne
Almost every receiver since the 1930s **mixes** the incoming signal with a local oscillator to shift the chosen station to a fixed **intermediate frequency** — 455 kHz for AM, 10.7 MHz for FM — where fixed, sharp filters and most of the gain sit. Tuning changes only the local oscillator, today usually a [[pll]] synthesiser.

### And digital
Data modulate carriers in the same ways: **ASK** (on–off keying of the amplitude, as in 433 MHz remote controls), **FSK** (two frequencies, as in many sub-GHz radio modules), **PSK** (steps of phase, as in GPS) and **QAM** (amplitude *and* phase together, many bits per symbol, as in Wi-Fi and cable modems).
`,
  ideas: [
    'AM makes the carrier\'s amplitude follow the message; FM makes its frequency follow it.',
    'An AM signal is the carrier plus two sidebands at f_c ± f_m: bandwidth 2f_m.',
    'At full AM modulation only a third of the power is in the sidebands.',
    'FM\'s modulation index is β = Δf/f_m; Carson\'s rule gives its bandwidth, 2(Δf + f_m).',
    'FM trades bandwidth for noise immunity; receivers shift every station to a fixed IF.'
  ],
  pitfalls: [
    'An AM station transmits only at its carrier frequency — The modulation creates sidebands; the station occupies twice the audio bandwidth.',
    'In FM the deviation depends on the audio frequency — The deviation follows the audio amplitude; the audio frequency sets how fast the frequency swings.',
    'More modulation depth is always better in AM — Beyond m = 1 the envelope folds through zero and the audio is badly distorted.'
  ],
  formulas: [
    {
      name: 'Total power of an AM signal',
      expr: 'Pt = Pc*(1 + m^2/2)', tex: 'P_t = P_c\\left(1 + \\frac{m^2}{2}\\right)',
      vars: {
        Pt: { name: 'total transmitted power', q: 'power', unit: 'W', tex: 'P_t' },
        Pc: { name: 'carrier power', q: 'power', unit: 'W', value: 100, tex: 'P_c' },
        m: { name: 'modulation depth', value: 1, min: 0, max: 1 }
      },
      note: 'Sine-wave modulation. Each sideband carries P_c·m²/4.'
    },
    {
      name: 'Carson\'s rule for FM bandwidth',
      expr: 'B = 2*(df + fm)', tex: 'B \\approx 2\\left(\\Delta f + f_m\\right)',
      vars: {
        B: { name: 'occupied bandwidth', q: 'frequency', unit: 'kHz' },
        df: { name: 'peak deviation', q: 'frequency', unit: 'kHz', value: 75, tex: '\\Delta f' },
        fm: { name: 'highest modulating frequency', q: 'frequency', unit: 'kHz', value: 15, tex: 'f_m' }
      },
      stories: { B: 'A transmitter deviates {df} with audio up to {fm}. Roughly what bandwidth does it occupy?' }
    },
    {
      name: 'FM modulation index',
      expr: 'b = df/fm', tex: '\\beta = \\frac{\\Delta f}{f_m}',
      vars: {
        b: { name: 'modulation index', tex: '\\beta' },
        df: { name: 'peak deviation', q: 'frequency', unit: 'kHz', value: 75, tex: '\\Delta f' },
        fm: { name: 'modulating frequency', q: 'frequency', unit: 'kHz', value: 15, tex: 'f_m' }
      }
    },
    {
      name: 'Longest envelope-detector time constant',
      expr: 'tau = sqrt(1 - m^2)/(2*pi*fm*m)', tex: '\\tau_{\\max} = \\frac{\\sqrt{1 - m^2}}{2\\pi f_m\\,m}',
      vars: {
        tau: { name: 'largest RC that follows the envelope', q: 'time', unit: 'µs', tex: '\\tau_{\\max}' },
        m: { name: 'modulation depth', value: 0.8, min: 0.01, max: 0.99 },
        fm: { name: 'highest audio frequency', q: 'frequency', unit: 'kHz', value: 5, tex: 'f_m' }
      },
      note: 'Any longer, and the capacitor cannot discharge as fast as the envelope falls. The time constant must still be much longer than the carrier period.'
    }
  ],
  examples: [
    {
      title: 'Where does an AM transmitter\'s power go?',
      q: 'A medium-wave transmitter has a 50 kW carrier. What is its total power at 100 % modulation, and at a typical average depth of 30 %?',
      steps: [
        'At $m = 1$: $P_t = 50(1 + 0.5) = 75$ kW; the two sidebands share 25 kW (12.5 kW each).',
        'At $m = 0.3$: $P_t = 50(1 + 0.045) = 52.25$ kW, of which only 2.25 kW — 4 % — carries the programme.',
        'This is why single-sideband (SSB) transmission, which removes the carrier and one sideband, is used where power matters.'
      ],
      a: '75 kW at full modulation; 52.25 kW at 30 %, of which only 2.25 kW is in the sidebands.'
    },
    {
      title: 'Narrow-band FM for two-way radio',
      q: 'A handheld radio uses 2.5 kHz peak deviation with speech up to 3 kHz. What bandwidth does Carson\'s rule give, and does it fit a 12.5 kHz channel?',
      steps: [
        '$B \\approx 2(2.5 + 3) = 11$ kHz.',
        '11 kHz fits inside 12.5 kHz with a little guard band. Broadcast FM\'s 75 kHz deviation would need 180 kHz.',
        'The modulation index here is only $2.5/3 = 0.83$: narrow-band FM, much of whose noise advantage over AM is given up to save spectrum.'
      ],
      a: 'About 11 kHz: it fits a 12.5 kHz channel.'
    },
    {
      title: 'Designing an envelope detector',
      q: 'An AM receiver\'s detector follows a 455 kHz intermediate frequency; the audio reaches 5 kHz and the depth up to 0.8. Choose R and C.',
      steps: [
        'Upper limit on the time constant: $\\sqrt{1 - 0.64}/(2\\pi \\times 5000 \\times 0.8) = 0.6/25\\,100 = 24\\ \\mu\\mathrm{s}$.',
        'Lower limit: many IF periods, $1/455\\ \\mathrm{kHz} = 2.2\\ \\mu\\mathrm{s}$ each.',
        'Take about 20 µs: $R$ = 10 kΩ, $C$ = 2.2 nF gives 22 µs — nine carrier periods, and short enough to follow the envelope.'
      ],
      a: 'R = 10 kΩ, C = 2.2 nF (τ = 22 µs).'
    }
  ],
  quiz: [
    { q: 'An AM transmitter sends a 1 kHz tone on a 1 MHz carrier. Its spectrum contains…', choices: ['only 1 MHz', '1 MHz and 1 kHz', '999 kHz, 1 MHz and 1001 kHz', 'every multiple of 1 kHz'], a: 2,
      why: 'Multiplying the carrier by (1 + m cos ω_m t) gives the carrier and two sidebands at f_c ± f_m.' },
    { q: 'Doubling the audio amplitude in an FM transmitter doubles…', choices: ['the carrier amplitude', 'the deviation', 'the carrier frequency', 'the rate of the frequency swing'], a: 1,
      why: 'In FM the deviation is proportional to the modulating amplitude; the audio frequency sets how fast the frequency swings.' },
    { q: 'What bandwidth does Carson\'s rule give for 5 kHz deviation and audio up to 3 kHz?', answer: 16, unit: 'kHz',
      why: 'B ≈ 2(Δf + f_m) = 2(5 + 3) = 16 kHz.' },
    { q: 'At 100 % AM, two thirds of the transmitted power is in the carrier, which carries no information.', a: true,
      why: 'P_t = P_c(1 + m²/2) = 1.5 P_c at m = 1, so the carrier is 1/1.5 = two thirds of the total.' },
    { q: 'Why is FM less affected by electrical noise than AM?', choices: ['It uses higher power', 'The information is in the frequency, so the receiver can clip away amplitude noise', 'It has no sidebands', 'Noise cannot reach VHF'], a: 1,
      why: 'Most interference adds to the amplitude. An FM receiver\'s limiter removes amplitude variations before demodulating the frequency.' }
  ],
  applications: ['AM broadcasting on long, medium and short wave; airband radio.', 'FM broadcasting and two-way radio.', 'Digital radio links: ASK remotes, FSK modules, PSK in GPS, QAM in Wi-Fi.', 'Superheterodyne receivers and spectrum analysers.']
},

{
  id: 'transmission-lines', parent: 'rf', title: 'Transmission lines and characteristic impedance', level: 2,
  short: 'When a connection is long compared with the wavelength or the rise time, signals travel along it as waves at a large fraction of the speed of light, and the line presents a characteristic impedance — 50 Ω for most coax — set by its geometry, not its length.',
  keywords: ['transmission line', 'characteristic impedance', 'Z0', 'coaxial cable', 'coax', 'twisted pair', 'microstrip', 'propagation delay', 'velocity factor', 'telegrapher\'s equations', '50 ohm', '75 ohm', 'signal integrity', 'rise time', 'RG-58', 'cable loss'],
  prereq: ['inductors', 'capacitors', 'physics:electromagnetic-waves', 'math:wave-equation'],
  related: ['reflections-matching', 'antennas', 'timing-clocks'],
  body: `
At low frequencies a wire is a wire: its two ends are at the same voltage, to within its small resistance. But a change of voltage travels along it at a finite speed — at most the speed of light, 30 cm per nanosecond, and in practice 50–85 % of that. When the time the change takes to travel the length of the wire is comparable with how fast the signal itself changes, the two ends are *not* at the same voltage, and the wire has to be treated as a **transmission line**.

### When to care
Rules of thumb for when a connection is "long":
- for a sine wave, when it is longer than about a tenth of a wavelength (at 100 MHz in coax, about 20 cm);
- for digital edges, when the one-way delay exceeds about a sixth of the rise time. A 1 ns edge on a circuit board, where signals travel roughly 6–7 ns per metre, makes any trace longer than a few centimetres a transmission line — which is why fast logic, and even a microcontroller's clock line, can ring.

### Distributed inductance and capacitance
Model a pair of conductors — the core and shield of a coax, two wires of a twisted pair, a trace over a ground plane — as a chain of tiny [[inductors]] along the line (the loop's magnetic field) and tiny [[capacitors]] across it (the electric field between the conductors): $L'$ and $C'$ per metre. A voltage step entering the line charges the first bit of capacitance through the first bit of inductance, then the next, and so on: a wave. Solving the chain — the **telegrapher's equations**, which reduce to the [[math:wave-equation|wave equation]] — gives two numbers that describe a lossless line completely:

$$v = \\frac{1}{\\sqrt{L'C'}} = \\frac{c}{\\sqrt{\\varepsilon_r}}, \\qquad Z_0 = \\sqrt{\\frac{L'}{C'}}$$

The wave travels at $v$, set by the dielectric between the conductors: solid polyethylene, $\\varepsilon_r = 2.25$, gives $0.67c$; foamed dielectrics reach $0.8$–$0.85c$. While the wave travels, the ratio of its voltage to its current is fixed at $Z_0$, the **characteristic impedance**. A source connected to a long line therefore sees a plain *resistance* $Z_0$, whatever the line's length and whatever is at the far end — until the reflection from the far end arrives (see [[reflections-matching]]).

$Z_0$ depends only on the cross-section and the dielectric. For coax with inner conductor diameter $d$ and dielectric diameter $D$:

$$Z_0 = \\frac{60\\ \\Omega}{\\sqrt{\\varepsilon_r}}\\,\\ln\\frac{D}{d}$$

Because of the logarithm, practical values lie between a few tens and a few hundred ohms: there is no such thing as a 5 Ω or a 5 kΩ cable.

### The standard impedances
| Line | $Z_0$ | Velocity factor |
|---|---|---|
| RG-58, RG-213 coax (radio, test equipment) | 50 Ω | 0.66 |
| RG-6, RG-59 coax (television, video) | 75 Ω | 0.66–0.85 |
| Twisted pair (Ethernet, RS-485, USB) | 90–120 Ω | 0.6–0.7 |
| PCB microstrip on FR-4, width about twice its height above the ground plane | about 50 Ω | about 0.55 |
| Twin-lead ribbon | 300 Ω | about 0.8 |

Why 50 Ω? For air-spaced coax, loss is lowest near 77 Ω and power handling highest near 30 Ω; 50 Ω is a compromise, and 75 Ω is kept where loss matters most and power does not — receiving antennas and video.

### Loss
Real lines lose signal: the conductors' resistance, which grows with frequency through the skin effect, and the dielectric's own loss, which grows faster still. Cable datasheets quote attenuation in dB per 100 m: thin RG-58 loses roughly 15 dB per 100 m at 100 MHz and over 50 dB at 1 GHz — which is why thicker, lower-loss cable feeds antennas at VHF and above.

> [!key] A transmission line looks like a resistance $Z_0$ to a signal travelling along it. What happens when the wave reaches the end — absorbed, reflected, or partly both — decides whether the circuit works.
`,
  ideas: [
    'A connection is a transmission line when its delay is comparable with the signal\'s period or rise time.',
    'A line is distributed inductance and capacitance: v = 1/√(L′C′), Z₀ = √(L′/C′).',
    'Signals travel at c/√ε_r: two-thirds of c in solid polyethylene coax.',
    'A travelling wave sees a resistance Z₀, independent of the line\'s length.',
    'Z₀ depends only on geometry and dielectric: 50 Ω and 75 Ω coax, 100 Ω twisted pair.'
  ],
  pitfalls: [
    'Cutting a 50 Ω cable shorter lowers its impedance — Z₀ is a property of the cross-section, not the length; any length of 50 Ω cable is 50 Ω.',
    'Z₀ is a resistance you could measure with an ohmmeter — An ohmmeter at DC sees the far end (open or short); Z₀ is the ratio of voltage to current in a travelling wave.',
    'Only radio engineers need transmission lines — Any fast digital edge on a trace of a few centimetres or more behaves as a line and can ring.'
  ],
  formulas: [
    {
      name: 'Characteristic impedance from L′ and C′',
      expr: 'Z0 = sqrt(Lp/Cp)', tex: 'Z_0 = \\sqrt{\\frac{L\'}{C\'}}',
      vars: {
        Z0: { name: 'characteristic impedance', q: 'resistance', unit: 'Ω', tex: 'Z_0' },
        Lp: { name: 'inductance per metre of line', q: 'inductance', unit: 'nH', value: 250, tex: 'L\'' },
        Cp: { name: 'capacitance per metre of line', q: 'capacitance', unit: 'pF', value: 100, tex: 'C\'' }
      },
      note: 'Enter the inductance and capacitance of one metre of line (per-metre values).'
    },
    {
      name: 'Wave speed from L′ and C′',
      expr: 'v = 1/sqrt(Lp*Cp)', tex: 'v = \\frac{1}{\\sqrt{L\'C\'}}',
      vars: {
        v: { name: 'propagation speed', q: 'speed', unit: 'm/s' },
        Lp: { name: 'inductance per metre of line', q: 'inductance', unit: 'nH', value: 250, tex: 'L\'' },
        Cp: { name: 'capacitance per metre of line', q: 'capacitance', unit: 'pF', value: 100, tex: 'C\'' }
      },
      note: 'With per-metre values the result is in metres per second.'
    },
    {
      name: 'Characteristic impedance of coax',
      expr: 'Z0 = 60/sqrt(er)*ln(D/d)', tex: 'Z_0 = \\frac{60\\ \\Omega}{\\sqrt{\\varepsilon_r}}\\,\\ln\\frac{D}{d}',
      vars: {
        Z0: { name: 'characteristic impedance', q: 'resistance', unit: 'Ω', tex: 'Z_0' },
        er: { name: 'relative permittivity of the dielectric', value: 2.25, tex: '\\varepsilon_r' },
        D: { name: 'dielectric (shield inner) diameter', q: 'length', unit: 'mm', value: 2.95 },
        d: { name: 'inner conductor diameter', q: 'length', unit: 'mm', value: 0.845 }
      },
      stories: { D: 'A coax with a {d} inner conductor and a dielectric of ε_r = {er} must be {Z0}. What must the dielectric diameter be?' }
    },
    {
      name: 'Propagation delay',
      expr: 'td = len*sqrt(er)/c', tex: 't_d = \\frac{l\\,\\sqrt{\\varepsilon_r}}{c}',
      vars: {
        td: { name: 'one-way delay', q: 'time', unit: 'ns', tex: 't_d' },
        len: { name: 'length of the line', q: 'length', unit: 'm', value: 10, tex: 'l' },
        er: { name: 'relative permittivity (effective)', value: 2.25, tex: '\\varepsilon_r' },
        c: { const: 'c' }
      },
      stories: { td: 'How long does a pulse take to travel {len} of coax whose dielectric has ε_r = {er}?' }
    }
  ],
  examples: [
    {
      title: 'Designing a 50 Ω coax',
      q: 'Polyethylene has $\\varepsilon_r$ = 2.25. What ratio of dielectric diameter to inner-conductor diameter gives 50 Ω? How fast does a signal travel in it, and what is the delay of a 10 m cable?',
      steps: [
        '$\\ln(D/d) = 50 \\times \\sqrt{2.25}/60 = 1.25$, so $D/d = e^{1.25} = 3.49$ — for example a 0.845 mm core in a 2.95 mm dielectric, close to RG-58.',
        '$v = c/\\sqrt{2.25} = c/1.5 = 2.0 \\times 10^8$ m/s: a velocity factor of 0.67.',
        '10 m then takes $10/2.0\\times10^8 = 50$ ns — five nanoseconds per metre.'
      ],
      a: 'D/d ≈ 3.5; 0.67c; 50 ns for 10 m.'
    },
    {
      title: 'Is this trace a transmission line?',
      q: 'A 15 cm clock trace on an FR-4 board carries edges with a 2 ns rise time. Signals travel at about 0.55c. Should it be treated as a transmission line?',
      steps: [
        'Speed: $0.55 \\times 3\\times10^8 = 1.65 \\times 10^8$ m/s, so the one-way delay is $0.15/1.65\\times10^8 = 0.91$ ns.',
        'The rule of thumb says a line matters when the delay exceeds a sixth of the rise time: $2/6 = 0.33$ ns.',
        '0.91 ns is nearly three times that: expect ringing unless the line is terminated — typically a 22–33 Ω series resistor at the driver.'
      ],
      a: 'Yes: its 0.9 ns delay is well over a sixth of the 2 ns edge.'
    }
  ],
  quiz: [
    { q: 'A 50 Ω coax is cut from 10 m down to 1 m. Its characteristic impedance becomes…', choices: ['5 Ω', '50 Ω', '500 Ω', 'dependent on frequency'], a: 1,
      why: 'Z₀ = √(L′/C′) depends on the per-metre properties, which do not change when the cable is shortened.' },
    { q: 'How long does a pulse take to travel 20 m of cable with a velocity factor of 0.66?', answer: 101, unit: 'ns',
      why: 't = 20 m / (0.66 × 3.0 × 10⁸ m/s) = 101 ns.' },
    { q: 'Raising the ratio D/d of a coax raises its characteristic impedance.', a: true,
      why: 'Z₀ = (60/√ε_r) ln(D/d): a thinner core or a wider shield means more inductance and less capacitance per metre.' },
    { q: 'At the instant a step is applied to the input of a long 75 Ω cable whose far end is open, the source sees…', choices: ['an open circuit', 'a short circuit', 'a 75 Ω resistance', 'a capacitor'], a: 2,
      why: 'Until the reflection returns, the source only sees the wave it launches, whose voltage-to-current ratio is Z₀.' },
    { q: 'Which change makes a PCB trace more likely to need transmission-line treatment?', choices: ['Slower edges', 'A shorter trace', 'Faster edges', 'Thicker copper'], a: 2,
      why: 'The criterion compares the trace delay with the rise time: faster edges make shorter traces "long".' }
  ],
  applications: ['Antenna feeders and RF test cables (50 Ω).', 'Television and video distribution (75 Ω).', 'High-speed digital buses, Ethernet, USB and HDMI (controlled-impedance pairs).', 'Printed-circuit design with controlled-impedance traces.'],
  sim: 'tr-tline'
},

{
  id: 'reflections-matching', parent: 'rf', title: 'Reflections, SWR and impedance matching', level: 3,
  short: 'A wave meeting an impedance different from the line\'s is partly reflected: fully and in step from an open end, fully and inverted from a short, not at all from a matched load. The reflection coefficient, SWR and return loss measure the mismatch; terminations and matching networks remove it.',
  keywords: ['reflection', 'reflection coefficient', 'Gamma', 'SWR', 'VSWR', 'standing wave ratio', 'return loss', 'mismatch', 'termination', 'series termination', 'parallel termination', 'quarter-wave transformer', 'L-network', 'impedance matching', 'TDR', 'Smith chart', 'balun'],
  prereq: ['transmission-lines', 'impedance', 'physics:standing-waves', 'physics:wave-reflection'],
  related: ['antennas', 'max-power-transfer', 'decibels'],
  body: `
When a wave travelling along a line of impedance $Z_0$ reaches a load $Z_L$, the load insists on its own ratio of voltage to current, while the arriving wave carries the ratio $Z_0$. The only way to satisfy both is for part of the wave to be sent back — just as a wave on a string partly reflects where the string changes thickness ([[physics:wave-reflection|wave reflection]]). The **reflection coefficient**, reflected voltage over incident voltage, is

$$\\Gamma = \\frac{Z_L - Z_0}{Z_L + Z_0}$$

| Load | Γ | What comes back |
|---|---|---|
| matched, $Z_L = Z_0$ | 0 | nothing: the line looks infinitely long |
| open circuit | +1 | the whole wave, same polarity: the voltage at the end doubles |
| short circuit | −1 | the whole wave, inverted: the voltage at the end stays at zero |
| $Z_L = 2Z_0$ | +⅓ | a third, same polarity |
| $Z_L = Z_0/2$ | −⅓ | a third, inverted |

The same formula applies at the source end, with the source's resistance in place of $Z_L$, so a wave can bounce back and forth several times. That is the **ringing** on an unterminated digital line, and the principle of **time-domain reflectometry** (TDR): send a fast step down a cable, watch for echoes, and the delay tells you how far away a break (Γ = +1) or a crushed spot (Γ < 0) lies.

### Standing waves and SWR
With a continuous sine wave the incident and reflected waves add. At some points along the line they arrive in step and the amplitude is $1 + |\\Gamma|$ times the incident; a quarter of a wavelength further on they are opposed and it is $1 - |\\Gamma|$. This fixed pattern of maxima and minima is a [[physics:standing-waves|standing wave]], and the ratio of maximum to minimum is the **standing wave ratio**:

$$\\text{SWR} = \\frac{1 + |\\Gamma|}{1 - |\\Gamma|}$$

A matched line has SWR = 1; an open or a short, infinity. Radio amateurs aim for an SWR below 1.5 (4 % of the power reflected) and accept 2 (11 %). The **return loss**, $RL = -20\\log_{10}|\\Gamma|$, says the same thing in [[decibels]] — higher is better; 20 dB means 1 % of the power comes back.

### Why mismatch matters
- **Power**: reflected power does not reach the load. In a transmitter it comes back and heats the output stage, which may fold back its power or fail.
- **Signal integrity**: in digital circuits reflections cause overshoot, undershoot and false edges.
- **Measurement**: a 50 Ω generator driving a high-impedance scope input through a long coax sees an open end: the signal arrives doubled, then rings.

### Matching
- **Terminate the line.** At the far end, a resistor equal to $Z_0$ (**parallel termination**) absorbs everything, at the cost of DC current. At the source, a series resistor bringing the driver's output resistance up to $Z_0$ (**series termination**) launches a half-height wave; it doubles to full height at the open far end, and its reflection is absorbed when it returns to the now-matched source. A 22–33 Ω resistor in series with a fast logic output is the classic cure for a ringing clock line.
- **Quarter-wave transformer.** A section of line a quarter of a wavelength long with $Z_1 = \\sqrt{Z_0 Z_L}$ matches two resistances at one frequency.
- **L-network.** An inductor and a capacitor match any two resistances at one frequency. The loaded Q of the match is fixed by their ratio, $Q = \\sqrt{R_\\text{high}/R_\\text{low} - 1}$, and both reactances follow from it. The **Smith chart** is the graphical tool for designing such networks.
- **Transformers and baluns** match by the square of the turns ratio over wide bandwidths: a 4 : 1 balun takes 200 Ω to 50 Ω.

Note that matching for no reflection is the same condition as [[max-power-transfer|maximum power transfer]] only when the source itself is matched; a line can be matched at both ends, at one, or at neither.
`,
  ideas: [
    'Γ = (Z_L − Z₀)/(Z_L + Z₀): +1 for an open, −1 for a short, 0 for a match.',
    'Reflections at both ends make a line ring; TDR uses their timing to locate faults.',
    'With a sine wave, incident and reflected waves form a standing wave: SWR = (1 + |Γ|)/(1 − |Γ|).',
    'Return loss −20 log|Γ| dB and reflected power |Γ|² express the same mismatch.',
    'Terminate at the far end, or in series at the source; match with quarter-wave lines, L-networks or transformers.'
  ],
  derivation: {
    title: 'Where the reflection coefficient comes from',
    steps: [
      { text: 'On the line, a forward wave $V_+$ and a reflected wave $V_-$ add in voltage. Each carries current in proportion to its voltage, $V/Z_0$, but the reflected wave travels the other way, so its current subtracts:', tex: 'V = V_+ + V_-, \\qquad I = \\frac{V_+ - V_-}{Z_0}' },
      { text: 'At the load, Ohm\'s law must hold: $V = Z_L I$.', tex: 'V_+ + V_- = \\frac{Z_L}{Z_0}\\left(V_+ - V_-\\right)' },
      { text: 'Collect the terms in $V_-$ and $V_+$:', tex: 'V_-\\left(1 + \\frac{Z_L}{Z_0}\\right) = V_+\\left(\\frac{Z_L}{Z_0} - 1\\right)' },
      { text: 'So the ratio of reflected to incident voltage is', tex: '\\Gamma = \\frac{V_-}{V_+} = \\frac{Z_L - Z_0}{Z_L + Z_0}' },
      { text: 'Check the limits: $Z_L \\to \\infty$ gives +1, $Z_L = 0$ gives −1, $Z_L = Z_0$ gives 0.' }
    ]
  },
  pitfalls: [
    'An open-ended line reflects nothing because no current flows into the open end — It reflects everything: Γ = +1, and the voltage at the end doubles.',
    'An SWR of 2 means half the power is lost — |Γ| = 1/3, so 11 % of the power is reflected (and much of that may still reach the load after re-reflection).',
    'Series termination makes the far end see half the voltage — The half-height wave doubles on reflection at the high-impedance far end, which therefore sees the full voltage.'
  ],
  formulas: [
    {
      name: 'Reflection coefficient',
      expr: 'G = (ZL - Z0)/(ZL + Z0)', tex: '\\Gamma = \\frac{Z_L - Z_0}{Z_L + Z_0}',
      vars: {
        G: { name: 'reflection coefficient', signed: true, tex: '\\Gamma', min: -1, max: 1 },
        ZL: { name: 'load resistance', q: 'resistance', unit: 'Ω', value: 75, tex: 'Z_L' },
        Z0: { name: 'line impedance', q: 'resistance', unit: 'Ω', value: 50, tex: 'Z_0' }
      },
      note: 'For resistive loads; with a complex load, Γ is complex too.',
      stories: { G: 'A {ZL} antenna is fed through {Z0} cable. What fraction of the incident voltage is reflected?' }
    },
    {
      name: 'Standing wave ratio',
      expr: 'S = (1 + rho)/(1 - rho)', tex: '\\mathrm{SWR} = \\frac{1 + \\rho}{1 - \\rho}',
      vars: {
        S: { name: 'standing wave ratio', tex: '\\mathrm{SWR}' },
        rho: { name: 'magnitude of the reflection coefficient |Γ|', value: 0.2, min: 0, max: 0.999, tex: '\\rho' }
      },
      stories: { rho: 'An SWR meter reads {S}. What is the magnitude of the reflection coefficient?' }
    },
    {
      name: 'Return loss',
      expr: 'RL = -20*log(rho)', tex: '\\mathrm{RL} = -20\\log_{10}\\rho',
      vars: {
        RL: { name: 'return loss', q: 'gain', unit: 'dB', tex: '\\mathrm{RL}' },
        rho: { name: 'magnitude of the reflection coefficient |Γ|', value: 0.2, min: 0.0001, max: 1, tex: '\\rho' }
      }
    },
    {
      name: 'Quarter-wave transformer',
      expr: 'Z1 = sqrt(Z0*ZL)', tex: 'Z_1 = \\sqrt{Z_0 Z_L}',
      vars: {
        Z1: { name: 'impedance of the quarter-wave section', q: 'resistance', unit: 'Ω', tex: 'Z_1' },
        Z0: { name: 'line impedance', q: 'resistance', unit: 'Ω', value: 50, tex: 'Z_0' },
        ZL: { name: 'load resistance', q: 'resistance', unit: 'Ω', value: 75, tex: 'Z_L' }
      },
      stories: { ZL: 'A quarter-wave section of {Z1} cable is used on a {Z0} line. What load resistance does it match?' }
    }
  ],
  examples: [
    {
      title: 'A 75 Ω antenna on a 50 Ω line',
      q: 'A 75 Ω antenna is fed through 50 Ω coax. Find Γ, the SWR, the return loss and the reflected power. What quarter-wave section would match it?',
      steps: [
        '$\\Gamma = (75 - 50)/(75 + 50) = 0.2$.',
        'SWR $= 1.2/0.8 = 1.5$; return loss $= -20\\log_{10} 0.2 = 14$ dB.',
        'Reflected power: $|\\Gamma|^2 = 4$ % — usually acceptable.',
        'A quarter-wave section of $\\sqrt{50 \\times 75} = 61$ Ω would match it perfectly at one frequency. No standard cable is 61 Ω; in practice the SWR of 1.5 is simply accepted, or the antenna is adjusted.'
      ],
      a: 'Γ = 0.2, SWR 1.5, 14 dB return loss, 4 % reflected; a 61 Ω quarter-wave section would match it.'
    },
    {
      title: 'Taming a ringing clock line',
      q: 'A 3.3 V logic driver with 15 Ω output resistance drives a 50 Ω trace ending at a CMOS input (effectively open). What voltage first arrives at the input? What series resistor fixes it?',
      steps: [
        'The driver and the line form a divider: the launched wave is $3.3 \\times 50/(15 + 50) = 2.54$ V.',
        'At the open end Γ = +1, so the voltage there jumps to $2 \\times 2.54 = 5.08$ V — 1.8 V above the supply, clamped hard by the input\'s protection diodes.',
        'The reflection returns to the driver, where $\\Gamma_s = (15 - 50)/65 = -0.54$: it bounces back inverted, and the line rings.',
        'Add 33 Ω in series: the source becomes 48 Ω. The launched wave is $3.3 \\times 50/98 = 1.68$ V, doubling to 3.37 V at the input, and the returning wave meets $\\Gamma_s = -0.02$ — absorbed.'
      ],
      a: 'About 5.1 V overshoot at first; a 33 Ω series resistor gives a clean 3.3 V edge.'
    }
  ],
  quiz: [
    { q: 'A pulse travelling on a line reaches a short circuit. The reflected pulse is…', choices: ['absent', 'the same polarity and size', 'inverted and the same size', 'twice as large'], a: 2,
      why: 'Γ = (0 − Z₀)/(0 + Z₀) = −1: the short forces zero voltage, so the reflection must cancel the incident pulse there.' },
    { q: 'What SWR does a 100 Ω load cause on a 50 Ω line?', answer: 2,
      why: 'Γ = 50/150 = 1/3, and SWR = (1 + 1/3)/(1 − 1/3) = 2. For a resistive load the SWR is simply the ratio of the larger to the smaller resistance.' },
    { q: 'A return loss of 20 dB means the reflected power is…', choices: ['20 %', '10 %', '1 %', '0.1 %'], a: 2,
      why: '20 dB means |Γ| = 0.1, and the reflected power is |Γ|² = 1 %.' },
    { q: 'On a matched line, the amplitude of a sine wave is the same everywhere along the line (ignoring loss).', a: true,
      why: 'With no reflected wave there is nothing to interfere with, so there is no standing-wave pattern: SWR = 1.' },
    { q: 'Series termination at a logic driver works because…', choices: ['it removes the reflection at the far end', 'the far-end reflection is absorbed when it returns to the now-matched source', 'it slows the edges to DC', 'it matches the input capacitance'], a: 1,
      why: 'The far end still reflects fully (which restores the full voltage there), but the reflection dies at the matched source instead of bouncing again.' }
  ],
  applications: ['Tuning antennas and feeders for low SWR.', 'Terminating clock lines, buses and differential pairs on circuit boards.', 'Cable fault location with a time-domain reflectometer.', 'RF amplifier input and output matching networks.'],
  sim: { id: 'tr-tline', params: { mode: 'sine' } }
},

{
  id: 'antennas', parent: 'rf', title: 'Antennas', level: 2,
  short: 'An antenna turns the current on a transmission line into electromagnetic waves, and back again. Its size relative to the wavelength sets how well it works: a half-wave dipole, a quarter-wave whip over a ground plane, or directional arrays with gain.',
  keywords: ['antenna', 'aerial', 'dipole', 'half-wave dipole', 'monopole', 'quarter-wave whip', 'ground plane', 'antenna gain', 'dBi', 'radiation pattern', 'Yagi', 'patch antenna', 'Friis equation', 'path loss', 'link budget', 'radiation resistance', 'balun', 'polarisation'],
  prereq: ['transmission-lines', 'physics:electromagnetic-waves', 'physics:em-spectrum', 'decibels'],
  related: ['reflections-matching', 'modulation', 'physics:standing-waves'],
  body: `
Accelerating charges radiate. An alternating current in a wire drives its electrons back and forth, and the fields they set up detach and travel away as [[physics:electromagnetic-waves|electromagnetic waves]]. Every wire does this a little; an **antenna** is a conductor shaped to do it efficiently. And by reciprocity, a good transmitting antenna is an equally good receiving one.

### The half-wave dipole
Split a wire in the middle, feed it there, and make the total length about half a wavelength, $\\lambda = c/f$. The current then forms a [[physics:standing-waves|standing wave]] on the wire — zero at the ends, maximum at the feed — and the antenna is **resonant**: its impedance at the feed point is purely resistive, about **73 Ω**. That resistance is almost all **radiation resistance** — power "dissipated" by being sent into space. Because the ends of a real wire carry a little extra capacitance, the resonant length is slightly shorter than $\\lambda/2$: about 95 % of it for a thin wire.

A dipole radiates most strongly broadside, perpendicular to the wire, and not at all off its ends: a doughnut-shaped **radiation pattern**. The waves leave polarised along the wire, and a receiving antenna turned at right angles picks up very little.

### The quarter-wave monopole
Cut the dipole in half and stand it on a conducting **ground plane** — a car roof, a metal case, or three or four radial wires. The ground plane acts as a mirror that supplies the missing half, and the $\\lambda/4$ whip behaves like a dipole with half the impedance, about **36 Ω**. This is the antenna of hand-held radios, cars and many radio modules (a 433 MHz module's 17 cm wire). Without a proper ground plane, the missing half is whatever the feed cable and the circuit board happen to be, and the performance becomes unpredictable.

### Gain — and why it is not free
An antenna creates no power. **Gain** is concentration: radiating more in some directions at the expense of others, compared with an imaginary **isotropic** antenna radiating equally in all directions (dBi), or with a dipole (dBd; a dipole itself has 2.15 dBi).
- **Yagi–Uda** arrays, the classic rooftop TV aerial: a driven dipole with a parasitic reflector and director rods, 7–15 dBi in one direction.
- **Patch** antennas (GPS, Wi-Fi): a metal rectangle above a ground plane on a circuit board, about 5–8 dBi broadside.
- **Parabolic dishes**: 30–40 dBi and more, for satellite and microwave links.
- **Small loops and chip antennas** trade efficiency for size where a quarter wave will not fit. At 2.4 GHz a quarter wave is only 31 mm; at 433 MHz it is 17 cm; at 27 MHz, 2.8 m.

### How far a signal goes
Between two antennas in free space, the received power follows the **Friis transmission equation**:

$$P_r = P_t\\,G_t\\,G_r\\left(\\frac{\\lambda}{4\\pi d}\\right)^2$$

The inverse square of distance is geometry: the power spreads over a sphere of area $4\\pi d^2$. The $\\lambda^2$ is the capture area of a receiving antenna of given gain — why lower frequencies reach further with the same antennas. In [[decibels]], the **free-space path loss** is $20\\log_{10}(4\\pi d/\\lambda)$: 80 dB at 2.4 GHz over 100 m, and every doubling of distance adds 6 dB. Real links add losses for walls, foliage and the ground, and keep a **fade margin** of 10–20 dB.

> [!tip] The feed line matters as much as the antenna. A dipole fed with coax needs a **balun** to stop current flowing on the outside of the shield, and the antenna should be matched to the cable ([[reflections-matching]]) so that the transmitter sees a low SWR.
`,
  ideas: [
    'A half-wave dipole is resonant, with a feed impedance of about 73 Ω, and about 95 % of λ/2 long.',
    'A quarter-wave whip needs a ground plane to act as its missing half; its impedance is about 36 Ω.',
    'Gain means concentrating power in some directions; a dipole has 2.15 dBi.',
    'Free-space path loss is 20 log(4πd/λ) dB: 6 dB more for every doubling of distance.',
    'The feed line, balun and match matter as much as the antenna itself.'
  ],
  pitfalls: [
    'A high-gain antenna amplifies the signal — It only redistributes the power, sending more one way and less in others.',
    'A quarter-wave whip works the same with or without a ground plane — Without one, the cable or board becomes the other half of the antenna, detuning it unpredictably.',
    'Doubling the distance halves the received power — Free space follows the inverse square: a quarter of the power, 6 dB less.'
  ],
  formulas: [
    {
      name: 'Wavelength',
      expr: 'lambda = c/f', tex: '\\lambda = \\frac{c}{f}',
      vars: {
        lambda: { name: 'wavelength', q: 'length', unit: 'm', tex: '\\lambda' },
        c: { const: 'c' },
        f: { name: 'frequency', q: 'frequency', unit: 'MHz', value: 145 }
      }
    },
    {
      name: 'Length of a half-wave dipole',
      expr: 'len = k*c/(2*f)', tex: 'l = k\\,\\frac{c}{2f}',
      vars: {
        len: { name: 'total length, tip to tip', q: 'length', unit: 'm', tex: 'l' },
        k: { name: 'shortening (end-effect) factor', value: 0.95, min: 0.8, max: 1 },
        c: { const: 'c' },
        f: { name: 'frequency', q: 'frequency', unit: 'MHz', value: 145 }
      },
      note: 'About 0.95 for thin wire, less for thick elements. Cut slightly long and trim for the lowest SWR.',
      stories: { len: 'How long, tip to tip, should a wire dipole for {f} be (shortening factor {k})?' }
    },
    {
      name: 'Free-space path loss',
      expr: 'L = 20*log(4*pi*d*f/c)', tex: 'L = 20\\log_{10}\\frac{4\\pi d f}{c}',
      vars: {
        L: { name: 'path loss', q: 'gain', unit: 'dB' },
        d: { name: 'distance', q: 'length', unit: 'm', value: 100 },
        f: { name: 'frequency', q: 'frequency', unit: 'GHz', value: 2.4 },
        c: { const: 'c' }
      },
      stories: { L: 'What is the free-space path loss over {d} at {f}?' }
    },
    {
      name: 'Link budget in decibels',
      expr: 'Pr = Pt + Gt + Gr - L', tex: 'P_r = P_t + G_t + G_r - L',
      vars: {
        Pr: { name: 'received power (dBm)', q: 'gain', unit: 'dB', signed: true, tex: 'P_r' },
        Pt: { name: 'transmitted power (dBm)', q: 'gain', unit: 'dB', value: 20, signed: true, tex: 'P_t' },
        Gt: { name: 'transmit antenna gain (dBi)', q: 'gain', unit: 'dB', value: 2.15, signed: true, tex: 'G_t' },
        Gr: { name: 'receive antenna gain (dBi)', q: 'gain', unit: 'dB', value: 2.15, signed: true, tex: 'G_r' },
        L: { name: 'path loss', q: 'gain', unit: 'dB', value: 80 }
      },
      note: 'The Friis equation in decibels: powers in dBm (decibels relative to 1 mW), gains in dBi. 20 dBm is 100 mW.'
    }
  ],
  examples: [
    {
      title: 'A dipole for the 2 m amateur band',
      q: 'Cut a wire dipole for 145 MHz.',
      steps: [
        '$\\lambda = 3.0\\times10^8/145\\times10^6 = 2.07$ m, so $\\lambda/2 = 1.034$ m.',
        'With the 0.95 shortening factor: $0.95 \\times 1.034 = 0.98$ m tip to tip — two arms of about 49 cm.',
        'Cut them a centimetre or two long, feed through a balun, and trim both arms equally for the lowest SWR.'
      ],
      a: 'About 0.98 m in total: two 49 cm arms.'
    },
    {
      title: 'A 2.4 GHz link budget',
      q: 'A 2.4 GHz link transmits 20 dBm (100 mW) through 2 dBi antennas at both ends, 100 m apart in free space. The receiver needs −90 dBm. How much margin is there?',
      steps: [
        '$\\lambda = 0.125$ m. Path loss: $20\\log_{10}(4\\pi \\times 100/0.125) = 20\\log_{10}(10\\,050) = 80$ dB.',
        'Received: $20 + 2 + 2 - 80 = -56$ dBm, about 2.5 nW.',
        'Margin: $-56 - (-90) = 34$ dB. Each wall indoors may cost 5–15 dB, so a few walls use it up — which is why Wi-Fi range indoors is tens of metres, not the kilometres free space would allow.'
      ],
      a: 'About −56 dBm received: 34 dB of margin in free space.'
    }
  ],
  quiz: [
    { q: 'A half-wave dipole for 300 MHz is about…', choices: ['5 cm long', '50 cm long (a little less)', '1 m long', '10 m long'], a: 1,
      why: 'λ = c/f = 1 m, so λ/2 = 50 cm, and the end effect makes it about 47–48 cm.' },
    { q: 'Doubling the distance between two antennas in free space reduces the received power by…', choices: ['3 dB', '6 dB', '10 dB', '20 dB'], a: 1,
      why: 'Inverse square: a quarter of the power, and 10 log₁₀(1/4) = −6 dB.' },
    { q: 'A 10 dBi antenna produces ten times more power than the transmitter gives it.', a: false,
      why: 'It radiates the same power (less a little loss), concentrated so that in its best direction the signal is ten times what an isotropic antenna would give.' },
    { q: 'A quarter-wave whip with no ground plane…', choices: ['works exactly like one with a ground plane', 'uses whatever conductors are near its base — the cable or the board — as its other half, unpredictably', 'does not radiate at all', 'becomes a half-wave antenna'], a: 1,
      why: 'Current has to return somewhere: without a ground plane it flows on the cable\'s shield or the board, detuning the antenna and spoiling its pattern.' },
    { q: 'What is the wavelength of a 433 MHz signal, in metres?', answer: 0.692, unit: 'm',
      why: 'λ = 3.0 × 10⁸/433 × 10⁶ = 0.69 m, so a quarter-wave whip is about 17 cm.' }
  ],
  applications: ['Radio and television broadcasting and reception.', 'Wi-Fi, Bluetooth, mobile phones and GPS.', 'Remote controls, telemetry and IoT radio modules.', 'Radar and satellite links.']
}

);
