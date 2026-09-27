/* HYPER-PNEUMATICS · content/vacuum.js
 * Branch "Vacuum Technology": vacuum, its units, ejectors and pumps (vacuum-basics-topic), and vacuum
 * handling — cups, holding force, leaks, circuits, safety and energy (vacuum-handling).
 * Simulations in sims/vacuum.js (prefix vac-).
 */
Hyper.add(

/* ================================================================ VACUUM */
{
  id: 'vacuum-basics', parent: 'vacuum-basics-topic', title: 'What vacuum is', level: 1,
  short: 'In pneumatics, vacuum means any pressure below the surrounding atmosphere. Nothing sucks: take air out from behind a cup and the atmosphere pushes the part on — never more than about 10 N on each square centimetre, however good the vacuum.',
  keywords: ['vacuum', 'negative pressure', 'suction', 'atmospheric pressure', 'partial vacuum', 'suction cup', '10 N/cm²', 'Magdeburg hemispheres', 'altitude', 'vacuum handling', 'molecules'],
  prereq: ['absolute-gauge-pressure', 'physics:pressure', 'physics:kinetic-theory-gases'],
  related: ['vacuum-units', 'suction-cups', 'holding-force', 'ejectors', 'vacuum-pumps', 'air-composition', 'physics:hydrostatic-pressure', 'aerodynamics:standard-atmosphere'],
  body: `
Press a suction cup onto a tile and it stays there; drink through a straw and the juice rises. It feels as if something pulls — but a vacuum cannot pull on anything. What happens is that the air on one side has been thinned out, and the **atmosphere on the other side pushes**. In pneumatics, *vacuum* means any pressure below the surrounding atmosphere, from a slight dip to almost nothing at all; the handling world mostly lives between 20 % and 90 % below atmospheric pressure.

### The atmosphere does the pushing
Air at sea level is a crowd of about $2.5\\times10^{25}$ molecules in every cubic metre, each moving at around 500 m/s. Their impacts on any surface add up to 101.3 kPa — **10.1 newtons on every square centimetre**, about the weight of a one-kilogram bag of sugar on a postage stamp. We do not notice because the same push acts on every side of everything. Pump half the molecules out from behind a suction cup and only half as many hit the part from the inside: the part is pressed against the cup by the difference,

$$F = (p_\\text{atm} - p)\\,A$$

with $p$ the **absolute** pressure left in the cup and $A$ its area (see [[physics:pressure|pressure]] and [[absolute-gauge-pressure]]).

### The ceiling: about 10 N/cm²
Even a perfect vacuum, $p = 0$, only removes the inner push; the outer push, the atmosphere, is all there is. So a cup can never hold more than $p_\\text{atm}A$, about 10 N per cm² at sea level — while a pneumatic cylinder at 6 bar gauge pushes with 60 N per cm². In vacuum handling, **area is the lever**, not pressure:

| Cup diameter | Area | Perfect vacuum (the ceiling) | At −60 kPa (a typical working vacuum) |
|---|---|---|---|
| 20 mm | 3.14 cm² | 31.8 N | 18.8 N |
| 40 mm | 12.6 cm² | 127 N | 75.4 N |
| 100 mm | 78.5 cm² | 796 N | 471 N |
| 200 mm | 314 cm² | 3.18 kN | 1.88 kN |

Going from 60 % to 90 % vacuum adds half again to the force; going from 90 % to 99.9 % adds only another 11 % — and costs far more time and energy. That is why handling systems work at a moderate vacuum, typically −0.6 to −0.8 bar gauge (see [[vacuum-units]]).

### The atmosphere is not a constant
Because the atmosphere does the work, the holding force follows the weather and, much more, the altitude. Weather moves the pressure by a few per cent (980–1040 mbar). Height matters more: the air pressure is about 845 mbar at 1500 m and 795 mbar at 2000 m, so the same cups and the same ejector — which reaches a *share* of the local atmosphere — hold about 22 % less in a plant at 2000 m than at the coast. Machines sold for high-altitude sites must be sized for it.

### Where vacuum is used
- **Handling**: suction cups on robots, pick-and-place units and hand-guided lifters move sheet metal, glass, boxes, bags, wood panels and electronic parts (see [[suction-cups]] and [[holding-force]]).
- **Holding and clamping**: vacuum tables hold workpieces on routers; vacuum chucks hold wafers and thin parts without clamps.
- **Forming and packaging**: thermoforming draws soft plastic over a mould; vacuum packing removes the air from food packs.
- **Processes**: at 100 mbar absolute water boils at about 46 °C, so vacuum dries, degasses and distils gently.
- **Vehicles**: the vacuum from an engine intake or a small pump assists the brakes of many cars.

Deeper vacuum — for coating, electron microscopes and particle accelerators — belongs to physics laboratories and process plants; the principles of handling rest on the rough end of the scale.

> [!key] A vacuum does not pull. The atmosphere pushes, so the force is the pressure difference times the area — at most about 10 N/cm², and less at altitude.

> [!warn] A part held by vacuum falls the moment the vacuum is lost — when the power or the air fails, a hose comes off or a cup tears. Never stand or reach under a vacuum-lifted load (see [[vacuum-safety]]), and never put a suction cup on skin: even a small cup can burst blood vessels.
`,
  ideas: [
    'Vacuum means pressure below the surrounding atmosphere; in handling, usually 20–90 % below it.',
    'Nothing sucks: the atmosphere pushes the part onto the cup with the pressure difference times the area.',
    'The atmosphere sets a hard ceiling of about 10 N/cm² at sea level, so cup area — not a deeper vacuum — is how to get more force.',
    'The holding force falls with altitude and a little with the weather, because the atmosphere does the pushing.',
    'Beyond about 80 % vacuum, each extra per cent adds little force but costs time and energy.'
  ],
  pitfalls: [
    'A vacuum pulls the part onto the cup — Nothing pulls; the surrounding air pushes, and it can push with no more than its own pressure, about 10 N/cm² at sea level.',
    'A better vacuum pump will make a cup hold many times more — Going from 90 % to 99.9 % vacuum raises the force by only 11 %; a bigger cup or more cups is the way to more force.',
    'A gripper works the same everywhere — The atmosphere is weaker at altitude: at 2000 m the same cups and ejector hold about a fifth less than at sea level.'
  ],
  formulas: [
    {
      name: 'Force from a vacuum',
      expr: 'F = (patm - p)*A', tex: 'F = (p_\\text{atm} - p)\\,A',
      vars: {
        F: { name: 'force pressing the part on', q: 'force', unit: 'N' },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'mbar', value: 1013, tex: 'p_\\text{atm}' },
        p: { name: 'pressure left in the cup (absolute)', q: 'pressure', unit: 'mbar', value: 400, tex: 'p' },
        A: { name: 'area sealed by the cup', q: 'area', unit: 'cm²', value: 12.57 }
      },
      note: 'Theoretical: a perfect seal and the full area. With $p = 0$ it gives the ceiling $p_\\text{atm}A$ — about 10.1 N/cm² at sea level.',
      practice: { unknowns: ['F', 'p', 'A'] },
      stories: {
        F: 'A cup of area {A} is evacuated to {p} while the atmosphere is at {patm}. With what force is the part pressed on?',
        A: 'A part must be pressed on with {F} by a vacuum of {p} (the atmosphere is at {patm}). What cup area is needed?',
        p: 'A cup of area {A} must press a part on with {F}; the atmosphere is at {patm}. To what absolute pressure must the cup be evacuated?'
      }
    },
    {
      name: 'Atmospheric pressure at altitude (standard atmosphere)',
      expr: 'patm = p0*(1 - 2.25577e-5*h)^5.25588', tex: 'p_\\text{atm} = p_0\\left(1 - 2.256\\times10^{-5}\\,h\\right)^{5.256}',
      vars: {
        patm: { name: 'atmospheric pressure at the site (absolute)', q: 'pressure', unit: 'mbar', tex: 'p_\\text{atm}' },
        p0: { name: 'sea-level pressure (absolute)', q: 'pressure', unit: 'mbar', value: 1013.25, fixed: true, tex: 'p_0' },
        h: { name: 'altitude of the site (in metres in the formula)', q: 'length', unit: 'm', value: 2000, min: 0, max: 11000 }
      },
      note: 'The ISA troposphere (valid to 11 km), with $h$ in metres. Real pressure varies with the weather by a few per cent around it. Everything a vacuum can do scales with $p_\\text{atm}$.',
      practice: { unknowns: ['patm', 'h'] },
      stories: {
        patm: 'A packaging machine is installed at {h}. What is the standard atmospheric pressure there?',
        h: 'The standard atmospheric pressure at a site is {patm}. At what altitude is it?'
      }
    }
  ],
  examples: [
    {
      title: 'How much can one cup hold?',
      q: 'A flat cup with an effective diameter of 100 mm lifts a smooth horizontal plate at sea level. What is the most it could ever hold, what does it hold at a working vacuum of −60 kPa, and how heavy may the plate be with a safety factor of 2 and no acceleration?',
      steps: [
        'Area: $A = \\pi \\times 0.1^2/4 = 7.854\\times10^{-3}$ m² = 78.5 cm².',
        'Ceiling (perfect vacuum): $101\\,325 \\times 7.854\\times10^{-3} = 796$ N — the weight of 81 kg.',
        'At −60 kPa: $60\\,000 \\times 7.854\\times10^{-3} = 471$ N.',
        'With a safety factor of 2: $471/(2 \\times 9.81) = 24$ kg.'
      ],
      a: 'At most 796 N; 471 N at −60 kPa; a plate of up to about 24 kg with a safety factor of 2.'
    },
    {
      title: 'The same gripper in the mountains',
      q: 'A gripper with a 40 mm cup and an ejector that reaches 85 % of the local atmosphere is moved from a plant at sea level (1013 mbar) to one at 2000 m. How does its holding force change?',
      steps: [
        'At 2000 m the standard atmosphere is $1013.25\\,(1 - 2.256\\times10^{-5}\\times 2000)^{5.256} = 795$ mbar.',
        'Vacuum reached: at sea level $0.85 \\times 1013 = 861$ mbar below atmosphere; at 2000 m $0.85 \\times 795 = 676$ mbar.',
        'Area $12.57$ cm²: force $86.1\\text{ kPa} \\times 12.57\\times10^{-4}\\text{ m}^2 = 108$ N at sea level, $67.6\\text{ kPa} \\times 12.57\\times10^{-4}\\text{ m}^2 = 85$ N at 2000 m.'
      ],
      a: 'It falls from about 108 N to 85 N — some 22 % less, because the atmosphere that does the pushing is weaker.'
    }
  ],
  quiz: [
    { q: 'A suction cup holds a steel sheet because…', choices: ['the vacuum pulls the sheet towards the cup', 'the atmosphere pushes the sheet against the cup harder than the thinned air inside pushes back', 'the rubber sticks to the steel', 'the ejector\'s air jet blows the sheet onto the cup'], a: 1,
      why: 'A vacuum exerts no force of its own. The surrounding air pushes on the outside of the sheet; with fewer molecules inside the cup, the push from inside is smaller, and the difference holds the sheet.' },
    { q: 'What is the largest force a cup of 50 mm effective diameter could ever exert at sea level (1013 mbar)?', answer: 199, unit: 'N', tol: 0.03,
      why: 'A = π × 0.05²/4 = 1.963×10⁻³ m²; with a perfect vacuum F = 101 325 × 1.963×10⁻³ = 199 N. No pump can do better.' },
    { q: 'A pump reaching 99.9 % vacuum makes a cup hold about ten times as much as an ejector reaching 90 %.', a: false,
      why: 'The force is proportional to the pressure difference: 0.999/0.90 = 1.11, only 11 % more.' },
    { q: 'A gripper that holds its part with a safety factor of 2.2 at sea level is installed at 2000 m with the same ejector. Its safety factor becomes about…', choices: ['2.2 — vacuum does not depend on the air outside', '1.7', '2.8, because thinner air leaks less', '0 — ejectors do not work at altitude'], a: 1,
      why: 'The ejector reaches a similar share of the local atmosphere, which is 795/1013 = 0.78 of the sea-level value; 2.2 × 0.78 ≈ 1.7 — below the usual minimum of 2.' },
    { q: 'Doubling a cup\'s diameter at the same vacuum multiplies its force by…', choices: ['2', '4', '√2', '8'], a: 1,
      why: 'Force is pressure difference times area, and area grows with the square of the diameter.' }
  ],
  problems: [
    { q: 'A 60 mm cup is evacuated to 350 mbar absolute while the atmosphere is at 1013 mbar. What force presses the part on?', answer: 187.5, unit: 'N', tol: 0.02,
      steps: ['$A = \\pi \\times 0.06^2/4 = 2.827\\times10^{-3}$ m².', '$\\Delta p = 1013 - 350 = 663$ mbar = 66 300 Pa.', '$F = 66\\,300 \\times 2.827\\times10^{-3} = 187.5$ N.'] }
  ],
  applications: ['Robot and gantry grippers handling sheet metal, glass, boxes and electronic parts.', 'Vacuum clamping tables on CNC routers and vacuum chucks for wafers and thin parts.', 'Thermoforming, vacuum packaging and vacuum drying at low temperature.', 'Brake boosters in cars, fed by the engine\'s intake vacuum or a small pump.'],
  history: 'In 1643 Evangelista Torricelli showed that the atmosphere holds up a column of mercury about 760 mm high, with nothing above it. In 1654 Otto von Guericke, mayor of Magdeburg, demonstrated before the Imperial Diet in Regensburg that teams of horses could not pull apart two copper hemispheres about half a metre across once he had pumped most of the air out — the atmosphere pressed them together with the equivalent of a couple of tonnes. He had built the first air pump to do it.',
  sim: 'vac-cup-force'
},

