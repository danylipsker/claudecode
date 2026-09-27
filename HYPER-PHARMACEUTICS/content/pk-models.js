/* HYPER-PHARMACEUTICS · content/pk-models.js — Pharmacokinetics › Models and dosing:
 * the one-compartment IV bolus, intravenous infusion, oral absorption (Bateman), multiple dosing,
 * loading and maintenance doses, the two-compartment model, non-linear (Michaelis–Menten) kinetics
 * and non-compartmental analysis. Simulations in sims/pk-models.js (prefix pkm-).
 * All drugs and numbers are hypothetical teaching examples. */
Hyper.add(

{
  id: 'one-compartment-iv', parent: 'pk-models', title: 'The one-compartment IV bolus', level: 2,
  short: 'The simplest model of a drug in the body: one well-stirred volume V that the whole dose enters at once and that is cleared at a constant CL. The level falls exponentially, C = C₀e^(−kt) with k = CL/V — a straight line on a log scale.',
  keywords: ['one-compartment model', 'IV bolus', 'intravenous bolus', 'first-order elimination', 'elimination rate constant', 'semilog plot', 'back-extrapolation', 'C0', 'clearance', 'volume of distribution', 'half-life', 'AUC', 'exponential decay'],
  prereq: ['volume-distribution', 'clearance', 'half-life', 'math:exponential-models'],
  related: ['two-compartment', 'iv-infusion', 'nca', 'auc-cmax', 'protein-binding', 'medicine:pharmacokinetics', 'medicine:half-life-dosing', 'chemistry:integrated-rate-laws'],
  body: `
Inject a drug into a vein and within minutes it has spread through the blood and into every tissue it can reach. The **one-compartment model** pretends that this happens instantly and evenly: the body is a single well-stirred tank of volume $V$, and the liver and kidneys are a pump that draws plasma from the tank, strips it of drug and returns it clean at a flow $\\mathrm{CL}$ — the **clearance**, in litres of plasma cleared per hour. The pump removes $\\mathrm{CL}\\cdot C$ milligrams an hour: a lot while the level is high, little when it is low. A fixed *fraction* of what is left disappears each hour, and that is the signature of first-order kinetics.

### The equations
A mass balance on the tank gives a first-order differential equation and its exponential solution:

$$V\\frac{dC}{dt} = -\\mathrm{CL}\\,C \\qquad\\Rightarrow\\qquad C = C_0\\,e^{-kt}, \\qquad C_0 = \\frac{D}{V}, \\qquad k = \\frac{\\mathrm{CL}}{V}$$

and the half-life is $t_{1/2} = \\ln 2/k = 0.693\\,V/\\mathrm{CL}$. A hypothetical antibiotic with $V = 40$ L and $\\mathrm{CL} = 4$ L/h has $k = 0.1$ per hour and $t_{1/2} = 6.9$ h. A 500 mg bolus gives $C_0 = 12.5$ mg/L; 24 hours — three and a half half-lives — later, 1.1 mg/L (9 %) is left.

### Reading the semilog plot
Take logarithms: $\\ln C = \\ln C_0 - kt$. Measured levels plotted on a logarithmic axis fall on a straight line of slope $-k$; extended back to $t = 0$ it cuts the axis at $C_0$, and $V = D/C_0$. Two good samples fix the line: $k = \\ln(C_1/C_2)/(t_2 - t_1)$. On base-10 semilog paper, as used before computers, the slope is $-k/2.303$ (see [[math:logarithms|logarithms]]). A curve that bends on this plot is the first sign that one compartment is not enough.

### Clearance and volume come first
The half-life feels like a property of the drug, but physiologically it is a consequence. Clearance is set by blood flow and by liver and kidney function; volume by how strongly the drug binds in tissues compared with plasma (see [[protein-binding]] and [[volume-distribution]]). The half-life follows from both — so disease can lengthen it for two opposite reasons:

| What changes | $C_0$ | $t_{1/2}$ | AUC |
|---|---|---|---|
| Dose doubled | ×2 | unchanged | ×2 |
| $V$ doubled (oedema, fluid overload), CL unchanged | ×½ | ×2 | unchanged |
| CL halved (kidney or liver failure), $V$ unchanged | unchanged | ×2 | ×2 |

Only a loss of clearance raises the total exposure, the area under the curve: $\\mathrm{AUC} = C_0/k = D/\\mathrm{CL}$ (see [[auc-cmax]]).

### When one compartment is enough
The model assumes instant mixing, constant CL and V, and elimination proportional to concentration. It fails in the first minutes to hours for drugs that move slowly into tissues — there a [[two-compartment]] model is needed — and at high levels for drugs whose enzymes saturate ([[nonlinear-pk]]). Even so, most everyday dosing arithmetic — [[iv-infusion|infusions]], [[multiple-dosing|repeated doses]], [[loading-dose|loading doses]] — rests on it, because it captures the slow terminal decline that decides how a drug accumulates. Try it in [the PK simulator](#/tools/pk).

> [!key] $C = (D/V)\\,e^{-kt}$ with $k = \\mathrm{CL}/V$. On a log scale: a straight line of slope $-k$ and intercept $C_0$. Clearance and volume are the primary parameters; $k$ and $t_{1/2}$ follow from them, and exposure (AUC = D/CL) depends on clearance alone.

> [!warn] The drugs and numbers on these pages are hypothetical teaching examples, not doses. Real dosing follows the product information and local protocols, with an independent check by a qualified professional; ask a pharmacist or doctor about any medicine you take.
`,
  ideas: [
    'One well-stirred volume, first-order elimination: C = C₀e^(−kt), with C₀ = D/V and k = CL/V.',
    'On a semilog plot the decline is a straight line; its slope gives k and its intercept gives C₀ and hence V.',
    'Clearance and volume are physiological; half-life is derived from them: t½ = 0.693 V/CL.',
    'Exposure after an IV dose depends only on clearance: AUC = D/CL.',
    'About 3.3 half-lives remove 90 % of a dose, 5 half-lives 97 %.'
  ],
  pitfalls: [
    'A longer half-life always means more drug in the body — Not if the volume grew: doubling V halves the level and doubles the half-life while leaving the AUC unchanged. Only a fall in clearance raises exposure.',
    'k and t½ are fixed properties of the drug — They are ratios of clearance to volume, which change with kidney and liver function, fluid status, age and interacting drugs.',
    'Any two samples will do to find k — Samples taken during the distribution phase of a drug that needs two compartments give a slope that is too steep; the samples must lie on the straight terminal part of the semilog plot.'
  ],
  formulas: [
    {
      name: 'Level after an IV bolus',
      expr: 'C = C0*exp(-k*t)', tex: 'C = C_0\\,e^{-kt}',
      vars: {
        C: { name: 'plasma concentration at time t', q: 'massconc', unit: 'mg/L' },
        C0: { name: 'initial (back-extrapolated) concentration', q: 'massconc', unit: 'mg/L', value: 12.5, tex: 'C_0' },
        k: { name: 'elimination rate constant', q: 'rate', unit: '1/h', value: 0.1 },
        t: { name: 'time since the dose', q: 'time', unit: 'h', value: 24 }
      },
      note: 'One compartment, first-order elimination. k = CL/V = ln 2 / t½.',
      practice: { unknowns: ['C', 't', 'k'] },
      stories: {
        C: 'A hypothetical drug starts at {C0} after an IV bolus and is eliminated with k = {k}. What is the level after {t}?',
        t: 'The level starts at {C0} and falls with k = {k}. How long until it reaches {C}?',
        k: 'The level falls from {C0} to {C} in {t}. What is the elimination rate constant?'
      }
    },
    {
      name: 'Initial concentration from the dose',
      expr: 'C0 = D/V', tex: 'C_0 = \\dfrac{D}{V}',
      vars: {
        C0: { name: 'initial concentration', q: false, unit: 'mg/L', tex: 'C_0' },
        D: { name: 'IV dose', q: false, unit: 'mg', value: 500 },
        V: { name: 'volume of distribution', q: false, unit: 'L', value: 40 }
      },
      note: 'Evaluated in mg, L and mg/L. In practice C₀ is found by extending the semilog line back to t = 0, and V = D/C₀.',
      stories: { V: 'A {D} IV bolus of a hypothetical drug gives a back-extrapolated {C0}. What is its volume of distribution?', C0: 'A drug with a volume of distribution of {V} is given as a {D} bolus. What is the initial level?' }
    },
    {
      name: 'Half-life from clearance and volume',
      expr: 'th = ln(2)*V/CL', tex: 't_{1/2} = \\dfrac{\\ln 2 \\cdot V}{\\mathrm{CL}}',
      vars: {
        th: { name: 'elimination half-life', q: 'time', unit: 'h', tex: 't_{1/2}' },
        V: { name: 'volume of distribution', q: 'volume', unit: 'L', value: 40 },
        CL: { name: 'clearance', q: 'flowrate', unit: 'L/h', value: 4, tex: '\\mathrm{CL}' }
      },
      note: 'The half-life is a consequence of CL and V, not an independent property.',
      stories: {
        th: 'A hypothetical drug has a volume of distribution of {V} and a clearance of {CL}. What is its half-life?',
        CL: 'A drug with a volume of {V} has a half-life of {th}. What is its clearance?'
      }
    },
    {
      name: 'Exposure after an IV dose',
      expr: 'AUC = D/CL', tex: '\\mathrm{AUC} = \\dfrac{D}{\\mathrm{CL}}',
      vars: {
        AUC: { name: 'area under the curve, 0 to ∞', q: false, unit: 'mg·h/L', tex: '\\mathrm{AUC}' },
        D: { name: 'IV dose', q: false, unit: 'mg', value: 500 },
        CL: { name: 'clearance', q: false, unit: 'L/h', value: 4, tex: '\\mathrm{CL}' }
      },
      note: 'Holds for any linear model after an IV dose, whatever the number of compartments. Evaluated in mg, L/h and mg·h/L.',
      stories: { CL: 'A {D} IV dose of a hypothetical drug gives an AUC of {AUC}. What is its clearance?', AUC: 'A drug with a clearance of {CL} is given as a {D} IV dose. What is the AUC?' }
    }
  ],
  examples: [
    {
      title: 'Parameters from two samples',
      q: 'A hypothetical drug is given as a 600 mg IV bolus. Plasma levels are 12.0 mg/L at 2 h and 4.0 mg/L at 10 h, both on the straight terminal line. Find k, t½, C₀, V, CL and the AUC.',
      steps: [
        '$k = \\ln(12/4)/(10 - 2) = 1.0986/8 = 0.1373$ per hour, so $t_{1/2} = 0.693/0.1373 = 5.05$ h.',
        'Back-extrapolate 2 h to time zero: $C_0 = 12.0\\,e^{0.1373 \\times 2} = 12.0 \\times 1.316 = 15.8$ mg/L.',
        '$V = D/C_0 = 600/15.8 = 38.0$ L; $\\mathrm{CL} = kV = 0.1373 \\times 38.0 = 5.22$ L/h.',
        '$\\mathrm{AUC} = D/\\mathrm{CL} = 600/5.22 = 115$ mg·h/L — the same as $C_0/k = 15.8/0.1373$.'
      ],
      a: 'k = 0.137 /h, t½ = 5.0 h, C₀ = 15.8 mg/L, V = 38 L, CL = 5.2 L/h, AUC = 115 mg·h/L.'
    },
    {
      title: 'Two ways to double a half-life',
      q: 'A hypothetical drug has V = 40 L and CL = 4 L/h and is given as a 500 mg bolus. Compare (a) a patient whose volume doubles to 80 L with unchanged clearance, and (b) a patient whose clearance halves to 2 L/h with unchanged volume.',
      steps: [
        'Baseline: $C_0 = 12.5$ mg/L, $t_{1/2} = 0.693 \\times 40/4 = 6.9$ h, $\\mathrm{AUC} = 500/4 = 125$ mg·h/L.',
        '(a) $C_0 = 500/80 = 6.25$ mg/L, $t_{1/2} = 0.693 \\times 80/4 = 13.9$ h, AUC $= 500/4 = 125$ mg·h/L: lower levels for longer, same exposure.',
        '(b) $C_0 = 12.5$ mg/L, $t_{1/2} = 0.693 \\times 40/2 = 13.9$ h, AUC $= 500/2 = 250$ mg·h/L: the same start, twice the exposure.'
      ],
      a: 'Both half-lives are 13.9 h, but only the loss of clearance doubles the exposure (250 against 125 mg·h/L).'
    }
  ],
  quiz: [
    { q: 'In a one-compartment model the volume of distribution doubles while clearance stays the same. The half-life…', choices: ['halves', 'stays the same', 'doubles', 'quadruples'], a: 2, why: '$t_{1/2} = 0.693\\,V/\\mathrm{CL}$: doubling V doubles it. The drug is spread thinner, so the pump removes less per hour.' },
    { q: 'After an IV bolus $C_0 = 20$ mg/L and $k = 0.2$ per hour. What is the level 5 hours later?', answer: 7.36, unit: 'mg/L', why: '$20\\,e^{-0.2 \\times 5} = 20\\,e^{-1} = 7.36$ mg/L.' },
    { q: 'Kidney failure halves a drug\'s clearance but leaves its volume unchanged. After the same IV dose, the AUC is…', choices: ['halved', 'unchanged', 'doubled', 'four times larger'], a: 2, why: 'AUC = D/CL. Half the clearance means twice the exposure.' },
    { q: 'For a one-compartment drug given as an IV bolus, ln C plotted against time is a straight line.', a: true, why: 'ln C = ln C₀ − kt: a straight line of slope −k. A curve that bends shows a second compartment or non-linear elimination.' },
    { q: 'About how many half-lives pass before less than 10 % of an IV dose is left?', choices: ['2', '3.3', '5', '10'], a: 1, why: '$(1/2)^n = 0.1$ gives $n = \\log_2 10 = 3.32$. Five half-lives leave 3 %, seven leave under 1 %.' }
  ],
  problems: [
    { q: 'A hypothetical drug is given as a 1 g IV bolus; the semilog line extrapolates to $C_0 = 25$ mg/L. What is its volume of distribution?', answer: 40, unit: 'L', tol: 0.02, steps: ['$V = D/C_0 = 1000\\text{ mg}/25\\text{ mg/L} = 40$ L.'] },
    { q: 'After an IV bolus the level is 9.0 mg/L at 1 h and 2.25 mg/L at 9 h. What is the half-life?', answer: 4, unit: 'h', tol: 0.02, steps: ['The level fell four-fold — two halvings — in 8 hours.', '$t_{1/2} = 8/2 = 4$ h (or $0.693/[\\ln 4/8]$).'] },
    { q: 'In the previous problem the dose was 400 mg. What is the clearance?', answer: 6.48, unit: 'L/h', tol: 0.02, hint: 'Back-extrapolate to C₀ first.', steps: ['$k = \\ln 4/8 = 0.1733$ per hour.', '$C_0 = 9.0\\,e^{0.1733} = 10.70$ mg/L, so $V = 400/10.70 = 37.4$ L.', '$\\mathrm{CL} = kV = 0.1733 \\times 37.4 = 6.48$ L/h.'] }
  ],
  applications: ['Estimating a patient\'s own clearance and volume from two levels in [[tdm|therapeutic drug monitoring]].', 'Predicting how long a drug lingers after it is stopped — before surgery, or after a toxic dose.', 'The building block of infusion, multiple-dose and loading-dose calculations.', 'Scaling doses when clearance changes with kidney function ([[renal-adjustment]]).'],
  history: 'The idea of clearance came from kidney physiology: in 1928–29 Møller, McIntosh and Van Slyke defined urea clearance as the volume of blood the kidneys free of urea each minute. Friedrich Dost gave the whole field its name — *Pharmakokinetik* — in his 1953 book *Der Blutspiegel*, and the one-compartment model with its semilog plot became the everyday tool of clinical pharmacokinetics in the 1960s and 1970s.',
  sim: 'pkm-bolus'
},

{
  id: 'iv-infusion', parent: 'pk-models', title: 'Intravenous infusion', level: 2,
  short: 'A drug run into a vein at a constant rate rises towards a plateau, Css = R₀/CL, where elimination balances input. How high the plateau is depends on clearance; how fast it is reached depends only on the half-life — 90 % in 3.3 half-lives, 95 % in 4.3.',
  keywords: ['intravenous infusion', 'constant-rate infusion', 'steady state', 'plateau', 'Css', 'infusion rate', 'time to steady state', 't95', 'loading bolus', 'short infusion', 'zero-order input', 'drip'],
  prereq: ['one-compartment-iv', 'clearance', 'math:first-order-linear'],
  related: ['loading-dose', 'infusion-rates', 'multiple-dosing', 'two-compartment', 'tdm', 'parenteral-routes', 'medicine:half-life-dosing'],
  body: `
An infusion pump pushes drug into a vein at a constant rate $R_0$ — so many milligrams an hour, a **zero-order input**. At first there is little drug in the body and little is removed, so the level climbs quickly. As it rises, the body removes more ($\\mathrm{CL}\\cdot C$ per hour), the climb slows, and the level settles where **output equals input**: the steady state, or plateau.

### The plateau
Setting $R_0 = \\mathrm{CL}\\cdot C_{ss}$:

$$C_{ss} = \\frac{R_0}{\\mathrm{CL}}$$

The plateau depends on the rate and the clearance only — **not on the volume**. Turned round, an infusion is the cleanest way to measure clearance: run it to steady state and $\\mathrm{CL} = R_0/C_{ss}$. A hypothetical drug with $\\mathrm{CL} = 3$ L/h needs 24 mg/h to hold 8 mg/L.

### How fast the plateau comes
Solving $V\\,dC/dt = R_0 - \\mathrm{CL}\\,C$ from $C = 0$ (a [[math:first-order-linear|first-order linear equation]]):

$$C(t) = C_{ss}\\left(1 - e^{-kt}\\right), \\qquad k = \\frac{\\mathrm{CL}}{V}$$

The approach is the exact mirror image of the decline after a bolus, and it is governed by the half-life alone:

| Time since the start | Fraction of the plateau |
|---|---|
| 1 half-life | 50 % |
| 2 half-lives | 75 % |
| 3.3 half-lives | 90 % |
| 4.3 half-lives | 95 % |
| 5 half-lives | 97 % |
| 6.6 half-lives | 99 % |

For a drug with $t_{1/2} = 10$ h that is two days to 95 %; for one with a 40-day half-life, half a year. Doubling the rate doubles the plateau but does not bring it sooner. Any change of rate — up, down or off — reaches its new level over the same four to five half-lives, and after the pump stops the level falls with the same half-life it rose with.

### Short infusions
Many drugs are infused over 30–60 minutes rather than pushed as a bolus, because a rapid peak causes harm — infusion reactions, cardiac effects, damage to the vein. At the end of an infusion lasting $T$:

$$C_{end} = \\frac{R_0}{\\mathrm{CL}}\\left(1 - e^{-kT}\\right)$$

then the level falls as after a bolus. The slower the infusion, the lower the peak; the AUC is the same, $D/\\mathrm{CL}$.

### Getting to the plateau at once
To avoid waiting four half-lives, a **loading bolus** of $C_{ss}V$ fills the volume immediately and the infusion then only has to replace what is cleared (see [[loading-dose]]). With drugs that distribute slowly the picture is more complicated: the central level after stopping falls fast at first and then slowly, and the time to halve it grows with the length of the infusion — the context-sensitive half-time of [[two-compartment]] kinetics. The practical arithmetic of millilitres per hour and drops per minute is on [[infusion-rates]].

> [!key] Plateau $C_{ss} = R_0/\\mathrm{CL}$ (set by clearance); approach $1 - e^{-kt}$ (set by half-life): 50 % after one half-life, 90 % after 3.3, 95 % after 4.3. A bolus of $C_{ss}V$ gets there at once.

> [!warn] Infusion rates and concentrations here are hypothetical. Real infusions are prepared and run to the product information and local protocols, on programmed pumps, with an independent double check.
`,
  ideas: [
    'At steady state input equals output: Css = R₀/CL, independent of the volume.',
    'The approach to the plateau is C = Css(1 − e^(−kt)): the time course depends on the half-life alone.',
    'Doubling the rate doubles the plateau but does not reach it sooner.',
    'A loading bolus of Css·V puts a one-compartment drug at its plateau immediately.',
    'After an infusion stops, the level falls with the same half-life it rose with (for one compartment).'
  ],
  pitfalls: [
    'A faster infusion reaches the steady state sooner — The time to any fraction of the plateau depends only on the half-life. A faster rate reaches a given level sooner only because its plateau is higher.',
    'A larger volume of distribution means a lower plateau — The plateau is R₀/CL; a larger volume only slows the approach (it lengthens the half-life).',
    'Stopping an infusion clears the drug in one half-life — One half-life halves the level; it takes about 3.3 half-lives to fall by 90 %, and longer for drugs that have accumulated in slowly equilibrating tissues.'
  ],
  formulas: [
    {
      name: 'Plateau of a constant-rate infusion',
      expr: 'Css = R0/CL', tex: 'C_{ss} = \\dfrac{R_0}{\\mathrm{CL}}',
      vars: {
        Css: { name: 'steady-state concentration', q: false, unit: 'mg/L', tex: 'C_{ss}' },
        R0: { name: 'infusion rate', q: false, unit: 'mg/h', value: 24, tex: 'R_0' },
        CL: { name: 'clearance', q: false, unit: 'L/h', value: 3, tex: '\\mathrm{CL}' }
      },
      note: 'Evaluated in mg/h, L/h and mg/L. Independent of the volume of distribution.',
      stories: {
        Css: 'A hypothetical drug with a clearance of {CL} is infused at {R0}. What level does it settle at?',
        R0: 'A drug with a clearance of {CL} should hold a plateau of {Css}. What infusion rate is needed?',
        CL: 'An infusion of {R0} settles at {Css}. What is the clearance?'
      }
    },
    {
      name: 'Level during a constant-rate infusion',
      expr: 'C = R0/CL*(1 - exp(-CL*t/V))', tex: 'C = \\dfrac{R_0}{\\mathrm{CL}}\\left(1 - e^{-\\mathrm{CL}\\,t/V}\\right)',
      vars: {
        C: { name: 'concentration at time t', q: false, unit: 'mg/L' },
        R0: { name: 'infusion rate', q: false, unit: 'mg/h', value: 24, tex: 'R_0' },
        CL: { name: 'clearance', q: false, unit: 'L/h', value: 3, tex: '\\mathrm{CL}' },
        t: { name: 'time since the infusion started', q: false, unit: 'h', value: 12 },
        V: { name: 'volume of distribution', q: false, unit: 'L', value: 45 }
      },
      note: 'Starting from zero, no loading dose. With t = T, the infusion time, it gives the level at the end of a short infusion. Evaluated in mg/h, L/h, h, L and mg/L.',
      practice: { unknowns: ['C', 't'] },
      stories: {
        C: 'A hypothetical drug (clearance {CL}, volume {V}) is infused at {R0}. What is the level after {t}?',
        t: 'A drug (clearance {CL}, volume {V}) is infused at {R0}. When does the level reach {C}?'
      }
    },
    {
      name: 'Time to a fraction of the plateau',
      expr: 't = th*ln(1/(1 - f))/ln(2)', tex: 't = \\dfrac{t_{1/2}}{\\ln 2}\\,\\ln\\dfrac{1}{1 - f}',
      vars: {
        t: { name: 'time since the start (or since a change of rate)', q: 'time', unit: 'h' },
        th: { name: 'elimination half-life', q: 'time', unit: 'h', value: 10.4, tex: 't_{1/2}' },
        f: { name: 'fraction of the new steady state reached', q: 'ratio', unit: '%', value: 95, min: 1, max: 99.99 }
      },
      note: 'f = 50 % takes one half-life, 90 % takes 3.32, 95 % takes 4.32, 99 % takes 6.64. The same holds for repeated doses and after any change of rate.',
      stories: {
        t: 'A hypothetical drug has a half-life of {th}. How long after starting an infusion is {f} of the plateau reached?',
        f: 'A drug with a half-life of {th} has been infused for {t}. What fraction of its plateau has it reached?'
      }
    }
  ],
  examples: [
    {
      title: 'Setting a rate — and the wait',
      q: 'A hypothetical drug has CL = 3 L/h and V = 45 L. The aim is a steady 8 mg/L. What infusion rate is needed, how long until 95 % of the plateau, what is the level after 12 h, and what bolus would reach 8 mg/L at once?',
      steps: [
        '$R_0 = C_{ss}\\,\\mathrm{CL} = 8 \\times 3 = 24$ mg/h.',
        '$k = 3/45 = 0.0667$ per hour, $t_{1/2} = 10.4$ h; 95 % takes $4.32 \\times 10.4 = 45$ h — almost two days.',
        'At 12 h: $C = 8(1 - e^{-0.0667 \\times 12}) = 8 \\times 0.551 = 4.4$ mg/L, just over half the target.',
        'A loading bolus of $C_{ss}V = 8 \\times 45 = 360$ mg, followed by 24 mg/h, holds 8 mg/L from the start (one-compartment behaviour assumed).'
      ],
      a: '24 mg/h; 95 % after about 45 h; 4.4 mg/L at 12 h; a 360 mg bolus reaches the target at once.'
    },
    {
      title: 'A one-hour infusion against a bolus',
      q: 'A hypothetical antibiotic (V = 20 L, k = 0.3 per hour) is given as 1000 mg, either as a bolus or infused over 1 hour. Compare the peaks, and find the level 6 h after the end of the infusion.',
      steps: [
        'Bolus: $C_0 = 1000/20 = 50$ mg/L.',
        'Infusion: $R_0 = 1000$ mg/h, $\\mathrm{CL} = kV = 6$ L/h, $C_{end} = (1000/6)(1 - e^{-0.3}) = 166.7 \\times 0.259 = 43.2$ mg/L.',
        'Six hours later: $43.2\\,e^{-0.3 \\times 6} = 43.2 \\times 0.165 = 7.1$ mg/L.',
        'The infusion trims the peak by 14 % and leaves the exposure unchanged (AUC = 1000/6 = 167 mg·h/L in both cases).'
      ],
      a: 'Peak 43 mg/L after a 1-hour infusion against 50 mg/L as a bolus; 7.1 mg/L six hours later.'
    }
  ],
  quiz: [
    { q: 'The infusion rate of a drug at steady state is doubled. What happens?', choices: ['the level doubles, reached in about 4–5 half-lives', 'the level doubles at once', 'the level doubles and the half-life halves', 'the level rises by √2'], a: 0, why: 'Css = R₀/CL doubles, and the new plateau is approached with the drug\'s own half-life, like any change of rate.' },
    { q: 'A patient\'s volume of distribution is twice normal, with normal clearance. Compared with normal, the infusion plateau is…', choices: ['half as high, reached sooner', 'the same, reached later', 'twice as high, reached later', 'the same, reached sooner'], a: 1, why: 'Css = R₀/CL does not involve V. The half-life (0.693 V/CL) doubles, so the plateau takes twice as long to reach.' },
    { q: 'A hypothetical drug has a half-life of 6 h. How long after starting an infusion is 95 % of the plateau reached?', answer: 25.9, unit: 'h', why: '$t = 6 \\times \\ln 20/\\ln 2 = 6 \\times 4.32 = 25.9$ h.' },
    { q: 'Giving a loading bolus changes the plateau level of an infusion.', a: false, why: 'The plateau is set by the rate and the clearance. The bolus only gets there sooner.' },
    { q: 'An infusion of a one-compartment drug is stopped at steady state. The level halves after…', choices: ['one half-life', 'two half-lives', 'the time it took to reach the plateau', 'it depends on the infusion rate'], a: 0, why: 'After stopping, the level falls as after a bolus: halved in one half-life, whatever the rate. (For multi-compartment drugs the fall can slow with long infusions.)' }
  ],
  problems: [
    { q: 'An infusion of 50 mg/h of a hypothetical drug settles at 12.5 mg/L. What is its clearance?', answer: 4, unit: 'L/h', tol: 0.02, steps: ['$\\mathrm{CL} = R_0/C_{ss} = 50/12.5 = 4$ L/h.'] },
    { q: 'A hypothetical drug with CL = 5 L/h and V = 50 L is infused at 40 mg/h from zero. What is the level after 10 h?', answer: 5.06, unit: 'mg/L', tol: 0.02, steps: ['$C_{ss} = 40/5 = 8$ mg/L; $k = 5/50 = 0.1$ per hour.', '$C = 8(1 - e^{-1}) = 8 \\times 0.632 = 5.06$ mg/L.'] }
  ],
  applications: ['Continuous infusions in intensive care, anaesthesia and oncology, where a steady level matters.', 'Measuring clearance: CL = R₀/Css at steady state.', 'Short (30–60 min) infusions of drugs whose rapid peak is harmful.', 'Target-controlled infusion pumps in anaesthesia, which compute rates from a compartment model in real time.'],
  history: 'Constant-rate infusion was analysed with the same exponentials as a bolus from the start of pharmacokinetics. In 1974 John Wagner described giving a fast infusion followed by a slower one to reach a plateau quickly without overshoot, and from the 1990s computer-controlled pumps in anaesthesia began running multi-compartment models to hold a chosen target concentration.',
  sim: 'pkm-infusion'
},

{
  id: 'oral-absorption-pk', parent: 'pk-models', title: 'Oral absorption: the Bateman function', level: 2,
  short: 'A tablet adds a first-order absorption step before the body\'s first-order elimination, giving the rise-and-fall Bateman curve. The peak time depends only on ka and k; the peak height on the dose; the AUC on F·D/CL — and when absorption is slower than elimination the tail reflects absorption: flip-flop kinetics.',
  keywords: ['oral absorption', 'Bateman function', 'absorption rate constant', 'ka', 'tmax', 'Cmax', 'flip-flop kinetics', 'lag time', 'first-order absorption', 'extravascular dose', 'Wagner–Nelson', 'absorption half-life'],
  prereq: ['one-compartment-iv', 'bioavailability', 'gi-absorption', 'math:first-order-linear'],
  related: ['multiple-dosing', 'modified-release', 'depot-implants', 'nca', 'bioequivalence', 'first-pass', 'auc-cmax', 'physics:half-life'],
  body: `
A drug taken by mouth has to dissolve, cross the gut wall and survive the liver before it reaches the blood, so its level rises, peaks and falls. The simplest useful model treats the gut as a second compartment that empties into the body by **first-order absorption** with rate constant $k_a$, while the body eliminates with $k$ as before. Only the fraction $F$ of the dose — the [[bioavailability]] — ever arrives.

### The Bateman function
The two exponentials combine into

$$C(t) = \\frac{F D\\,k_a}{V(k_a - k)}\\left(e^{-kt} - e^{-k_a t}\\right)$$

the same equation as a radioactive parent decaying into a daughter that itself decays. Early on, the $e^{-k_a t}$ term dominates the change and the curve rises; later, when the gut is nearly empty, the $e^{-kt}$ term is all that is left and the curve falls with the elimination half-life.

### Peak time, peak height and exposure
The peak comes when absorption and elimination balance ($k_a e^{-k_a t} = k e^{-kt}$):

$$t_{max} = \\frac{\\ln(k_a/k)}{k_a - k}, \\qquad C_{max} = \\frac{F D}{V}\\,e^{-k\\,t_{max}}, \\qquad \\mathrm{AUC} = \\frac{F D}{\\mathrm{CL}}$$

Three consequences matter every day. $t_{max}$ **does not depend on the dose** — a double dose peaks at the same time, twice as high. **The AUC does not depend on $k_a$** — every molecule absorbed is cleared the same way in the end. And slower absorption flattens and delays the peak without changing the exposure. For a hypothetical drug with $FD/V = 6$ mg/L and $k = 0.1$ per hour ($t_{1/2} = 6.9$ h, AUC = 60 mg·h/L in every row):

| $k_a$ (1/h) | Absorption half-life | $t_{max}$ | $C_{max}$ (mg/L) |
|---|---|---|---|
| 3 | 0.23 h | 1.2 h | 5.3 |
| 1.5 | 0.46 h | 1.9 h | 4.9 |
| 0.5 | 1.4 h | 4.0 h | 4.0 |
| 0.2 | 3.5 h | 6.9 h | 3.0 |
| 0.05 | 13.9 h | 13.9 h | 1.5 |

That is the whole point of a modified-release tablet ([[modified-release]]): the same AUC with a lower, later, broader peak.

### Flip-flop kinetics
The formula is symmetric in $k_a$ and $k$: swap them and the curve has the same shape, only scaled. Whichever constant is *smaller* sets the terminal slope. Normally absorption is fast and the tail shows elimination. But for extended-release tablets, depot injections into muscle or under the skin, patches and implants ([[depot-implants]]), absorption can be the slower step — then the tail reflects **absorption**, and the apparent half-life is the absorption half-life. This is **flip-flop kinetics**. In the last row of the table the terminal half-life is 13.9 h, twice the true elimination half-life. Only an IV dose (or an oral solution) of the same drug can tell which constant is which — and it matters, because for such products the time to steady state follows the slower, absorption half-life.

### Real absorption
Real curves often start with a **lag time** (the tablet must empty from the stomach and disintegrate), and absorption from a modified-release tablet may be closer to zero order than first order. Food, gastric emptying and [[first-pass|first-pass metabolism]] change $F$ and $k_a$ (see [[gi-absorption]]). The Wagner–Nelson method recovers the fraction absorbed over time from the blood curve itself — the basis for linking dissolution tests to the body ([[ivivc]]).

> [!key] $t_{max} = \\ln(k_a/k)/(k_a - k)$, independent of dose; $C_{max} \\propto F D$; AUC $= FD/\\mathrm{CL}$, independent of $k_a$. The smaller of $k_a$ and $k$ sets the terminal slope: when absorption is slower, the tail is absorption (flip-flop).
`,
  ideas: [
    'Oral dosing adds a first-order absorption step: the level rises, peaks and falls (the Bateman function).',
    'tmax depends only on ka and k, not on the dose; Cmax is proportional to F·D.',
    'The AUC after an oral dose is F·D/CL, whatever the absorption rate.',
    'Slower absorption gives a later, lower peak with the same exposure — the idea behind modified release.',
    'When ka < k the terminal slope is set by absorption (flip-flop kinetics); only an IV reference can tell.'
  ],
  pitfalls: [
    'The terminal half-life after a tablet is always the elimination half-life — For extended-release products, depots and patches absorption can be the slower step, and the tail then shows the absorption half-life (flip-flop).',
    'A higher dose peaks later — With linear kinetics tmax does not depend on the dose; only the height scales.',
    'Faster absorption means more drug absorbed — The rate (ka) and the extent (F) are separate: a faster-dissolving tablet raises Cmax and brings tmax forward, but the AUC changes only if F changes.'
  ],
  derivation: {
    title: 'Derive the Bateman function and the peak time',
    steps: [
      { text: 'Drug in the gut ($A_g$) is absorbed by first order; drug in the body ($A$) is eliminated by first order:', tex: '\\frac{dA_g}{dt} = -k_a A_g, \\qquad \\frac{dA}{dt} = k_a A_g - kA' },
      { text: 'The gut empties exponentially from the absorbable dose $FD$:', tex: 'A_g = FD\\,e^{-k_a t}' },
      { text: 'The body equation is then first-order linear with an exponential input. Multiply by the integrating factor $e^{kt}$:', tex: '\\frac{d}{dt}\\left(A\\,e^{kt}\\right) = k_a F D\\,e^{(k - k_a)t}' },
      { text: 'Integrate from $t = 0$, where $A = 0$:', tex: 'A\\,e^{kt} = \\frac{k_a F D}{k - k_a}\\left(e^{(k - k_a)t} - 1\\right)' },
      { text: 'Multiply by $e^{-kt}$ and divide by $V$:', tex: 'C = \\frac{F D\\,k_a}{V(k_a - k)}\\left(e^{-kt} - e^{-k_a t}\\right)' },
      { text: 'At the peak $dC/dt = 0$, so $k_a e^{-k_a t} = k\\,e^{-kt}$. Taking logarithms:', tex: 't_{max} = \\frac{\\ln(k_a/k)}{k_a - k}' },
      { text: 'Putting $e^{-k_a t_{max}} = (k/k_a)\\,e^{-k t_{max}}$ back into $C$ gives the neat result', tex: 'C_{max} = \\frac{FD}{V}\\,e^{-k\\,t_{max}}' }
    ]
  },
  formulas: [
    {
      name: 'The Bateman function (oral dose, one compartment)',
      expr: 'C = F*D*ka/(V*(ka - k))*(exp(-k*t) - exp(-ka*t))', tex: 'C = \\dfrac{F D\\,k_a}{V(k_a - k)}\\left(e^{-kt} - e^{-k_a t}\\right)',
      vars: {
        C: { name: 'plasma concentration', q: false, unit: 'mg/L' },
        F: { name: 'bioavailability (fraction)', value: 0.75, min: 0.01, max: 1 },
        D: { name: 'oral dose', q: false, unit: 'mg', value: 400 },
        ka: { name: 'absorption rate constant', q: false, unit: '1/h', value: 1.5, min: 0.005, max: 20, tex: 'k_a' },
        V: { name: 'volume of distribution', q: false, unit: 'L', value: 50 },
        k: { name: 'elimination rate constant', q: false, unit: '1/h', value: 0.1, min: 0.001, max: 5 },
        t: { name: 'time after the dose', q: false, unit: 'h', value: 2, min: 0, max: 200 }
      },
      note: 'Evaluated in mg, L, 1/h and h (F as a fraction). Assumes first-order absorption with no lag time and ka ≠ k. For a given level, ka and t can each have two solutions: one on the rising and one on the falling part of the curve.',
      practice: { unknowns: ['C', 'D'] },
      stories: {
        C: 'A hypothetical tablet of {D} (bioavailability {F}) is absorbed with ka = {ka} and eliminated with k = {k}; the volume is {V}. What is the level at {t}?',
        D: 'A drug (F = {F}, ka = {ka}, k = {k}, V = {V}) should give {C} at {t} after the dose. What dose is needed?'
      }
    },
    {
      name: 'Time of the peak',
      expr: 'tmax = ln(ka/k)/(ka - k)', tex: 't_{max} = \\dfrac{\\ln(k_a/k)}{k_a - k}',
      vars: {
        tmax: { name: 'time of the peak', q: 'time', unit: 'h', tex: 't_{max}' },
        ka: { name: 'absorption rate constant', q: 'rate', unit: '1/h', value: 1.5, min: 0.001, max: 50, tex: 'k_a' },
        k: { name: 'elimination rate constant', q: 'rate', unit: '1/h', value: 0.1, min: 0.001, max: 50 }
      },
      note: 'Independent of the dose and of F. Symmetric in ka and k: swapping them gives the same peak time (the root of flip-flop ambiguity).',
      stories: {
        tmax: 'A hypothetical drug is absorbed with ka = {ka} and eliminated with k = {k}. When does the level peak?',
        ka: 'A drug with k = {k} peaks at {tmax}. What is its absorption rate constant (assuming absorption is the faster step)?'
      }
    },
    {
      name: 'Height of the peak',
      expr: 'Cmax = F*D/V*exp(-k*tmax)', tex: 'C_{max} = \\dfrac{F D}{V}\\,e^{-k\\,t_{max}}',
      vars: {
        Cmax: { name: 'peak concentration', q: false, unit: 'mg/L', tex: 'C_{max}' },
        F: { name: 'bioavailability (fraction)', value: 0.75, min: 0.01, max: 1 },
        D: { name: 'oral dose', q: false, unit: 'mg', value: 400 },
        V: { name: 'volume of distribution', q: false, unit: 'L', value: 50 },
        k: { name: 'elimination rate constant', q: false, unit: '1/h', value: 0.1 },
        tmax: { name: 'time of the peak', q: false, unit: 'h', value: 1.934, tex: 't_{max}' }
      },
      note: 'At the peak, absorption and elimination balance; the level is what a bolus of F·D would have fallen to by tmax. Evaluated in mg, L, 1/h and h.',
      stories: { Cmax: 'A hypothetical {D} tablet (F = {F}) peaks at {tmax}; V = {V}, k = {k}. How high is the peak?' }
    },
    {
      name: 'Exposure after an oral dose',
      expr: 'AUC = F*D/CL', tex: '\\mathrm{AUC} = \\dfrac{F D}{\\mathrm{CL}}',
      vars: {
        AUC: { name: 'area under the curve, 0 to ∞', q: false, unit: 'mg·h/L', tex: '\\mathrm{AUC}' },
        F: { name: 'bioavailability (fraction)', value: 0.75, min: 0.01, max: 1 },
        D: { name: 'oral dose', q: false, unit: 'mg', value: 400 },
        CL: { name: 'clearance', q: false, unit: 'L/h', value: 5, tex: '\\mathrm{CL}' }
      },
      note: 'Independent of the absorption rate. Comparing oral and IV AUCs gives F: F = (AUC_oral/D_oral)/(AUC_IV/D_IV).',
      stories: {
        AUC: 'A hypothetical drug with a clearance of {CL} is given as a {D} tablet with bioavailability {F}. What is the AUC?',
        F: 'A {D} tablet gives an AUC of {AUC}; IV data give a clearance of {CL}. What is the bioavailability?'
      }
    }
  ],
  examples: [
    {
      title: 'Peak and exposure of a tablet',
      q: 'A hypothetical drug is given as a 400 mg tablet with F = 0.75. V = 50 L, ka = 1.5 per hour, k = 0.1 per hour. Find tmax, Cmax, the AUC and the level at 12 h.',
      steps: [
        '$t_{max} = \\ln(1.5/0.1)/(1.5 - 0.1) = \\ln 15/1.4 = 2.708/1.4 = 1.93$ h.',
        '$C_{max} = (0.75 \\times 400/50)\\,e^{-0.1 \\times 1.93} = 6 \\times 0.824 = 4.94$ mg/L.',
        '$\\mathrm{CL} = kV = 5$ L/h, so $\\mathrm{AUC} = 300/5 = 60$ mg·h/L.',
        'At 12 h: $C = \\frac{300 \\times 1.5}{50 \\times 1.4}(e^{-1.2} - e^{-18}) = 6.43 \\times 0.301 = 1.94$ mg/L — by now the absorption term has vanished.'
      ],
      a: 'tmax ≈ 1.9 h, Cmax ≈ 4.9 mg/L, AUC = 60 mg·h/L, 1.9 mg/L at 12 h.'
    },
    {
      title: 'Spotting flip-flop',
      q: 'The same drug is made as an extended-release tablet absorbed with ka = 0.05 per hour. Levels at 48 h and 96 h are 0.495 and 0.049 mg/L. What half-life would someone who ignored absorption report, and what is really going on?',
      steps: [
        'Apparent terminal slope: $\\ln(0.495/0.049)/48 = 2.31/48 = 0.048$ per hour, an apparent half-life of $0.693/0.048 = 14$ h.',
        'The IV half-life of this drug is 6.9 h ($k = 0.1$). The tail falls at close to $k_a = 0.05$ per hour: absorption is the slower step, so the tail shows absorption — flip-flop.',
        'The peak moves to $t_{max} = \\ln(0.5)/(0.05 - 0.1) = 13.9$ h and falls to $6\\,e^{-1.39} = 1.5$ mg/L; the AUC is still 60 mg·h/L.'
      ],
      a: 'About 14 h — the absorption half-life, not the 6.9 h elimination half-life.'
    }
  ],
  quiz: [
    { q: 'A new tablet of the same drug dissolves faster: ka rises, F and the dose are unchanged. What happens?', choices: ['earlier and higher peak, same AUC', 'earlier and higher peak, larger AUC', 'later peak, same height', 'no change: only elimination matters'], a: 0, why: 'tmax = ln(ka/k)/(ka − k) falls and Cmax rises as ka grows, but AUC = F·D/CL does not involve ka.' },
    { q: 'Doubling an oral dose (linear kinetics) makes the level peak later.', a: false, why: 'tmax depends only on ka and k. The whole curve is scaled by two.' },
    { q: 'A hypothetical drug has ka = 1.0 per hour and k = 0.2 per hour. When does it peak?', answer: 2.01, unit: 'h', why: '$\\ln(1.0/0.2)/(1.0 - 0.2) = 1.609/0.8 = 2.01$ h.' },
    { q: 'In flip-flop kinetics (ka < k), the terminal slope of the log-concentration curve equals…', choices: ['k, as always', 'ka', 'ka + k', 'the average of ka and k'], a: 1, why: 'The smaller rate constant sets the tail. When absorption is slower, the body clears drug faster than it arrives, so the decline tracks the gut emptying.' },
    { q: 'How can you tell for sure whether a long terminal half-life after a depot injection is flip-flop?', choices: ['a longer sampling period', 'comparison with an IV dose of the same drug', 'a higher depot dose', 'measuring tmax'], a: 1, why: 'The IV curve shows the true elimination rate. If the depot tail is slower, absorption is rate-limiting. The Bateman curve alone cannot tell ka from k.' }
  ],
  problems: [
    { q: 'A hypothetical drug has a clearance of 5 L/h and oral bioavailability of 50 %. What AUC does a 200 mg tablet give?', answer: 20, unit: 'mg·h/L', tol: 0.02, steps: ['$\\mathrm{AUC} = FD/\\mathrm{CL} = 0.5 \\times 200/5 = 20$ mg·h/L.'] },
    { q: 'A drug has ka = 2 per hour and k = 0.25 per hour. When does it peak?', answer: 1.19, unit: 'h', tol: 0.02, steps: ['$t_{max} = \\ln(2/0.25)/(2 - 0.25) = \\ln 8/1.75 = 2.079/1.75 = 1.19$ h.'] }
  ],
  applications: ['Designing modified-release tablets that lower the peak and extend the effect with the same exposure.', 'Interpreting the long tails of depot injections, patches and implants (flip-flop).', 'Bioequivalence studies, which compare Cmax, tmax and AUC of two products ([[bioequivalence]]).', 'Estimating absorption rates (Wagner–Nelson) to relate dissolution tests to blood levels ([[ivivc]]).'],
  history: 'Harry Bateman solved the equations of radioactive decay chains in 1910 — a parent decaying into a daughter that itself decays — and the oral-absorption curve is exactly his two-member chain, which is why pharmacologists call it the Bateman function. In 1963 John Wagner and Eino Nelson showed how to recover the fraction absorbed over time from a blood-level curve, a method still used to study how modified-release products behave in the body.',
  sim: 'pkm-oral'
},

{
  id: 'multiple-dosing', parent: 'pk-models', title: 'Multiple dosing and accumulation', level: 2,
  short: 'Each dose lands on what is left of the last, so levels build up until as much is cleared in each interval as is given. The accumulation factor 1/(1 − e^(−kτ)) sets the steady-state peaks and troughs; the average level depends only on the dose rate, F·D/(CL·τ); and steady state takes four to five half-lives whatever the schedule.',
  keywords: ['multiple dosing', 'accumulation', 'accumulation factor', 'steady state', 'superposition', 'peak and trough', 'dosing interval', 'fluctuation', 'Css average', 'geometric series', 'therapeutic window', 'missed dose'],
  prereq: ['one-compartment-iv', 'oral-absorption-pk', 'math:geometric-series'],
  related: ['loading-dose', 'iv-infusion', 'therapeutic-index', 'tdm', 'modified-release', 'nonlinear-pk', 'medicine:half-life-dosing'],
  body: `
Most medicines are taken again and again, and every dose lands on what is left of the previous ones. In a linear system the levels simply add — the **principle of superposition** — so the curve after many doses is the sum of many single-dose curves, each shifted by the dosing interval $\\tau$. The levels climb until the amount cleared in one interval equals the amount given in one dose: the **steady state**, where the curve repeats itself from dose to dose.

### Accumulation is a geometric series
After an IV bolus, a fraction $r = e^{-k\\tau}$ of the drug survives until the next dose. The peak after $n$ doses is the dose's own $D/V$ plus the surviving fractions of all the earlier ones:

$$C_{max,n} = \\frac{D}{V}\\left(1 + r + r^2 + \\dots + r^{n-1}\\right) = \\frac{D}{V}\\,\\frac{1 - r^n}{1 - r}$$

a [[math:geometric-series|geometric series]]. As $n$ grows, $r^n$ vanishes and

$$C_{max,ss} = \\frac{D/V}{1 - e^{-k\\tau}}, \\qquad C_{min,ss} = C_{max,ss}\\,e^{-k\\tau}, \\qquad R = \\frac{1}{1 - e^{-k\\tau}}$$

$R$ is the **accumulation factor**: how many times higher the steady-state peak is than the first. After $n$ doses the fraction of steady state reached is $1 - r^n = 1 - e^{-k\\,n\\tau}$ — exactly as for an infusion. However the doses are spaced, steady state takes four to five **half-lives**, not a number of doses.

### The average depends only on the dose rate
Over one interval at steady state the body clears exactly one dose, so the area under the curve in the interval is $F D/\\mathrm{CL}$ and the average level is

$$C_{ss,avg} = \\frac{F D}{\\mathrm{CL}\\,\\tau}$$

the same as an infusion at $FD/\\tau$. What the schedule changes is the **swing**. For a hypothetical drug with $t_{1/2} = 12$ h and $V = 60$ L given by IV bolus, 600 mg a day in three ways:

| Regimen | $R$ | Peak (mg/L) | Trough (mg/L) | Peak ÷ trough |
|---|---|---|---|---|
| 150 mg every 6 h | 3.41 | 8.5 | 6.0 | 1.4 |
| 300 mg every 12 h | 2.00 | 10.0 | 5.0 | 2.0 |
| 600 mg every 24 h | 1.33 | 13.3 | 3.3 | 4.0 |

The average is 7.2 mg/L in every row.

### Choosing the interval
The peak-to-trough ratio is $e^{k\\tau} = 2^{\\tau/t_{1/2}}$. To keep the levels inside a therapeutic window between $C_{min}$ and $C_{max}$ (see [[therapeutic-index]]) the interval can be at most $\\tau = \\ln(C_{max}/C_{min})/k$. A wide window and a long half-life allow once-daily or even weekly dosing; a narrow window and a short half-life force frequent doses, an infusion, or a [[modified-release]] product that stretches absorption. For some drugs a deep trough is harmless, even useful — the effect outlasts the level, or low troughs reduce toxicity — so the right swing depends on the pharmacology, not only on the numbers.

### Oral doses and real life
Oral doses give lower, later peaks and higher troughs than the same doses IV, with the same average. Real schedules are not perfectly even — "three times a day" at meals leaves a long night gap — and doses get missed. What to do after a missed dose is specific to each medicine and is given in its leaflet; a pharmacist can advise. Non-linear drugs break the superposition rule altogether ([[nonlinear-pk]]).

> [!key] Steady-state peak $= (D/V)/(1 - e^{-k\\tau})$, trough $=$ peak $\\times e^{-k\\tau}$, average $= FD/(\\mathrm{CL}\\,\\tau)$. Steady state takes 4–5 half-lives whatever the dose or interval; the interval sets the swing, the dose rate sets the average.

> [!warn] The regimens here belong to hypothetical drugs. Real dosing schedules come from the product information and the prescriber; do not change how or when a medicine is taken without advice from a pharmacist or doctor.
`,
  ideas: [
    'Levels from repeated doses add up (superposition) until the amount cleared per interval equals the dose.',
    'Accumulation factor R = 1/(1 − e^(−kτ)): 2 when the interval equals the half-life.',
    'The steady-state average, F·D/(CL·τ), depends only on the dose rate; the interval sets the peak-to-trough swing, e^(kτ).',
    'Steady state takes 4–5 half-lives, whatever the dose or the interval.',
    'The longest interval that keeps within a window is ln(Cmax/Cmin)/k.'
  ],
  pitfalls: [
    'A bigger dose reaches steady state faster — The time to steady state depends only on the half-life; a bigger dose gives a higher steady state, reached in the same time.',
    'Giving the same daily dose less often keeps the levels the same — The average is the same, but the peaks rise and the troughs fall: 600 mg once a day swings four-fold where 300 mg twice a day swings two-fold (τ = 12 h half-life).',
    'Steady state is reached after a fixed number of doses — It is reached after a fixed number of half-lives. With a 12-hour interval and a 48-hour half-life, that is about 16–20 doses; with a 4-hour half-life, the second dose is already close.'
  ],
  formulas: [
    {
      name: 'Accumulation factor',
      expr: 'R = 1/(1 - exp(-k*tau))', tex: 'R = \\dfrac{1}{1 - e^{-k\\tau}}',
      vars: {
        R: { name: 'accumulation factor (steady-state peak ÷ first peak)' },
        k: { name: 'elimination rate constant', q: 'rate', unit: '1/h', value: 0.0578 },
        tau: { name: 'dosing interval', q: 'time', unit: 'h', value: 12, tex: '\\tau' }
      },
      note: 'Linear kinetics, regular intervals. R = 2 when τ equals the half-life; R ≈ 1.44 t½/τ when τ is much shorter than the half-life.',
      stories: {
        R: 'A hypothetical drug with k = {k} is given every {tau}. How much higher are the steady-state peaks than the first peak?',
        tau: 'A drug with k = {k} should accumulate by a factor of {R}. What dosing interval gives that?'
      }
    },
    {
      name: 'Steady-state peak after repeated IV doses',
      expr: 'Cmax = D/(V*(1 - exp(-k*tau)))', tex: 'C_{max,ss} = \\dfrac{D}{V\\left(1 - e^{-k\\tau}\\right)}',
      vars: {
        Cmax: { name: 'steady-state peak', q: false, unit: 'mg/L', tex: 'C_{max,ss}' },
        D: { name: 'dose', q: false, unit: 'mg', value: 300 },
        V: { name: 'volume of distribution', q: false, unit: 'L', value: 60 },
        k: { name: 'elimination rate constant', q: false, unit: '1/h', value: 0.0578 },
        tau: { name: 'dosing interval', q: false, unit: 'h', value: 12, tex: '\\tau' }
      },
      note: 'IV bolus doses, one compartment. The trough is this peak × e^(−kτ). Evaluated in mg, L, 1/h and h.',
      practice: { unknowns: ['Cmax', 'D', 'tau'] },
      stories: {
        Cmax: 'A hypothetical drug (V = {V}, k = {k}) is given as {D} IV every {tau}. What is the steady-state peak?',
        D: 'A drug (V = {V}, k = {k}) is given every {tau}. What dose gives a steady-state peak of {Cmax}?'
      }
    },
    {
      name: 'Average steady-state level',
      expr: 'Cav = F*D/(CL*tau)', tex: 'C_{ss,avg} = \\dfrac{F D}{\\mathrm{CL}\\,\\tau}',
      vars: {
        Cav: { name: 'average steady-state concentration', q: false, unit: 'mg/L', tex: 'C_{ss,avg}' },
        F: { name: 'bioavailability (fraction)', value: 0.8, min: 0.01, max: 1 },
        D: { name: 'dose', q: false, unit: 'mg', value: 300 },
        CL: { name: 'clearance', q: false, unit: 'L/h', value: 3.47, tex: '\\mathrm{CL}' },
        tau: { name: 'dosing interval', q: false, unit: 'h', value: 12, tex: '\\tau' }
      },
      note: 'Any route, any linear model: the AUC over one interval at steady state divided by τ. Evaluated in mg, L/h, h and mg/L.',
      stories: {
        Cav: 'A hypothetical drug (clearance {CL}, bioavailability {F}) is taken as {D} every {tau}. What is the average steady-state level?',
        D: 'A drug with clearance {CL} and bioavailability {F} is taken every {tau}. What dose gives an average level of {Cav}?'
      }
    },
    {
      name: 'Longest interval for a therapeutic window',
      expr: 'tau = ln(Cmax/Cmin)/k', tex: '\\tau = \\dfrac{\\ln(C_{max}/C_{min})}{k}',
      vars: {
        tau: { name: 'longest dosing interval', q: 'time', unit: 'h', tex: '\\tau' },
        Cmax: { name: 'upper limit of the window (peak)', q: 'massconc', unit: 'mg/L', value: 12, tex: 'C_{max}' },
        Cmin: { name: 'lower limit of the window (trough)', q: 'massconc', unit: 'mg/L', value: 4, tex: 'C_{min}' },
        k: { name: 'elimination rate constant', q: 'rate', unit: '1/h', value: 0.0866 }
      },
      note: 'IV bolus doses at steady state: peak ÷ trough = e^(kτ). The dose that swings exactly between the limits is V(Cmax − Cmin). Oral absorption flattens the swing, so this is the conservative case.',
      stories: {
        tau: 'A hypothetical drug has k = {k}; its levels should stay between {Cmin} and {Cmax}. What is the longest dosing interval?',
        Cmin: 'A drug with k = {k} is given every {tau} with steady-state peaks of {Cmax}. What are the troughs?'
      }
    }
  ],
  examples: [
    {
      title: 'Same daily dose, two schedules',
      q: 'A hypothetical drug has t½ = 12 h and V = 60 L. Compare 300 mg IV every 12 h with 600 mg IV every 24 h at steady state.',
      steps: [
        '$k = 0.693/12 = 0.0578$ per hour; $\\mathrm{CL} = kV = 3.47$ L/h.',
        'Every 12 h: $r = e^{-0.693} = 0.5$, $R = 2$; peak $= (300/60) \\times 2 = 10.0$ mg/L, trough $= 5.0$ mg/L.',
        'Every 24 h: $r = 0.25$, $R = 1.33$; peak $= (600/60) \\times 1.33 = 13.3$ mg/L, trough $= 3.3$ mg/L.',
        'Average in both: $C_{ss,avg} = 300/(3.47 \\times 12) = 600/(3.47 \\times 24) = 7.2$ mg/L.'
      ],
      a: 'Same average (7.2 mg/L), but 10.0/5.0 against 13.3/3.3 mg/L: once daily swings twice as much.'
    },
    {
      title: 'Designing for a window',
      q: 'A hypothetical drug given IV has t½ = 8 h and V = 50 L; levels should stay between 4 and 12 mg/L. What is the longest interval, and what dose every 12 h gives a steady-state peak of 12 mg/L?',
      steps: [
        '$k = 0.693/8 = 0.0866$ per hour. Longest interval: $\\ln(12/4)/0.0866 = 1.099/0.0866 = 12.7$ h — so every 12 h is a practical choice.',
        'With $\\tau = 12$ h: $r = e^{-0.0866 \\times 12} = 0.354$.',
        'Dose for a 12 mg/L peak: $D = V\\,C_{max,ss}(1 - r) = 50 \\times 12 \\times 0.646 = 388$ mg.',
        'Trough: $12 \\times 0.354 = 4.2$ mg/L — inside the window.'
      ],
      a: 'At most about 12.7 h; about 390 mg every 12 h gives peaks of 12 and troughs of 4.2 mg/L.'
    }
  ],
  quiz: [
    { q: 'The same daily dose is split into four doses instead of two. At steady state…', choices: ['the average rises and the swing shrinks', 'the average is unchanged and the swing shrinks', 'the average falls', 'steady state comes sooner'], a: 1, why: 'The average FD/(CL·τ) depends only on the dose rate. Shorter intervals flatten the peak-to-trough ratio e^(kτ). The time to steady state depends on the half-life only.' },
    { q: 'A drug is given every half-life. What is the accumulation factor?', answer: 2, why: '$r = e^{-k t_{1/2}} = 1/2$, so $R = 1/(1 - 1/2) = 2$.' },
    { q: 'Doubling the dose (same interval) doubles the time needed to reach steady state.', a: false, why: 'It doubles the steady-state levels; the time to reach them is set by the half-life alone.' },
    { q: 'At steady state with IV doses given every two half-lives, the peak is how many times the trough?', answer: 4, why: 'Peak ÷ trough = e^(kτ) = 2^(τ/t½) = 2² = 4.' },
    { q: 'A hypothetical drug has a half-life of 48 h and is given every 12 h. Roughly when is steady state reached?', choices: ['after the second dose', 'after about 1 day', 'after about 8–10 days', 'never'], a: 2, why: 'Four to five half-lives: 4–5 × 48 h = 8–10 days, some 16–20 doses — the reason a loading dose is sometimes used.' }
  ],
  problems: [
    { q: 'A hypothetical drug is given IV every 8 h; each dose raises the level by $D/V = 5$ mg/L and $k = 0.1$ per hour. What is the steady-state peak?', answer: 9.08, unit: 'mg/L', tol: 0.02, steps: ['$e^{-0.1 \\times 8} = 0.449$.', '$C_{max,ss} = 5/(1 - 0.449) = 5/0.551 = 9.08$ mg/L.'] },
    { q: 'A hypothetical tablet (F = 0.9) of 250 mg is taken every 8 h; the clearance is 6 L/h. What is the average steady-state level?', answer: 4.69, unit: 'mg/L', tol: 0.02, steps: ['$C_{ss,avg} = FD/(\\mathrm{CL}\\,\\tau) = 0.9 \\times 250/(6 \\times 8) = 225/48 = 4.69$ mg/L.'] }
  ],
  applications: [
    'Try dosing regimens of a hypothetical drug against a target window in [the dosing simulator](#/tools/pk/dosing).','Choosing dosing intervals that keep levels inside a therapeutic window.', 'Explaining why once-daily products are made as modified-release forms for short half-life drugs.', 'Timing trough samples in therapeutic drug monitoring ([[tdm]]).', 'Predicting accumulation, and why side effects may appear only after days of treatment.'],
  history: 'In 1924 Erik Widmark and Tandberg calculated how repeated doses of a drug accumulate towards a plateau — among the first quantitative pharmacokinetics. In the 1960s Ekkehard Krüger-Thiemer turned such calculations into systematic dosage schedules for antibacterial drugs, and the peak, trough and average formulas became standard in clinical pharmacokinetics.',
  sim: 'pkm-multiple'
},

{
  id: 'loading-dose', parent: 'pk-models', title: 'Loading and maintenance doses', level: 2,
  short: 'A loading dose fills the volume of distribution at once (LD = C·V/F); maintenance doses then replace what is cleared (MD = C·CL·τ/F). Volume sets the first, clearance the second — so kidney failure usually lowers the maintenance dose but not the loading dose.',
  keywords: ['loading dose', 'maintenance dose', 'priming dose', 'target concentration', 'top-up dose', 'volume of distribution', 'clearance', 'accumulation factor', 'loading infusion', 'split loading dose', 'digitalisation'],
  prereq: ['multiple-dosing', 'iv-infusion', 'volume-distribution'],
  related: ['two-compartment', 'renal-adjustment', 'tdm', 'clearance', 'dose-calculations', 'paediatric-geriatric', 'medicine:half-life-dosing'],
  body: `
A drug with a long half-life takes four to five half-lives to build up: hours for some, days for many, weeks for a few with very long terminal half-lives. When the effect is needed sooner — an infection, an arrhythmia, a seizure — the regimen can start with a larger **loading dose** that fills the volume of distribution at once, followed by smaller **maintenance doses** that only replace what the body clears.

### Two doses, two jobs
$$D_L = \\frac{C_{target}\\,V}{F}, \\qquad D_M = \\frac{C_{target}\\,\\mathrm{CL}\\,\\tau}{F}$$

The loading dose depends on the **volume**, the maintenance dose on the **clearance**. That split explains most dose adjustments:

| Situation | Volume | Clearance | Loading dose | Maintenance dose |
|---|---|---|---|---|
| Kidney failure (renally cleared drug) | about the same | lower | usually unchanged | lower or less often |
| Oedema, ascites, critical illness (water-soluble drug) | higher | variable | larger | by clearance |
| Obesity (fat-soluble drug) | higher | variable | larger | by clearance |
| Enzyme-inducing co-medication | same | higher | unchanged | higher |

(See [[renal-adjustment]] and [[volume-distribution]].) A hypothetical drug with $V = 49$ L and $\\mathrm{CL} = 3.5$ L/h, aimed at 15 mg/L, needs a 735 mg loading dose and then 630 mg every 12 hours by IV; in kidney failure with CL = 1.2 L/h the loading dose is still 735 mg, but maintenance falls to 216 mg every 12 hours.

### Loading for intermittent doses
To start straight at the steady-state peaks of a regimen, the loading dose is the maintenance dose times the accumulation factor:

$$D_L = \\frac{D_M}{1 - e^{-k\\tau}}$$

When the interval equals the half-life this is exactly twice the maintenance dose — the logic behind regimens that begin with a double first dose.

### Topping up
If some drug is already on board — a level has been measured — only the difference is needed: $D_L = V(C_{target} - C_{now})/F$.

### Infusions
For an infusion the loading bolus is $C_{ss}V$ and the rate $C_{ss}\\,\\mathrm{CL}$ ([[iv-infusion]]). Alternatives are a fast infusion followed by a slower one, which avoids a sharp peak.

### Loading a drug that distributes slowly
The formulas assume the dose spreads through $V$ instantly. For a [[two-compartment]] drug the dose first fills only the small central volume $V_1$ — blood and well-perfused organs such as the heart and brain. A loading dose calculated from the whole volume and pushed as a bolus would briefly produce a central level $V_{ss}/V_1$ times the target: with $V_1 = 10$ L and $V_{ss} = 32$ L, more than three times. For drugs that act on the heart or brain that overshoot can be dangerous, so loading doses of such drugs are given slowly or split into portions hours apart, and levels are measured only after distribution is complete (see [[tdm]]).

> [!warn] Loading doses are deliberately larger than regular doses. They are prescribed case by case from the product information and local protocols, and checked independently; the numbers here are hypothetical teaching examples.
`,
  ideas: [
    'Loading dose = C·V/F fills the volume of distribution; maintenance dose = C·CL·τ/F replaces what is cleared.',
    'Loading depends on volume, maintenance on clearance: kidney failure usually changes maintenance only.',
    'For intermittent dosing, LD = MD/(1 − e^(−kτ)): twice the maintenance dose when τ equals the half-life.',
    'A top-up dose covers only the gap: V(C_target − C_now)/F.',
    'Drugs that distribute slowly are loaded slowly or in portions, to avoid a central overshoot.'
  ],
  pitfalls: [
    'A loading dose makes the drug act faster by shortening its half-life — It changes nothing about elimination; it simply starts the level where regular dosing would have taken 4–5 half-lives to arrive.',
    'In kidney failure every dose should be reduced — The loading dose depends on the volume of distribution, which kidney failure changes little; it is the maintenance dose that follows clearance.',
    'The loading dose can always be given as one rapid bolus — For drugs with slow distribution the bolus first fills the small central compartment and can overshoot the target several-fold; such doses are given slowly or split.'
  ],
  formulas: [
    {
      name: 'Loading dose',
      expr: 'DL = Ct*V/F', tex: 'D_L = \\dfrac{C_{target}\\,V}{F}',
      vars: {
        DL: { name: 'loading dose', q: false, unit: 'mg', tex: 'D_L' },
        Ct: { name: 'target concentration', q: false, unit: 'mg/L', value: 15, tex: 'C_{target}' },
        V: { name: 'volume of distribution', q: false, unit: 'L', value: 49 },
        F: { name: 'bioavailability (fraction)', value: 1, min: 0.01, max: 1 }
      },
      note: 'Assumes the dose spreads through V at once (one compartment). Evaluated in mg, mg/L and L.',
      stories: {
        DL: 'A hypothetical drug has a volume of distribution of {V} and bioavailability {F}. What loading dose reaches {Ct}?',
        V: 'A loading dose of {DL} (F = {F}) produced a level of {Ct}. What is the volume of distribution?'
      }
    },
    {
      name: 'Maintenance dose',
      expr: 'DM = Ct*CL*tau/F', tex: 'D_M = \\dfrac{C_{target}\\,\\mathrm{CL}\\,\\tau}{F}',
      vars: {
        DM: { name: 'maintenance dose each interval', q: false, unit: 'mg', tex: 'D_M' },
        Ct: { name: 'target average concentration', q: false, unit: 'mg/L', value: 15, tex: 'C_{target}' },
        CL: { name: 'clearance', q: false, unit: 'L/h', value: 3.5, tex: '\\mathrm{CL}' },
        tau: { name: 'dosing interval', q: false, unit: 'h', value: 12, tex: '\\tau' },
        F: { name: 'bioavailability (fraction)', value: 1, min: 0.01, max: 1 }
      },
      note: 'Holds the average steady-state level at the target; peaks and troughs swing around it. Evaluated in mg, mg/L, L/h and h.',
      stories: {
        DM: 'A hypothetical drug has a clearance of {CL} and bioavailability {F}. What dose every {tau} keeps the average level at {Ct}?',
        CL: 'A dose of {DM} every {tau} (F = {F}) holds an average level of {Ct}. What is the clearance?'
      }
    },
    {
      name: 'Loading dose for an intermittent regimen',
      expr: 'DL = DM/(1 - exp(-k*tau))', tex: 'D_L = \\dfrac{D_M}{1 - e^{-k\\tau}}',
      vars: {
        DL: { name: 'loading dose', q: false, unit: 'mg', tex: 'D_L' },
        DM: { name: 'maintenance dose', q: false, unit: 'mg', value: 400, tex: 'D_M' },
        k: { name: 'elimination rate constant', q: false, unit: '1/h', value: 0.0714 },
        tau: { name: 'dosing interval', q: false, unit: 'h', value: 12, tex: '\\tau' }
      },
      note: 'Starts at the steady-state peak of the maintenance regimen (IV bolus doses, one compartment). Evaluated in mg, 1/h and h.',
      stories: {
        DL: 'A hypothetical drug (k = {k}) will be maintained on {DM} every {tau}. What loading dose starts it at steady state?',
        tau: 'A regimen uses a loading dose of {DL} and a maintenance dose of {DM} for a drug with k = {k}. What dosing interval do they imply?'
      }
    },
    {
      name: 'Top-up (incremental) loading dose',
      expr: 'DL = V*(Ct - Cn)/F', tex: 'D_L = \\dfrac{V\\left(C_{target} - C_{now}\\right)}{F}',
      vars: {
        DL: { name: 'top-up dose', q: false, unit: 'mg', tex: 'D_L' },
        V: { name: 'volume of distribution', q: false, unit: 'L', value: 49 },
        Ct: { name: 'target concentration', q: false, unit: 'mg/L', value: 15, tex: 'C_{target}' },
        Cn: { name: 'measured concentration now', q: false, unit: 'mg/L', value: 6, tex: 'C_{now}' },
        F: { name: 'bioavailability (fraction)', value: 1, min: 0.01, max: 1 }
      },
      note: 'Assumes the measured level is in the same (distributed) volume. Evaluated in mg, L and mg/L.',
      stories: { DL: 'A hypothetical drug (V = {V}, F = {F}) has a measured level of {Cn}. What dose raises it to {Ct}?' }
    }
  ],
  examples: [
    {
      title: 'Loading and maintenance, then kidney failure',
      q: 'A hypothetical drug given IV has V = 49 L and CL = 3.5 L/h. The target average level is 15 mg/L with doses every 12 h. Find the loading and maintenance doses, then redo them for a patient whose clearance has fallen to 1.2 L/h.',
      steps: [
        'Loading: $D_L = 15 \\times 49 = 735$ mg.',
        'Maintenance: $D_M = 15 \\times 3.5 \\times 12 = 630$ mg every 12 h.',
        'Kidney failure: V unchanged, so $D_L$ stays 735 mg. $D_M = 15 \\times 1.2 \\times 12 = 216$ mg every 12 h — or the full 630 mg every $630/(15 \\times 1.2) = 35$ h.',
        'The half-life has risen from $0.693 \\times 49/3.5 = 9.7$ h to 28 h: without the loading dose the levels would take five to six days (4–5 half-lives) to reach the target.'
      ],
      a: 'Loading 735 mg in both cases; maintenance 630 mg every 12 h normally, 216 mg every 12 h at CL = 1.2 L/h.'
    },
    {
      title: 'Starting at steady state',
      q: 'The same drug (k = 3.5/49 = 0.0714 per hour) will be maintained on 400 mg IV every 12 h. What loading dose starts the patient at the steady-state peak?',
      steps: [
        '$e^{-0.0714 \\times 12} = e^{-0.857} = 0.424$.',
        '$D_L = 400/(1 - 0.424) = 400/0.576 = 695$ mg — the accumulation factor, 1.74, times the maintenance dose.'
      ],
      a: 'About 695 mg, then 400 mg every 12 h.'
    },
    {
      title: 'Topping up',
      q: 'A level of the same drug (V = 49 L) measured after distribution is 6 mg/L; the target is 15 mg/L. What IV dose closes the gap?',
      steps: ['$D_L = 49 \\times (15 - 6) = 441$ mg.'],
      a: '441 mg.'
    }
  ],
  quiz: [
    { q: 'A renally cleared drug: the patient\'s clearance halves, the volume is unchanged. Compared with normal…', choices: ['both doses halve', 'the loading dose is unchanged, the maintenance dose halves', 'the loading dose halves, the maintenance dose is unchanged', 'neither changes'], a: 1, why: 'Loading fills the volume (unchanged); maintenance replaces what is cleared (halved).' },
    { q: 'A hypothetical oral drug: target 10 mg/L, V = 35 L, F = 0.7. What is the loading dose?', answer: 500, unit: 'mg', why: '$D_L = 10 \\times 35/0.7 = 500$ mg.' },
    { q: 'A loading dose shortens the drug\'s half-life so that steady state comes sooner.', a: false, why: 'Half-life is unchanged. The loading dose simply puts the level where it would have ended up.' },
    { q: 'Why are loading doses of some slowly distributing drugs given slowly or split into portions?', choices: ['to improve absorption', 'because the bolus first fills the small central volume and would overshoot there', 'to lengthen the half-life', 'because clearance is higher at first'], a: 1, why: 'Before distribution is complete the dose sits in V₁; a dose calculated from the whole volume would give a central level V_ss/V₁ times the target.' },
    { q: 'With doses given every half-life, the loading dose that starts at steady state is how many times the maintenance dose?', answer: 2, why: '$1/(1 - e^{-k t_{1/2}}) = 1/(1 - 1/2) = 2$.' }
  ],
  problems: [
    { q: 'A hypothetical drug has CL = 2 L/h and F = 0.8. What oral dose every 8 h holds an average level of 20 mg/L?', answer: 400, unit: 'mg', tol: 0.02, steps: ['$D_M = C\\,\\mathrm{CL}\\,\\tau/F = 20 \\times 2 \\times 8/0.8 = 400$ mg.'] },
    { q: 'A measured level is 4 mg/L; the target is 12 mg/L; V = 60 L; the dose is IV. What top-up dose is needed?', answer: 480, unit: 'mg', tol: 0.02, steps: ['$D_L = 60 \\times (12 - 4) = 480$ mg.'] }
  ],
  applications: [
    'Compare a regimen with and without a loading dose in [the dosing simulator](#/tools/pk/dosing).','Starting treatment with long half-life drugs when an effect is needed quickly.', 'Loading and infusion schemes in intensive care and anaesthesia.', 'Dose adjustment in kidney failure, oedema and obesity, where volume and clearance change differently ([[renal-adjustment]]).', 'Correcting a low measured level in [[tdm|therapeutic drug monitoring]].'],
  history: 'Clinicians "digitalised" patients with large first doses of foxglove preparations long before anyone could say why it worked. The modern formulas — the loading dose from the volume, the maintenance dose from clearance — came with clinical pharmacokinetics in the 1960s and 1970s, and target-concentration dosing made them routine for drugs with narrow therapeutic windows.',
  sim: [{ id: 'pkm-multiple', params: { load: true } }, { id: 'pkm-infusion', params: { load: true } }]
},

{
  id: 'two-compartment', parent: 'pk-models', title: 'The two-compartment model', level: 3,
  short: 'Many drugs fall fast after an IV dose and then slowly: first they spread from blood into tissues (the α, distribution phase), then they are eliminated (the β, terminal phase). A central and a peripheral compartment give C = Ae^(−αt) + Be^(−βt), which the method of residuals pulls apart.',
  keywords: ['two-compartment model', 'biexponential', 'distribution phase', 'alpha phase', 'beta phase', 'terminal phase', 'method of residuals', 'feathering', 'curve stripping', 'micro-constants', 'hybrid constants', 'central compartment', 'peripheral compartment', 'Vss', 'Vbeta', 'context-sensitive half-time'],
  prereq: ['one-compartment-iv', 'volume-distribution', 'math:eigenvalues', 'math:logarithmic-scales'],
  related: ['loading-dose', 'iv-infusion', 'nca', 'tdm', 'pkpd', 'medicine:anaesthesia-surgery', 'math:second-order-linear'],
  body: `
After an IV bolus, many drugs fall steeply for the first minutes or hours and then much more slowly: on a semilog plot the curve bends and only later straightens. The early drop is not fast elimination — the drug is **moving into tissues**. The two-compartment model captures this with a small **central compartment** (plasma and the richly perfused organs: heart, lungs, liver, kidneys, brain) that exchanges drug with a **peripheral compartment** (muscle, skin, fat), and eliminates it from the centre.

### The model
With amounts $A_1$ (central, volume $V_1$) and $A_2$ (peripheral), and first-order rate constants $k_{12}$ (out to the tissues), $k_{21}$ (back) and $k_{10}$ (elimination):

$$\\frac{dA_1}{dt} = -(k_{10} + k_{12})A_1 + k_{21}A_2, \\qquad \\frac{dA_2}{dt} = k_{12}A_1 - k_{21}A_2$$

Two coupled linear equations have a sum of two exponentials as their solution, the rates being the [[math:eigenvalues|eigenvalues]] of the system:

$$C = A\\,e^{-\\alpha t} + B\\,e^{-\\beta t}, \\qquad \\alpha + \\beta = k_{10} + k_{12} + k_{21}, \\qquad \\alpha\\beta = k_{10}k_{21}$$

$\\alpha$ (the larger) belongs to the **distribution phase**, $\\beta$ to the **terminal phase**. The terminal half-life $0.693/\\beta$ is the one reported on product information — but $\\beta$ is smaller than $k_{10}$, because drug returning from the tissues keeps topping up the plasma.

### The method of residuals
Before computers, and still for intuition and starting values, the curve is pulled apart by hand ("feathering" or curve stripping). For a hypothetical 100 mg bolus:

| t (h) | Measured C (mg/L) | Terminal line $Be^{-\\beta t}$ | Residual |
|---|---|---|---|
| 0.25 | 7.45 | 1.95 | 5.50 |
| 0.5 | 5.68 | 1.90 | 3.78 |
| 1 | 3.60 | 1.81 | 1.79 |
| 2 | 2.04 | 1.64 | 0.40 |
| 12 | 0.602 | 0.602 | — |
| 24 | 0.181 | 0.181 | — |

1. Fit a straight line to the late points on the semilog plot: slope $-\\beta = -0.1$ per hour, intercept $B = 2$ mg/L.
2. Subtract the extrapolated line from the early points: the **residuals**.
3. The residuals fall on a second straight line: slope $-\\alpha = -1.5$ per hour, intercept $A = 8$ mg/L.

### From the curve to the body
The four "hybrid" constants give the physiological ones:

$$k_{21} = \\frac{A\\beta + B\\alpha}{A + B}, \\qquad k_{10} = \\frac{\\alpha\\beta}{k_{21}}, \\qquad k_{12} = \\alpha + \\beta - k_{21} - k_{10}, \\qquad V_1 = \\frac{D}{A + B}$$

Here $k_{21} = 0.38$, $k_{10} = 0.39$, $k_{12} = 0.83$ per hour, and clearance is $\\mathrm{CL} = D/\\mathrm{AUC} = 100/(8/1.5 + 2/0.1) = 3.95$ L/h. There are now three volumes, always in the order $V_1 < V_{ss} < V_\\beta$:

| Volume | Formula | Here | Used for |
|---|---|---|---|
| Central, $V_1$ | $D/(A + B)$ | 10 L | the first peak after a bolus |
| Steady state, $V_{ss}$ | $V_1(1 + k_{12}/k_{21})$ | 31.7 L | loading doses; amount in the body at steady state |
| Terminal, $V_\\beta$ | $\\mathrm{CL}/\\beta$ | 39.5 L | linking the terminal half-life to clearance |

### Why it matters
- **Sampling time.** During distribution the plasma level overstates the level in the tissues, so drug levels for monitoring are taken after distribution is complete — for digoxin, for example, at least six hours after a dose ([[tdm]]).
- **Loading doses** based on the whole volume, given too fast, overshoot in the central compartment — where the heart and brain are ([[loading-dose]]).
- **Effects that lag.** When the site of action is peripheral, the effect peaks after the plasma level and a plot of effect against concentration loops (hysteresis; see [[pkpd]]).
- **Anaesthesia.** After a long infusion the tissues are full and keep feeding drug back, so the time for the central level to halve — the **context-sensitive half-time** — grows with the length of the infusion, from minutes to hours for some intravenous anaesthetics and opioids ([[medicine:anaesthesia-surgery|anaesthesia]]). Three-compartment models are used there.

The compartments are mathematical, not anatomical: the "peripheral compartment" is whatever tissue exchanges slowly for that drug.

> [!key] $C = Ae^{-\\alpha t} + Be^{-\\beta t}$: a fast distribution phase and a slow terminal phase, stripped apart by the method of residuals. $\\beta < k_{10}$, and $V_1 < V_{ss} < V_\\beta$. The terminal half-life governs accumulation; the distribution phase governs early peaks and when to sample.
`,
  ideas: [
    'A curved semilog plot after an IV bolus means distribution into tissues: C = Ae^(−αt) + Be^(−βt).',
    'α and β are the eigenvalues of the two-compartment system: α + β = k10 + k12 + k21 and αβ = k10·k21.',
    'The method of residuals fits the terminal line, subtracts it, and fits the residuals to find A and α.',
    'Three volumes: V1 (initial) < Vss (steady state) < Vβ (terminal); the terminal slope β is smaller than k10.',
    'Distribution decides when to sample levels, how fast to load, and why effects can lag plasma levels.'
  ],
  pitfalls: [
    'The steep early fall is rapid elimination — It is mostly distribution into tissues; the drug is still in the body and will come back into the plasma.',
    'The terminal rate constant β is the elimination rate constant k10 — β is smaller than k10: the terminal phase is slowed by drug returning from the tissues. CL = k10·V1 = β·Vβ, not β·V1.',
    'The peripheral compartment is fat (or muscle) — Compartments are mathematical groupings of tissues that exchange at similar rates; they differ from drug to drug and need not match any organ.'
  ],
  formulas: [
    {
      name: 'Biexponential decline after an IV bolus',
      expr: 'C = A*exp(-alpha*t) + B*exp(-beta*t)', tex: 'C = A\\,e^{-\\alpha t} + B\\,e^{-\\beta t}',
      vars: {
        C: { name: 'plasma (central) concentration', q: 'massconc', unit: 'mg/L' },
        A: { name: 'intercept of the distribution phase', q: 'massconc', unit: 'mg/L', value: 8 },
        alpha: { name: 'distribution rate constant α', q: 'rate', unit: '1/h', value: 1.5, tex: '\\alpha' },
        B: { name: 'intercept of the terminal phase', q: 'massconc', unit: 'mg/L', value: 2 },
        beta: { name: 'terminal rate constant β', q: 'rate', unit: '1/h', value: 0.1, tex: '\\beta' },
        t: { name: 'time after the dose', q: 'time', unit: 'h', value: 1 }
      },
      note: 'C₀ = A + B. The terminal half-life is 0.693/β, the distribution half-life 0.693/α.',
      practice: { unknowns: ['C', 't'] },
      stories: {
        C: 'A hypothetical drug follows C = A·e^(−αt) + B·e^(−βt) with A = {A}, α = {alpha}, B = {B}, β = {beta}. What is the level at {t}?',
        t: 'With A = {A}, α = {alpha}, B = {B} and β = {beta}, when does the level fall to {C}?'
      }
    },
    {
      name: 'Return rate constant from the hybrid constants',
      expr: 'k21 = (A*beta + B*alpha)/(A + B)', tex: 'k_{21} = \\dfrac{A\\beta + B\\alpha}{A + B}',
      vars: {
        k21: { name: 'rate constant, peripheral → central', q: 'rate', unit: '1/h', tex: 'k_{21}' },
        A: { name: 'intercept of the distribution phase', q: 'massconc', unit: 'mg/L', value: 8 },
        beta: { name: 'terminal rate constant β', q: 'rate', unit: '1/h', value: 0.1, tex: '\\beta' },
        B: { name: 'intercept of the terminal phase', q: 'massconc', unit: 'mg/L', value: 2 },
        alpha: { name: 'distribution rate constant α', q: 'rate', unit: '1/h', value: 1.5, tex: '\\alpha' }
      },
      note: 'IV bolus into the central compartment. Then k10 = αβ/k21 and k12 = α + β − k21 − k10.',
      stories: { k21: 'Stripping a hypothetical curve gives A = {A}, α = {alpha}, B = {B}, β = {beta}. What is k₂₁?' }
    },
    {
      name: 'Elimination rate constant from the central compartment',
      expr: 'k10 = alpha*beta/k21', tex: 'k_{10} = \\dfrac{\\alpha\\beta}{k_{21}}',
      vars: {
        k10: { name: 'elimination rate constant from the central compartment', q: 'rate', unit: '1/h', tex: 'k_{10}' },
        alpha: { name: 'distribution rate constant α', q: 'rate', unit: '1/h', value: 1.5, tex: '\\alpha' },
        beta: { name: 'terminal rate constant β', q: 'rate', unit: '1/h', value: 0.1, tex: '\\beta' },
        k21: { name: 'rate constant, peripheral → central', q: 'rate', unit: '1/h', value: 0.38, tex: 'k_{21}' }
      },
      note: 'Because α > k21, k10 is always larger than β. Clearance CL = k10·V1.',
      stories: { k10: 'A hypothetical drug has α = {alpha}, β = {beta} and k₂₁ = {k21}. What is its elimination rate constant k₁₀?' }
    },
    {
      name: 'Volume of distribution at steady state',
      expr: 'Vss = V1*(1 + k12/k21)', tex: 'V_{ss} = V_1\\left(1 + \\dfrac{k_{12}}{k_{21}}\\right)',
      vars: {
        Vss: { name: 'volume of distribution at steady state', q: 'volume', unit: 'L', tex: 'V_{ss}' },
        V1: { name: 'central volume', q: 'volume', unit: 'L', value: 10, tex: 'V_1' },
        k12: { name: 'rate constant, central → peripheral', q: 'rate', unit: '1/h', value: 0.825, tex: 'k_{12}' },
        k21: { name: 'rate constant, peripheral → central', q: 'rate', unit: '1/h', value: 0.38, tex: 'k_{21}' }
      },
      note: 'At equilibrium k12·A1 = k21·A2, so the peripheral amount is k12/k21 times the central amount.',
      stories: {
        Vss: 'A hypothetical drug has a central volume of {V1}, k₁₂ = {k12} and k₂₁ = {k21}. What is its steady-state volume?',
        k12: 'A drug has V₁ = {V1}, V_ss = {Vss} and k₂₁ = {k21}. What is k₁₂?'
      }
    }
  ],
  examples: [
    {
      title: 'Stripping a curve',
      q: 'After a 100 mg IV bolus of a hypothetical drug, levels are 5.68 mg/L at 0.5 h, 3.60 at 1 h, 0.602 at 12 h and 0.181 at 24 h. Find β, B, α and A by the method of residuals.',
      steps: [
        'Terminal line through 12 h and 24 h: $\\beta = \\ln(0.602/0.181)/12 = 1.202/12 = 0.100$ per hour; $B = 0.602\\,e^{0.1 \\times 12} = 0.602 \\times 3.32 = 2.00$ mg/L.',
        'Extrapolated terminal line at 0.5 h: $2\\,e^{-0.05} = 1.90$; at 1 h: $2\\,e^{-0.1} = 1.81$ mg/L.',
        'Residuals: $5.68 - 1.90 = 3.78$ and $3.60 - 1.81 = 1.79$ mg/L.',
        '$\\alpha = \\ln(3.78/1.79)/0.5 = 0.748/0.5 = 1.50$ per hour; $A = 3.78\\,e^{1.5 \\times 0.5} = 3.78 \\times 2.117 = 8.0$ mg/L.'
      ],
      a: 'C = 8.0 e^(−1.5t) + 2.0 e^(−0.1t) mg/L: distribution half-life 0.46 h, terminal half-life 6.9 h.'
    },
    {
      title: 'Micro-constants and volumes',
      q: 'For the curve C = 8e^(−1.5t) + 2e^(−0.1t) mg/L after 100 mg IV, find k21, k10, k12, V1, the clearance, Vss and Vβ.',
      steps: [
        '$k_{21} = (8 \\times 0.1 + 2 \\times 1.5)/(8 + 2) = 3.8/10 = 0.38$ per hour.',
        '$k_{10} = 1.5 \\times 0.1/0.38 = 0.395$ per hour; $k_{12} = 1.5 + 0.1 - 0.38 - 0.395 = 0.825$ per hour.',
        '$V_1 = 100/(8 + 2) = 10$ L; $\\mathrm{AUC} = 8/1.5 + 2/0.1 = 25.3$ mg·h/L; $\\mathrm{CL} = 100/25.3 = 3.95$ L/h (check: $k_{10}V_1 = 3.95$).',
        '$V_{ss} = 10(1 + 0.825/0.38) = 31.7$ L; $V_\\beta = \\mathrm{CL}/\\beta = 39.5$ L.'
      ],
      a: 'k21 = 0.38, k10 = 0.395, k12 = 0.825 per hour; V1 = 10 L, CL = 3.95 L/h, Vss = 31.7 L, Vβ = 39.5 L.'
    }
  ],
  quiz: [
    { q: 'In a two-compartment model, how does the terminal rate constant β compare with the elimination rate constant k₁₀?', choices: ['β is always larger', 'β is always smaller', 'they are equal', 'it depends on the dose'], a: 1, why: 'Drug returning from the tissues slows the terminal decline. From αβ = k₁₀k₂₁ and α > k₂₁, β < k₁₀.' },
    { q: 'The peripheral compartment of a drug corresponds to one particular organ.', a: false, why: 'Compartments group tissues that exchange drug at similar rates; they are mathematical, and differ between drugs.' },
    { q: 'Which ordering of the volumes is always true?', choices: ['V₁ < V_ss < V_β', 'V_β < V_ss < V₁', 'V_ss < V₁ < V_β', 'all three are equal'], a: 0, why: 'V₁ is the initial dilution volume, V_ss adds the tissue amount at equilibrium, and V_β (= CL/β) is inflated further because the terminal phase is not an equilibrium.' },
    { q: 'A curve has A = 6 mg/L, α = 2 per hour, B = 3 mg/L, β = 0.2 per hour. What is the AUC?', answer: 18, unit: 'mg·h/L', why: 'AUC = A/α + B/β = 6/2 + 3/0.2 = 3 + 15 = 18 mg·h/L — almost all of it from the terminal phase.' },
    { q: 'Why are levels of slowly distributing drugs measured several hours after a dose?', choices: ['absorption is not finished', 'during distribution the plasma level overstates the level at tissue sites', 'the assay needs time', 'the terminal phase has not started to accumulate'], a: 1, why: 'Before equilibrium most of the dose is still in the central compartment; a level taken then does not reflect the tissues where the drug acts.' }
  ],
  problems: [
    { q: 'A stripped curve gives A = 8 mg/L, α = 1.5 per hour, B = 2 mg/L, β = 0.1 per hour. What is k₂₁ (per hour)?', answer: 0.38, unit: '1/h', tol: 0.02, steps: ['$k_{21} = (A\\beta + B\\alpha)/(A + B) = (0.8 + 3.0)/10 = 0.38$ per hour.'] },
    { q: 'A hypothetical drug has V₁ = 12 L, k₁₂ = 0.6 per hour and k₂₁ = 0.3 per hour. What is V_ss?', answer: 36, unit: 'L', tol: 0.02, steps: ['$V_{ss} = 12(1 + 0.6/0.3) = 12 \\times 3 = 36$ L.'] }
  ],
  applications: [
    'Change the rate constants and watch the α and β phases in [the two-compartment calculator](#/tools/pk/twocomp).','Choosing sampling times for therapeutic drug monitoring of slowly distributing drugs.', 'Designing loading doses and infusion rates for antiarrhythmics, anticonvulsants and anaesthetics.', 'Target-controlled infusion pumps and context-sensitive half-times in anaesthesia.', 'Explaining why effects can lag plasma levels (PK/PD hysteresis).'],
  history: 'Torsten Teorell\'s two papers of 1937 described drugs moving between blood, tissues and an elimination route with coupled differential equations — the first multi-compartment pharmacokinetic model, far ahead of the computers needed to use it. In 1968 Riegelman, Loo and Rowland showed how misleading a one-compartment analysis can be for drugs that distribute slowly, and in 1992 Hughes, Glass and Jacobs introduced the context-sensitive half-time for intravenous anaesthetics.',
  sim: 'pkm-twocomp'
},

{
  id: 'nonlinear-pk', parent: 'pk-models', title: 'Non-linear pharmacokinetics', level: 3,
  short: 'When enzymes, transporters or binding sites saturate, levels stop being proportional to the dose. With Michaelis–Menten elimination the steady-state level is Km·R/(Vmax − R): it climbs steeply as the dosing rate approaches Vmax, the half-life lengthens with the level, and a single larger dose gives a more than proportionally larger AUC.',
  keywords: ['non-linear pharmacokinetics', 'nonlinear', 'Michaelis–Menten', 'saturable metabolism', 'capacity-limited elimination', 'Vmax', 'Km', 'zero-order elimination', 'dose-dependent kinetics', 'dose proportionality', 'auto-induction', 'target-mediated drug disposition', 'phenytoin', 'ethanol'],
  prereq: ['one-compartment-iv', 'multiple-dosing', 'biology:enzyme-kinetics', 'hepatic-clearance'],
  related: ['tdm', 'drug-interactions', 'pharmacogenomics', 'protein-binding', 'nca', 'chemistry:enzyme-kinetics', 'medicine:epilepsy', 'medicine:poisoning-overdose'],
  body: `
Everything in the linear models rests on proportionality: double the dose and every level doubles, the half-life stays put and the AUC doubles. That holds while the enzymes, transporters and binding sites that handle a drug work far below their capacity. When they **saturate**, pharmacokinetics becomes **non-linear**, and small changes in dose can have large, unexpected effects.

### Where non-linearity comes from
| What saturates | A higher dose gives… | Teaching examples |
|---|---|---|
| Metabolising enzymes | more than proportional AUC; longer half-life | phenytoin, ethanol, high-dose salicylate |
| An absorption transporter | less than proportional AUC | gabapentin (carried by an amino-acid transporter) |
| Plasma protein binding | less than proportional total level; free level rises more | valproate at high levels |
| Binding to the drug's target | clearance falls as the target fills | many monoclonal antibodies |
| Auto-induction (with time, not dose) | clearance rises over the first weeks | carbamazepine |

Dose-normalised AUC or Cmax that changes with the dose is the tell-tale sign in a study ([[nca]]).

### Michaelis–Menten elimination
An enzyme with limited capacity removes drug at the rate ([[biology:enzyme-kinetics|Michaelis–Menten kinetics]])

$$v = \\frac{V_{max}\\,C}{K_m + C}$$

Far below $K_m$ this is first order, $v \\approx (V_{max}/K_m)\\,C$, with a constant clearance $V_{max}/K_m$. Far above, it is **zero order**: a fixed amount per hour whatever the level. Ethanol is the classic case — the liver enzyme is saturated at quite ordinary blood levels, so blood alcohol falls in a nearly straight line, roughly 0.1–0.2 g/L per hour in adults, and nothing speeds that up. In between, the apparent clearance $V_{max}/(K_m + C)$ falls as the level rises, and the half-life lengthens.

### Steady state: the hockey stick
At steady state the dosing rate $R$ (the amount reaching the circulation per day) equals the elimination rate:

$$C_{ss} = \\frac{K_m\\,R}{V_{max} - R}$$

As $R$ approaches $V_{max}$ the level shoots up, and for $R \\ge V_{max}$ there is no steady state at all — the level keeps climbing. For a hypothetical phenytoin-like drug with $V_{max} = 500$ mg/day, $K_m = 4$ mg/L and $V = 50$ L:

| Daily dose | $C_{ss}$ | Time to 90 % of $C_{ss}$ |
|---|---|---|
| 300 mg | 6 mg/L | 4.4 days |
| 400 mg | 16 mg/L | 16 days |
| 450 mg | 36 mg/L | 60 days |

A third more drug gives 2.7 times the level; half as much again gives six times. The time to reach steady state grows too, $t_{90} = K_m V(2.303\\,V_{max} - 0.9R)/(V_{max} - R)^2$, so the full effect of a dose change can take weeks to show.

### Single doses
After an IV bolus the area under the curve is $\\mathrm{AUC} = D\\,(K_m + D/2V)/V_{max}$. For the drug above (with $V_{max}$ = 20.8 mg/h), 500 mg gives 216 mg·h/L and 1000 mg gives 672 mg·h/L — 3.1 times the exposure for twice the dose.

### In practice
$V_{max}$ and $K_m$ vary several-fold between people, with genetic variants of the enzymes ([[pharmacogenomics]]) and with interacting drugs ([[drug-interactions]]), so population values only give a starting point. Drugs like this are adjusted in small steps with measured levels ([[tdm]]); two steady-state levels at two dosing rates are enough to estimate an individual's $V_{max}$ and $K_m$. Saturation also shapes poisoning: when the enzymes are saturated the body clears only a fixed amount per hour, so high levels fall slowly.

> [!warn] Saturable elimination makes overdoses more dangerous and slower to clear. If an overdose or poisoning is suspected, call your local emergency number or a poison centre at once, even if the person seems well (see [[medicine:poisoning-overdose|poisoning and overdose]]).
`,
  ideas: [
    'Non-linear kinetics arise when enzymes, transporters or binding sites saturate: levels are no longer proportional to dose.',
    'Michaelis–Menten elimination is first order far below Km (CL = Vmax/Km) and zero order far above it.',
    'Css = Km·R/(Vmax − R): the level rises steeply as the dosing rate approaches Vmax, and there is no steady state beyond it.',
    'The half-life and the time to steady state both grow with the level.',
    'Saturable absorption or binding give the opposite: less than proportional increases in total levels.'
  ],
  pitfalls: [
    'A 25 % dose increase gives a 25 % higher level — Only with linear kinetics. Near saturation the same increase can double or triple the steady-state level.',
    'Every drug has a fixed half-life — With saturable elimination the apparent half-life lengthens as the level rises; it is a property of the level, not only of the drug.',
    'Non-linear always means more than proportional — Saturable absorption (a transporter) or saturable protein binding give less than proportional total levels; only saturable elimination gives more.'
  ],
  formulas: [
    {
      name: 'Michaelis–Menten elimination rate',
      expr: 'v = Vmax*C/(Km + C)', tex: 'v = \\dfrac{V_{max}\\,C}{K_m + C}',
      vars: {
        v: { name: 'rate of elimination', q: false, unit: 'mg/day' },
        Vmax: { name: 'maximum elimination rate', q: false, unit: 'mg/day', value: 500, tex: 'V_{max}' },
        C: { name: 'plasma concentration', q: false, unit: 'mg/L', value: 16 },
        Km: { name: 'Michaelis constant (level at half the maximum rate)', q: false, unit: 'mg/L', value: 4, tex: 'K_m' }
      },
      note: 'First order below Km (v ≈ Vmax·C/Km), zero order far above it (v ≈ Vmax). Evaluated in mg/day and mg/L.',
      stories: {
        v: 'A hypothetical drug is metabolised with Vmax = {Vmax} and Km = {Km}. How fast is it eliminated at a level of {C}?',
        C: 'A drug (Vmax = {Vmax}, Km = {Km}) is being eliminated at {v}. What is the level?'
      }
    },
    {
      name: 'Steady-state level with saturable elimination',
      expr: 'Css = Km*R/(Vmax - R)', tex: 'C_{ss} = \\dfrac{K_m\\,R}{V_{max} - R}',
      vars: {
        Css: { name: 'steady-state concentration', q: false, unit: 'mg/L', tex: 'C_{ss}' },
        Km: { name: 'Michaelis constant', q: false, unit: 'mg/L', value: 4, tex: 'K_m' },
        R: { name: 'dosing rate reaching the circulation', q: false, unit: 'mg/day', value: 400 },
        Vmax: { name: 'maximum elimination rate', q: false, unit: 'mg/day', value: 500, tex: 'V_{max}' }
      },
      note: 'Only for R < Vmax; at or above Vmax there is no steady state. R is the dose rate times F (and the salt factor). Evaluated in mg/day and mg/L.',
      practice: { unknowns: ['Css', 'R'] },
      stories: {
        Css: 'A hypothetical phenytoin-like drug has Vmax = {Vmax} and Km = {Km}. What steady-state level does {R} give?',
        R: 'A drug has Vmax = {Vmax} and Km = {Km}. What daily dosing rate gives a steady state of {Css}?'
      }
    },
    {
      name: 'AUC of a single IV dose with saturable elimination',
      expr: 'AUC = D*(Km + D/(2*V))/Vmax', tex: '\\mathrm{AUC} = \\dfrac{D\\left(K_m + \\dfrac{D}{2V}\\right)}{V_{max}}',
      vars: {
        AUC: { name: 'area under the curve, 0 to ∞', q: false, unit: 'mg·h/L', tex: '\\mathrm{AUC}' },
        D: { name: 'IV dose', q: false, unit: 'mg', value: 500 },
        Km: { name: 'Michaelis constant', q: false, unit: 'mg/L', value: 4, tex: 'K_m' },
        V: { name: 'volume of distribution', q: false, unit: 'L', value: 50 },
        Vmax: { name: 'maximum elimination rate', q: false, unit: 'mg/h', value: 20.83, tex: 'V_{max}' }
      },
      note: 'One compartment, Michaelis–Menten elimination. The D/2V term makes the AUC grow faster than the dose. Vmax here in mg/h, so the AUC is in mg·h/L.',
      stories: {
        AUC: 'A hypothetical drug (Vmax = {Vmax}, Km = {Km}, V = {V}) is given as a {D} IV dose. What is the AUC?',
        D: 'A drug (Vmax = {Vmax}, Km = {Km}, V = {V}) should give an AUC of {AUC}. What single IV dose is needed?'
      }
    },
    {
      name: 'Time to 90 % of steady state with saturable elimination',
      expr: 't90 = Km*V*(ln(10)*Vmax - 0.9*R)/(Vmax - R)^2', tex: 't_{90} = \\dfrac{K_m V\\left(2.303\\,V_{max} - 0.9\\,R\\right)}{\\left(V_{max} - R\\right)^2}',
      vars: {
        t90: { name: 'time to 90 % of the steady-state level', q: false, unit: 'day', tex: 't_{90}' },
        Km: { name: 'Michaelis constant', q: false, unit: 'mg/L', value: 4, tex: 'K_m' },
        V: { name: 'volume of distribution', q: false, unit: 'L', value: 50 },
        Vmax: { name: 'maximum elimination rate', q: false, unit: 'mg/day', value: 500, tex: 'V_{max}' },
        R: { name: 'dosing rate reaching the circulation', q: false, unit: 'mg/day', value: 400 }
      },
      note: 'Starting from zero at a constant input rate R < Vmax (2.303 = ln 10). Unlike linear kinetics, the time grows with the dose. Evaluated in mg/L, L, mg/day and days.',
      practice: { unknowns: ['t90'] },
      stories: { t90: 'A hypothetical drug (Km = {Km}, V = {V}, Vmax = {Vmax}) is started at {R}. How long until it reaches 90 % of its steady state?' }
    }
  ],
  examples: [
    {
      title: 'A small step, a large rise',
      q: 'A hypothetical phenytoin-like drug has Vmax = 500 mg/day, Km = 4 mg/L and V = 50 L. Compare 300 and 400 mg/day: steady-state level and time to reach 90 % of it.',
      steps: [
        '300 mg/day: $C_{ss} = 4 \\times 300/(500 - 300) = 6$ mg/L; $t_{90} = 4 \\times 50 \\times (1151 - 270)/200^2 = 200 \\times 881/40\\,000 = 4.4$ days.',
        '400 mg/day: $C_{ss} = 4 \\times 400/100 = 16$ mg/L; $t_{90} = 200 \\times (1151 - 360)/100^2 = 15.8$ days.',
        'A 33 % increase in dose gives a 167 % increase in the level — and takes more than three times as long to show fully.'
      ],
      a: '6 mg/L after about 4 days against 16 mg/L after about 16 days.'
    },
    {
      title: 'An individual\'s Vmax and Km from two levels',
      q: 'A patient on a hypothetical saturably cleared drug has a steady-state level of 6 mg/L on 300 mg/day and 16 mg/L on 400 mg/day. Estimate Vmax and Km, and the dosing rate for 12 mg/L.',
      steps: [
        'At steady state $R = V_{max} - K_m (R/C_{ss})$: a straight line in $R$ against $R/C_{ss}$ with slope $-K_m$ and intercept $V_{max}$.',
        '$R/C_{ss}$ = 300/6 = 50 and 400/16 = 25 L/day. Slope $= (400 - 300)/(25 - 50) = -4$, so $K_m = 4$ mg/L.',
        '$V_{max} = 300 + 4 \\times 50 = 500$ mg/day.',
        'For 12 mg/L: $R = V_{max}C/(K_m + C) = 500 \\times 12/16 = 375$ mg/day.'
      ],
      a: 'Km ≈ 4 mg/L, Vmax ≈ 500 mg/day; about 375 mg/day for 12 mg/L — in practice approached in small steps with measured levels.'
    }
  ],
  quiz: [
    { q: 'A single dose of a drug with saturable metabolism is doubled. The AUC…', choices: ['halves', 'doubles exactly', 'more than doubles', 'is unchanged'], a: 2, why: 'Clearance falls as the level rises, so the higher dose is cleared more slowly: AUC = D(Km + D/2V)/Vmax grows faster than D.' },
    { q: 'A hypothetical drug has Km = 5 mg/L and Vmax = 600 mg/day and is given at 300 mg/day. What is the steady-state level?', answer: 5, unit: 'mg/L', why: 'Css = Km·R/(Vmax − R) = 5 × 300/300 = 5 mg/L. Half of Vmax gives a level equal to Km.' },
    { q: 'Far below Km, Michaelis–Menten elimination behaves like first-order elimination.', a: true, why: 'v = Vmax·C/(Km + C) ≈ (Vmax/Km)·C when C ≪ Km: a constant clearance Vmax/Km.' },
    { q: 'A drug absorbed by a saturable transporter is given at higher and higher doses. Its AUC…', choices: ['rises more than proportionally', 'rises less than proportionally', 'rises exactly in proportion', 'falls'], a: 1, why: 'The fraction absorbed falls as the transporter saturates, so exposure grows less than the dose.' },
    { q: 'For a drug with saturable elimination, raising the daily dose makes the time to reach steady state…', choices: ['shorter', 'unchanged', 'longer', 'zero'], a: 2, why: 'The apparent clearance falls as the level rises, so the effective half-life — and the time to steady state — lengthens.' }
  ],
  problems: [
    { q: 'A hypothetical drug has Vmax = 500 mg/day and Km = 4 mg/L. What dosing rate gives a steady state of 10 mg/L?', answer: 357, unit: 'mg/day', tol: 0.02, steps: ['$R = V_{max}C_{ss}/(K_m + C_{ss}) = 500 \\times 10/14 = 357$ mg/day.'] },
    { q: 'The same drug (V = 50 L, Vmax = 20.83 mg/h) is given as a single 250 mg IV dose. What is the AUC?', answer: 78, unit: 'mg·h/L', tol: 0.02, steps: ['$D/2V = 250/100 = 2.5$ mg/L.', '$\\mathrm{AUC} = 250 \\times (4 + 2.5)/20.83 = 78$ mg·h/L — against 216 for 500 mg.'] }
  ],
  applications: [
    'See a 20 % dose rise give far more than 20 % in [the saturable-elimination calculator](#/tools/pk/nonlinear).','Dosing anticonvulsants and other drugs with saturable metabolism in small steps with measured levels ([[tdm]]).', 'Why blood alcohol falls at a roughly constant rate, and why nothing speeds it up.', 'Dose-proportionality tests in early clinical trials.', 'Understanding slow recovery after overdoses of saturably cleared drugs.'],
  history: 'Leonor Michaelis and Maud Menten described saturable enzyme kinetics in 1913. In the 1920s and 1930s Erik Widmark showed that blood alcohol falls in a straight line — zero-order elimination — and built forensic alcohol calculations on it. In the 1970s clinical pharmacologists showed that phenytoin\'s metabolism saturates within its usual range of levels, and devised graphical methods to find a patient\'s own Vmax and Km from two steady-state levels.',
  sim: 'pkm-mm'
},

{
  id: 'nca', parent: 'pk-models', title: 'Non-compartmental analysis', level: 3,
  short: 'Pharmacokinetics straight from the data, with no model: Cmax and tmax as observed, the AUC by trapezoids (linear up, logarithmic down), the terminal slope λz by a straight-line fit, and from them AUC∞, clearance, volume and mean residence time. The standard method of bioequivalence and early clinical studies.',
  keywords: ['non-compartmental analysis', 'NCA', 'trapezoidal rule', 'linear-up log-down', 'log trapezoid', 'terminal slope', 'lambda z', 'AUC extrapolation', 'AUC0-t', 'AUC0-inf', 'AUMC', 'mean residence time', 'MRT', 'statistical moments', 'sampling schedule'],
  prereq: ['auc-cmax', 'one-compartment-iv', 'math:numerical-integration', 'math:linear-regression'],
  related: ['bioequivalence', 'bioavailability', 'two-compartment', 'oral-absorption-pk', 'clinical-trials', 'math:definite-integral', 'math:improper-integrals'],
  body: `
Compartment models describe the body with equations and fit them to the data. **Non-compartmental analysis** (NCA) asks for no equations at all: it takes the measured concentrations and computes exposure directly — the area under the curve by geometry, the terminal slope by a straight-line fit on a log scale. Its assumptions are few (linear kinetics for clearance and volume, and a terminal phase that is log-linear), it is quick and reproducible, and it is the standard method of bioequivalence studies ([[bioequivalence]]) and first-in-human trials.

### Peak and time of peak
$C_{max}$ and $t_{max}$ are simply the highest measured level and its time. They depend on the sampling schedule: with samples at 1, 2 and 4 hours, a true peak at 1.5 hours is missed. Dense sampling around the expected peak is a design requirement, not a nicety.

### The area by trapezoids
Between two samples the area is approximated by a trapezoid:

$$\\Delta\\mathrm{AUC} = \\frac{C_1 + C_2}{2}\\,\\Delta t \\qquad\\text{or, while falling,}\\qquad \\Delta\\mathrm{AUC} = \\frac{(C_1 - C_2)\\,\\Delta t}{\\ln(C_1/C_2)}$$

A straight chord lies above a falling exponential, so the **linear** rule overestimates the declining part — badly when samples are far apart. The **logarithmic** rule is exact for an exponential decline. The usual choice is "linear-up/log-down": linear while the level rises, logarithmic while it falls (see [[math:numerical-integration|numerical integration]]). For a segment from 2.63 to 0.79 mg/L over 12 hours the linear rule gives 20.5 mg·h/L, the log rule 18.4 — and the true area is 18.4.

### The terminal phase and the tail
The terminal rate constant $\\lambda_z$ is the negative slope of a least-squares line through $\\ln C$ against $t$ for the last three or more points that lie on the straight terminal part ([[math:linear-regression|least squares]]) — never including $C_{max}$, and not points still in the distribution phase. Then $t_{1/2} = 0.693/\\lambda_z$, and the area beyond the last sample is extrapolated:

$$\\mathrm{AUC}_{\\infty} = \\mathrm{AUC}_{last} + \\frac{C_{last}}{\\lambda_z}$$

If the extrapolated part is large the estimate is fragile; in bioequivalence studies regulators generally expect the sampled area to cover at least 80 % of $\\mathrm{AUC}_{\\infty}$ (EMA and FDA guidance, at the time of writing), which in practice means sampling for three to five terminal half-lives.

### What follows from the areas
| Parameter | NCA formula | Needs |
|---|---|---|
| Clearance (CL, or CL/F after an oral dose) | $D/\\mathrm{AUC}_{\\infty}$ | linear kinetics |
| Terminal volume $V_z$ (or $V_z/F$) | $\\mathrm{CL}/\\lambda_z$ | a terminal phase |
| Mean residence time | $\\mathrm{MRT} = \\mathrm{AUMC}/\\mathrm{AUC}$ | the area under $C\\cdot t$ (AUMC) |
| Volume at steady state (IV) | $V_{ss} = \\mathrm{CL}\\cdot\\mathrm{MRT}$ | an IV dose |
| Mean absorption time | $\\mathrm{MRT}_{oral} - \\mathrm{MRT}_{IV}$ | both routes |
| Bioavailability | $(\\mathrm{AUC}_{oral}/D_{oral})/(\\mathrm{AUC}_{IV}/D_{IV})$ | both routes |

The mean residence time is the average time a molecule spends in the body — a statistical moment of the curve. For a one-compartment IV bolus it is $1/k = 1.44\\,t_{1/2}$.

### Limits
NCA says nothing about *why* the curve has its shape, cannot predict a new regimen without the superposition assumption, and is sensitive to the choice of terminal points, to values below the assay's limit of quantification and to sparse sampling. When data are sparse — children, patients, a few samples each — [[two-compartment|compartmental]] models fitted across a whole population (population PK) take over.

> [!key] AUC by linear-up/log-down trapezoids; $\\lambda_z$ from a log-linear fit of the terminal points; $\\mathrm{AUC}_{\\infty} = \\mathrm{AUC}_{last} + C_{last}/\\lambda_z$; then CL = D/AUC∞, $V_z = \\mathrm{CL}/\\lambda_z$, MRT = AUMC/AUC.
`,
  ideas: [
    'NCA computes exposure straight from the data: Cmax and tmax as observed, AUC by trapezoids.',
    'The linear trapezoid overestimates a falling exponential; the log trapezoid is exact for it (linear-up/log-down).',
    'λz comes from a log-linear fit of the terminal points; AUC∞ = AUClast + Clast/λz, and the extrapolated part should be small.',
    'CL = D/AUC∞, Vz = CL/λz, MRT = AUMC/AUC, Vss = CL·MRT (IV).',
    'Sampling design — around the peak and for 3–5 half-lives — decides how good the numbers are.'
  ],
  pitfalls: [
    'The linear trapezoid rule is exact enough everywhere — On the falling part it lies above the curve and overestimates; with widely spaced late samples the error can reach 10–20 % of a segment.',
    'Any three last points give λz — The points must be on the straight terminal part of the semilog plot; points still in the distribution phase or around Cmax make the slope too steep and the half-life too short.',
    'NCA makes no assumptions — It assumes linear kinetics for CL and volumes, a log-linear terminal phase for the extrapolation, and adequate sampling; it is model-light, not assumption-free.'
  ],
  formulas: [
    {
      name: 'Linear trapezoid (one segment)',
      expr: 'dAUC = (C1 + C2)/2*dt', tex: '\\Delta\\mathrm{AUC} = \\dfrac{C_1 + C_2}{2}\\,\\Delta t',
      vars: {
        dAUC: { name: 'area of the segment', q: false, unit: 'mg·h/L', tex: '\\Delta\\mathrm{AUC}' },
        C1: { name: 'concentration at the start of the segment', q: false, unit: 'mg/L', value: 2.63, tex: 'C_1' },
        C2: { name: 'concentration at the end of the segment', q: false, unit: 'mg/L', value: 0.79, tex: 'C_2' },
        dt: { name: 'time between the samples', q: false, unit: 'h', value: 12, tex: '\\Delta t' }
      },
      note: 'Used while levels rise. On a falling exponential it overestimates. Evaluated in mg/L, h and mg·h/L.',
      stories: { dAUC: 'Two samples {dt} apart read {C1} and {C2}. What is the area of the segment by the linear trapezoid rule?' }
    },
    {
      name: 'Log trapezoid (one falling segment)',
      expr: 'dAUC = (C1 - C2)*dt/ln(C1/C2)', tex: '\\Delta\\mathrm{AUC} = \\dfrac{(C_1 - C_2)\\,\\Delta t}{\\ln(C_1/C_2)}',
      vars: {
        dAUC: { name: 'area of the segment', q: false, unit: 'mg·h/L', tex: '\\Delta\\mathrm{AUC}' },
        C1: { name: 'concentration at the start of the segment', q: false, unit: 'mg/L', value: 2.63, tex: 'C_1' },
        C2: { name: 'concentration at the end of the segment', q: false, unit: 'mg/L', value: 0.79, tex: 'C_2' },
        dt: { name: 'time between the samples', q: false, unit: 'h', value: 12, tex: '\\Delta t' }
      },
      note: 'Exact for an exponential decline; used for falling segments (C₂ < C₁, both above zero). Evaluated in mg/L, h and mg·h/L.',
      practice: { unknowns: ['dAUC'] },
      stories: { dAUC: 'Two samples {dt} apart read {C1} and {C2} on the falling part of the curve. What is the segment\'s area by the log trapezoid rule?' }
    },
    {
      name: 'Terminal rate constant from two points',
      expr: 'lz = ln(C1/C2)/dt', tex: '\\lambda_z = \\dfrac{\\ln(C_1/C_2)}{\\Delta t}',
      vars: {
        lz: { name: 'terminal rate constant', q: 'rate', unit: '1/h', tex: '\\lambda_z' },
        C1: { name: 'earlier terminal concentration', q: 'massconc', unit: 'mg/L', value: 2.63, tex: 'C_1' },
        C2: { name: 'later terminal concentration', q: 'massconc', unit: 'mg/L', value: 0.79, tex: 'C_2' },
        dt: { name: 'time between the samples', q: 'time', unit: 'h', value: 12, tex: '\\Delta t' }
      },
      note: 'With three or more terminal points, λz is the negative slope of the least-squares line of ln C against t. Terminal half-life = 0.693/λz.',
      stories: {
        lz: 'In the terminal phase a level falls from {C1} to {C2} in {dt}. What is λz?',
        C2: 'A level of {C1} declines with λz = {lz}. What will it be {dt} later?'
      }
    },
    {
      name: 'AUC extrapolated to infinity',
      expr: 'AUCi = AUCt + Cl/lz', tex: '\\mathrm{AUC}_{\\infty} = \\mathrm{AUC}_{last} + \\dfrac{C_{last}}{\\lambda_z}',
      vars: {
        AUCi: { name: 'AUC from zero to infinity', q: false, unit: 'mg·h/L', tex: '\\mathrm{AUC}_{\\infty}' },
        AUCt: { name: 'AUC from zero to the last sample', q: false, unit: 'mg·h/L', value: 71.0, tex: '\\mathrm{AUC}_{last}' },
        Cl: { name: 'last measured concentration', q: false, unit: 'mg/L', value: 0.79, tex: 'C_{last}' },
        lz: { name: 'terminal rate constant', q: false, unit: '1/h', value: 0.1, tex: '\\lambda_z' }
      },
      note: 'The tail C_last/λz is the area of the exponential beyond the last sample. Its share of AUC∞ should be small (commonly under 20 %). Evaluated in mg/L, 1/h and mg·h/L.',
      stories: {
        AUCi: 'Trapezoids give {AUCt} up to the last sample, where the level is {Cl}; λz = {lz}. What is the AUC to infinity?',
        Cl: 'The AUC to the last sample is {AUCt} and to infinity {AUCi}, with λz = {lz}. What was the last concentration?'
      }
    }
  ],
  examples: [
    {
      title: 'A full NCA',
      q: 'After a 500 mg oral dose of a hypothetical drug, levels (mg/L) at 0, 1, 2, 4, 8, 12 and 24 h are 0, 5.27, 6.35, 5.78, 3.92, 2.63 and 0.79. Find Cmax, tmax, AUC₀–₂₄ (linear-up/log-down), λz from the last three points, AUC∞, the percentage extrapolated, CL/F and Vz/F.',
      steps: [
        '$C_{max} = 6.35$ mg/L at $t_{max} = 2$ h (the true peak, between samples, is similar).',
        'Rising segments, linear: $2.64 + 5.81 = 8.45$. Falling segments, logarithmic: 2–4 h 12.12, 4–8 h 19.16, 8–12 h 12.93, 12–24 h 18.36. $\\mathrm{AUC}_{0-24} = 71.0$ mg·h/L (all-linear would give 73.6).',
        'Least-squares slope of ln C at 8, 12 and 24 h: $\\lambda_z = 0.100$ per hour, $t_{1/2} = 6.9$ h.',
        'Tail $0.79/0.100 = 7.9$; $\\mathrm{AUC}_{\\infty} = 78.9$ mg·h/L, of which 10 % is extrapolated.',
        '$\\mathrm{CL}/F = 500/78.9 = 6.34$ L/h; $V_z/F = 6.34/0.100 = 63$ L.'
      ],
      a: 'Cmax 6.35 mg/L at 2 h; AUC₀–₂₄ 71.0 and AUC∞ 78.9 mg·h/L (10 % extrapolated); t½ 6.9 h; CL/F 6.3 L/h; Vz/F 63 L. (The data were made with a true AUC of 80, CL/F 6.25 L/h and V/F 62.5 L.)'
    },
    {
      title: 'How wrong is the linear rule?',
      q: 'For the 12–24 h segment above (2.63 → 0.79 mg/L), compare the linear and logarithmic trapezoids.',
      steps: [
        'Linear: $(2.63 + 0.79)/2 \\times 12 = 20.5$ mg·h/L.',
        'Logarithmic: $(2.63 - 0.79) \\times 12/\\ln(2.63/0.79) = 22.08/1.203 = 18.4$ mg·h/L.',
        'The linear rule is 12 % too high for this segment, and adds 2.2 mg·h/L — 3 % — to the whole AUC.'
      ],
      a: 'Linear 20.5 against log 18.4 mg·h/L: the chord overestimates a falling exponential.'
    }
  ],
  quiz: [
    { q: 'On the falling part of a concentration curve, the linear trapezoid rule…', choices: ['underestimates the area', 'overestimates the area', 'is exact', 'overestimates only when levels rise'], a: 1, why: 'A falling exponential is convex, so the straight chord between two samples lies above it.' },
    { q: 'AUC to the last sample is 90 mg·h/L, the last level 2 mg/L and λz = 0.2 per hour. What is AUC∞?', answer: 100, unit: 'mg·h/L', why: 'AUC∞ = 90 + 2/0.2 = 100 mg·h/L; 10 % of it is extrapolated.' },
    { q: 'Non-compartmental analysis requires choosing the number of compartments first.', a: false, why: 'NCA fits no compartment model: areas come from trapezoids and the tail from a log-linear fit of the terminal points.' },
    { q: 'Which points should be used to estimate λz?', choices: ['all points after the dose', 'Cmax and the last point', 'three or more points on the straight terminal part of the semilog plot, excluding Cmax', 'the first three points'], a: 2, why: 'Only the log-linear terminal phase reflects λz; including the peak or the distribution phase makes the slope too steep.' },
    { q: 'For a one-compartment drug given as an IV bolus with a half-life of 10 h, what is the mean residence time?', answer: 14.4, unit: 'h', why: 'MRT = 1/k = t½/ln 2 = 10/0.693 = 14.4 h.' }
  ],
  problems: [
    { q: 'Levels of 5.78 mg/L at 4 h and 3.92 mg/L at 8 h. What is the area of this segment by the linear trapezoid rule?', answer: 19.4, unit: 'mg·h/L', tol: 0.02, steps: ['$(5.78 + 3.92)/2 \\times 4 = 4.85 \\times 4 = 19.4$ mg·h/L (the log rule gives 19.2).'] },
    { q: 'Terminal levels are 2.63 mg/L at 12 h and 0.79 mg/L at 24 h. What is the terminal half-life?', answer: 6.92, unit: 'h', tol: 0.02, steps: ['$\\lambda_z = \\ln(2.63/0.79)/12 = 1.203/12 = 0.1002$ per hour.', '$t_{1/2} = 0.693/0.1002 = 6.92$ h.'] }
  ],
  applications: [
    'Paste your own concentration–time data into [the NCA calculator](#/tools/pk/nca).','Bioequivalence of generic medicines: AUC₀–t, AUC∞ and Cmax compared with 90 % confidence intervals ([[bioequivalence]]).', 'First-in-human and dose-escalation studies, including tests of dose proportionality.', 'Absolute bioavailability from oral and IV AUCs ([[bioavailability]]).', 'Quick, reproducible summaries of exposure in drug–drug interaction and food-effect studies.'],
  history: 'The trapezoidal rule is centuries old; its use for drug areas became routine with the first bioavailability studies of the 1960s and 1970s. In 1978 Chiou quantified how much the linear rule overestimates falling curves, and the same year Yamaoka, Nakagawa and Uno set out the statistical-moment theory behind the mean residence time — the basis of NCA as it is practised today.',
  sim: 'pkm-nca'
}

);
