/* HYPER-ELECTRONICS · content/reference.js — the reference concept for electronics authors:
 * its depth, practical angle and layout are the model (see also sims/reference.js). */
Hyper.add(

{
  id: 'voltage-divider', parent: 'dc-basics', title: 'The voltage divider', level: 1,
  short: 'Two resistors in series split a voltage in the ratio of their resistances — the most used circuit in electronics, and the easiest to get subtly wrong by loading it.',
  keywords: ['voltage divider', 'potential divider', 'resistor divider', 'loading', 'ratio', 'level shifting', 'bias', 'sensor', 'ADC input'],
  prereq: ['series-parallel', 'resistance-ohms-law', 'physics:resistors-combinations'],
  related: ['thevenin-norton', 'potentiometers', 'current-divider', 'sensor-interfacing'],
  body: `
Put two resistors in series across a voltage and the same current flows through both. Each one drops a voltage in proportion to its resistance, so the point between them sits at a fixed fraction of the input:

$$V_\\text{out} = V_\\text{in}\\,\\frac{R_2}{R_1 + R_2}$$

where $R_2$ is the resistor between the output and ground. Equal resistors halve the voltage; $R_2 = 2R_1$ gives two-thirds. Only the **ratio** matters for the output voltage — 1 kΩ and 2 kΩ give the same answer as 100 kΩ and 200 kΩ. The **size** decides everything else: the current drawn, the power wasted, and how much the output sags when something is connected to it.

### Where you meet it
- **Scaling a voltage for a measurement.** A 12 V battery monitored by a microcontroller whose [[adc|ADC]] accepts 0–3.3 V: 30 kΩ over 10 kΩ gives a quarter, so 12 V reads as 3 V.
- **Reading a resistive sensor.** A [[thermistors-rtd|thermistor]] or light-dependent resistor in place of $R_1$ or $R_2$ turns a change of resistance into a change of voltage.
- **Setting a bias point.** The base of a transistor or the input of a comparator is often held at a fraction of the supply by a divider ([[bjt-biasing]]).
- **A potentiometer** is a divider whose ratio you set by turning a knob ([[potentiometers]]).

### Loading: the catch
The formula assumes nothing draws current from the output. Connect a load $R_L$ and it appears **in parallel with $R_2$**, so the lower half of the divider shrinks and the output falls:

$$V_\\text{out} = V_\\text{in}\\,\\frac{R_2 \\parallel R_L}{R_1 + R_2 \\parallel R_L}, \\qquad R_2 \\parallel R_L = \\frac{R_2 R_L}{R_2 + R_L}$$

The clean way to see it is [[thevenin-norton|Thévenin's theorem]]: seen from its output, any divider is a source of $V_\\text{in} R_2/(R_1+R_2)$ in series with a resistance $R_\\text{th} = R_1 \\parallel R_2$. The load and $R_\\text{th}$ form a second divider. The rule of thumb follows at once: **the load must be much larger than $R_1 \\parallel R_2$** — ten times larger costs about 10 % of the voltage for equal resistors, a hundred times about 1 %.

> [!warn] A voltage divider is not a power supply. Feeding a motor, a relay or an LED strip from a divider fails, because their current is comparable to the divider's own. Use a [[linear-regulators|regulator]] for that.

### Choosing the values
Pick the ratio from the voltages, then pick the size from two opposite pressures: small resistors waste current ($I = V_\\text{in}/(R_1 + R_2)$ flows all the time — 1.2 mA for 10 kΩ across 12 V), large ones make the output weak and noisy and let leakage or an ADC's input current shift it. For feeding a high-impedance input, a total of 10 kΩ to 100 kΩ is the usual compromise. Resistors come in standard values (the [[resistors|E12 and E24 series]]), so the exact ratio is usually approximated — the calculator below lets you check how close you get.

### Why it works
With no load, the current is $I = V_\\text{in}/(R_1 + R_2)$ ([[resistance-ohms-law|Ohm's law]] for the series pair). The voltage across $R_2$ is $I R_2$, which is the formula. The same reasoning with $R_2 \\parallel R_L$ in place of $R_2$ gives the loaded result — nothing more than [[kirchhoffs-laws|Kirchhoff's laws]] and Ohm's law.
`,
  ideas: [
    'The output is the input times R₂/(R₁ + R₂): only the ratio sets the voltage.',
    'The resistor sizes set the current wasted, and how stiff the output is.',
    'A load appears in parallel with R₂ and pulls the output down.',
    'Seen from the output, a divider is a source V_in·R₂/(R₁+R₂) behind a resistance R₁ ∥ R₂.',
    'Keep the load at least 10–100 times larger than R₁ ∥ R₂.'
  ],
  pitfalls: [
    'A divider can supply a load — Only a light one. Anything drawing comparable current changes the ratio; use a regulator or a buffer.',
    'Bigger resistors are always better because they save power — Very large values make the output sensitive to loading, leakage and noise.',
    'The output depends on the resistor values — It depends on their ratio; the values themselves set current and output impedance.'
  ],
  formulas: [
    {
      name: 'Unloaded voltage divider',
      expr: 'Vout = Vin*R2/(R1 + R2)', tex: 'V_{\\text{out}} = V_{\\text{in}}\\,\\frac{R_2}{R_1 + R_2}',
      vars: {
        Vout: { name: 'output voltage', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{\\text{in}}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 30, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_2' }
      },
      stories: {
        Vout: 'A divider of {R1} over {R2} is connected across {Vin}. What is the output voltage (no load)?',
        R1: 'You need to scale {Vin} down to {Vout} for an ADC input, with {R2} as the lower resistor. What upper resistor do you need?'
      }
    },
    {
      name: 'Divider with a load',
      expr: 'Vout = Vin*(R2*RL/(R2 + RL))/(R1 + R2*RL/(R2 + RL))',
      tex: 'V_{\\text{out}} = V_{\\text{in}}\\,\\frac{R_2 \\parallel R_L}{R_1 + R_2 \\parallel R_L}',
      vars: {
        Vout: { name: 'output voltage (loaded)', q: 'voltage', unit: 'V', tex: 'V_{\\text{out}}' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{\\text{in}}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_2' },
        RL: { name: 'load resistance', q: 'resistance', unit: 'kΩ', value: 50, tex: 'R_L' }
      },
      note: 'Solving for $R_L$ tells you the smallest load that keeps the output at a given voltage.',
      practice: { unknowns: ['Vout', 'RL'] },
      stories: { Vout: 'A 10 kΩ / 10 kΩ divider across {Vin} feeds a load of {RL}. What is the output voltage now?' }
    },
    {
      name: 'Output (Thévenin) resistance of a divider',
      expr: 'Rth = R1*R2/(R1 + R2)', tex: 'R_{\\text{th}} = R_1 \\parallel R_2 = \\frac{R_1 R_2}{R_1 + R_2}',
      vars: {
        Rth: { name: 'output resistance', q: 'resistance', unit: 'kΩ', tex: 'R_{\\text{th}}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 30, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_2' }
      }
    },
    {
      name: 'Current drawn by the divider',
      expr: 'I = Vin/(R1 + R2)', tex: 'I = \\frac{V_{\\text{in}}}{R_1 + R_2}',
      vars: {
        I: { name: 'divider current', q: 'current', unit: 'mA' },
        Vin: { name: 'input voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_{\\text{in}}' },
        R1: { name: 'upper resistor', q: 'resistance', unit: 'kΩ', value: 30, tex: 'R_1' },
        R2: { name: 'lower resistor', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_2' }
      },
      stories: { I: 'A battery monitor uses {R1} over {R2} across {Vin}, permanently connected. How much current does it drain?' }
    }
  ],
  examples: [
    {
      title: 'A battery monitor for a 3.3 V ADC',
      q: 'A lead-acid battery ranges up to 14.4 V while charging. Design a divider so the ADC input never exceeds 3.3 V, draining no more than 100 µA.',
      steps: [
        'The ratio must be at most $3.3/14.4 = 0.229$. Take $R_2/(R_1 + R_2) = 0.2$ for margin: $R_1 = 4R_2$.',
        'The current limit sets the total: $R_1 + R_2 \\ge 14.4\\ \\mathrm{V} / 100\\ \\mu\\mathrm{A} = 144\\ \\mathrm{k\\Omega}$.',
        'Standard values: $R_2 = 33\\ \\mathrm{k\\Omega}$, $R_1 = 130\\ \\mathrm{k\\Omega}$ (E24) give a ratio of $33/163 = 0.202$ and 88 µA at 14.4 V.',
        'At 14.4 V the ADC sees $14.4 \\times 0.202 = 2.92\\ \\mathrm{V}$ — safely below 3.3 V. The output resistance is $130 \\parallel 33 = 26\\ \\mathrm{k\\Omega}$; if the ADC needs a lower source impedance, add a 100 nF capacitor from the output to ground.'
      ],
      a: 'R₁ = 130 kΩ, R₂ = 33 kΩ: 2.92 V at 14.4 V, drawing 88 µA.'
    },
    {
      title: 'How much does the load pull it down?',
      q: 'A 10 kΩ / 10 kΩ divider across 10 V feeds a 20 kΩ load. What is the output voltage, and what would it be with no load?',
      steps: [
        'No load: $10 \\times 10/(10 + 10) = 5\\ \\mathrm{V}$.',
        'With the load, $R_2 \\parallel R_L = 10 \\times 20/(10 + 20) = 6.67\\ \\mathrm{k\\Omega}$.',
        '$V_\\text{out} = 10 \\times 6.67/(10 + 6.67) = 4.0\\ \\mathrm{V}$.',
        'Thévenin check: $R_\\text{th} = 5\\ \\mathrm{k\\Omega}$ and $5\\ \\mathrm{V} \\times 20/(20 + 5) = 4.0\\ \\mathrm{V}$. A load only four times $R_\\text{th}$ costs 20 %.'
      ],
      a: '4.0 V loaded, 5.0 V unloaded.'
    }
  ],
  quiz: [
    { q: 'Both resistors of a divider are doubled in value. The unloaded output voltage…', choices: ['doubles', 'halves', 'stays the same', 'drops to a quarter'], a: 2,
      why: 'Only the ratio R₂/(R₁+R₂) sets the unloaded output. Doubling both leaves it unchanged — though the current halves and the output resistance doubles.' },
    { q: 'You connect a load to a divider\'s output. The output voltage…', choices: ['rises', 'falls', 'stays the same', 'depends on which resistor is larger'], a: 1,
      why: 'The load is in parallel with R₂, lowering the effective lower resistance and so the fraction of the input across it.' },
    { q: 'Seen from its output, a 20 kΩ over 20 kΩ divider behaves like a source with an internal resistance of…', choices: ['40 kΩ', '20 kΩ', '10 kΩ', '0 Ω'], a: 2,
      why: 'The Thévenin resistance is R₁ ∥ R₂ = 20 × 20 / 40 = 10 kΩ.' },
    { q: 'A 5 V to 3.3 V level shift for a slow logic signal can be done with a 1.8 kΩ / 3.3 kΩ divider.', a: true,
      why: '5 × 3.3/(1.8 + 3.3) = 3.24 V: fine for a slow signal into a high-impedance CMOS input. For fast edges the divider\'s resistance and the input capacitance slow things down.' },
    { q: 'Why is a voltage divider a poor way to power a 5 V motor from 12 V?', choices: ['Resistors cannot take 12 V', 'The motor\'s current changes the ratio and wastes power', 'Dividers only work with AC', 'The output would be too high'], a: 1,
      why: 'The motor draws a large, varying current in parallel with R₂; the voltage sags and the resistors burn power. A regulator (or a PWM driver) is the right tool.' }
  ],
  applications: ['Battery and supply monitoring with a microcontroller ADC.', 'Thermistor, LDR and potentiometer sensors.', 'Bias networks for transistors and reference voltages for comparators.', 'Setting the output voltage of adjustable regulators (the feedback divider).'],
  sim: 'ref-divider'
}

);