{
  id: 'vacuum-units', parent: 'vacuum-basics-topic', title: 'Vacuum levels and units', level: 1,
  short: 'One vacuum, many numbers: 400 mbar absolute is −61 kPa gauge, 60 % vacuum, 18 inHg of vacuum or 300 Torr. Absolute scales count from a perfect vacuum, gauge scales from the local atmosphere — and handling works in the rough-vacuum range, typically −0.6 to −0.8 bar.',
  keywords: ['vacuum units', 'absolute pressure', 'negative gauge pressure', 'percent vacuum', 'mbar', 'kPa', 'inHg', 'Torr', 'rough vacuum', 'medium vacuum', 'high vacuum', 'vacuum gauge', 'vacuum switch', 'mean free path'],
  prereq: ['vacuum-basics', 'absolute-gauge-pressure'],
  related: ['pressure-switches', 'ejectors', 'vacuum-pumps', 'vacuum-leakage', 'physics:mean-free-path', 'aerodynamics:standard-atmosphere'],
  body: `
A vacuum can be measured from two zeros: from a **perfect vacuum** (absolute pressure) or from the **local atmosphere** (gauge pressure, negative below it). Both are in daily use, often side by side, and confusing them is the commonest mistake in vacuum work. The rule from [[absolute-gauge-pressure]] still holds:

$$p_g = p_\\text{abs} - p_\\text{atm}$$

so a vacuum is a *negative* gauge pressure, and it can never be more negative than the atmosphere itself: −1.013 bar gauge is a perfect vacuum at sea level.

### One vacuum, five numbers
Here is the same state — 400 mbar absolute with the atmosphere at 1013 mbar — in the scales you will meet:

| Scale | Zero at | Value | Typical users |
|---|---|---|---|
| Absolute (mbar, hPa, kPa) | perfect vacuum | 400 mbar = 40 kPa abs | pumps, process vacuum, laboratories |
| Gauge (kPa, bar) | atmosphere | −61.3 kPa = −0.613 bar | handling catalogues, gauges and switches |
| Per cent vacuum | atmosphere | 60.5 % | ejector data, handling |
| Inches of mercury (vacuum) | atmosphere | 18.1 inHg | American practice (0–29.9 inHg) |
| Torr (= mmHg, absolute) | perfect vacuum | 300 Torr | science, older pump data |

Per cent vacuum is the pressure difference as a share of the atmosphere, $v = (p_\\text{atm} - p)/p_\\text{atm}$: 0 % is no vacuum, 100 % a perfect one. It is convenient because an ejector reaches roughly the same *percentage* anywhere — but that makes it a relative number: 85 % is −86 kPa at the coast and only −68 kPa at 2000 m, where the atmosphere is 795 mbar (see [[vacuum-basics]]).

> [!tip] Always write which zero you mean: "−0.7 bar (gauge)", "300 mbar abs", "70 % vacuum". A bare "0.7 bar vacuum" has been read both ways, with expensive results.

### Levels of vacuum
The full range spans more than ten decades, and each part of it behaves differently, because the molecules get so far apart that they stop colliding with each other and only hit the walls. The [[physics:mean-free-path|mean free path]] — the average distance a molecule flies between collisions — is about 66 nm at atmospheric pressure, 0.07 mm at 1 mbar and 7 cm at $10^{-3}$ mbar.

| Range | Absolute pressure | Molecules fly… | Used for |
|---|---|---|---|
| Rough (low) vacuum | 1013 – 1 mbar | as a flowing gas | handling, clamping, packaging, conveying, drying |
| Medium (fine) vacuum | 1 – $10^{-3}$ mbar | in a transition | freeze-drying, degassing, vacuum furnaces |
| High vacuum | $10^{-3}$ – $10^{-7}$ mbar | wall to wall | coatings, electron beams and microscopes |
| Ultra-high vacuum | below $10^{-7}$ mbar | wall to wall, rarely | surface science, particle accelerators |

The boundaries differ a little between standards and textbooks; the picture does not. All of pneumatic handling sits in the first decade of the rough range.

### What handling needs
| Application | Typical working vacuum |
|---|---|
| Smooth, tight parts: sheet metal, glass, plastics | −0.6 to −0.8 bar (60–80 %) |
| Porous parts: cardboard, wood, textiles | −0.2 to −0.5 bar, with much more flow |
| Thin film, bags, delicate parts | −0.2 to −0.4 bar, soft cups |
| An ejector's limit, sealed | about −0.85 to −0.9 bar (85–90 %) |

A vacuum switch usually confirms the grip at a set point such as −0.5 bar, with a hysteresis of 5–15 kPa, and an air-saving ejector switches itself off at a higher set point (see [[vacuum-circuits]] and [[vacuum-energy]]). Pressure switches and sensors for vacuum read the same way as those for positive pressure (see [[pressure-switches]]); a mechanical vacuum gauge reads 0 to −1 bar, the needle moving the other way from a pressure gauge.
`,
  ideas: [
    'Absolute pressure counts from a perfect vacuum; gauge pressure from the local atmosphere, and a vacuum is a negative gauge pressure.',
    'Per cent vacuum is the pressure difference as a share of the atmosphere: 0 % none, 100 % perfect.',
    'The same absolute pressure is a different gauge reading and percentage at a different altitude or weather.',
    'Handling lives in the rough-vacuum range, typically −0.6 to −0.8 bar for tight parts and less, with more flow, for porous ones.',
    'Deeper ranges behave differently because molecules stop colliding with each other and only hit the walls.'
  ],
  pitfalls: [
    '−0.9 bar and 0.9 bar absolute are the same vacuum — They are opposites: −0.9 bar gauge is about 0.11 bar absolute, a deep vacuum; 0.9 bar absolute is a mere 11 % vacuum.',
    'A percentage of vacuum is a fixed pressure — It is a share of the local atmosphere, which varies with the weather and falls with altitude; 85 % is −86 kPa at sea level but −68 kPa at 2000 m.',
    'Absolute pressure can go below zero — A perfect vacuum is zero absolute; the most negative gauge pressure possible is minus the atmospheric pressure.'
  ],
  formulas: [
    {
      name: 'Gauge reading of a vacuum',
      expr: 'pg = p - patm', tex: 'p_g = p_\\text{abs} - p_\\text{atm}',
      vars: {
        pg: { name: 'gauge pressure (negative for a vacuum)', q: 'pressure', unit: 'kPa', signed: true, tex: 'p_g' },
        p: { name: 'absolute pressure in the system', q: 'pressure', unit: 'mbar', value: 400, tex: 'p_\\text{abs}' },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'mbar', value: 1013, tex: 'p_\\text{atm}' }
      },
      note: 'Switch the units of any variable to see the same state in bar, kPa, inHg or Torr.',
      practice: { unknowns: ['pg', 'p'] },
      stories: {
        pg: 'A cup is evacuated to {p} while the atmosphere is at {patm}. What does a vacuum gauge on it read?',
        p: 'A vacuum gauge reads {pg} while the atmosphere is at {patm}. What is the absolute pressure?'
      }
    },
    {
      name: 'Vacuum as a percentage',
      expr: 'v = (patm - p)/patm', tex: 'v = \\frac{p_\\text{atm} - p_\\text{abs}}{p_\\text{atm}}',
      vars: {
        v: { name: 'vacuum as a share of the atmosphere', q: 'ratio', unit: '%', min: 0, max: 100 },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'mbar', value: 1013, tex: 'p_\\text{atm}' },
        p: { name: 'absolute pressure in the system', q: 'pressure', unit: 'mbar', value: 400, tex: 'p_\\text{abs}' }
      },
      note: 'Relative to the local atmosphere; an ejector reaches a similar percentage at any altitude, so its gauge reading falls where the air is thinner.',
      practice: { unknowns: ['v', 'p'] },
      stories: {
        v: 'The absolute pressure in a cup is {p} with the atmosphere at {patm}. What percentage vacuum is that?',
        p: 'An ejector reaches {v} where the atmosphere is at {patm}. What absolute pressure is left in the cup?'
      }
    }
  ],
  examples: [
    {
      title: 'One vacuum, five numbers',
      q: 'A gauge on a gripper reads −75 kPa on a day when the atmosphere is at 1000 mbar. Express the vacuum as an absolute pressure, a percentage, inches of mercury of vacuum and Torr absolute.',
      steps: [
        'Absolute: $p = p_g + p_\\text{atm} = -75 + 100 = 25$ kPa = 250 mbar abs.',
        'Percentage: $v = 75/100 = 75$ %.',
        'Inches of mercury below atmosphere: $75\\,000/3386.4 = 22.1$ inHg.',
        'Torr absolute: $25\\,000/133.32 = 187.5$ Torr.'
      ],
      a: '250 mbar abs = 75 % vacuum = 22.1 inHg of vacuum = 187.5 Torr abs.'
    },
    {
      title: '"85 % vacuum" at two sites',
      q: 'A catalogue says an ejector reaches 85 % vacuum. What will its gauge read, and what absolute pressure will it leave, at sea level (1013 mbar) and at 2000 m (795 mbar)?',
      steps: [
        'Sea level: $0.85 \\times 1013 = 861$ mbar below atmosphere: the gauge reads −86.1 kPa; absolute $1013 - 861 = 152$ mbar.',
        'At 2000 m: $0.85 \\times 795 = 676$ mbar: the gauge reads −67.6 kPa; absolute $795 - 676 = 119$ mbar.'
      ],
      a: 'Sea level: −86.1 kPa gauge, 152 mbar abs. At 2000 m: −67.6 kPa gauge, 119 mbar abs — a deeper absolute vacuum, but less holding force.'
    }
  ],
  quiz: [
    { q: 'A vacuum gauge reads −0.6 bar at sea level. The absolute pressure in the system is about…', choices: ['0.6 bar', '0.4 bar', '1.6 bar', '−0.6 bar'], a: 1,
      why: 'Absolute = gauge + atmospheric = −0.6 + 1.013 ≈ 0.41 bar.' },
    { q: 'What percentage vacuum is 300 mbar absolute when the atmosphere is at 1013 mbar? (Answer in per cent.)', answer: 70.4, tol: 0.02,
      why: 'v = (1013 − 300)/1013 = 0.704 = 70.4 %.' },
    { q: '"Rough vacuum" means a poor-quality vacuum that a good handling system should avoid.', a: false,
      why: 'Rough (low) vacuum is simply the range from atmospheric pressure down to about 1 mbar. All vacuum handling works in it, and deeper vacuum would only cost time and energy.' },
    { q: 'An American data sheet gives a vacuum of 25 inHg. How many kPa below atmosphere is that?', answer: 84.7, unit: 'kPa', tol: 0.02,
      why: '1 inHg = 3.386 kPa, so 25 inHg = 84.7 kPa below atmosphere — about 84 % vacuum at sea level.' },
    { q: 'Which of these scales reads zero for a perfect vacuum?', choices: ['Gauge pressure in kPa', 'Per cent vacuum', 'Torr', 'Inches of mercury of vacuum'], a: 2,
      why: 'Torr (like mbar absolute) counts from a perfect vacuum. Gauge, per cent vacuum and inHg of vacuum count from the atmosphere: a perfect vacuum is −101 kPa, 100 % or 29.9 inHg on them.' }
  ],
  problems: [
    { q: 'A vacuum switch is set to −55 kPa (gauge). What absolute pressure does that correspond to at a site where the atmosphere is at 900 mbar?', answer: 350, unit: 'mbar', tol: 0.02,
      steps: ['$p_\\text{abs} = p_g + p_\\text{atm} = -550 + 900 = 350$ mbar.'] }
  ],
  applications: ['Reading ejector and pump data sheets that use different scales.', 'Setting vacuum switches and checking gauges on grippers.', 'Specifying machines for sites at altitude.', 'Choosing a pump type for process vacuum: rough, medium or high.'],
  sim: 'vac-scales'
},

{
  id: 'ejectors', parent: 'vacuum-basics-topic', title: 'Vacuum ejectors', level: 2,
  short: 'An ejector makes vacuum out of compressed air: a jet from a small nozzle drags the surrounding air along and out through a diffuser. No moving parts, instant response, small enough to sit on the cup — but it consumes compressed air all the time it runs.',
  keywords: ['ejector', 'vacuum generator', 'venturi', 'Coanda', 'nozzle', 'diffuser', 'entrainment', 'multi-stage ejector', 'single-stage ejector', 'suction flow', 'air consumption', 'air-saving ejector', 'non-return valve', 'optimum supply pressure'],
  prereq: ['vacuum-basics', 'choked-flow', 'physics:bernoullis-equation'],
  related: ['vacuum-pumps', 'vacuum-leakage', 'vacuum-circuits', 'vacuum-energy', 'sonic-conductance', 'aerodynamics:nozzles', 'aerodynamics:momentum-equation', 'hydraulics:venturi-meter'],
  body: `
Most of the vacuum in factory automation is made by a small block with no moving parts. Compressed air at 4–6 bar enters, blows through a nozzle of 0.5–3 mm and leaves through a silencer; a side port on the block sucks. This is the **vacuum ejector**, also called a venturi or vacuum generator. It weighs a few grams to a few hundred, switches on and off in milliseconds with its supply valve, needs no electricity at the gripper — and turns a good deal of expensive compressed air into a modest flow of vacuum.

### How a jet makes vacuum
The supply air expands through the nozzle to the speed of sound and beyond — the pressure ratio across it is far below the critical 0.53, so the nozzle is [[choked-flow|choked]] — and leaves as a jet of 300–500 m/s. A fast jet in still air does not stay alone: turbulent mixing at its edge drags neighbouring air along (**entrainment**), handing it momentum. The ejector surrounds the jet with a small chamber connected to the suction port; the jet carries air out of that chamber faster than it can come back, so the chamber's pressure falls. Downstream, a **diffuser** — a passage that widens gently — slows the mixed stream down so its pressure climbs back to atmospheric at the exhaust, exactly as in a [[physics:bernoullis-equation|Bernoulli]] venturi run backwards. **Coanda** ejectors and air amplifiers use an annular jet that clings to a curved surface, which entrains even more air at low vacuum.

### Two curves describe an ejector
**Suction flow against vacuum.** With the suction port open the ejector moves its largest flow of free air; as the vacuum deepens the flow falls, reaching zero at the ejector's **maximum vacuum** — typically 85–90 % for a single-stage ejector designed for high vacuum. A straight line from the open-port flow $q_0$ to the maximum vacuum is a fair first model. Where this curve meets the leak of the part and cups is where the vacuum settles (see [[vacuum-leakage]]).

**Vacuum and air against supply pressure.** The air consumption rises in proportion to the absolute supply pressure, because the nozzle is choked:

$$Q_\\text{air} = C\\,p_1 \\;\\propto\\; d^2 (p_g + p_\\text{atm})$$

But the vacuum does not keep rising. It climbs to a maximum at the ejector's **optimum supply pressure** — commonly 4–6 bar gauge — and then stays flat or even falls, because the jet no longer expands correctly in the mixing chamber. Supplying more than the optimum only wastes air; set the regulator to it.

Typical single-stage ejectors at 5 bar gauge (rounded; the suction flow depends a great deal on the design):

| Nozzle | Air consumption | Suction flow, open port | Maximum vacuum |
|---|---|---|---|
| 0.5 mm | 13 L/min | 6 L/min | 85–90 % |
| 0.7 mm | 25 L/min | 11 L/min | 85–90 % |
| 1.0 mm | 51 L/min | 23 L/min | 85–90 % |
| 1.5 mm | 114 L/min | 51 L/min | 85–90 % |
| 2.0 mm | 203 L/min | 91 L/min | 85–90 % |

All flows are free air (L/min ANR, see [[standard-air]]). Note the ratio: roughly two litres of compressed free air for every litre sucked at an open port, and far more at a working vacuum, where the suction flow is smaller.

### Single-stage and multi-stage
A **multi-stage** ejector places two or three diffusers in a row, each with its own suction openings behind flap valves. While the vacuum is low, every stage draws air and the suction flow is two to three times that of a single stage using the same compressed air; as the vacuum deepens, the later flaps close one by one and only the first stage keeps working, so the maximum vacuum is about the same. Multi-stage ejectors suit large volumes and porous parts, where much air must be moved at moderate vacuum; single-stage ones are compact, reach high vacuum quickly in small volumes, and suit the typical small gripper. A single-stage nozzle can also be tuned for flow instead of vacuum — more suction, but only 50–60 % maximum vacuum.

### Air-saving ejectors
An ejector running while a sealed part is simply being held is pure waste. **Air-saving** (or energy-saving) ejectors add a non-return valve between the nozzle and the cup and a vacuum switch: the ejector runs until the upper set point is reached, then switches its own supply off while the non-return valve holds the vacuum; if leakage lets the vacuum fall to the lower set point, it runs again briefly. With tight parts the ejector runs for a fraction of a second per pick, and the saving is typically 80–90 % (see [[vacuum-energy]]). Most include a blow-off valve for releasing the part.

> [!key] An ejector trades compressed air for vacuum. Its air use is set by the nozzle and the supply pressure alone; its vacuum peaks at an optimum supply pressure; its suction flow falls from a maximum at an open port to zero at its maximum vacuum.

> [!warn] An ejector exhausts its whole air flow — loud without a silencer, often 70–80 dB(A) and more — and its vacuum collapses within milliseconds when its supply stops, unless a non-return valve holds it. Plan for both (see [[vacuum-safety]] and [[noise-silencers]]).
`,
  ideas: [
    'A supersonic jet entrains the surrounding air; the chamber around it falls below atmospheric pressure and the diffuser returns the mixed stream to the atmosphere.',
    'The air consumption is set by the choked nozzle: proportional to its area and to the absolute supply pressure, whatever the vacuum.',
    'The suction flow falls from its open-port maximum to zero at the maximum vacuum, typically 85–90 % for a single stage.',
    'Vacuum peaks at an optimum supply pressure, usually 4–6 bar; more pressure only wastes air.',
    'Multi-stage ejectors move two to three times more air at low vacuum for the same compressed air; air-saving ejectors switch off once the part is sealed.'
  ],
  pitfalls: [
    'More supply pressure gives more vacuum — Above the optimum (typically 4–6 bar) the vacuum stays flat or falls, while the air consumption keeps rising in proportion to the absolute supply pressure.',
    'The suction flow is the air the ejector consumes — They are different streams: the nozzle\'s compressed air drives the jet, and the suction flow is the air it drags out of the cup, typically only half as much at an open port and far less near the maximum vacuum.',
    'A multi-stage ejector reaches a deeper vacuum — It moves more air at low vacuum; its maximum vacuum is set by the first stage and is about the same as a single-stage ejector\'s.'
  ],
  formulas: [
    {
      name: 'Air consumption of an ejector nozzle',
      expr: 'Q = 0.0404*Cd*pi*d^2/4*(p + patm)/(sqrt(T)*rho)', tex: 'Q_\\text{air} = \\dfrac{0.0404\\,C_d\\,\\pi d^2\\,(p_g + p_\\text{atm})}{4\\,\\rho_\\text{ANR}\\sqrt{T_1}}',
      vars: {
        Q: { name: 'air consumption (free air)', q: 'airflow', unit: 'L/min ANR', tex: 'Q_\\text{air}' },
        Cd: { name: 'discharge coefficient of the nozzle', value: 0.9, min: 0.3, max: 1, tex: 'C_d' },
        d: { name: 'nozzle diameter', q: 'length', unit: 'mm', value: 1 },
        p: { name: 'supply pressure at the ejector (gauge)', q: 'pressure', unit: 'bar', value: 5, tex: 'p_g' },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        T: { name: 'supply air temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        rho: { name: 'density of free air (ISO 8778)', q: 'density', unit: 'kg/m³', value: 1.185, fixed: true, tex: '\\rho_\\text{ANR}' }
      },
      note: 'Choked flow of air through a nozzle ($\\gamma = 1.4$): the mass flux is $0.0404\\,p_1/\\sqrt{T_1}$ per unit area (in SI units), converted to free air. It holds whatever the vacuum at the suction port, because the nozzle stays choked. About 51 L/min for a 1 mm nozzle at 5 bar.',
      practice: { unknowns: ['Q', 'd', 'p'] },
      stories: {
        Q: 'An ejector with a {d} nozzle (discharge coefficient {Cd}) is supplied at {p} with air at {T}. How much free air does it consume?',
        d: 'An ejector may consume at most {Q} at {p} (air at {T}, discharge coefficient {Cd}). What nozzle diameter does that allow?',
        p: 'An ejector with a {d} nozzle (discharge coefficient {Cd}) consumes {Q} with air at {T}. At what gauge pressure is it supplied?'
      }
    },
    {
      name: 'Suction characteristic (straight-line model)',
      expr: 'qs = q0*(1 - dp/dpmax)', tex: 'q_s = q_0\\left(1 - \\frac{\\Delta p}{\\Delta p_\\text{max}}\\right)',
      vars: {
        qs: { name: 'suction flow at this vacuum (free air)', q: 'airflow', unit: 'L/min ANR', tex: 'q_s' },
        q0: { name: 'suction flow with the port open (free air)', q: 'airflow', unit: 'L/min ANR', value: 23, tex: 'q_0' },
        dp: { name: 'vacuum: atmosphere minus absolute pressure', q: 'pressure', unit: 'kPa', value: 60, tex: '\\Delta p' },
        dpmax: { name: 'maximum vacuum of the ejector (below atmosphere)', q: 'pressure', unit: 'kPa', value: 88, tex: '\\Delta p_\\text{max}' }
      },
      note: 'A first approximation of a single-stage ejector\'s curve. Real curves bow a little; multi-stage ejectors give much more flow at low vacuum and join the single-stage line near the maximum.',
      practice: { unknowns: ['qs', 'dp'] },
      stories: {
        qs: 'An ejector sucks {q0} with its port open and reaches at most {dpmax} below atmosphere. How much does it still suck at a vacuum of {dp}?',
        dp: 'An ejector sucks {q0} with its port open and reaches at most {dpmax}. At what vacuum does its suction flow fall to {qs}?'
      }
    }
  ],
  examples: [
    {
      title: 'What a 1 mm ejector uses',
      q: 'An ejector with a 1.0 mm nozzle ($C_d = 0.9$) is supplied at 5 bar gauge and runs continuously for 4000 hours a year. The compressor needs 0.11 kWh per cubic metre of free air, and electricity costs ¤0.15 per kWh. What does it consume and cost?',
      steps: [
        'Nozzle area $\\pi \\times (10^{-3})^2/4 = 7.854\\times10^{-7}$ m².',
        { text: 'Choked flow:', tex: 'Q = \\frac{0.0404 \\times 0.9 \\times 7.854\\times10^{-7} \\times 6.013\\times10^{5}}{1.185 \\times \\sqrt{293.15}} = 8.46\\times10^{-4}\\ \\text{m}^3/\\text{s} = 50.8\\ \\text{L/min}' },
        'Per hour: $50.8 \\times 60 = 3050$ L = 3.05 m³ of free air, needing $3.05 \\times 0.11 = 0.335$ kWh.',
        'Per year: $0.335 \\times 4000 = 1340$ kWh, costing about ¤201.'
      ],
      a: 'About 51 L/min of free air, 1340 kWh and ¤200 a year — for a gripper that sucks only about 23 L/min even with its port wide open.'
    },
    {
      title: 'More pressure is not more vacuum',
      q: 'The ejector above reaches its best vacuum at 4.8 bar. A technician raises its supply from 5 to 7 bar "to get a better grip". What happens?',
      steps: [
        'Air consumption scales with the absolute supply pressure: $(7 + 1.013)/(5 + 1.013) = 1.33$ — a third more air.',
        'The vacuum was already at its maximum near 5 bar; above the optimum it stays flat or falls a little, so the grip does not improve.',
        'The right move is the opposite: set the regulator to the optimum and, if the grip is weak, look for leaks or larger cups.'
      ],
      a: 'A third more air for no more vacuum — possibly a little less.'
    },
    {
      title: 'Suction at a working vacuum',
      q: 'The same ejector sucks 23 L/min with its port open and reaches at most 88 kPa below atmosphere. How much does it suck when the cup is at −60 kPa?',
      steps: ['$q_s = 23\\,(1 - 60/88) = 23 \\times 0.318 = 7.3$ L/min of free air.'],
      a: 'About 7.3 L/min — less than a third of its open-port flow, while it still consumes 51 L/min.'
    }
  ],
  quiz: [
    { q: 'Why does an ejector\'s air consumption hardly depend on the vacuum at its suction port?', choices: ['Because the suction port has a non-return valve', 'Because its nozzle is choked: the flow through it depends only on the supply pressure and temperature', 'Because the diffuser keeps the flow constant', 'It does: consumption doubles at maximum vacuum'], a: 1,
      why: 'The supply pressure is several times the pressure after the nozzle, so the nozzle runs at the speed of sound and its mass flow is fixed by the upstream pressure alone.' },
    { q: 'About how much free air does an ejector with a 1.5 mm nozzle ($C_d$ = 0.9) consume at 5 bar gauge?', answer: 114, unit: 'L/min', tol: 0.04,
      why: 'Consumption scales with d²: 51 L/min for 1 mm × 2.25 = 114 L/min.' },
    { q: 'Compared with a single-stage ejector using the same compressed air, a multi-stage ejector…', choices: ['reaches a much deeper vacuum', 'moves two to three times more air at low vacuum and reaches about the same maximum vacuum', 'uses no compressed air once the part is gripped', 'is always the better choice'], a: 1,
      why: 'The extra stages draw air only while the vacuum is low; their flaps then close and the first stage alone sets the maximum. Great for big volumes and porous parts, not needed for small tight grippers.' },
    { q: 'Raising an ejector\'s supply from 5 to 7 bar always gives a deeper vacuum.', a: false,
      why: 'The vacuum peaks at an optimum supply pressure (commonly 4–6 bar) and stays flat or falls above it, while the air consumption keeps rising.' },
    { q: 'An air-saving ejector holds a sealed sheet for 5 seconds. For most of that time its compressed-air supply is…', choices: ['on, to keep the flow going', 'off: a non-return valve holds the vacuum and a switch restarts the ejector only if leakage lowers it', 'on at reduced pressure', 'reversed to blow off'], a: 1,
      why: 'That is the whole point of air-saving control: the ejector runs only to evacuate and to top up.' }
  ],
  problems: [
    { q: 'An ejector with a 0.7 mm nozzle ($C_d$ = 0.9) is supplied at 6 bar gauge with air at 20 °C. How much free air does it consume?', answer: 29.0, unit: 'L/min', tol: 0.03,
      steps: ['Area: $\\pi \\times (0.7\\times10^{-3})^2/4 = 3.848\\times10^{-7}$ m².', '$Q = 0.0404 \\times 0.9 \\times 3.848\\times10^{-7} \\times 7.013\\times10^5/(1.185 \\times 17.12) = 4.84\\times10^{-4}$ m³/s = 29.0 L/min.'] },
    { q: 'An ejector sucks 50 L/min with its port open and reaches at most 88 kPa below atmosphere. How much does it suck at −70 kPa (straight-line model)?', answer: 10.2, unit: 'L/min', tol: 0.03,
      steps: ['$q_s = 50\\,(1 - 70/88) = 50 \\times 0.2045 = 10.2$ L/min.'] }
  ],
  applications: ['Grippers on robots and pick-and-place units, with the ejector mounted right at the cups.', 'Compact ejectors with valves, switch and blow-off for each gripper of a press line.', 'Multi-stage ejectors for large cardboard and wood panels.', 'Air amplifiers and conveyors for light parts and dust, using the same entrainment.'],
  history: 'Jet pumps are older than pneumatics: Henri Giffard\'s steam injector of 1858 fed locomotive boilers with a jet, and water-jet pumps on laboratory taps have filtered chemists\' precipitates since the nineteenth century. Compressed-air ejectors became the standard vacuum source of automated handling in the late twentieth century, as small nozzles, multi-stage designs and built-in air-saving control appeared.',
  sim: ['vac-ejector-curves', 'vac-air-saving']
},

{
  id: 'vacuum-pumps', parent: 'vacuum-basics-topic', title: 'Vacuum pumps', level: 2,
  short: 'Motor-driven machines that compress air from below atmosphere up to atmosphere: rotary vane, liquid ring, claw and screw pumps, side-channel blowers. Heavier and dearer than an ejector, but far cheaper to run where vacuum is needed continuously or in large amounts.',
  keywords: ['vacuum pump', 'rotary vane', 'dry-running vane pump', 'liquid ring', 'side-channel blower', 'claw pump', 'screw pump', 'diaphragm pump', 'pumping speed', 'ultimate pressure', 'central vacuum', 'pump or ejector'],
  prereq: ['vacuum-units', 'compressor-types', 'physics:ideal-gas-law'],
  related: ['ejectors', 'vacuum-energy', 'vacuum-circuits', 'vacuum-leakage', 'scroll-vane-compressors', 'compression-work', 'hydraulics:vane-pumps', 'chemistry:vapor-pressure'],
  body: `
A vacuum pump is a compressor whose inlet is below atmosphere: it draws thin air out of a vessel and pushes it out at atmospheric pressure. Many of the machines are relatives of the [[compressor-types|compressors]] that make compressed air, built for a different pressure range. Instead of compressed air they use electricity directly, which makes them several times more efficient than an ejector — but they are bigger, heavier, slower to respond and need maintenance, so they usually sit away from the gripper and feed it through a line and a valve.

### Pumping speed and free air
A pump's size is its **pumping speed** $S$, the volume it draws per unit time *measured at its inlet pressure* (m³/h). The mass behind that volume shrinks with the pressure: at 200 mbar absolute, a 100 m³/h pump moves only 20 m³/h of free air, and at its **ultimate pressure** — the lowest it can reach, with its inlet blocked — it moves none at all. So

$$Q_\\text{ANR} = S\\,\\frac{p}{p_\\text{ANR}}$$

turns pumping speed into the free air that [[vacuum-leakage|leaks]] and evacuation calculations use.

### The main types
| Type | Ultimate pressure (typical) | Pumping speed | Strengths and limits |
|---|---|---|---|
| Rotary vane, oil-lubricated | 0.1–2 mbar abs | 4–1500 m³/h | the process workhorse; needs an oil-mist filter, dislikes dust and vapours |
| Rotary vane, dry-running | 100–150 mbar abs | 3–250 m³/h | carbon vanes, oil-free; handling, packaging, printing |
| Claw and dry screw | 50–150 mbar (claw), far lower (screw) | 50–1000+ m³/h | contact-free rotors, oil-free, efficient; central systems |
| Liquid ring | 30–150 mbar abs | 10–30 000 m³/h | swallows water, steam and dirt; paper machines, chemistry |
| Side-channel blower | 500–700 mbar abs (−0.3 to −0.5 bar) | 50–1500 m³/h | huge flow at shallow vacuum: porous parts, large area grippers, lifters |
| Diaphragm | 2–100 mbar abs | below 10 m³/h | small, dry, clean: laboratories, instruments |

A liquid-ring pump seals its rotor with a ring of water, so it cannot go below the water's [[chemistry:vapor-pressure|vapour pressure]] — 17 mbar at 15 °C, 23 mbar at 20 °C — without the water boiling; in practice about 30–40 mbar with cool water.

### The power a vacuum pump needs
Compressing the air from the inlet pressure $p$ back up to atmospheric takes at least the isothermal work (see [[compression-work]]):

$$P = \\frac{p\\,S\\,\\ln(p_\\text{atm}/p)}{\\eta}$$

Curiously, this **peaks part-way down**: near atmosphere there is almost no pressure ratio to overcome, and at deep vacuum there is almost no mass to move. The maximum lies at $p = p_\\text{atm}/e \\approx 373$ mbar abs — 63 % vacuum — and the motor must be sized for it, because every pump-down passes through it. Real pumps reach overall efficiencies $\\eta$ of roughly 20–40 % against this ideal.

### Pump or ejector?
| Choose an ejector when… | Choose a pump when… |
|---|---|
| vacuum is needed in short bursts, many times a minute | vacuum is needed continuously, for hours |
| the gripper needs its own fast, small circuit | many cups can share a central supply |
| compressed air is already there and weight at the tool matters | large flows are needed, e.g. porous parts |
| investment must be small | the energy bill decides |

For the same useful vacuum, a pump typically uses several times — at a working vacuum often ten times — less energy than an ejector running continuously. An air-saving ejector that runs only for a fraction of a second per pick can nevertheless beat a pump that runs all day, so the comparison always depends on the duty (see [[vacuum-energy]]).

> [!warn] Before maintaining a pump, isolate and lock out its motor and let it vent to atmosphere; its surfaces run hot, oil-lubricated pumps exhaust an oil mist that must be filtered, and an open inlet of a large pump can grab a hand or clothing. Where the pump holds a load, the load must be set down or supported first (see [[vacuum-safety]]).
`,
  ideas: [
    'A vacuum pump is a compressor with its inlet below atmosphere, driven directly by a motor.',
    'Pumping speed is volume at the inlet pressure; the free air it moves shrinks in proportion to that pressure.',
    'The ideal power peaks at about 63 % vacuum, where the product of mass flow and pressure ratio is largest.',
    'Types span dry and oil-lubricated vane, claw and screw, liquid ring, side-channel blowers and diaphragm pumps, from shallow high-flow vacuum to deep process vacuum.',
    'Pumps beat ejectors on energy for continuous or large duties; ejectors win on speed, size and short cycles.'
  ],
  pitfalls: [
    'A pump\'s pumping speed is the free air it removes — It is volume at the inlet pressure; at 200 mbar absolute, 100 m³/h of pumping speed is only 20 m³/h of free air.',
    'The ultimate pressure is the pump\'s working pressure — At its ultimate pressure a pump moves no gas at all; it must work well above it to carry away leaks.',
    'A vacuum pump always saves energy over an ejector — An air-saving ejector that runs a fraction of a second per cycle can use less than a pump that runs all the time.'
  ],
  formulas: [
    {
      name: 'Free air moved by a vacuum pump',
      expr: 'Q = S*p/pn', tex: 'Q_\\text{ANR} = S\\,\\frac{p}{p_\\text{ANR}}',
      vars: {
        Q: { name: 'free air moved', q: 'airflow', unit: 'm³/h ANR', tex: 'Q_\\text{ANR}' },
        S: { name: 'pumping speed (volume at the inlet pressure)', q: 'flowrate', unit: 'm³/h', value: 100 },
        p: { name: 'inlet pressure (absolute)', q: 'pressure', unit: 'mbar', value: 200 },
        pn: { name: 'reference pressure of free air (absolute)', q: 'pressure', unit: 'mbar', value: 1000, fixed: true, tex: 'p_\\text{ANR}' }
      },
      note: 'At the same temperature on both sides; ISO 8778 free air is counted at 1000 mbar and 20 °C.',
      practice: { unknowns: ['Q', 'S', 'p'] },
      stories: {
        Q: 'A vacuum pump with a pumping speed of {S} works at an inlet pressure of {p}. How much free air does it move?',
        S: 'A process must have {Q} of free air removed at {p}. What pumping speed is needed?'
      }
    },
    {
      name: 'Power of a vacuum pump (isothermal ideal over efficiency)',
      expr: 'P = p*S*ln(patm/p)/eta', tex: 'P = \\frac{p\\,S\\,\\ln(p_\\text{atm}/p)}{\\eta}',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'kW' },
        p: { name: 'inlet pressure (absolute)', q: 'pressure', unit: 'mbar', value: 200, min: 0.01, max: 1013 },
        S: { name: 'pumping speed (volume at the inlet pressure)', q: 'flowrate', unit: 'm³/h', value: 100 },
        patm: { name: 'discharge pressure: the atmosphere (absolute)', q: 'pressure', unit: 'mbar', value: 1013, tex: 'p_\\text{atm}' },
        eta: { name: 'overall efficiency against the isothermal ideal', q: 'ratio', unit: '%', value: 40, min: 1, max: 100, tex: '\\eta' }
      },
      note: 'Largest at $p = p_\\text{atm}/e$ (about 373 mbar abs), so solving for $p$ gives two answers, one on each side of the peak.',
      practice: { unknowns: ['P', 'S'] },
      stories: {
        P: 'A vacuum pump with a pumping speed of {S} works at {p} and discharges to {patm}; its efficiency is {eta}. What shaft power does it need?',
        S: 'A pump with a {P} motor and an efficiency of {eta} works at {p}, discharging to {patm}. What pumping speed can it have?'
      }
    }
  ],
  examples: [
    {
      title: 'The peak of a pump-down',
      q: 'A dry vane pump has a pumping speed of 100 m³/h and an overall efficiency of 40 %. What shaft power does it need at 200 mbar abs, and what at its worst point?',
      steps: [
        '$S = 100/3600 = 0.02778$ m³/s.',
        'At 200 mbar: $P = 20\\,000 \\times 0.02778 \\times \\ln(1013/200)/0.4 = 555.6 \\times 1.622/0.4 = 2.25$ kW.',
        'Worst point $p = 1013/e = 373$ mbar: $P = 37\\,270 \\times 0.02778 \\times 1/0.4 = 2.59$ kW.',
        'It moves only $100 \\times 200/1000 = 20$ m³/h of free air at 200 mbar.'
      ],
      a: '2.25 kW at 200 mbar, 2.59 kW at the peak near 373 mbar — the motor is sized for the peak.'
    },
    {
      title: 'A vacuum table: pump or ejectors?',
      q: 'A router\'s vacuum table needs 20 m³/h of free air removed at 400 mbar abs, 4000 hours a year. Compare a vane pump ($\\eta$ = 40 %) with single-stage ejectors whose open-port suction is 45 % of their air use and whose maximum vacuum is 88 % (straight-line curve). Compressed air costs 0.11 kWh/m³.',
      steps: [
        'Pump: $S = 20 \\times 1000/400 = 50$ m³/h; $P = 40\\,000 \\times 0.01389 \\times \\ln(1013/400)/0.4 = 1.29$ kW, or 5160 kWh a year.',
        'Ejectors at 60.5 % vacuum suck $(1 - 60.5/88) = 0.31$ of their open-port flow, i.e. $0.45 \\times 0.31 = 0.14$ of their air use.',
        'Air needed: $20/0.14 = 142$ m³/h of free air, costing $142 \\times 0.11 = 15.6$ kW, or about 62 000 kWh a year.'
      ],
      a: 'The pump uses roughly a twelfth of the energy. Continuous vacuum at a working level is pump territory.'
    }
  ],
  quiz: [
    { q: 'Why does the power of a vacuum pump peak part-way through a pump-down?', choices: ['The oil is coldest then', 'Near atmosphere the pressure ratio is small, and at deep vacuum there is little mass to move; the product peaks around 37 % absolute', 'The vanes wear fastest at that point', 'It does not: power rises steadily as the vacuum deepens'], a: 1,
      why: 'Isothermal power p·S·ln(p_atm/p) is zero at both ends and largest at p = p_atm/e ≈ 373 mbar.' },
    { q: 'Large porous cardboard sheets need a great deal of flow at about −0.3 bar. Which vacuum source suits them best?', choices: ['An oil-lubricated rotary vane pump reaching 0.5 mbar', 'A side-channel blower', 'A diaphragm pump', 'A single-stage high-vacuum ejector'], a: 1,
      why: 'Side-channel blowers deliver very large flows at shallow vacuum — exactly what leaky parts need. Deep vacuum is useless when the part leaks.' },
    { q: 'A pump with a pumping speed of 40 m³/h works at 250 mbar absolute. How much free air (m³/h, ANR at 1000 mbar) does it move?', answer: 10, unit: 'm³/h', tol: 0.02,
      why: 'Q = S·p/p_ANR = 40 × 250/1000 = 10 m³/h.' },
    { q: 'A liquid-ring pump running on water at 20 °C cannot reach 5 mbar absolute because…', choices: ['its motor is too small', 'the ring water would boil: its vapour pressure is about 23 mbar', 'rotary pumps cannot pass 100 mbar', 'air dissolves in the water'], a: 1,
      why: 'Below the vapour pressure the sealing water boils (and cavitates); cooler water reaches lower.' },
    { q: 'A vacuum pump always uses less energy than an ejector.', a: false,
      why: 'Continuously, yes, by a wide margin. But an air-saving ejector running 0.2 s per 4 s cycle can use less than a pump that runs all day — the duty decides.' }
  ],
  applications: ['Central vacuum for packaging machines and printing presses.', 'Vacuum clamping tables on woodworking and sign-making routers.', 'Side-channel blowers on area grippers and tube lifters for sacks, boxes and panels.', 'Oil-sealed and dry pumps as the first stage of laboratory and coating systems.'],
  sim: 'vac-evacuation'
},

/* ================================================================ VACUUM HANDLING */
{
  id: 'suction-cups', parent: 'vacuum-handling', title: 'Suction cups', level: 1,
  short: 'The flexible lip that seals against the part. Flat cups for flat, rigid parts; bellows cups for curved, uneven or tilted ones; oval cups for long narrow parts. Shape, material and size decide how well a cup seals, how firmly it holds and how long it lasts.',
  keywords: ['suction cup', 'vacuum pad', 'flat cup', 'bellows cup', 'oval cup', 'lip seal', 'support ribs', 'NBR', 'silicone', 'polyurethane', 'FKM', 'Shore hardness', 'marking-free', 'effective diameter', 'level compensator'],
  prereq: ['vacuum-basics', 'vacuum-units'],
  related: ['holding-force', 'vacuum-leakage', 'vacuum-circuits', 'grippers', 'pick-and-place', 'physics:friction'],
  body: `
The suction cup is where vacuum handling succeeds or fails. Its job sounds simple — seal against the part so the air cannot get back in — but the part may be oily, curved, porous, hot, fragile or about to be painted, and the cup must also hold the part steady while a robot swings it around at several metres per second squared. A cup has a **lip** that seals, a **body** that carries the load, often **ribs or studs** inside for the part to rest on, and a **connector** with a small bore to the vacuum line. Under vacuum the lip flattens and the part is pulled onto the supports; the friction there is what resists sideways forces.

### Shapes
| Shape | Suits | Watch out for |
|---|---|---|
| Flat, round | flat, smooth, rigid parts: sheet metal, glass, boards | little tolerance for curves or tilt; very stable in shear, small volume, fast |
| Flat with ribs, deep lip | thin sheet (the ribs stop it bending into the cup), oily sheet with special lips | slightly more volume |
| Bellows, 1½ or 2½ folds | curved, uneven or tilted surfaces; height differences; parts that must be lifted gently off a stack | softer sideways, so parts sway; more volume, slower evacuation |
| Oval (slotted) | long narrow parts: profiles, strips, tubes, pipes | orientation matters |
| Special | bags and film (soft deep lips), foam-sealed plates for rough wood, stone and cardboard | wear of the soft seal |

Bellows cups also **contract** as they evacuate, lifting the part a few millimetres — useful for peeling the top sheet off a stack — and their fold compensates small differences in height between cups.

### Force of a cup
The theoretical force is the vacuum times the area the lip encloses (see [[vacuum-basics]]):

$$F = \\Delta p\\,\\frac{\\pi d^2}{4}$$

with $d$ the *effective* diameter — for flat cups close to the outer diameter of the lip once it has flattened, for bellows cups noticeably less than the outer diameter, which is why a data sheet's measured force is the better number. An oval cup of length $L$ and width $W$ encloses $(L - W)W + \\pi W^2/4$. How much of that force is usable depends on the direction of the load and on friction (see [[holding-force]]).

### Materials
| Material | Typical temperature range | Character |
|---|---|---|
| Nitrile rubber (NBR) | −10 to +70 °C | the standard: oil-resistant, cheap, fair wear; may mark sensitive surfaces |
| Silicone (VMQ) | −30 to +200 °C | soft, food-compatible, hot parts; tears easily, and silicone traces spoil paint and glue |
| Polyurethane (PU) | −20 to +60 °C | very wear-resistant for rough sheet and wood; good on oily sheet |
| Fluororubber (FKM) | −10 to +200 °C | chemicals and heat |
| Conductive (ESD) and marking-free compounds | depends | electronics, glass, displays, painted and visible surfaces |

A **softer** lip (30–40 Shore A) seals better on rough or textured surfaces and treats delicate parts gently; a **harder** one (60–70 Shore A) lasts longer, sways less and carries shear better. The figures are typical: data sheets differ.

### Choosing cups
1. **The surface** decides the shape and the lip: flat or curved, smooth or rough, dry or oily, tight or porous.
2. **The conditions** decide the material: temperature, oil, food contact, marks, later painting or gluing.
3. **The force** decides size and number — from the mass, the acceleration, the direction of load and a safety factor (see [[holding-force]]).
4. **The layout**: spread the cups symmetrically around the centre of gravity and as far apart as the part allows, so that tilting and swinging cannot peel one side off; add spring-loaded level compensators or ball joints where heights vary.

Several smaller cups usually beat one large one: they resist tilting, share the load if one leaks, and follow a flexible part. But if one cup of a group fed by a single generator loses its part, the whole group loses vacuum — unless each cup has a flow-limiting or self-closing valve (see [[vacuum-circuits]]).

> [!tip] Worn, cracked or hardened lips are the most common cause of dropped parts and wasted air. Inspect cups regularly and keep spares; a cup costs little compared with a dropped part.

> [!warn] Never test a cup on skin or put one on a person: even a small cup at −0.6 bar can burst blood vessels and injure an eye. Keep hands away from cups and parts while a gripper is working.
`,
  ideas: [
    'A cup seals with its lip, carries the load through its body and supports, and resists sideways forces by friction.',
    'Flat cups for flat rigid parts, bellows for curved or uneven ones and height differences, oval cups for long narrow parts.',
    'Its force is the vacuum times its effective area — the outer diameter overstates it, especially for bellows cups.',
    'The material follows the conditions: NBR as standard, silicone for heat and food, polyurethane for wear, special compounds for marks and electronics.',
    'Several cups spread around the centre of gravity resist tilting better than one big cup.'
  ],
  pitfalls: [
    'The outer diameter gives the force — The effective diameter under vacuum is smaller, especially for bellows cups; use the data sheet\'s force or effective diameter.',
    'A softer cup always holds better — Soft lips seal better on rough surfaces, but they sway and wear more, and they carry less sideways force; harder lips suit smooth parts and fast motion.',
    'One large cup equals several small ones of the same total area — The force is equal, but a single cup resists tilting poorly, has no redundancy and cannot follow a flexible part.'
  ],
  formulas: [
    {
      name: 'Theoretical force of a round cup',
      expr: 'F = dp*pi*d^2/4', tex: 'F = \\Delta p\\,\\frac{\\pi d^2}{4}',
      vars: {
        F: { name: 'theoretical holding force of one cup', q: 'force', unit: 'N' },
        dp: { name: 'vacuum: atmosphere minus absolute pressure in the cup', q: 'pressure', unit: 'kPa', value: 60, tex: '\\Delta p' },
        d: { name: 'effective cup diameter', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'Perpendicular to the cup, with a perfect seal. $\\Delta p$ is the magnitude of the negative gauge pressure: −60 kPa gauge means $\\Delta p = 60$ kPa.',
      practice: { unknowns: ['F', 'd', 'dp'] },
      stories: {
        F: 'A cup of effective diameter {d} holds a part at a vacuum of {dp} below atmosphere. What is its theoretical force?',
        d: 'A single cup must give {F} at a vacuum of {dp}. What effective diameter does it need?',
        dp: 'A {d} cup must give {F}. What vacuum is needed?'
      }
    },
    {
      name: 'Theoretical force of an oval cup',
      expr: 'F = dp*((L - W)*W + pi*W^2/4)', tex: 'F = \\Delta p\\left[(L - W)\\,W + \\frac{\\pi W^2}{4}\\right]',
      vars: {
        F: { name: 'theoretical holding force of one cup', q: 'force', unit: 'N' },
        dp: { name: 'vacuum: atmosphere minus absolute pressure in the cup', q: 'pressure', unit: 'kPa', value: 60, tex: '\\Delta p' },
        L: { name: 'effective length of the cup', q: 'length', unit: 'mm', value: 60 },
        W: { name: 'effective width of the cup', q: 'length', unit: 'mm', value: 20, min: 0.1, max: 200 }
      },
      note: 'A slot of two half-circles joined by straight sides; with $L = W$ it becomes a round cup.',
      practice: { unknowns: ['F', 'L'] },
      stories: {
        F: 'An oval cup {L} long and {W} wide works at a vacuum of {dp}. What is its theoretical force?',
        L: 'An oval cup {W} wide must give {F} at a vacuum of {dp}. How long must it be?'
      }
    }
  ],
  examples: [
    {
      title: 'An oval cup for a strip',
      q: 'A 25 mm wide aluminium strip must be held with a theoretical force of 50 N per cup at −60 kPa. Oval cups 20 mm wide come in lengths of 40, 60 and 80 mm. Which length is enough?',
      steps: [
        'Area needed: $50/60\\,000 = 8.33\\times10^{-4}$ m² = 833 mm².',
        'Round ends: $\\pi \\times 20^2/4 = 314$ mm²; the straight part must add $833 - 314 = 519$ mm², i.e. $L - W = 519/20 = 26$ mm, so $L = 46$ mm.',
        'The 60 mm cup: $(60 - 20)\\times 20 + 314 = 1114$ mm², giving $60\\,000 \\times 1.114\\times10^{-3} = 66.8$ N.'
      ],
      a: 'The 60 × 20 mm cup, with 66.8 N theoretical force; the 40 mm one gives only 42.8 N.'
    },
    {
      title: 'Choosing a material',
      q: 'Choose cup materials for: (a) glass bottles just out of a moulding machine at 150 °C; (b) oily car-body sheet that will be painted later; (c) rough chipboard panels in a furniture plant.',
      steps: [
        '(a) Heat: silicone or FKM; silicone is softer and food-compatible, which suits containers.',
        '(b) Oily sheet to be painted: not silicone (traces spoil paint); polyurethane or NBR with an oil-grip lip profile.',
        '(c) Rough, abrasive and slightly porous: wear-resistant polyurethane, or a foam-sealed plate, with a generator sized for the leak.'
      ],
      a: '(a) silicone or FKM, (b) polyurethane or NBR, never silicone, (c) polyurethane or foam seals with generous flow.'
    }
  ],
  quiz: [
    { q: 'Which cup suits a curved car-body panel whose surface is not quite parallel to the gripper?', choices: ['A hard flat cup', 'A bellows cup', 'An oval cup', 'A foam-sealed plate'], a: 1,
      why: 'The bellows folds let the lip tilt and follow the curve, and compensate height differences between cups.' },
    { q: 'Why do many flat cups have ribs or studs inside?', choices: ['To look technical', 'So a thin part rests on them instead of bending into the cup, and so friction can carry sideways loads', 'To store vacuum', 'To make the lip softer'], a: 1,
      why: 'Under vacuum the part is pressed onto the supports; they keep it flat and give the friction that resists shear.' },
    { q: 'Silicone cups are chosen for sheet parts that will later be painted. What risk does that bring?', choices: ['None', 'Silicone traces left on the surface can spoil the paint', 'Silicone cannot hold metal', 'The cups melt in the paint oven'], a: 1,
      why: 'Even tiny silicone residues cause paint defects (craters), so car and appliance plants avoid silicone near paint.' },
    { q: 'What is the theoretical force of a cup of 60 mm effective diameter at −70 kPa?', answer: 198, unit: 'N', tol: 0.03,
      why: 'A = π × 0.06²/4 = 2.827×10⁻³ m²; F = 70 000 × 2.827×10⁻³ = 198 N.' },
    { q: 'A softer lip always gives a stronger grip.', a: false,
      why: 'Softness helps sealing on rough surfaces, but soft cups sway, wear faster and carry less sideways load. The force itself is vacuum × area.' }
  ],
  problems: [
    { q: 'A bellows cup is listed with an outer diameter of 50 mm but an effective diameter of 42 mm. By how many newtons does using the outer diameter overstate its force at −60 kPa?', answer: 34.7, unit: 'N', tol: 0.03,
      steps: ['With 50 mm: $60\\,000 \\times \\pi \\times 0.05^2/4 = 117.8$ N.', 'With 42 mm: $60\\,000 \\times \\pi \\times 0.042^2/4 = 83.1$ N.', 'Overstated by $117.8 - 83.1 = 34.7$ N: the naive figure is 42 % too high, and the true force 29 % lower than it.'] }
  ],
  applications: ['Flat cups on press-line tooling for car-body sheet.', 'Bellows cups for bottles, curved glass and parts taken off stacks.', 'Oval cups for profiles, strips and pipes.', 'Foam-sealed area grippers for wood panels, cardboard and mixed layers on pallets.'],
  sim: 'vac-cup-force'
},

{
  id: 'holding-force', parent: 'vacuum-handling', title: 'Holding force and safety factors', level: 2,
  short: 'How big the cups must be. The theoretical force Δp·A must cover the part\'s weight and its acceleration — directly when a horizontal part is lifted, through friction when it moves sideways or hangs on a vertical face — times a safety factor of at least 2, and at least 4 where friction carries the load.',
  keywords: ['holding force', 'safety factor', 'load case', 'friction coefficient', 'acceleration', 'shear', 'vertical lift', 'horizontal motion', 'vertical face', 'cup sizing', 'number of cups', 'tilting', 'peeling', 'emergency stop'],
  prereq: ['suction-cups', 'physics:newtons-second-law', 'physics:friction'],
  related: ['vacuum-leakage', 'vacuum-safety', 'vacuum-circuits', 'pick-and-place', 'grippers', 'vacuum-basics', 'physics:free-body-diagrams'],
  body: `
A robot picks a 5 kg steel sheet and swings it to a press. At every instant the cups must supply enough force to hold the sheet against gravity *and* to accelerate it with the gripper — and they can only push it on perpendicular to their faces. Any force along the face has to be carried by **friction** between the lips and supports and the part. That is the whole of cup sizing: draw the [[physics:free-body-diagrams|free-body diagram]], find the largest force the cups must supply, multiply by a safety factor, and choose cups whose theoretical force $n\\,\\Delta p\\,A$ (see [[suction-cups]]) meets it.

### Three load cases
**I — horizontal part, cups on top, moving vertically.** The cups pull straight against gravity and the vertical acceleration:
$$F_\\text{th} = m\\,(g + a)\\,S$$

**II — horizontal part, cups on top, moving sideways.** The sideways inertia force $ma$ must be carried by friction, and friction is $\\mu$ times the force pressing the part onto the cups — the cup force minus the weight. So $\\mu(F - mg) \\ge ma$, and with the safety factor
$$F_\\text{th} = m\\left(g + \\frac{a}{\\mu}\\right)S$$

**III — vertical part, cups on its face.** Now the weight itself, and any acceleration, lie along the face: friction carries everything.
$$F_\\text{th} = \\frac{m\\,(g + a)}{\\mu}\\,S$$

Because $\\mu$ is typically 0.5, a vertical face needs about **twice** the force of a horizontal lift for friction alone — and more again for its larger safety factor.

| Surface (dry cup lips) | Friction coefficient $\\mu$ for sizing (typical, assumed) |
|---|---|
| Dry, smooth: glass, sheet metal, plastics | 0.5 |
| Wet | 0.2–0.4 |
| Oily sheet | 0.1–0.2 (special oil-grip lips do better) |
| Rough: wood, stone, cardboard | 0.5–0.6 |

### Safety factors
The safety factor $S$ covers what the formulas leave out: vacuum that sags as cups wear, dirt and oil, uneven parts, jerks, vibration and the unknowns of the real part. Usual minimums:

- **$S \\ge 2$** for horizontal lifting (case I);
- **$S \\ge 4$** where friction carries the load (cases II and III, shear and vertical faces), because friction varies so much;
- more for porous, oily, inhomogeneous or flexible parts, and for anything moving over people or valuable equipment (see [[vacuum-safety]]).

The vacuum in the calculation must be the level the system **reliably holds with the real part** — with its leaks, at the site's altitude (see [[vacuum-leakage]] and [[vacuum-basics]]) — not the ejector's maximum. A common choice for tight parts is to size at −60 kPa even when the generator reaches −85 kPa. The acceleration must be the **largest** the axis can produce, including an emergency stop, which often decelerates harder than any normal move.

### A worked comparison
A 5 kg steel sheet, $a = 5$ m/s², $\\mu = 0.5$, four cups at −60 kPa:

| Load case | Force needed | Diameter per cup | Next standard size |
|---|---|---|---|
| I, $S = 2$ | 148 N | 28 mm | 30 mm |
| II, $S = 4$ | 396 N | 46 mm | 50 mm |
| III, $S = 4$ | 592 N | 56 mm | 60 mm |

### Tilting and peeling
If the part's centre of gravity lies far from the middle of the cup pattern, or a sideways acceleration acts on a tall or overhanging part, the load becomes a moment that loads the cups on one side and unloads those on the other; a lightly loaded cup can **peel** open and the vacuum collapses for the whole group. Place the cups symmetrically about the centre of gravity and as far apart as the part allows, and slow down where a part overhangs.

> [!key] The cups can only push the part on. Whatever acts along the face — weight on a vertical face, sideways acceleration — must be carried by friction, which needs about 1/μ times more force and a larger safety factor.

> [!warn] A vacuum-held part falls the moment the vacuum is lost. Keep people out from under vacuum-lifted loads, and do not use the safety factor to justify moving loads over people — use guarding, catches or a different route (see [[vacuum-safety]]).
`,
  ideas: [
    'Cups can only press the part on; forces along the face are carried by friction.',
    'Case I: F = m(g + a)S. Case II: F = m(g + a/μ)S. Case III: F = m(g + a)S/μ.',
    'Use S ≥ 2 for horizontal lifting and S ≥ 4 where friction carries the load, more for difficult parts.',
    'Size with the vacuum the system reliably holds with the real leak and at the real altitude, and with the largest acceleration, including emergency stops.',
    'Spread the cups around the centre of gravity so that tilting cannot peel one side off.'
  ],
  pitfalls: [
    'Size with the ejector\'s maximum vacuum — Leaks, wear and altitude lower the real vacuum; size with the level the system reliably holds with the actual part, often −60 kPa for tight parts.',
    'A safety factor of 2 covers everything — It covers ordinary variation in case I; an emergency stop can decelerate far harder than normal moves, and friction-carried loads need 4 or more.',
    'On a vertical face the cup force carries the weight — The cups only press the part on; friction carries the weight, so the force needed is about 1/μ, typically twice, larger.'
  ],
  formulas: [
    {
      name: 'Load case I: horizontal part, vertical motion',
      expr: 'F = m*(g + a)*S', tex: 'F_\\text{th} = m\\,(g + a)\\,S',
      vars: {
        F: { name: 'theoretical force needed from all cups', q: 'force', unit: 'N', tex: 'F_\\text{th}' },
        m: { name: 'mass of the part', q: 'mass', unit: 'kg', value: 5 },
        g: { const: 'g' },
        a: { name: 'largest vertical acceleration (up, or braking downward motion)', q: 'accel', unit: 'm/s²', value: 5 },
        S: { name: 'safety factor', value: 2, min: 1, max: 10 }
      },
      note: 'Cups on top of a horizontal part pulling straight up. Use $S \\ge 2$.',
      practice: { unknowns: ['F', 'm', 'a'] },
      stories: {
        F: 'Cups lift a horizontal part of {m} vertically with an acceleration of up to {a}. With a safety factor of {S}, what theoretical force must they give?',
        m: 'Cups giving {F} lift a horizontal part vertically at up to {a}, with a safety factor of {S}. What is the heaviest part?',
        a: 'Cups giving {F} lift a {m} horizontal part with a safety factor of {S}. What is the largest acceleration allowed?'
      }
    },
    {
      name: 'Load case II: horizontal part, sideways motion',
      expr: 'F = m*(g + a/mu)*S', tex: 'F_\\text{th} = m\\left(g + \\frac{a}{\\mu}\\right)S',
      vars: {
        F: { name: 'theoretical force needed from all cups', q: 'force', unit: 'N', tex: 'F_\\text{th}' },
        m: { name: 'mass of the part', q: 'mass', unit: 'kg', value: 5 },
        g: { const: 'g' },
        a: { name: 'largest sideways acceleration', q: 'accel', unit: 'm/s²', value: 5 },
        mu: { name: 'friction coefficient between cups and part', value: 0.5, min: 0.05, max: 1.5, tex: '\\mu' },
        S: { name: 'safety factor', value: 4, min: 1, max: 10 }
      },
      note: 'From $\\mu(F - mg) \\ge ma$: the cup force minus the weight presses the part on, and friction carries the sideways inertia force. Friction carries the load, so use $S \\ge 4$ — more on oily parts.',
      practice: { unknowns: ['F', 'm', 'mu'] },
      stories: {
        F: 'A horizontal part of {m} hangs under cups and is moved sideways at up to {a}; the friction coefficient is {mu}. With a safety factor of {S}, what theoretical force must the cups give?',
        mu: 'Cups giving {F} move a {m} part sideways at up to {a} with a safety factor of {S}. What friction coefficient must the cups at least have?'
      }
    },
    {
      name: 'Load case III: vertical face',
      expr: 'F = m*(g + a)*S/mu', tex: 'F_\\text{th} = \\frac{m\\,(g + a)}{\\mu}\\,S',
      vars: {
        F: { name: 'theoretical force needed from all cups', q: 'force', unit: 'N', tex: 'F_\\text{th}' },
        m: { name: 'mass of the part', q: 'mass', unit: 'kg', value: 5 },
        g: { const: 'g' },
        a: { name: 'largest acceleration along the face', q: 'accel', unit: 'm/s²', value: 5 },
        mu: { name: 'friction coefficient between cups and part', value: 0.5, min: 0.05, max: 1.5, tex: '\\mu' },
        S: { name: 'safety factor', value: 4, min: 1, max: 10 }
      },
      note: 'Cups on a vertical face: friction carries the weight and the acceleration. Use $S \\ge 4$.',
      practice: { unknowns: ['F', 'm'] },
      stories: {
        F: 'Cups hold a {m} panel by its vertical face and move it vertically at up to {a}; the friction coefficient is {mu}. With a safety factor of {S}, what theoretical force must they give?',
        m: 'Cups giving {F} hold a panel by its vertical face, moving at up to {a}, friction coefficient {mu}, safety factor {S}. What is the heaviest panel?'
      }
    },
    {
      name: 'Cup diameter for a required force',
      expr: 'd = sqrt(4*F/(pi*n*dp))', tex: 'd = \\sqrt{\\frac{4F_\\text{th}}{\\pi\\,n\\,\\Delta p}}',
      vars: {
        d: { name: 'effective diameter of each cup', q: 'length', unit: 'mm' },
        F: { name: 'theoretical force needed from all cups', q: 'force', unit: 'N', value: 148, tex: 'F_\\text{th}' },
        n: { name: 'number of cups', q: 'count', value: 4, int: true, min: 1, max: 100 },
        dp: { name: 'vacuum reliably held (below atmosphere)', q: 'pressure', unit: 'kPa', value: 60, tex: '\\Delta p' }
      },
      note: 'Then choose the next standard cup size (10, 15, 20, 25, 30, 40, 50, 60, 80, 100 mm …) — or its data-sheet force.',
      practice: { unknowns: ['d', 'n'] },
      stories: {
        d: '{n} cups must give {F} together at a vacuum of {dp}. What effective diameter must each have?'
      }
    }
  ],
  examples: [
    {
      title: 'Three ways to carry one sheet',
      q: 'A 5 kg steel sheet is handled with four cups at −60 kPa, accelerations up to 5 m/s² and $\\mu = 0.5$. Size the cups for (I) lifting it horizontally, (II) moving it sideways, (III) holding it by a vertical face.',
      steps: [
        'I: $F = 5 \\times (9.81 + 5) \\times 2 = 148$ N; per cup 37.0 N; $d = \\sqrt{4 \\times 37.0/(\\pi \\times 60\\,000)} = 28.0$ mm → 30 mm cups.',
        'II ($S = 4$, friction carries the sideways load): $F = 5 \\times (9.81 + 5/0.5) \\times 4 = 396$ N; per cup 99.0 N; $d = \\sqrt{4 \\times 99.0/(\\pi \\times 60\\,000)} = 45.8$ mm → 50 mm cups.',
        'III: $F = 5 \\times (9.81 + 5)\\times 4/0.5 = 592$ N; per cup 148 N; $d = 56.1$ mm → 60 mm cups.'
      ],
      a: '30 mm cups for a vertical lift, 50 mm for brisk sideways moves, 60 mm to hold it by a vertical face — four times the area of the first.'
    },
    {
      title: 'How hard may the axis accelerate?',
      q: 'Four 40 mm cups at −60 kPa lift an 8 kg horizontal lid (case I). Up to what upward acceleration is the safety factor still 2, and at what acceleration would the lid be torn off?',
      steps: [
        'Theoretical force: $4 \\times 60\\,000 \\times \\pi \\times 0.04^2/4 = 301.6$ N.',
        'With $S = 2$: $a = 301.6/(8 \\times 2) - 9.81 = 9.0$ m/s².',
        'With $S = 1$ (the limit): $a = 301.6/8 - 9.81 = 27.9$ m/s².'
      ],
      a: 'Up to 9.0 m/s² with S = 2; it would come off at about 28 m/s² — a hard emergency stop of a fast axis can come close.'
    }
  ],
  quiz: [
    { q: 'A panel is held by cups on its vertical face. What carries its weight?', choices: ['The pressure difference, directly', 'Friction between the cups and the panel, produced by the pressure difference', 'The atmosphere pushing up from below', 'The stiffness of the cup body'], a: 1,
      why: 'The cups press the panel on perpendicular to its face; only friction can act along the face, so the needed force is m(g + a)/μ times the safety factor.' },
    { q: 'In load case II (horizontal part moving sideways), why is the acceleration divided by μ?', choices: ['Because friction must supply the sideways inertia force ma, and friction is μ times the pressing force', 'Because the part gets heavier sideways', 'Because air resistance grows with μ', 'It is a safety factor'], a: 0,
      why: 'μ(F − mg) ≥ ma gives F ≥ m(g + a/μ): with μ = 0.5, a sideways acceleration costs twice as much force as a vertical one.' },
    { q: 'A 2 kg glass plate is lifted horizontally (case I) with 3 m/s² and a safety factor of 2. What theoretical force must the cups give?', answer: 51.2, unit: 'N', tol: 0.02,
      why: 'F = 2 × (9.81 + 3) × 2 = 51.2 N.' },
    { q: 'With a safety factor of 2, a gripper is certain to keep its part during an emergency stop.', a: false,
      why: 'An emergency stop can decelerate an axis much harder than normal moves; size with the worst deceleration, and never move vacuum loads over people.' },
    { q: 'Four 40 mm cups are replaced by one 80 mm cup at the centre — the same total area. What is the main drawback?', choices: ['Less force', 'It resists tilting poorly and has no redundancy: a small peel or tear drops the part', 'It evacuates faster', 'Nothing'], a: 1,
      why: 'The force is the same, but one central cup gives no lever against tilting moments and no spare if it leaks.' }
  ],
  problems: [
    { q: 'Four cups must hold a 12 kg panel by its vertical face, moving it vertically at up to 4 m/s², with μ = 0.5, S = 4 and a vacuum of −70 kPa. What is the smallest effective diameter each cup may have?', answer: 77.6, unit: 'mm', tol: 0.02,
      steps: ['$F = 12 \\times (9.81 + 4) \\times 4/0.5 = 1326$ N; per cup 331 N.', '$A = 331.4/70\\,000 = 4.735\\times10^{-3}$ m².', '$d = \\sqrt{4A/\\pi} = 0.0776$ m = 77.6 mm → 80 mm cups.'] }
  ],
  applications: ['Sizing robot grippers for press lines, glass handling and palletising.', 'Checking how fast an existing gripper may be driven.', 'Hand-guided vacuum lifters for panels, sacks and stone slabs.', 'Choosing between horizontal and vertical pick-up of a part.'],
  sim: ['vac-cup-force', 'vac-pick-place']
},

{
  id: 'vacuum-leakage', parent: 'vacuum-handling', title: 'Porous parts and leakage', level: 2,
  short: 'Cardboard, wood, textiles and parts with holes or rough edges let air in all the time. The vacuum settles where the generator\'s suction flow equals the leak — where two curves cross — so leaky parts need a lot of flow at a moderate vacuum, not a deep vacuum.',
  keywords: ['porous parts', 'leakage', 'leak flow', 'operating point', 'cardboard', 'wood', 'textiles', 'choked leak', 'suction flow', 'ejector curve', 'leak curve', 'side-channel blower', 'leak test', 'foam seal'],
  prereq: ['ejectors', 'holding-force', 'choked-flow'],
  related: ['vacuum-pumps', 'vacuum-circuits', 'vacuum-energy', 'suction-cups', 'air-leaks', 'sonic-conductance', 'hydraulics:orifice-equation', 'physics:continuity-equation'],
  body: `
Put a cup on a steel sheet and switch on the ejector: the vacuum climbs to the ejector's maximum, 85–90 %, and stays there. Put the same cup on corrugated cardboard and the vacuum stops at perhaps 40 %, because air keeps seeping through the board into the cup. Whatever the generator removes, the leak brings back; the vacuum settles where the two flows are **equal**. That balance point — not the generator's catalogue maximum — is the vacuum you can count on.

### Two curves cross
The generator's curve **falls** with vacuum: most flow at an open port, none at its maximum vacuum (see [[ejectors]]). The leak's curve **rises** with vacuum: the deeper the vacuum, the harder the atmosphere drives air through the part. Plot both in free air against the vacuum, and the crossing is the operating point. With straight lines for both — the ejector from $q_0$ at no vacuum to zero at $\\Delta p_\\text{max}$, the leak from zero to $q_L$ at $\\Delta p_\\text{max}$ — the crossing is at

$$\\Delta p = \\Delta p_\\text{max}\\,\\frac{q_0}{q_0 + q_L}$$

A leak as large as the ejector's open-port flow halves the vacuum. Double the ejector and the vacuum climbs back towards its maximum — but never reaches it while the leak remains.

### How leaks behave
- **Through the material** — cardboard, paper, wood, foam, textiles. Air creeps through fine pores in laminar flow, so the leak grows roughly in proportion to the vacuum (strictly, with $p_\\text{atm}^2 - p^2$, since the air expands on its way through). Porosity varies from batch to batch, and with moisture and coatings.
- **Through gaps and holes** — a hole in the part, a cup lip over a groove, an edge, a rough casting. These behave like orifices: once the absolute pressure in the cup falls below about half the atmosphere (a vacuum above about 50 %), the flow in the gap reaches the speed of sound and the leak stops growing — it is [[choked-flow|choked]]:

$$Q_L = \\frac{0.0404\\,C_d\\,A\\,p_\\text{atm}}{\\rho_\\text{ANR}\\sqrt{T}}$$

— about **8 L/min of free air for every square millimetre** of opening at sea level ($C_d \\approx 0.65$).

| Opening | Area | Leak once choked |
|---|---|---|
| 0.5 mm hole | 0.20 mm² | 1.5 L/min |
| 1 mm hole | 0.79 mm² | 6.2 L/min |
| 2 mm hole | 3.1 mm² | 25 L/min |
| 3 mm hole | 7.1 mm² | 56 L/min |
| a 0.1 mm gap along 20 mm of lip | 2.0 mm² | 16 L/min |

A 2 mm hole under a cup already swallows the whole open-port flow of a 1 mm ejector.

### What to do about it
1. **Measure the leak.** Hold one cup on a real part — the worst of the batch — with a known generator and read the vacuum; with the formula above (or the ejector's curve) that gives the leak. Test damp and dry, coated and uncoated parts.
2. **Raise the flow, not the vacuum.** Bigger or multi-stage ejectors, or a side-channel blower, move the operating point up; a deeper-vacuum generator does not help (see [[vacuum-pumps]]).
3. **Use area instead of vacuum.** Force is $\\Delta p A$: at a modest 30 % vacuum, larger cups or foam-sealed plates still give plenty of force.
4. **Reduce the leak.** Softer or foam lips on rough surfaces, cups placed away from holes and edges, and flow-limiting or self-closing valves so that cups not covered by a part do not bleed the whole group.

> [!key] With a leaky part, the vacuum is where the generator's curve meets the leak's curve. Flow, not maximum vacuum, is what counts — and area can make up for a shallow vacuum.

> [!warn] Porosity varies: a gripper that holds today's cardboard may drop tomorrow's, which is damper or thinner. Size for the leakiest parts expected, confirm the grip with a vacuum switch every cycle, and keep people out from under the load.
`,
  ideas: [
    'With a leaky part, the vacuum settles where the generator\'s suction flow equals the leak.',
    'The generator\'s curve falls with vacuum and the leak\'s curve rises; the crossing is the operating point.',
    'Porous materials leak roughly in proportion to the vacuum; holes and gaps leak a constant flow once choked, about 8 L/min per mm² at sea level.',
    'Leaky parts need flow — bigger or multi-stage ejectors, blowers — and cup area, not a deeper vacuum.',
    'Measure the leak on the worst real parts, and confirm the grip every cycle.'
  ],
  pitfalls: [
    'A generator with a deeper maximum vacuum will hold porous parts better — With a large leak the vacuum sits far below any generator\'s maximum; what raises it is more flow.',
    'A leak through a hole grows steadily as the vacuum deepens — Above about 50 % vacuum the flow in the hole is choked; the leak stays constant however deep the vacuum.',
    'An air-saving ejector will save air on cardboard — The leak pulls the vacuum down as soon as the ejector stops, so it never switches off; the saving needs tight parts.'
  ],
  formulas: [
    {
      name: 'Operating vacuum with a leak (straight-line curves)',
      expr: 'dp = dpmax*q0/(q0 + qL)', tex: '\\Delta p = \\Delta p_\\text{max}\\,\\frac{q_0}{q_0 + q_L}',
      vars: {
        dp: { name: 'operating vacuum (below atmosphere)', q: 'pressure', unit: 'kPa', tex: '\\Delta p' },
        dpmax: { name: 'maximum vacuum of the generator, sealed (below atmosphere)', q: 'pressure', unit: 'kPa', value: 88, tex: '\\Delta p_\\text{max}' },
        q0: { name: 'suction flow with the port open (free air)', q: 'airflow', unit: 'L/min ANR', value: 23, tex: 'q_0' },
        qL: { name: 'leak the part would pass at the maximum vacuum (free air)', q: 'airflow', unit: 'L/min ANR', value: 15, tex: 'q_L' }
      },
      note: 'Straight-line generator curve and a leak proportional to the vacuum (porous parts). A choked leak through holes is flatter: use the simulation for it.',
      practice: { unknowns: ['dp', 'q0', 'qL'] },
      stories: {
        dp: 'An ejector sucks {q0} with its port open and reaches {dpmax} when sealed. A cardboard box would leak {qL} at that vacuum. What vacuum does the gripper actually reach?',
        q0: 'A part leaks {qL} at {dpmax}, and the gripper must reach {dp}. What open-port suction flow must a generator with a maximum of {dpmax} have?',
        qL: 'An ejector ({q0} open, {dpmax} sealed) reaches only {dp} on a part. How large is the leak, stated at the maximum vacuum?'
      }
    },
    {
      name: 'Leak through a small opening (choked)',
      expr: 'Q = 0.0404*Cd*A*patm/(sqrt(T)*rho)', tex: 'Q_L = \\frac{0.0404\\,C_d\\,A\\,p_\\text{atm}}{\\rho_\\text{ANR}\\sqrt{T}}',
      vars: {
        Q: { name: 'leak (free air)', q: 'airflow', unit: 'L/min ANR', tex: 'Q_L' },
        Cd: { name: 'discharge coefficient of the opening', value: 0.65, min: 0.3, max: 1, tex: 'C_d' },
        A: { name: 'area of the opening', q: 'area', unit: 'mm²', value: 1 },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_\\text{atm}' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 20 },
        rho: { name: 'density of free air (ISO 8778)', q: 'density', unit: 'kg/m³', value: 1.185, fixed: true, tex: '\\rho_\\text{ANR}' }
      },
      note: 'Valid once the absolute pressure in the cup is below about half the atmosphere (vacuum above roughly 50 %); at a shallower vacuum the leak is smaller. About 7.9 L/min per mm² with $C_d = 0.65$ at sea level.',
      practice: { unknowns: ['Q', 'A'] },
      stories: {
        Q: 'A hole of area {A} (discharge coefficient {Cd}) lies under a cup at a deep vacuum; the atmosphere is at {patm} and {T}. How much free air leaks in?',
        A: 'A gripper at deep vacuum loses {Q} through an opening (discharge coefficient {Cd}, atmosphere {patm}, {T}). How large is the opening?'
      }
    }
  ],
  examples: [
    {
      title: 'Cardboard on a small ejector',
      q: 'An ejector sucks 23 L/min with its port open and reaches 88 kPa below atmosphere when sealed. A corrugated box would leak 15 L/min at that vacuum. What vacuum does the gripper reach — and with an ejector twice the size?',
      steps: [
        '$\\Delta p = 88 \\times 23/(23 + 15) = 53.3$ kPa, i.e. about −53 kPa instead of −88 kPa.',
        'With $q_0 = 46$ L/min: $\\Delta p = 88 \\times 46/(46 + 15) = 66.4$ kPa.',
        'If the next batch leaks twice as much (30 L/min): $88 \\times 23/53 = 38.2$ kPa with the small ejector.'
      ],
      a: 'About −53 kPa; −66 kPa with twice the ejector; and only −38 kPa if the board is twice as porous.'
    },
    {
      title: 'A hole under the cup',
      q: 'A 40 mm cup on a 1 mm ejector (23 L/min open, 88 kPa maximum, straight line) sits over a 1 mm hole in the part ($C_d$ = 0.65). What vacuum and force result?',
      steps: [
        'Hole: $A = 0.785$ mm², choked leak $0.785 \\times 7.87 = 6.2$ L/min.',
        'The ejector sucks 6.2 L/min where $23\\,(1 - \\Delta p/88) = 6.2$, i.e. $\\Delta p = 64.4$ kPa.',
        'Check: the absolute pressure is $101.3 - 64.4 = 36.9$ kPa, below half the atmosphere, so the hole is indeed choked.',
        'Force: $64\\,400 \\times 1.257\\times10^{-3} = 81$ N instead of 111 N on a sound part.'
      ],
      a: 'About −64 kPa and 81 N — a quarter less force from a 1 mm hole.'
    }
  ],
  quiz: [
    { q: 'A gripper holds porous board too weakly with a small single-stage ejector. Which change helps most?', choices: ['An ejector with a deeper maximum vacuum', 'More suction flow — a bigger or multi-stage ejector or a blower — and more cup area', 'Higher supply pressure to the same ejector', 'Harder cups'], a: 1,
      why: 'The vacuum is set by the leak; only more flow raises it, and area turns a moderate vacuum into force.' },
    { q: 'Where does the vacuum settle when a part leaks?', choices: ['At the generator\'s maximum vacuum', 'Where the generator\'s suction flow equals the leak flow', 'At half the maximum, always', 'At the atmosphere'], a: 1,
      why: 'Steady state means as much air comes in as goes out: the crossing of the two curves.' },
    { q: 'A 2 mm hole ($C_d$ = 0.65) lies under a cup held at 70 % vacuum at sea level. About how much free air leaks in (L/min)?', answer: 24.7, unit: 'L/min', tol: 0.04,
      why: 'At 70 % vacuum the hole is choked: 3.14 mm² × 7.87 L/min per mm² ≈ 24.7 L/min.' },
    { q: 'The leak through a hole doubles when the vacuum rises from 60 % to 80 %.', a: false,
      why: 'Above about 50 % vacuum the flow in the hole is choked; the leak stays the same.' },
    { q: 'Why does an air-saving ejector save nothing on cardboard?', choices: ['Cardboard is too light', 'The leak pulls the vacuum below the switch-on point as soon as the ejector stops, so it runs continuously', 'Air-saving ejectors cannot handle paper dust', 'It saves even more on cardboard'], a: 1,
      why: 'Air-saving control relies on the non-return valve holding the vacuum; a porous part empties it at once.' }
  ],
  problems: [
    { q: 'An ejector sucks 12 L/min with its port open and reaches 88 kPa when sealed. The part would leak 8 L/min at 88 kPa. What vacuum does it reach (straight-line model)?', answer: 52.8, unit: 'kPa', tol: 0.02,
      steps: ['$\\Delta p = 88 \\times 12/(12 + 8) = 52.8$ kPa below atmosphere.'] }
  ],
  applications: ['Handling cardboard boxes, sacks, wood panels and textiles.', 'Area grippers with foam seals that pick mixed layers from pallets.', 'Checking a new part material before a gripper is built.', 'Leak testing of cups and lines as part of maintenance.'],
  sim: 'vac-ejector-leak'
},

{
  id: 'vacuum-circuits', parent: 'vacuum-handling', title: 'Vacuum circuits and evacuation time', level: 2,
  short: 'A vacuum circuit switches the generator on, confirms the grip with a vacuum switch and releases the part with a short pulse of blow-off air. How fast it grips depends on the volume of cups and hoses and on the generator\'s suction: roughly t ≈ V/q · ln(p₀/p).',
  keywords: ['vacuum circuit', 'vacuum switch', 'blow-off', 'release pulse', 'vacuum filter', 'evacuation time', 'pump-down time', 'decentralised ejector', 'central vacuum', 'hose volume', 'response time', 'compact ejector', 'self-closing valve'],
  prereq: ['ejectors', 'suction-cups', 'way-valves'],
  related: ['vacuum-safety', 'vacuum-energy', 'vacuum-leakage', 'pressure-switches', 'solenoid-valves', 'pick-and-place', 'filling-emptying', 'math:exponential-growth-decay'],
  body: `
A gripper needs more than a generator and a cup. It must switch the vacuum on and off at the right moments, know that the part is really held before the robot moves, and let go cleanly — a light part will happily stay stuck to a cup long after the vacuum is switched off. A basic ejector circuit, drawn in [[iso-1219-pneu|ISO 1219]] symbols, has:

1. a **"vacuum on"** solenoid valve (2/2 or 3/2) feeding compressed air to the ejector;
2. the **ejector** with its silencer;
3. a **vacuum filter** that keeps dust out of the ejector and valves;
4. a **vacuum switch** (or sensor) that reports "part gripped" when the vacuum passes its set point (see [[pressure-switches]]);
5. a **"blow-off"** valve that sends a short pulse of compressed air through a throttle into the vacuum line to release the part;
6. the **cups**, with hoses as short as possible.

The sequence: vacuum on → wait for the switch → move → vacuum off and blow-off for 50–200 ms → blow-off off → gripper away. Compact ejectors combine the two valves, the switch, a non-return valve and the silencer in one block the size of a matchbox; air-saving versions also switch themselves off (see [[ejectors]] and [[vacuum-energy]]).

### Near the cup or central?
An ejector can sit right at the cups (**decentralised**) or a central ejector or pump can serve a whole tool through longer vacuum lines. Compressed air travels well: at 6 bar a thin tube carries a lot of it. Vacuum does not: the most pressure difference a vacuum line can ever use is one atmosphere, so vacuum lines must be short and generously sized, and everything in them must be evacuated on every pick. Putting the ejector at the cup shrinks that volume — often by a factor of ten or more — and the gripper grips that much faster.

### How long does it take to grip?
Suppose the generator draws a steady volume flow $S$ measured at the pressure in the cup — true for a vacuum pump well above its ultimate pressure. The air left in the volume $V$ of cups and hoses then falls exponentially, like a tank being emptied ([[filling-emptying]], [[math:exponential-growth-decay|exponential decay]]): $V\\,dp/dt = -S p$, so

$$t = \\frac{V}{S}\\,\\ln\\frac{p_0}{p_1}$$

with $p_0$ and $p_1$ absolute. The logarithm grows slowly at first and then quickly: $\\ln(p_0/p_1)$ is 0.92 for 60 % vacuum, 1.61 for 80 % and 2.30 for 90 %. For an ejector, use its open-port suction flow for $S$: that gives a fair estimate up to about 60 % vacuum. Beyond that the ejector's flow falls away as its maximum nears and the real time is longer — up to its maximum vacuum it would be infinite — so allow a generous margin, or integrate the real curve as the simulation does. A leak slows everything further.

| Hose bore | Volume per metre |
|---|---|
| 2.5 mm (4 mm tube) | 4.9 cm³ |
| 4 mm (6 mm tube) | 12.6 cm³ |
| 6 mm (8 mm tube) | 28.3 cm³ |
| 8 mm (10 mm tube) | 50.3 cm³ |

Small flat cups hold a few cubic centimetres each; bellows cups several times more. Add the switching time of the valve (10–30 ms), the response of the vacuum switch and a moment for the part to settle.

### Letting go
Switching off the ejector leaves the cup at vacuum; air creeps back only through the ejector's own passages, which can take a second or more. The **blow-off** pulse refills the cups at once and pushes the part off. It must be short and throttled: too much, and small parts fly. Blow-off also cleans the filter and cups a little every cycle.

> [!tip] Put the ejector at the cups, keep vacuum lines short and wide, and use the smallest cups that do the job: every cubic centimetre removed from the vacuum side is time and air saved on every pick.

> [!warn] Move only after the vacuum switch confirms the grip, and keep monitoring it while moving: a drop in vacuum must stop the motion before the part is lost. Before working on a gripper, set down the part, switch off and exhaust the air and lock out the supply.
`,
  ideas: [
    'A basic circuit: "vacuum on" valve, ejector, filter, vacuum switch, blow-off valve with throttle, cups.',
    'Move only after the vacuum switch confirms the grip; release with a short blow-off pulse.',
    'Evacuation time is about V/S × ln(p₀/p₁): proportional to the volume, inversely to the suction.',
    'The rough formula is fair to about 60 % vacuum; near the generator\'s maximum, and with leaks, the real time is much longer.',
    'Ejectors at the cups shrink the volume to be evacuated and so grip faster.'
  ],
  pitfalls: [
    'The robot can move as soon as the vacuum valve switches — The cups need time to evacuate; move only when the vacuum switch confirms the grip.',
    'Switching off the vacuum releases the part — The cups stay at vacuum until air gets back in; without a blow-off pulse, light parts stick and come along.',
    'Vacuum lines can be as thin as compressed-air lines — A vacuum line works with at most one atmosphere of pressure difference; thin, long lines slow the gripper and lower the vacuum at the cup.'
  ],
  formulas: [
    {
      name: 'Volume to evacuate',
      expr: 'V = n*Vc + pi*dh^2/4*L', tex: 'V = n\\,V_c + \\frac{\\pi d_h^2}{4}\\,L',
      vars: {
        V: { name: 'volume of cups and hoses', q: 'volume', unit: 'cm³' },
        n: { name: 'number of cups', q: 'count', value: 4, int: true, min: 1, max: 100 },
        Vc: { name: 'inner volume of one cup', q: 'volume', unit: 'cm³', value: 3, tex: 'V_c' },
        dh: { name: 'bore of the vacuum hose', q: 'length', unit: 'mm', value: 4, tex: 'd_h' },
        L: { name: 'total length of vacuum hose', q: 'length', unit: 'm', value: 2 }
      },
      note: 'Add fittings, filters and manifolds. The ejector\'s own internal volume is small.',
      practice: { unknowns: ['V', 'L'] },
      stories: {
        V: 'A gripper has {n} cups of {Vc} each and {L} of vacuum hose with a bore of {dh}. What volume must be evacuated?',
        L: 'A gripper with {n} cups of {Vc} each may have a total vacuum volume of {V}. How much hose of bore {dh} can it have?'
      }
    },
    {
      name: 'Evacuation time (constant suction speed)',
      expr: 't = V/S*ln(p0/p1)', tex: 't = \\frac{V}{S}\\,\\ln\\frac{p_0}{p_1}',
      vars: {
        t: { name: 'evacuation time', q: 'time', unit: 's' },
        V: { name: 'volume of cups and hoses', q: 'volume', unit: 'cm³', value: 50 },
        S: { name: 'suction speed (volume flow at the cup pressure)', q: 'flowrate', unit: 'L/min', value: 20 },
        p0: { name: 'starting pressure (absolute)', q: 'pressure', unit: 'mbar', value: 1013, tex: 'p_0' },
        p1: { name: 'target pressure (absolute)', q: 'pressure', unit: 'mbar', value: 405, tex: 'p_1' }
      },
      note: 'Exact for a pump of constant pumping speed well above its ultimate pressure. For an ejector take its open-port suction flow: fair up to about 60 % vacuum, optimistic beyond. No leak.',
      practice: { unknowns: ['t', 'S', 'V'] },
      stories: {
        t: 'A gripper with {V} of cups and hoses is evacuated with a suction speed of {S} from {p0} to {p1}. How long does it take?',
        S: 'A gripper with {V} of cups and hoses must reach {p1} from {p0} within {t}. What suction speed does it need?',
        V: 'A generator with a suction speed of {S} must evacuate a gripper from {p0} to {p1} within {t}. How large may its vacuum volume be?'
      }
    }
  ],
  examples: [
    {
      title: 'How fast does the gripper grip?',
      q: 'Four flat cups of 3 cm³ each hang on 2 m of hose with a 4 mm bore, evacuated by an ejector that sucks 23 L/min with its port open and reaches 88 % at most. Estimate the time to 60 % and to 80 % vacuum at sea level.',
      steps: [
        'Volume: $4 \\times 3 + \\pi \\times 0.4^2/4 \\times 200 = 12 + 25.1 = 37.1$ cm³.',
        'To 60 % (405 mbar): $t = 0.0371/23 \\times \\ln(1013/405)$ min $= 1.61\\times10^{-3} \\times 0.917 = 1.48\\times10^{-3}$ min = 0.089 s.',
        'To 80 % (203 mbar): $\\ln(1013/203) = 1.61$, so the estimate is 0.16 s.',
        'Integrating the straight-line ejector curve instead gives 0.10 s and 0.21 s: the estimate is close at 60 %, a quarter too optimistic at 80 %.'
      ],
      a: 'About 0.1 s to 60 % and 0.2 s to 80 % — plus the valve\'s switching time.'
    },
    {
      title: 'Moving the ejector to the cups',
      q: 'The same four cups are first served by a central ejector through 5 m of hose with an 8 mm bore, then by the same ejector mounted at the cups with 0.3 m of 4 mm hose. Compare the times to 60 % vacuum.',
      steps: [
        'Central: $V = 12 + 50.3 \\times 5 = 263$ cm³; $t = 0.263/23 \\times 0.917$ min = 0.63 s.',
        'At the cups: $V = 12 + 12.6 \\times 0.3 = 15.8$ cm³; $t = 0.0158/23 \\times 0.917$ min = 0.038 s.'
      ],
      a: 'About 0.63 s against 0.04 s — seventeen times faster, with the same ejector and the same air.'
    }
  ],
  quiz: [
    { q: 'What is the blow-off pulse for?', choices: ['To cool the ejector', 'To refill the cups at once so the part is released cleanly instead of sticking', 'To test the vacuum switch', 'To save air'], a: 1,
      why: 'Without it the cups stay at vacuum until air seeps back through the ejector, and light parts stay stuck to the gripper.' },
    { q: 'Halving the volume of hoses and cups changes the evacuation time by a factor of…', choices: ['½', '¼', '2', 'it does not change'], a: 0,
      why: 't = (V/S) ln(p₀/p₁) is proportional to V.' },
    { q: 'How long does a pump with a constant suction speed of 60 L/min take to evacuate 0.2 L from 1013 to 405 mbar absolute?', answer: 0.183, unit: 's', tol: 0.03,
      why: 't = 0.2/60 min × ln(1013/405) = 3.33×10⁻³ × 0.917 min = 3.06×10⁻³ min = 0.183 s.' },
    { q: 'A robot may start moving as soon as the "vacuum on" valve has switched.', a: false,
      why: 'The cups first need tens to hundreds of milliseconds to evacuate; the vacuum switch confirms the grip.' },
    { q: 'A gripper at the end of 5 m of 8 mm vacuum hose is slow. The most effective improvement is usually…', choices: ['a higher supply pressure', 'moving the ejector to the cups, cutting the vacuum volume', 'harder cups', 'a longer blow-off pulse'], a: 1,
      why: 'The hose holds most of the volume to be evacuated; taking it away shortens the time in proportion.' }
  ],
  problems: [
    { q: 'Six bellows cups of 8 cm³ each and 3 m of 6 mm-bore hose are evacuated at a suction speed of 40 L/min. Estimate the time from 1013 to 300 mbar absolute.', answer: 0.242, unit: 's', tol: 0.03,
      steps: ['$V = 6 \\times 8 + 28.3 \\times 3 = 48 + 84.8 = 132.8$ cm³.', '$t = 0.1328/40 \\times \\ln(1013/300)$ min $= 3.32\\times10^{-3} \\times 1.217 = 4.04\\times10^{-3}$ min = 0.24 s.'] }
  ],
  applications: ['Robot and gantry grippers with compact ejectors at the cups.', 'Central vacuum supplies for multi-cup tooling with a valve per cup group.', 'Checking the cycle time of a pick-and-place design.', 'Suction bars with self-closing valves for parts of varying size.'],
  sim: ['vac-evacuation', 'vac-pick-place']
},

{
  id: 'vacuum-safety', parent: 'vacuum-handling', title: 'Vacuum safety', level: 2,
  short: 'A part held by vacuum falls when the vacuum goes — on a power or air failure, a torn cup or a burst hose. Non-return valves and vacuum reservoirs buy time, switches detect the loss, mechanical catches hold the load; and nobody works under a vacuum-lifted load.',
  keywords: ['vacuum safety', 'loss of vacuum', 'power failure', 'air failure', 'non-return valve', 'vacuum reservoir', 'hold time', 'vacuum switch', 'mechanical catch', 'vacuum lifter', 'EN 13155', 'ISO 4414', 'suspended load', 'warning device'],
  prereq: ['vacuum-circuits', 'holding-force', 'check-valves-pneu'],
  related: ['pneumatic-safety', 'iso-4414', 'emergency-stop-pneu', 'safety-functions', 'vacuum-leakage', 'vacuum-energy', 'suction-cups'],
  body: `
A clamp that loses its air usually just goes slack. A vacuum gripper that loses its vacuum **drops the part** — from wherever it happens to be, at whatever speed it is moving. Every vacuum system therefore has to answer one question in its design: *what happens when the vacuum goes?*

### How vacuum is lost
| Cause | What happens | Typical protection |
|---|---|---|
| Power failure | a normally closed "vacuum on" valve closes, the ejector stops | non-return valve, reservoir; or a normally open valve (vacuum stays on while air lasts) |
| Air-supply failure | the ejector stops at once | non-return valve, reservoir, pressure switch on the supply |
| Torn or worn lip, hose pulled off | a large leak: the vacuum collapses | inspection, vacuum switch that stops motion, redundancy |
| Porous, oily or damp part | the vacuum or friction is less than assumed | testing with the worst parts, larger safety factor |
| Emergency stop, collision | a hard deceleration exceeds the grip | size for the worst deceleration, catches |
| Mis-set switch | motion starts before the grip is made | set point from the holding-force calculation, not by trial |

An ejector's vacuum falls within milliseconds once its supply stops, because air flows straight back through the nozzle and diffuser. A **non-return valve** between ejector and cup stops that; then the vacuum decays only through the leaks — the cup lips, the part, the fittings. How long it lasts depends on how much vacuum is stored and how fast it leaks.

### Buying time: the reservoir
With the supply gone, air leaking in at a free-air rate $q_L$ raises the absolute pressure in the volume $V$ at the rate $p_\\text{ANR}\\,q_L/V$ (isothermal). The part holds until the vacuum has fallen from $\\Delta p_0$ to the level at which it drops, $\\Delta p_1$:

$$t = \\frac{(V + V_r)\\,(\\Delta p_0 - \\Delta p_1)}{p_\\text{ANR}\\,q_L}$$

A gripper's own cups and hoses hold perhaps 50 cm³ — seconds or less with any real leak. A **vacuum reservoir** $V_r$ of a litre or more multiplies the time: enough to finish the move or to set the load down. The level at which the part drops is set by the holding force with no safety factor: for a horizontal lift, $\\Delta p_1 = m(g + a)/(nA)$.

### Detect, stop, catch
- A **vacuum switch** confirms the grip before the move and monitors it during the move; a fall below the set point stops the motion or brings the gripper to a safe position. Where a failure could hurt someone, this is a safety function and must be designed to the required performance level (see [[safety-functions]]).
- **Mechanical catches** — latches, hooks, supporting forks or clamp jaws that close under the part — hold it independently of the vacuum where it moves over people or valuable equipment.
- A **normally open** "vacuum on" valve keeps the ejector running during a power failure as long as compressed air remains; the choice between normally open and normally closed is part of the risk assessment ([[iso-4414|ISO 4414:2010]] asks that loss or restoration of energy must not create a hazard).
- **Hand-guided vacuum lifters** for sheets, sacks and stone slabs are lifting equipment; in Europe EN 13155:2003+A2:2009 covers them and asks for a safety margin on the holding force, a gauge the operator can see, a warning when the vacuum falls below the safe level, and a reserve that keeps the load held for some minutes after the energy fails.

### Other hazards of vacuum
- A large cup or the open inlet of a pump can grab a hand, hair or clothing; **never put a cup on skin** — even at modest vacuum it bursts blood vessels, and near an eye it can cause serious injury.
- Blow-off pulses can launch small parts; ejector exhausts are loud (use silencers and hearing protection, see [[noise-silencers]]).
- Compressed air feeds the ejectors: the usual rules apply — never point it at people, exhaust and lock out before maintenance (see [[pneumatic-safety]]).

> [!warn] Never stand, walk or reach under a load held by vacuum, and never route vacuum-lifted loads over people. Before working on a vacuum gripper or lifter, set the load down or support it mechanically, switch off and exhaust the compressed air, release the vacuum and lock out the energy supplies.

> [!key] Design every vacuum system for the moment the vacuum goes: a non-return valve and a reservoir buy time, a switch detects the loss, a catch holds the load — and the layout keeps people out from under it.
`,
  ideas: [
    'Loss of vacuum means a dropped part: power and air failures, torn lips, burst hoses, bad parts and hard stops all cause it.',
    'A non-return valve stops the vacuum collapsing through the ejector; the vacuum then decays only through leaks.',
    'Hold time ≈ (V + V_r)(Δp₀ − Δp₁)/(p_ANR q_L): a reservoir multiplies it.',
    'Vacuum switches confirm and monitor the grip; mechanical catches hold loads that must never fall.',
    'Nobody under a vacuum-held load; cups never on skin; lock out before maintenance.'
  ],
  pitfalls: [
    'A non-return valve holds the part indefinitely — It only stops the vacuum escaping through the generator; leaks at the lips and part still bring it down, in seconds without a reservoir.',
    'A vacuum gripper is safe because its cups are oversized — Oversizing does not help when a hose comes off, a lip tears or the power fails; loss of vacuum must be planned for.',
    'A normally closed "vacuum on" valve is always the safe choice — On power failure it stops the ejector and the part drops; a normally open valve keeps the vacuum while air remains. The risk assessment decides.'
  ],
  formulas: [
    {
      name: 'Vacuum at which the part drops (case I, no safety factor)',
      expr: 'dpmin = m*(g + a)/(n*pi*d^2/4)', tex: '\\Delta p_1 = \\frac{m\\,(g + a)}{n\\,\\pi d^2/4}',
      vars: {
        dpmin: { name: 'lowest vacuum that still holds (below atmosphere)', q: 'pressure', unit: 'kPa', tex: '\\Delta p_1' },
        m: { name: 'mass of the part', q: 'mass', unit: 'kg', value: 8 },
        g: { const: 'g' },
        a: { name: 'vertical acceleration at the moment', q: 'accel', unit: 'm/s²', value: 2 },
        n: { name: 'number of cups', q: 'count', value: 4, int: true, min: 1, max: 100 },
        d: { name: 'effective cup diameter', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'A horizontal part lifted vertically; for friction-carried loads divide by μ. The vacuum switch\'s warning point must lie well above this.',
      practice: { unknowns: ['dpmin', 'm'] },
      stories: {
        dpmin: 'A {m} part hangs under {n} cups of {d} and accelerates upward at {a}. Below what vacuum will it drop?',
        m: '{n} cups of {d} hold a part at a vacuum of {dpmin} with an upward acceleration of {a}. What mass is on the point of dropping?'
      }
    },
    {
      name: 'Hold time after the generator stops',
      expr: 't = (V + Vr)*(dp0 - dp1)/(pn*qL)', tex: 't = \\frac{(V + V_r)\\,(\\Delta p_0 - \\Delta p_1)}{p_\\text{ANR}\\,q_L}',
      vars: {
        t: { name: 'time until the part drops', q: 'time', unit: 's' },
        V: { name: 'volume of cups and hoses', q: 'volume', unit: 'L', value: 0.05 },
        Vr: { name: 'vacuum reservoir', q: 'volume', unit: 'L', value: 1, tex: 'V_r' },
        dp0: { name: 'vacuum when the supply stops (below atmosphere)', q: 'pressure', unit: 'kPa', value: 70, tex: '\\Delta p_0' },
        dp1: { name: 'vacuum at which the part drops (below atmosphere)', q: 'pressure', unit: 'kPa', value: 20, tex: '\\Delta p_1' },
        pn: { name: 'reference pressure of free air (absolute)', q: 'pressure', unit: 'mbar', value: 1000, fixed: true, tex: 'p_\\text{ANR}' },
        qL: { name: 'leak into the system (free air)', q: 'airflow', unit: 'L/min ANR', value: 2, tex: 'q_L' }
      },
      note: 'Isothermal, with a non-return valve so that nothing flows back through the generator, and a constant leak (as through choked gaps). Porous leaks shrink as the vacuum falls, so this is on the safe side for them.',
      practice: { unknowns: ['t', 'Vr', 'qL'] },
      stories: {
        t: 'A gripper with {V} of cups and hoses and a {Vr} reservoir holds its part at {dp0} when the air fails; the part drops at {dp1}, and air leaks in at {qL}. How long does it stay up?',
        Vr: 'A load must stay held for {t} after an energy failure. Cups and hoses hold {V}, the vacuum starts at {dp0}, the load drops at {dp1}, the leak is {qL}. What reservoir is needed?'
      }
    }
  ],
  examples: [
    {
      title: 'How long does the part stay up?',
      q: 'A gripper (cups and hoses 0.05 L) holds a part at −70 kPa behind a non-return valve when the compressed air fails. The part drops at −20 kPa, and 2 L/min of free air leaks in. How long does it hold, without and with a 1 L reservoir?',
      steps: [
        'Leak: $2$ L/min $= 3.33\\times10^{-5}$ m³/s; $p_\\text{ANR}\\,q_L = 10^5 \\times 3.33\\times10^{-5} = 3.33$ W, i.e. Pa·m³/s.',
        'Without reservoir: $t = 0.05\\times10^{-3} \\times 50\\,000/3.33 = 0.75$ s.',
        'With 1 L: $t = 1.05\\times10^{-3} \\times 50\\,000/3.33 = 15.8$ s.'
      ],
      a: 'Three quarters of a second without a reservoir; about 16 s with a litre — time to stop the move and set the part down.'
    },
    {
      title: 'Where to set the warning',
      q: 'Four 40 mm cups lift an 8 kg part with up to 2 m/s² upward. At what vacuum would it drop, and where might the vacuum switch\'s warning point go if the working vacuum is −65 kPa?',
      steps: [
        'Drop point: $\\Delta p_1 = 8 \\times 11.81/(4 \\times 1.257\\times10^{-3}) = 18.8$ kPa.',
        'With a safety factor of 2 the vacuum should not go below about 38 kPa during a move.',
        'A warning point near −45 kPa leaves margin above that and below the −65 kPa working level, so ordinary fluctuations do not trip it.'
      ],
      a: 'It would drop below about −19 kPa; a warning near −45 kPa stops the motion while the grip is still twice what is needed.'
    }
  ],
  quiz: [
    { q: 'The power fails. The ejector of a gripper is switched by a normally closed solenoid valve and there is no non-return valve. What happens?', choices: ['The part stays gripped until the air runs out', 'The valve closes, the ejector stops and the vacuum collapses within milliseconds: the part drops', 'The vacuum switch holds the vacuum', 'Nothing: vacuum needs no energy'], a: 1,
      why: 'Without a non-return valve, air rushes back through the ejector as soon as it stops.' },
    { q: 'What does a vacuum reservoir do in a safety concept?', choices: ['It raises the vacuum level', 'It stores vacuum, so leaks take much longer to bring the vacuum down after a failure', 'It filters dust', 'It replaces the vacuum switch'], a: 1,
      why: 'The hold time is proportional to the total evacuated volume: a litre of reservoir can turn a fraction of a second into many seconds.' },
    { q: 'A non-return valve between ejector and cup holds the part indefinitely after the air fails.', a: false,
      why: 'It stops back-flow through the ejector; leaks through lips, part and fittings still bring the vacuum down.' },
    { q: 'Before a robot moves a gripped part, it should…', choices: ['wait a fixed 50 ms', 'wait for the vacuum switch to confirm the grip, and keep monitoring during the move', 'raise the supply pressure', 'switch on the blow-off'], a: 1,
      why: 'Confirmation makes sure the part is held with the vacuum the design assumed; monitoring catches a loss in time.' },
    { q: 'Cups and a reservoir hold 2 L in total. The vacuum starts at −70 kPa, the part drops at −30 kPa, and 1 L/min of free air leaks in. How many seconds does the part stay up after the generator stops?', answer: 48, unit: 's', tol: 0.03,
      why: 't = 2×10⁻³ × 40 000/(10⁵ × 1.667×10⁻⁵) = 80/1.667 = 48 s.' }
  ],
  applications: ['Hand-guided vacuum lifters for glass, stone, sheet and sacks, with reservoirs and warning devices.', 'Robot grippers that stop the motion when the vacuum sags.', 'Press-line tooling with catches for heavy panels.', 'Risk assessments of vacuum handling under ISO 12100:2010 and ISO 4414:2010.'],
  sim: 'vac-pick-place'
},

{
  id: 'vacuum-energy', parent: 'vacuum-handling', title: 'Energy in vacuum handling', level: 2,
  short: 'An ejector that runs all the time turns expensive compressed air into a little vacuum. Switching it off once the part is sealed, sizing it to the job, running it at its optimum pressure and choosing a pump for continuous duty typically cut the energy by 80–90 %.',
  keywords: ['vacuum energy', 'air-saving ejector', 'energy-saving', 'switch-off', 'hysteresis', 'ejector efficiency', 'air consumption', 'vacuum pump energy', 'supply pressure', 'cost of vacuum', 'duty cycle'],
  prereq: ['ejectors', 'vacuum-circuits', 'cost-of-compressed-air'],
  related: ['air-saving-circuits', 'vacuum-pumps', 'vacuum-leakage', 'pressure-optimisation', 'air-leaks', 'leak-management', 'vacuum-safety'],
  body: `
Compressed air is an expensive way to deliver energy (see [[cost-of-compressed-air]]), and an ejector is an inefficient way to use it. A 1 mm ejector at 5 bar consumes about 51 L/min of free air — some 3 m³ an hour, which costs the compressor about a third of a kilowatt of electricity. Measured against the isothermal work of the vacuum it actually makes at −60 kPa, only a few per cent of that is useful; a good vacuum pump reaches 20–40 %. Yet ejectors remain the right choice for most grippers — as long as they run only when they have work to do.

### Where the energy goes
- **Holding a tight part.** Once a sheet is sealed, an ejector that keeps blowing does nothing but make noise. This is usually the largest waste, and the easiest to cut.
- **Leaks** at worn lips, loose fittings, uncovered cups and porous parts, which keep the ejector running (see [[vacuum-leakage]]).
- **Oversize.** A bigger ejector than the job needs uses proportionally more air every second it runs.
- **Too much pressure.** Air use rises with the absolute supply pressure, while the vacuum peaks at the ejector's optimum — often 4–5 bar (see [[ejectors]]).
- **Volume.** Long, wide vacuum lines must be evacuated on every pick.

### Air-saving control
An air-saving ejector has a non-return valve and a vacuum switch with two set points. It runs until the vacuum reaches the **upper** set point, say −70 kPa, then switches off; the non-return valve holds the vacuum. If leakage lowers it to the **lower** set point, say −60 kPa, the ejector runs again for a few tens of milliseconds. The time the vacuum takes to leak down between the set points follows the same law as the safety hold time (see [[vacuum-safety]]): the tighter the system and the larger its volume, the rarer the re-starts. With tight parts the ejector runs only during evacuation and a few short top-ups — typically **80–90 % less air** than an ejector running through the whole hold, and more on long holds. On porous parts it saves nothing, because the vacuum never stays up.

### A checklist of measures
| Measure | Typical saving (indicative) |
|---|---|
| Air-saving control on tight parts | 80–90 % of the ejector's air |
| Switching off in pauses and between picks | whatever the ejector ran for nothing |
| Supply pressure lowered to the optimum, e.g. 6 → 4.5 bar | about 20 % |
| Right-sized ejector, multi-stage for large volumes | 20–50 % |
| Short vacuum lines, ejectors at the cups | less volume, faster picks |
| Worn cups replaced, uncovered cups closed | fewer re-starts or a higher vacuum |
| A pump for continuous duty (vacuum tables, central systems) | often 70–90 % against ejectors |

These figures are typical; the only reliable numbers are measured ones — a flow meter on the gripper's supply for a day tells the story.

> [!tip] A quick audit: listen. An ejector hissing while a robot waits holding a part, or while the line is stopped, is money leaving through the silencer.

> [!warn] Energy saving must not weaken the grip. Air-saving ejectors rely on their non-return valve and switch: check that a failure of either is detected, keep the lower set point above the level the safety factor requires, and do not lower the supply pressure below what the ejector needs for its vacuum.
`,
  ideas: [
    'An ejector turns only a few per cent of the compressed air\'s energy into useful vacuum work; its air costs about 0.11 kWh per m³ of free air.',
    'The biggest waste is an ejector running while a sealed part is simply held.',
    'Air-saving ejectors switch off at an upper set point and back on at a lower one: typically 80–90 % less air on tight parts.',
    'Run ejectors at their optimum pressure, size them to the job and keep vacuum volumes small.',
    'For continuous vacuum a pump uses a fraction of the energy of ejectors.'
  ],
  pitfalls: [
    'Air-saving ejectors save air on every part — They need the vacuum to stay up with the supply off; on porous or leaky parts they run continuously and save nothing.',
    'A higher supply pressure is a safety margin — Above the optimum it adds air use in proportion to the absolute pressure without adding vacuum.',
    'Ejectors cost nothing because air is already there — Every litre of free air was made by a compressor using electricity: about 0.11 kWh per cubic metre.'
  ],
  formulas: [
    {
      name: 'Share of air saved by an air-saving ejector',
      expr: 's = 1 - (te + N*tr)/th', tex: 's = 1 - \\frac{t_e + N\\,t_r}{t_h}',
      vars: {
        s: { name: 'air saved against an ejector running through the hold', q: 'ratio', unit: '%', min: 0, max: 100 },
        te: { name: 'evacuation time', q: 'time', unit: 's', value: 0.15, tex: 't_e' },
        N: { name: 're-starts while holding', q: 'count', value: 2, int: true, min: 0, max: 1000 },
        tr: { name: 'length of one re-start', q: 'time', unit: 's', value: 0.03, tex: 't_r' },
        th: { name: 'time the part is held', q: 'time', unit: 's', value: 3, tex: 't_h' }
      },
      note: 'The ejector consumes the same flow whenever it runs, so the air used is proportional to the running time.',
      practice: { unknowns: ['s', 'th'] },
      stories: {
        s: 'An air-saving ejector evacuates in {te}, then re-starts {N} times for {tr} each while holding a part for {th}. What share of the air does it save?',
        th: 'An air-saving ejector evacuates in {te} and re-starts {N} times for {tr} each. How long must the hold be for it to save {s}?'
      }
    },
    {
      name: 'Yearly cost of an ejector\'s air',
      expr: 'C = Q*H*w*price', tex: 'C = Q\\,H\\,w\\,c_\\text{el}',
      vars: {
        C: { name: 'cost per year', q: 'money', unit: '$' },
        Q: { name: 'air consumption while running (free air)', q: false, unit: 'm³/h', value: 3.05 },
        H: { name: 'running hours per year', q: false, unit: 'h', value: 4000 },
        w: { name: 'electricity per cubic metre of free air', q: false, unit: 'kWh/m³', value: 0.11 },
        price: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.15, tex: 'c_\\text{el}' }
      },
      note: 'About 0.1–0.12 kWh per m³ of free air at 6–7 bar from a good compressor; more from an old or part-loaded one.',
      practice: { unknowns: ['C', 'H'] },
      stories: {
        C: 'An ejector consumes {Q} of free air and runs {H} a year. The compressor needs {w} and electricity costs {price} per kWh. What does its air cost per year?',
        H: 'An ejector consuming {Q} may cost at most {C} a year ({w}, {price} per kWh). How many hours may it run?'
      }
    }
  ],
  examples: [
    {
      title: 'What one ejector costs — and what air-saving saves',
      q: 'A 1 mm ejector consumes 3.05 m³/h of free air and runs 4000 hours a year; the compressor needs 0.11 kWh per m³ and electricity costs ¤0.15 per kWh. A plant has 150 such grippers. What do they cost, and what if air-saving control cuts their air by 90 %?',
      steps: [
        'One ejector: $3.05 \\times 4000 \\times 0.11 \\times 0.15 = 201$ per year.',
        '150 ejectors: about ¤30,000 a year.',
        'With 90 % saved: about ¤3,000 a year — ¤27,000 saved.'
      ],
      a: 'About ¤200 per ejector and ¤30,000 for the plant; air-saving control saves roughly ¤27,000 a year.'
    },
    {
      title: 'An air-saving pick-and-place',
      q: 'A gripper holds a sealed part for 3 s per cycle. The ejector evacuates in 0.15 s, and leakage makes it re-start twice during the hold for 0.03 s each. What share of its air does air-saving control save?',
      steps: [
        'Running time: $0.15 + 2 \\times 0.03 = 0.21$ s instead of 3 s.',
        'Saved: $1 - 0.21/3 = 0.93$.'
      ],
      a: '93 % — the ejector runs for 0.21 s of each 3 s hold.'
    },
    {
      title: 'Lowering the supply pressure',
      q: 'An ejector reaches its best vacuum at 4.5 bar but is supplied at 6 bar gauge. How much air does a regulator set to 4.5 bar save?',
      steps: ['Air use scales with the absolute supply pressure: $(4.5 + 1.013)/(6 + 1.013) = 0.786$.'],
      a: 'About 21 % less air, with the same (or a slightly better) vacuum.'
    }
  ],
  quiz: [
    { q: 'An ejector uses 100 L/min of free air at 5 bar gauge. About how much does it use at 4 bar gauge?', answer: 83.4, unit: 'L/min', tol: 0.03,
      why: 'Choked nozzle: flow ∝ absolute supply pressure: 100 × 5.013/6.013 = 83.4 L/min.' },
    { q: 'An air-saving ejector needs a non-return valve between its nozzle and the cups.', a: true,
      why: 'Without it, the vacuum would flow back through the ejector the moment it switched off, and it would have to run continuously.' },
    { q: 'Which usually wastes the most energy in an ejector-based gripper?', choices: ['The blow-off pulse', 'The ejector running while a sealed part is simply held, or while the machine waits', 'The vacuum switch', 'The silencer'], a: 1,
      why: 'Evacuation takes a fraction of a second; holding and waiting can take seconds to hours.' },
    { q: 'A vacuum clamping table on a router needs vacuum 16 hours a day. The most energy-efficient source is usually…', choices: ['a bank of ejectors', 'a vacuum pump', 'an air-saving ejector', 'a larger compressor'], a: 1,
      why: 'For continuous duty a pump uses a small fraction of the energy of ejectors, and a wood panel leaks too much for air-saving control.' },
    { q: 'An air-saving ejector on a porous cardboard box saves about as much as on a steel sheet.', a: false,
      why: 'The box leaks the vacuum away as soon as the ejector stops, so it runs continuously and saves nothing.' }
  ],
  applications: ['Retrofitting air-saving ejectors on press lines and packaging machines.', 'Energy audits of compressed-air use in handling.', 'Choosing between ejectors and a central pump for a new machine.', 'Setting regulators on vacuum supplies to the ejector\'s optimum pressure.'],
  sim: 'vac-air-saving'
}

);
