/* HYPER-FEYNMAN · content/heat-chance.js — Heat, Chance and the Arrow of Time.
 *   kinetic-statistical: probability-feyn, kinetic-theory-feyn, boltzmann-law, equipartition-failure,
 *                        brownian-movement, diffusion-random-walk
 *   thermo-arrow:        laws-of-thermodynamics-feyn, entropy-and-order, ratchet-and-pawl, past-and-future
 * Simulations in sims/heat-chance.js (prefix heat-). */
Hyper.add(

/* ================================================================ PROBABILITY */
{
  id: 'probability-feyn', parent: 'kinetic-statistical', title: 'Probability and fluctuations', level: 1,
  short: 'A probability is the fraction of times something happens in a long run of alike trials. Toss N coins and the excess of heads over tails typically grows like √N, while the fraction of heads settles towards ½ — the reason averages over huge numbers of molecules are so steady.',
  keywords: ['probability', 'chance', 'coin tossing', 'fluctuation', 'square root of N', 'random walk', 'binomial', 'Gaussian', 'bell curve', 'standard deviation', 'law of large numbers', 'counting statistics', 'Poisson'],
  prereq: ['atomic-hypothesis', 'math:probability'],
  related: ['diffusion-random-walk', 'brownian-movement', 'kinetic-theory-feyn', 'entropy-and-order', 'bullets-waves-electrons', 'quantum-reality', 'math:binomial-distribution', 'math:normal-distribution', 'math:central-limit-theorem', 'math:standard-deviation'],
  body: `
Feynman put a lecture on probability near the very start of his course, long before heat or quantum mechanics, because so much of physics leans on it. Nobody can follow $10^{23}$ molecules one by one, and in quantum mechanics chance is written into the laws themselves. The question is how to say something *exact* about things that are uncertain.

### What a probability means
Toss a coin many times. The [[?probability]] of heads is our best estimate of the fraction of tosses that will come up heads in a long run of trials that are, as far as we can tell, alike. It is a statement about the long run, not about the next toss: a coin has no memory, and after five heads in a row the sixth toss is still fifty–fifty. Probabilities of outcomes that exclude each other add (heads or tails: $\\tfrac12 + \\tfrac12 = 1$); probabilities of independent events multiply (two heads running: $\\tfrac12 \\times \\tfrac12 = \\tfrac14$).

### Fluctuations and the √N law
In $N$ tosses we *expect* $N/2$ heads, but we almost never get exactly that. Keep score as a walk: one step up for heads, one step down for tails. After $N$ tosses the walker stands at $D = \\text{heads} - \\text{tails}$. Its [[?mean]] is zero, yet it wanders off. Square it: each new step $\\pm 1$ changes $D^2$ to $D^2 \\pm 2D + 1$, and the middle term averages to zero because the step is as likely up as down. So every toss adds exactly 1 to the average of $D^2$:
$$\\langle D^2 \\rangle = N, \\qquad D_{\\mathrm{rms}} = \\sqrt{N}.$$
This is the [[?random-walk]]: the typical distance from the start grows as the [[?square-root]] of the number of steps, not in proportion to it.

| Tosses $N$ | Typical excess $\\sqrt N$ | Fraction of heads, typically |
|---|---|---|
| 10 | 3 | 0.5 ± 0.16 |
| 100 | 10 | 0.5 ± 0.05 |
| 10 000 | 100 | 0.5 ± 0.005 |
| 1 000 000 | 1000 | 0.5 ± 0.0005 |
| $10^{22}$ | $10^{11}$ | 0.5 ± 0.000 000 000 005 |

> [!key] The absolute fluctuation grows like $\\sqrt N$; the relative fluctuation shrinks like $1/\\sqrt N$. Averages over huge numbers are sharp — which is why a gas of wildly random molecules has a perfectly steady pressure.

### The bell curve
The chance of exactly $k$ heads is the number of sequences with $k$ heads, $\\binom{N}{k}$, divided by all $2^N$ sequences. For large $N$ this piles up into a [[?gaussian]] bell centred on $N/2$ with [[?standard-deviation]] $\\sigma = \\sqrt N/2$ heads: about 68 % of runs land within one σ, 95 % within two. With a biased coin, or a die (a six has $p = 1/6$), the spread is $\\sigma = \\sqrt{Np(1-p)}$; for rare events ($p$ small) this is just $\\sqrt{\\text{mean}}$ — the famous $\\sqrt N$ error bar on any count of clicks.

### Why a physicist cares
A litre of air holds about $2.5\\times10^{22}$ molecules. The number in its left half fluctuates by roughly $\\sqrt{N}/2 \\approx 8\\times10^{10}$ — a few parts in $10^{12}$ of the half, far below anything a gauge could notice. But a cube of air 10 nm on a side holds on average only about 25 molecules, and its count jumps by ±5, twenty per cent. Small things live in a restless world: that restlessness is [[brownian-movement|Brownian motion]], and the random walk returns as [[diffusion-random-walk|diffusion]]. Probability also underlies [[entropy-and-order|entropy]] and, in quite a different way, the quantum rules of [[bullets-waves-electrons]].

### What to look for in the simulation
Many players toss coins together. Each thin line is one player's $D$; the dashed curves are $\\pm\\sqrt N$ and $\\pm 2\\sqrt N$ — a parabola lying on its side. The histogram at the right, drawn on the same scale, fills out the bell. The graph below shows the *fraction* of heads homing in on ½ inside a funnel of width $1/(2\\sqrt N)$.
`,
  ideas: [
    'A probability is the expected fraction of successes in a long run of alike trials; it says nothing certain about one trial.',
    'For N independent tosses the excess of heads over tails typically grows like √N — a random walk.',
    'The fraction of heads settles to ½ with a typical error 1/(2√N): relative fluctuations shrink as numbers grow.',
    'For large N the number of heads follows a Gaussian bell with standard deviation √(Np(1 − p)).',
    'A count of N random clicks carries a statistical uncertainty of about √N.'
  ],
  pitfalls: [
    'After a run of heads, tails is "due" — Tosses are independent; the fraction settles to ½ because later tosses swamp an early excess, not because the coin compensates.',
    'The law of averages makes heads − tails shrink to zero — The difference typically grows, like √N; only the fraction settles.',
    'A probability of ½ means exactly half the outcomes will be heads — In 100 tosses exactly 50 heads happens only about 8 % of the time.'
  ],
  derivation: {
    title: 'Why the random walk goes √N',
    steps: [
      { text: 'After N steps the walker is at $D_N = D_{N-1} + s$, where the step $s$ is $+1$ or $-1$ with equal chance.', tex: 'D_N = D_{N-1} + s' },
      { text: 'Square both sides: the square of the new position is the old square, plus twice the product, plus the square of the step (which is always 1).', tex: 'D_N^2 = D_{N-1}^2 + 2sD_{N-1} + 1' },
      { text: 'Average over many walkers. The step does not know where the walker is, so $2sD_{N-1}$ is as often positive as negative and averages to zero.', tex: '\\langle D_N^2\\rangle = \\langle D_{N-1}^2\\rangle + 1' },
      { text: 'Starting from $D_0 = 0$ and adding 1 at every step gives the mean square distance; its square root is the typical (root-mean-square) distance.', tex: '\\langle D_N^2\\rangle = N \\;\\Rightarrow\\; D_{\\mathrm{rms}} = \\sqrt{N}' }
    ]
  },
  formulas: [
    {
      name: 'Typical excess of heads over tails (random walk)',
      expr: 'D = sqrt(N)', tex: 'D_{\\mathrm{rms}} = \\sqrt{N}',
      vars: {
        D: { name: 'rms excess of heads over tails', tex: 'D_{\\mathrm{rms}}' },
        N: { name: 'number of tosses', int: true, value: 100 }
      },
      note: 'A fair coin; the same law gives the distance of a walker taking N unit steps at random.',
      stories: { D: 'A fair coin is tossed {N} times. By how much does the number of heads typically differ from the number of tails?', N: 'How many tosses make heads − tails typically as large as {D}?' }
    },
    {
      name: 'Spread of a count (binomial)',
      expr: 'sigma = sqrt(N*p*(1 - p))', tex: '\\sigma = \\sqrt{N p\\,(1-p)}',
      vars: {
        sigma: { name: 'standard deviation of the number of successes', tex: '\\sigma' },
        N: { name: 'number of trials', int: true, value: 600 },
        p: { name: 'probability of success in one trial', value: 0.1667, min: 0, max: 1 }
      },
      note: 'The expected number is Np. Solving for p gives two answers, p and 1 − p: the spread cannot tell success from failure.',
      stories: { sigma: 'A die is rolled {N} times and the chance of a six is {p}. What is the standard deviation of the number of sixes?', N: 'How many trials with success probability {p} give a spread of {sigma} successes?' }
    },
    {
      name: 'Chance of exactly N/2 + x heads (the bell curve)',
      expr: 'P = sqrt(2/(pi*N))*exp(-2*x^2/N)', tex: 'P = \\sqrt{\\dfrac{2}{\\pi N}}\\; e^{-2x^2/N}',
      vars: {
        P: { name: 'probability of exactly N/2 + x heads' },
        N: { name: 'number of tosses (even)', int: true, value: 100 },
        x: { name: 'heads above half', int: true, signed: true, value: 3 }
      },
      note: 'The Gaussian approximation to the binomial for a fair coin, good when N is large. For N = 100, x = 3 it gives 0.0666; the exact value is 0.0666.',
      stories: { P: 'A fair coin is tossed {N} times. What is the chance of getting exactly {x} heads more than half?', x: 'In {N} tosses, how far from half does the number of heads have to be for its chance to fall to {P}?' }
    }
  ],
  examples: [
    {
      title: 'How lopsided can 100 tosses be?',
      q: 'A fair coin is tossed 100 times. What range of heads is typical, and what is the chance of exactly 50?',
      steps: [
        'The number of heads has mean $50$ and standard deviation $\\sigma = \\sqrt{100}/2 = 5$.',
        'About 68 % of runs give 45 to 55 heads, about 95 % give 40 to 60.',
        'Exactly 50: $\\binom{100}{50}/2^{100} = 0.0796$. The bell-curve formula gives $\\sqrt{2/(100\\pi)} = 0.0798$.'
      ],
      a: 'Usually 45–55 heads; exactly 50 only about 8 % of the time.'
    },
    {
      title: 'Molecules in half a litre',
      q: 'A litre of air at 20 °C and 1 atm holds $N = 2.5\\times10^{22}$ molecules. How much does the number in the left half fluctuate? And in a cube 10 nm on a side?',
      steps: [
        'Each molecule is in the left half with $p = \\tfrac12$: $\\sigma = \\sqrt{N}/2 = \\sqrt{2.5\\times10^{22}}/2 = 7.9\\times10^{10}$.',
        'Relative to the $1.25\\times10^{22}$ expected: $7.9\\times10^{10}/1.25\\times10^{22} = 6\\times10^{-12}$.',
        'The small cube: volume $10^{-24}$ m³, number density $2.5\\times10^{25}$ m⁻³, so on average 25 molecules. Here $p$ is tiny and $\\sigma \\approx \\sqrt{25} = 5$ — 20 %.'
      ],
      a: 'Six parts in a million million for the litre; twenty per cent for the 10 nm cube.'
    },
    {
      title: 'Counting clicks',
      q: 'A Geiger counter records 400 counts in a minute. How precise is the rate, and how many counts are needed for 1 % precision?',
      steps: [
        'Clicks are rare independent events, so the spread is $\\sqrt{400} = 20$ counts: 400 ± 20, or ± 5 %.',
        'The relative error is $1/\\sqrt{N}$; for 1 %, $\\sqrt N = 100$, so $N = 10\\,000$ counts — 25 minutes at this rate.'
      ],
      a: '± 5 % in one minute; 10 000 counts (25 minutes) for 1 %.'
    }
  ],
  quiz: [
    { q: 'A fair coin is tossed 10 000 times. How far from 5000 is the number of heads typically?', choices: ['about 50', 'about 100', 'about 5', 'about 1000'], a: 0, why: 'σ of the heads count is √N/2 = 50. The excess of heads over tails, D = 2·heads − N, is typically twice that: √N = 100.' },
    { q: 'As the number of tosses grows from 100 to 1 000 000, the difference heads − tails typically…', choices: ['grows, from about 10 to about 1000', 'shrinks towards zero', 'stays about the same', 'grows in proportion to N'], a: 0, why: 'It grows like √N. The fraction of heads still settles to ½, because √N/N = 1/√N shrinks.' },
    { q: 'After a fair coin has shown heads five times running, tails is more likely than heads on the next toss.', a: false, why: 'Independent tosses have no memory. The long-run fraction settles because later tosses swamp an early excess, not because tails catch up.' },
    { q: 'A detector gives 2500 counts. What is the statistical uncertainty (one standard deviation) of that count?', answer: 50, why: 'For rare random events the standard deviation of a count is √N = √2500 = 50, i.e. 2 %.' },
    { q: 'Why does a pressure gauge on a gas cylinder not flicker, although molecules hit it at random?', choices: ['so many impacts arrive in any instant that the relative fluctuation, about 1/√N, is tiny', 'the molecules hit in a regular rhythm', 'the molecules all have the same speed', 'fluctuations only exist in liquids'], a: 0, why: 'Around 10²³ impacts per square centimetre per second: fluctuations of order √N are a vanishing fraction of N.' }
  ],
  problems: [
    { q: 'A die is rolled 600 times. What is the standard deviation of the number of sixes?', answer: 9.13, unit: 'sixes', tol: 0.02, hint: 'σ = √(Np(1 − p)) with p = 1/6.',
      steps: ['$\\sigma = \\sqrt{600 \\times \\tfrac16 \\times \\tfrac56} = \\sqrt{83.3} = 9.13$.', 'So 100 ± 9 sixes is ordinary; 70 would be more than three σ away and a reason to suspect the die.'] },
    { q: 'How many tosses of a fair coin are needed for the fraction of heads to be typically within 0.001 of ½?', answer: 250000, unit: 'tosses', tol: 0.02, hint: 'The typical error of the fraction is 1/(2√N).',
      steps: ['$1/(2\\sqrt N) = 0.001 \\Rightarrow \\sqrt N = 500$.', '$N = 250\\,000$ tosses.'] }
  ],
  applications: [
    'Opinion polls: asking 1000 people gives a typical error of √(0.25/1000) ≈ 1.6 percentage points, whatever the size of the country.',
    'Every counting measurement — radioactivity, photons from a faint star, particles in a detector — carries a √N error bar.',
    'Monte Carlo methods compute averages by random sampling; their error falls like 1/√(number of samples).'
  ],
  history: 'The mathematics of chance began with letters between Blaise Pascal and Pierre de Fermat in 1654 about dividing the stakes of an unfinished game. Jacob Bernoulli proved the law of large numbers (published in 1713, after his death), and Abraham de Moivre found the bell curve as the limit of coin tossing in 1733. James Clerk Maxwell and Ludwig Boltzmann brought probability into physics in the 1860s and 1870s to describe gases — the start of statistical mechanics.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 6 (Probability) — chance and likelihood, fluctuations in coin tossing, the random walk and its √N law, probability distributions.',
    'Vol. I, ch. 41 (The Brownian Movement) — the random walk again, as the path of a jiggling particle.',
    '*The Character of Physical Law*, lecture 6 (Probability and Uncertainty — the Quantum Mechanical View of Nature) — where probability enters physics at its deepest level.'
  ],
  sim: 'heat-coins'
},

/* ================================================================ KINETIC THEORY */
{
  id: 'kinetic-theory-feyn', parent: 'kinetic-statistical', title: 'The kinetic theory of gases', level: 2,
  short: 'A gas is molecules in flight. Their impacts on the walls are the pressure, p = ⅓ n m v²; their average kinetic energy is the temperature, ½ m v² = 3/2 kT; together they give the ideal gas law p = nkT — and explain why a gas warms when a piston squeezes it.',
  keywords: ['kinetic theory', 'pressure', 'ideal gas law', 'temperature', 'kinetic energy', 'rms speed', 'Boltzmann constant', 'piston', 'adiabatic compression', 'gamma', 'Avogadro', 'molecular impacts'],
  prereq: ['atomic-hypothesis', 'conservation-of-momentum', 'probability-feyn'],
  related: ['boltzmann-law', 'equipartition-failure', 'laws-of-thermodynamics-feyn', 'brownian-movement', 'physics:kinetic-theory-gases', 'physics:ideal-gas-law', 'physics:thermodynamic-processes'],
  body: `
Pump up a bicycle tyre and the pump grows warm. Feynman's picture of why — it appears already in his first lecture, on atoms in motion — is a box of tiny particles flying about, bouncing off the walls and off each other. Everything a gas does follows from that picture and Newton's laws.

### Pressure is impacts
A molecule of mass $m$ with velocity component $v_x$ hits a piston of area $A$ and bounces back elastically; the piston receives momentum $2mv_x$. In a time $t$ the molecules that reach it are those moving towards it within a distance $v_xt$: half of the $nAv_xt$ molecules in that slab ($n$ is the number per unit volume). The force is the momentum delivered per second, and the pressure is force per area. The factor 2 of the bounce and the ½ of those moving the right way cancel, and averaging over all molecules:
$$p = n\\,m\\,\\langle v_x^2\\rangle = \\tfrac13\\,n\\,m\\,\\langle v^2\\rangle = \\tfrac23\\,n\\,\\langle \\tfrac12 m v^2\\rangle ,$$
since for random directions $\\langle v_x^2\\rangle = \\langle v_y^2\\rangle = \\langle v_z^2\\rangle = \\tfrac13\\langle v^2\\rangle$. The angle brackets mean the [[?mean]] over all molecules.

### Temperature is mean kinetic energy
Put a light gas and a heavy gas in contact — say on the two sides of a free piston. Feynman showed with the mechanics of collisions that energy passes between them until the *average kinetic energy* of a molecule is the same on both sides. What equalises between bodies in contact is exactly what we call temperature, so the average kinetic energy measures it:
$$\\langle \\tfrac12 m v^2\\rangle = \\tfrac32\\,k_BT, \\qquad p = n\\,k_BT,$$
with Boltzmann's constant $k_B = 1.380649\\times10^{-23}$ J/K. That is the ideal gas law, and it hides Avogadro's rule: at the same pressure and temperature, equal volumes of *any* gases hold equal numbers of molecules. At 20 °C and 1 atm, $n = 2.5\\times10^{25}$ molecules per cubic metre.

| Gas at 300 K | Mass (u) | $v_{\\mathrm{rms}} = \\sqrt{3k_BT/m}$ |
|---|---|---|
| hydrogen, H₂ | 2.0 | 1930 m/s |
| helium, He | 4.0 | 1370 m/s |
| nitrogen, N₂ | 28.0 | 517 m/s |
| oxygen, O₂ | 32.0 | 484 m/s |
| argon, Ar | 39.9 | 433 m/s |
| carbon dioxide, CO₂ | 44.0 | 412 m/s |

All have the same average kinetic energy, $\\tfrac32 k_BT = 6.2\\times10^{-21}$ J; lighter molecules make up for their mass with speed (speed goes as the [[?square-root]] of $1/m$).

### Squeezing a gas heats it
Now move the piston inwards at speed $u$. A molecule that meets the approaching piston comes back faster by $2u$ — like a tennis ball off a moving racket. The work done by the piston goes straight into the molecules, and if no heat leaks out the gas warms. Following this through, Feynman found that for a monatomic gas $pV^{\\gamma}$ stays constant with $\\gamma = 5/3$, and so $TV^{\\gamma-1}$ is constant: halving the volume of argon quickly raises it from 300 K to 476 K. For air, whose molecules also rotate, $\\gamma = 1.4$ ([[equipartition-failure]] explains why). Pull the piston out and the gas cools.

> [!key] Pressure is the momentum delivered by molecular impacts; temperature is the average kinetic energy per molecule. Put together they give $p = nk_BT$.

### What to look for in the simulation
Molecules of argon (or helium, or xenon) fly in a box a few tens of nanometres wide, in extreme slow motion. Each flash on the piston is an impact. The measured pressure — total momentum delivered divided by time and area — jitters (few molecules, see [[probability-feyn]]) but its running average sits on $nk_BT$. Drag the piston in and the temperature climbs; done slowly, it keeps $TV^{2/3}$ constant, while a sudden shove heats the gas even more. Uncheck *insulated walls* and the walls hand heat to and from the gas, holding the temperature steady.
`,
  ideas: [
    'Pressure is the rate at which molecules deliver momentum to a wall, per unit area: p = ⅓ n m⟨v²⟩.',
    'The average kinetic energy of a molecule is 3/2 kT, the same for every gas at the same temperature.',
    'Combining the two gives the ideal gas law p = nkT and Avogadro\'s rule of equal numbers in equal volumes.',
    'Lighter molecules move faster: v_rms = √(3kT/m) — about 500 m/s for air at room temperature.',
    'A piston moving in speeds up the molecules that bounce off it, so compression without heat flow warms a gas (TV^(γ−1) constant).'
  ],
  pitfalls: [
    'Hotter gas pushes harder only because its molecules hit harder — They also hit more often; both factors scale with v, which is why p goes as v² (and as T).',
    'Heavier molecules exert more pressure at the same temperature — At the same n and T the pressure is the same: heavier molecules hit harder but less often.',
    'Compressing a gas slowly keeps its temperature constant — Only if heat can flow out. With insulated walls even slow compression heats it; slowness only makes the process reversible.'
  ],
  formulas: [
    {
      name: 'The ideal gas law, molecule by molecule',
      expr: 'p = n*kB*T', tex: 'p = n\\,k_B T',
      vars: {
        p: { name: 'pressure', q: 'pressure', unit: 'kPa' },
        n: { name: 'number of molecules per unit volume', q: 'numberdensity', unit: '1/m³', value: 2.5e25 },
        kB: { const: 'kB' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 293 }
      },
      note: 'Any gas dilute enough that the molecules are small compared with their distances apart and hardly attract each other.',
      stories: { p: 'A gas has {n} at {T}. What is its pressure?', n: 'How many molecules per cubic metre are there in a gas at {p} and {T}?', T: 'At what temperature does a gas with {n} have a pressure of {p}?' }
    },
    {
      name: 'Pressure from molecular impacts',
      expr: 'p = 1/3*n*m*v^2', tex: 'p = \\tfrac13\\, n\\, m\\, v_{\\mathrm{rms}}^2',
      vars: {
        p: { name: 'pressure', q: 'pressure', unit: 'kPa' },
        n: { name: 'number of molecules per unit volume', q: 'numberdensity', unit: '1/m³', value: 2.45e25 },
        m: { name: 'mass of one molecule', q: 'mass', unit: 'u', value: 39.95 },
        v: { name: 'root-mean-square speed', q: 'speed', unit: 'm/s', value: 433, tex: 'v_{\\mathrm{rms}}' }
      },
      note: 'Derived from elastic bounces off the wall and random directions of motion; v_rms is the square root of the mean of v².',
      stories: { p: 'Argon atoms ({m}) at {n} fly with an rms speed of {v}. What pressure do they exert?', v: 'A gas of molecules of mass {m} at {n} has a pressure of {p}. What is the rms speed of its molecules?' }
    },
    {
      name: 'Root-mean-square speed of the molecules',
      expr: 'v = sqrt(3*kB*T/m)', tex: 'v_{\\mathrm{rms}} = \\sqrt{\\dfrac{3k_B T}{m}}',
      vars: {
        v: { name: 'root-mean-square speed', q: 'speed', unit: 'm/s', tex: 'v_{\\mathrm{rms}}' },
        kB: { const: 'kB' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 300 },
        m: { name: 'mass of one molecule', q: 'mass', unit: 'u', value: 28.01 }
      },
      note: 'From ½m⟨v²⟩ = 3/2 kT. The mean speed is 8 % lower: √(8kT/πm).',
      stories: { v: 'What is the rms speed of molecules of mass {m} at {T}?', T: 'At what temperature do molecules of mass {m} have an rms speed of {v}?', m: 'Molecules at {T} have an rms speed of {v}. What is the mass of one molecule?' }
    },
    {
      name: 'Temperature after a quick (adiabatic) compression',
      expr: 'T2 = T1*(V1/V2)^(gam - 1)', tex: 'T_2 = T_1 \\left(\\dfrac{V_1}{V_2}\\right)^{\\gamma - 1}',
      vars: {
        T2: { name: 'temperature after', q: 'temperature', unit: 'K' },
        T1: { name: 'temperature before', q: 'temperature', unit: 'K', value: 300 },
        V1: { name: 'volume before', q: 'volume', unit: 'L', value: 1 },
        V2: { name: 'volume after', q: 'volume', unit: 'L', value: 0.5 },
        gam: { name: 'ratio of specific heats γ (5/3 monatomic, 7/5 air)', value: 1.667, min: 1, max: 2, tex: '\\gamma' }
      },
      note: 'No heat in or out (insulated, or too fast for heat to flow), ideal gas.',
      stories: { T2: 'A gas with γ = {gam} at {T1} is compressed quickly from {V1} to {V2}. How hot does it get?', V2: 'To what volume must {V1} of a gas with γ = {gam} be compressed quickly to heat it from {T1} to {T2}?' }
    }
  ],
  examples: [
    {
      title: 'How fast are the molecules of the air?',
      q: 'Find the rms speed of nitrogen molecules (28.0 u) at 300 K, and compare it with the speed of sound, 347 m/s.',
      steps: [
        'Mass of one molecule: $m = 28.0 \\times 1.661\\times10^{-27} = 4.65\\times10^{-26}$ kg.',
        '$v_{\\mathrm{rms}} = \\sqrt{3 \\times 1.381\\times10^{-23} \\times 300 / 4.65\\times10^{-26}} = \\sqrt{2.67\\times10^5} = 517$ m/s.',
        'Sound travels at $\\sqrt{\\gamma/3} = 0.68$ of $v_{\\mathrm{rms}}$: a sound wave is passed along by the molecules themselves, so it cannot outrun them.'
      ],
      a: 'About 517 m/s — half as fast again as sound.'
    },
    {
      title: 'The drumming on a wall',
      q: 'How many nitrogen molecules hit each square centimetre of wall per second at 1 atm and 300 K? (The number crossing unit area per second is ¼ n v̄, with mean speed v̄ = 476 m/s.)',
      steps: [
        '$n = p/k_BT = 101\\,325/(1.381\\times10^{-23}\\times300) = 2.45\\times10^{25}$ m⁻³.',
        'Flux $= \\tfrac14 \\times 2.45\\times10^{25} \\times 476 = 2.9\\times10^{27}$ per m² per second.',
        'Per square centimetre ($10^{-4}$ m²): $2.9\\times10^{23}$ impacts every second.'
      ],
      a: 'About 3 × 10²³ impacts per cm² per second — so many that the pressure looks perfectly steady.'
    },
    {
      title: 'The diesel engine',
      q: 'A diesel engine compresses air (γ = 1.4) at 300 K to 1/18 of its volume, too quickly for much heat to escape. Estimate the final temperature.',
      steps: [
        '$T_2 = T_1 (V_1/V_2)^{\\gamma-1} = 300 \\times 18^{0.4}$.',
        '$18^{0.4} = e^{0.4\\ln 18} = e^{1.156} = 3.18$, so $T_2 \\approx 950$ K.',
        'Diesel fuel ignites by itself above about 500 K, so it burns as soon as it is sprayed in — no spark plug needed. (Real engines lose some heat, reaching perhaps 800–900 K.)'
      ],
      a: 'About 950 K (roughly 680 °C) in the ideal case.'
    }
  ],
  quiz: [
    { q: 'At fixed volume the absolute temperature of a gas is doubled. The pressure…', choices: ['doubles', 'rises by √2', 'quadruples', 'stays the same'], a: 0, why: 'v_rms grows by √2: each impact is √2 harder and impacts are √2 more frequent — together a factor 2, as p = nkT says.' },
    { q: 'Hydrogen (2 u) and oxygen (32 u) are at the same temperature. Compared with oxygen, the hydrogen molecules…', choices: ['move 4 times faster, with the same average kinetic energy', 'move 16 times faster', 'have 16 times more kinetic energy', 'move at the same speed'], a: 0, why: 'Equal ½mv² means v ∝ 1/√m: √16 = 4.' },
    { q: 'At the same temperature and pressure, a litre of helium and a litre of carbon dioxide contain the same number of molecules.', a: true, why: 'p = nkT fixes n = p/kT, whatever the molecule — Avogadro\'s rule.' },
    { q: 'A piston is pushed quickly into an insulated cylinder of gas. Why does the gas warm up?', choices: ['molecules bounce back faster off the approaching piston', 'friction of the piston heats the gas', 'the molecules become heavier', 'the pressure makes the molecules vibrate'], a: 0, why: 'Off a wall moving towards it at u, a molecule rebounds with 2u more speed: the piston\'s work becomes molecular kinetic energy.' },
    { q: 'What is the rms speed of helium atoms (4.00 u) at 300 K?', answer: 1367, unit: 'm/s', why: '√(3kT/m) = √(3 × 1.381e−23 × 300 / 6.64e−27) ≈ 1370 m/s.' }
  ],
  problems: [
    { q: 'How many molecules are there in a cubic metre of any gas at 0 °C and 1 atm (the Loschmidt number)?', answer: 2.687e25, unit: '1/m³', tol: 0.01, hint: 'n = p/(kT).',
      steps: ['$n = 101\\,325/(1.380649\\times10^{-23} \\times 273.15)$.', '$n = 2.687\\times10^{25}$ m⁻³ — about 27 million million million per cubic centimetre.'] },
    { q: 'At what temperature would nitrogen molecules (28.0 u) have an rms speed of 1000 m/s?', answer: 1123, unit: 'K', tol: 0.02, hint: 'T = m v²/(3k).',
      steps: ['$m = 28.0 \\times 1.661\\times10^{-27} = 4.65\\times10^{-26}$ kg.', '$T = 4.65\\times10^{-26} \\times 10^6 / (3 \\times 1.381\\times10^{-23}) = 1123$ K.'] }
  ],
  applications: [
    'Tyres, weather balloons and gas cylinders all obey p = nkT to a few per cent at ordinary pressures.',
    'Diesel engines ignite their fuel by the heat of rapid compression.',
    'Gas centrifuges and diffusion plants separate isotopes using the small speed difference between molecules of slightly different mass.'
  ],
  history: 'Daniel Bernoulli derived the pressure of a gas from molecular impacts in his Hydrodynamica of 1738, but the idea lay dormant. John Herapath (1820s) and John James Waterston (1845) revived it; Waterston\'s paper was rejected by the Royal Society and only published in 1892, when Lord Rayleigh found it in the archives. The theory took hold with August Krönig (1856) and Rudolf Clausius (1857), and James Clerk Maxwell added the distribution of speeds in 1860.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 39 (The Kinetic Theory of Gases) — the pressure of a gas from molecular impacts, compression by a moving piston and γ, why temperature is mean kinetic energy, the ideal gas law.',
    'Vol. I, ch. 1 (Atoms in Motion) — the first picture of the course: atoms jiggling as heat, and a gas pushing on a piston.'
  ],
  sim: 'heat-gas-box'
},

/* ================================================================ BOLTZMANN'S LAW */
{
  id: 'boltzmann-law', parent: 'kinetic-statistical', title: 'Boltzmann\'s law and the atmosphere', level: 2,
  short: 'In an atmosphere at one temperature, the density falls exponentially with height, n = n₀e^(−mgh/kT). Generalised, it is Boltzmann\'s law: in equilibrium, a state of energy E is found in proportion to e^(−E/kT). The Maxwell distribution of speeds, evaporation and reaction rates all follow.',
  keywords: ['Boltzmann factor', 'Boltzmann law', 'exponential atmosphere', 'barometric formula', 'scale height', 'Maxwell distribution', 'velocity distribution', 'evaporation', 'vapour pressure', 'Perrin', 'sedimentation'],
  prereq: ['kinetic-theory-feyn', 'work-and-potential-energy', 'math:exponential-functions'],
  related: ['equipartition-failure', 'brownian-movement', 'ratchet-and-pawl', 'physics:maxwell-boltzmann', 'physics:kinetic-theory-gases', 'math:exponential-distribution'],
  body: `
Why does the air thin out as you climb a mountain, and by how much? Feynman answered with one of the most useful ideas in all of physics — and then showed that the same idea tells you how fast molecules move, how quickly water evaporates, and how often anything unlikely happens in a warm world.

### The atmosphere, slab by slab
Pretend the air has one temperature $T$ all the way up (a simplification). Take a thin horizontal slab of area $A$ between heights $h$ and $h + dh$. The air below pushes up on it a little harder than the air above pushes down, and the difference holds up the weight of the $nA\\,dh$ molecules inside:
$$p(h) - p(h + dh) = n\\,m g\\,dh \\quad\\Rightarrow\\quad \\frac{dp}{dh} = -\\,n m g .$$
With $p = nk_BT$ and $T$ fixed, a change of pressure is just $k_BT$ times a change of density, so
$$\\frac{dn}{dh} = -\\frac{mg}{k_BT}\\; n .$$
A quantity whose rate of decrease is [[?proportional]] to itself dies away [[?exponential|exponentially]]:
$$n(h) = n_0\\, e^{-mgh/k_BT}.$$
Every rise of $H = k_BT/mg$, the **scale height**, divides the density by $e \\approx 2.72$ ([[?number-e]]).

| Atmosphere | Gas, temperature | $g$ (m/s²) | Scale height $H$ |
|---|---|---|---|
| Earth | air (29 u), 288 K | 9.81 | 8.4 km |
| Mars | CO₂ (44 u), 210 K | 3.71 | 10.7 km |
| Venus | CO₂, 737 K | 8.87 | 15.7 km |
| Titan | N₂ (28 u), 94 K | 1.35 | 20.6 km |

On Earth the pressure halves every $H\\ln 2 \\approx 5.8$ km. At the top of Everest (8849 m) the simple formula predicts 0.35 atm; the measured value, about 0.33 atm, is a little lower because the real air is colder aloft.

Each gas has its own scale height: helium alone would thin out over 61 km, carbon dioxide over 5.5 km. Winds stir our air so thoroughly that its make-up is the same up to about 100 km; only above that does each gas thin at its own rate, and the lightest reach highest.

### Boltzmann's law
$mgh$ is the potential energy of a molecule. Nothing in the argument needed gravity in particular: in equilibrium, a force $F = -dU/dx$ on each molecule must be balanced by the gradient of pressure, $k_BT\\,dn/dx$, and the same steps give
$$n \\propto e^{-U/k_BT}.$$
This is the [[?boltzmann-factor]]. Ions near a charged electrode, molecules in a centrifuge and dust grains in water all arrange themselves this way.

### The speeds follow
The molecules found at height $h$ are those that left the ground fast enough to climb there: $\\tfrac12 m v_z^2 > mgh$. For the density to fall as $e^{-mgh/k_BT}$, the fraction of molecules with an upward speed greater than $v_z$ must fall as $e^{-mv_z^2/2k_BT}$. So each component of velocity has a [[?gaussian]] distribution, $f(v_x) \\propto e^{-mv_x^2/2k_BT}$ — Maxwell's distribution, which is just Boltzmann's law with the kinetic energy. The general rule: **the chance of finding a system in a state of energy $E$ is proportional to $e^{-E/k_BT}$.**

### Evaporation and reactions
A water molecule escapes the liquid only if it has more than about $W = 0.42$ eV to spare (the latent heat per molecule). The fraction that does grows as $e^{-W/k_BT}$: from 300 K to 373 K, $k_BT$ rises from 0.0259 to 0.0322 eV and this factor grows about 24 times. The vapour pressure of water in fact grows 29 times, from 3.5 to 101 kPa. Chemical reaction rates follow the same law (Arrhenius), which is why a cake bakes and an egg cooks so much faster in a slightly hotter oven.

> [!key] In equilibrium at temperature $T$, a state of energy $E$ is occupied in proportion to $e^{-E/k_BT}$. Every extra $k_BT$ of energy makes a state $e$ times rarer.

### What to look for in the simulation
Molecules bounce up from warm ground and fly in free fall. Stir the column and watch the histogram at the side settle into the exponential; on the logarithmic graph below it becomes a straight line whose slope is $-1/H$. Mix helium with nitrogen and each finds its own scale height. Warm the ground and the atmosphere swells.
`,
  ideas: [
    'In an isothermal atmosphere the density falls as e^(−mgh/kT); the scale height kT/mg is about 8 km for air on Earth.',
    'The derivation only balances the weight of a slab against the pressure difference, using p = nkT.',
    'Generalised, Boltzmann\'s law says a state of energy E is occupied in proportion to e^(−E/kT).',
    'Applied to kinetic energy it gives Maxwell\'s Gaussian distribution of each velocity component.',
    'Anything that needs an energy W — evaporation, chemical reactions — happens at a rate that grows like e^(−W/kT).'
  ],
  pitfalls: [
    'Molecules high in an isothermal atmosphere are slower, because they climbed against gravity — Each one slows as it climbs, but only the fast ones get there; the survivors have exactly the same speed distribution as at the ground.',
    'All the gases of the air separate by weight — Below about 100 km winds mix them; separation by weight happens only in still gas or high up.',
    'The Boltzmann factor is the probability of a state — It is a relative weight; to get a probability, divide by the sum over all states (and count how many states share each energy).'
  ],
  formulas: [
    {
      name: 'The exponential atmosphere',
      expr: 'n = n0*exp(-m*g*h/(kB*T))', tex: 'n = n_0\\, e^{-mgh/k_B T}',
      vars: {
        n: { name: 'number density at height h', q: 'numberdensity', unit: '1/m³' },
        n0: { name: 'number density at the ground', q: 'numberdensity', unit: '1/m³', value: 2.55e25, tex: 'n_0' },
        m: { name: 'mass of one molecule', q: 'mass', unit: 'u', value: 28.97 },
        g: { const: 'g' },
        h: { name: 'height', q: 'length', unit: 'km', value: 5 },
        kB: { const: 'kB' },
        T: { name: 'temperature (the same at all heights)', q: 'temperature', unit: 'K', value: 288 }
      },
      note: 'Isothermal gas in uniform gravity. The pressure follows the same law, since p = nkT.',
      stories: { n: 'Air ({m} per molecule) has {n0} at the ground and a temperature of {T}. What is the number density {h} up?', h: 'At what height has the density of an isothermal atmosphere ({m}, {T}) fallen from {n0} to {n}?' }
    },
    {
      name: 'Scale height',
      expr: 'H = kB*T/(m*g)', tex: 'H = \\dfrac{k_B T}{m g}',
      vars: {
        H: { name: 'scale height (density falls by e)', q: 'length', unit: 'km' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 288 },
        m: { name: 'mass of one molecule', q: 'mass', unit: 'u', value: 28.97 },
        g: { name: 'gravitational acceleration', q: 'accel', unit: 'm/s²', value: 9.81 }
      },
      note: 'Also the average height of the molecules in an isothermal atmosphere.',
      stories: { H: 'What is the scale height of an atmosphere of molecules of mass {m} at {T} where g = {g}?', T: 'An atmosphere of molecules of mass {m} under g = {g} has a scale height of {H}. What is its temperature?' }
    },
    {
      name: 'The Boltzmann factor',
      expr: 'f = exp(-dE/(kB*T))', tex: 'f = e^{-\\Delta E/k_B T}',
      vars: {
        f: { name: 'ratio of occupation of two states' },
        dE: { name: 'energy difference between the states', q: 'energy', unit: 'eV', value: 0.42, tex: '\\Delta E' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'Per state; multiply by the number of states at each energy when comparing levels.',
      stories: { f: 'Two states differ in energy by {dE}. At {T}, how much less often is the higher one occupied?', T: 'At what temperature is a state {dE} above another occupied {f} times as often?' }
    },
    {
      name: 'Maxwell\'s distribution of one velocity component',
      expr: 'f = exp(-m*v^2/(2*kB*T))', tex: 'f = e^{-m v_x^2/2 k_B T}',
      vars: {
        f: { name: 'how often vₓ occurs, relative to vₓ = 0' },
        m: { name: 'mass of one molecule', q: 'mass', unit: 'u', value: 28 },
        v: { name: 'velocity component', q: 'speed', unit: 'm/s', value: 1000, tex: 'v_x' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'Boltzmann\'s law with the kinetic energy ½mvₓ². Each component is Gaussian with standard deviation √(kT/m).',
      stories: { f: 'In nitrogen ({m}) at {T}, how common is a velocity component of {v} compared with one near zero?', v: 'At {T}, what velocity component of a molecule of mass {m} is {f} times as common as zero?' }
    }
  ],
  examples: [
    {
      title: 'The air on Everest',
      q: 'Treat the air as isothermal at 288 K with molecules of 28.97 u. What pressure does the model give at the summit of Everest, 8849 m?',
      steps: [
        '$m = 28.97 \\times 1.661\\times10^{-27} = 4.81\\times10^{-26}$ kg; $H = k_BT/mg = 3.976\\times10^{-21}/(4.81\\times10^{-26}\\times9.807) = 8430$ m.',
        '$p/p_0 = e^{-8849/8430} = e^{-1.050} = 0.350$.',
        '$p = 0.350 \\times 101.3 = 35.5$ kPa. Measured: about 34 kPa — the real air is colder aloft, so it thins a little faster.'
      ],
      a: 'About 0.35 atm (35 kPa): a climber gets a third of the oxygen per breath.'
    },
    {
      title: 'The atmosphere of Mars',
      q: 'Mars has a carbon dioxide atmosphere (44.0 u) at about 210 K, and g = 3.71 m/s². Find its scale height.',
      steps: [
        '$m = 44.0 \\times 1.661\\times10^{-27} = 7.31\\times10^{-26}$ kg.',
        '$H = 1.381\\times10^{-23}\\times210/(7.31\\times10^{-26}\\times3.71) = 1.07\\times10^4$ m.'
      ],
      a: 'About 10.7 km — the heavier gas is more than offset by the weaker gravity.'
    },
    {
      title: 'Why hot water evaporates so much faster',
      q: 'A water molecule needs about 0.42 eV to leave the liquid. By what factor does $e^{-W/k_BT}$ grow between 300 K and 373 K?',
      steps: [
        '$k_BT$ = 0.02585 eV at 300 K and 0.03216 eV at 373 K.',
        '$e^{-0.42/0.02585} = e^{-16.25} = 8.8\\times10^{-8}$; $e^{-0.42/0.03216} = e^{-13.06} = 2.1\\times10^{-6}$.',
        'Ratio: about 24. The measured vapour pressure grows by 29 (3.5 kPa to 101 kPa); the simple factor captures almost all of it.'
      ],
      a: 'About 24 times more molecules have enough energy to escape.'
    }
  ],
  quiz: [
    { q: 'If an isothermal atmosphere were twice as hot (in kelvin), its scale height would…', choices: ['double', 'halve', 'grow by √2', 'stay the same'], a: 0, why: 'H = kT/mg is proportional to T.' },
    { q: 'Compared with nitrogen (28 u) at the same temperature, pure helium (4 u) would thin out with height…', choices: ['7 times more slowly', '7 times faster', '√7 times more slowly', 'at the same rate'], a: 0, why: 'H ∝ 1/m: 28/4 = 7 times the scale height.' },
    { q: 'In an isothermal atmosphere, the molecules high up move more slowly on average than those at the ground.', a: false, why: 'Only molecules with enough upward speed get high, and after climbing they have the same Maxwell distribution as below: the temperature is the same at every height.' },
    { q: 'A state lies 3kT above another (both single states). How often is it occupied, relative to the lower one?', answer: 0.0498, why: 'e^(−3) = 0.050.' },
    { q: 'What single rule contains the exponential atmosphere, Maxwell\'s speeds and evaporation?', choices: ['a state of energy E is occupied in proportion to e^(−E/kT)', 'every quadratic term holds ½kT', 'pressure equals nkT', 'the entropy of a closed system never decreases'], a: 0, why: 'Boltzmann\'s law, applied to potential energy, kinetic energy and binding energy in turn.' }
  ],
  problems: [
    { q: 'In an isothermal atmosphere of air at 288 K (scale height 8.43 km), at what height is the pressure half its ground value?', answer: 5.84, unit: 'km', tol: 0.02, hint: 'Solve e^(−h/H) = ½.',
      steps: ['$h = H\\ln 2 = 8.43 \\times 0.693$.', '$h = 5.84$ km.'] },
    { q: 'Grains suspended in water at 20 °C have an effective mass (their mass minus that of the water they displace) of 1.0 × 10⁻¹⁷ kg. Over what height does their number fall by a factor e?', answer: 41.3, unit: 'µm', tol: 0.02, hint: 'The same scale height kT/(mg), with the effective mass.',
      steps: ['$k_BT = 1.381\\times10^{-23}\\times293 = 4.05\\times10^{-21}$ J.', '$H = 4.05\\times10^{-21}/(1.0\\times10^{-17}\\times9.81) = 4.13\\times10^{-5}$ m $= 41$ µm — visible in a microscope, as Perrin found.'] }
  ],
  applications: [
    'Aircraft altimeters read height from air pressure, using the barometric law (with the real, cooling atmosphere).',
    'Ultracentrifuges sort large molecules by the Boltzmann distribution in a strong centrifugal field.',
    'The number of electrons able to cross a semiconductor\'s band gap grows as a Boltzmann factor — why chips leak more when hot.'
  ],
  history: 'James Clerk Maxwell found the distribution of molecular velocities in 1860; Ludwig Boltzmann extended it in 1868 to molecules in a force field, giving the factor e^(−E/kT), and made it the basis of statistical mechanics in the 1870s. In 1908–09 Jean Perrin counted microscopic grains of gamboge resin at different heights in water, found the exponential law with scale heights of tens of micrometres, and deduced Avogadro\'s number from it — part of the work that earned him the 1926 Nobel Prize and settled the reality of atoms.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 40 (The Principles of Statistical Mechanics) — the exponential atmosphere, the Boltzmann law, evaporation of a liquid, and the distribution of molecular speeds derived from the atmosphere.'
  ],
  sim: 'heat-atmosphere'
},

/* ================================================================ EQUIPARTITION */
{
  id: 'equipartition-failure', parent: 'kinetic-statistical', title: 'Equipartition, and where classical physics failed', level: 3,
  short: 'Classical physics gives every quadratic term in a molecule\'s energy ½kT, so a diatomic gas should have C_V = 7/2 R. It has 5/2 R at room temperature, and hydrogen drops to 3/2 R in the cold: rotations and vibrations "freeze out". Only quantum mechanics — levels spaced wider than kT — explains it.',
  keywords: ['equipartition', 'specific heat', 'heat capacity', 'degrees of freedom', 'gamma', 'freezing out', 'hydrogen', 'rotation', 'vibration', 'quantum oscillator', 'Planck', 'ultraviolet catastrophe', 'characteristic temperature'],
  prereq: ['boltzmann-law', 'harmonic-oscillator-feyn', 'physics:specific-heat'],
  related: ['kinetic-theory-feyn', 'brownian-movement', 'bosons-and-lasers', 'physics:equipartition', 'physics:blackbody-radiation', 'physics:heat-capacity-solids'],
  body: `
Some of the first cracks in classical physics appeared not in atoms or light but in something as homely as the heat needed to warm a gas. Feynman made a point of showing exactly where the classical theory, correct in every step, gives the wrong answer.

### Equipartition: ½kT for every way of holding energy
The kinetic theory gives a molecule an average $\\tfrac12 k_BT$ for each direction of motion: $\\tfrac12 m\\langle v_x^2\\rangle = \\tfrac12 k_BT$, three times over. Classical statistical mechanics generalises this with the [[?boltzmann-factor]]: every term in the energy that is a *square* of a velocity or a position coordinate — $\\tfrac12 I\\omega^2$ for a rotation, $\\tfrac12 \\kappa x^2$ for a stretched spring — holds on [[?mean|average]] $\\tfrac12 k_BT$. (The Gaussian average of $a x^2$ weighted by $e^{-ax^2/k_BT}$ is $\\tfrac12k_BT$ whatever $a$ is.) For a mole, each such term adds $\\tfrac12 R = 4.16$ J/(mol·K) to the heat capacity at constant volume.

| Model of the molecule | Quadratic terms $f$ | $C_V$ | $\\gamma = C_p/C_V$ |
|---|---|---|---|
| single atom (He, Ar) | 3 translations | $\\tfrac32R$ = 12.5 J/(mol·K) | 5/3 = 1.67 |
| rigid dumbbell (N₂, O₂) | + 2 rotations = 5 | $\\tfrac52R$ = 20.8 J/(mol·K) | 7/5 = 1.40 |
| dumbbell on a spring | + 2 for the vibration = 7 | $\\tfrac72R$ = 29.1 J/(mol·K) | 9/7 = 1.29 |

### Where it fails
Argon has $\\gamma = 1.67$, as it should. Nitrogen at room temperature has $\\gamma = 1.40$ — the *rigid* dumbbell. Yet its atoms are certainly held by a springy bond: the molecule's spectrum shows it vibrating. Classical physics insists on $\\tfrac72 R$, and it cannot let a motion count "partly": equipartition does not depend on how stiff the spring is. Worse, hydrogen cooled below about 100 K sinks towards $\\tfrac32 R$, as if its molecules had stopped turning; heated to a few thousand kelvin, gases creep up towards $\\tfrac72 R$. And the same theorem, applied to the infinitely many modes of the electromagnetic field in a hot oven, gives every mode $k_BT$ and the oven an infinite energy — the ultraviolet catastrophe.

### Levels too far apart to reach
Quantum mechanics removes the paradox. A vibrating bond has levels spaced by $h\\nu$; a rotor has levels $E_J = k_B\\Theta_{\\mathrm{rot}}\\,J(J+1)$. By Boltzmann's law the first excited level is occupied only in proportion to $e^{-\\Delta E/k_BT}$. When $k_BT$ is much smaller than the spacing, nearly every molecule sits in its lowest level: the motion is **frozen out** and absorbs no heat. When $k_BT$ is much larger, many levels are filled and the classical $\\tfrac12k_BT$ per term returns. Summing the Boltzmann-weighted ladder $0, h\\nu, 2h\\nu, \\ldots$ (a geometric [[?sum]]) gives Planck's mean energy of an oscillator,
$$\\langle E\\rangle = \\frac{h\\nu}{e^{h\\nu/k_BT} - 1},$$
which tends to $k_BT$ when $k_BT \\gg h\\nu$ and to almost nothing when $k_BT \\ll h\\nu$ ([[?small-approximation]]).

| Molecule | $\\Theta_{\\mathrm{rot}}$ | $\\Theta_{\\mathrm{vib}} = h\\nu/k_B$ | At 300 K |
|---|---|---|---|
| H₂ | 85 K | 6330 K | rotates; vibration frozen |
| N₂ | 2.9 K | 3370 K | rotates; vibration frozen |
| O₂ | 2.1 K | 2260 K | rotates; vibration barely stirring |
| Cl₂ | 0.35 K | 810 K | rotates; vibration half awake ($C_V \\approx 3.1R$) |

Hydrogen is special because it is so light: its small moment of inertia spaces the rotational levels widely, so its rotation freezes at temperatures where the gas still exists. (The detailed shape of hydrogen's curve also depends on the two kinds of hydrogen molecule, ortho and para, set by the nuclear spins — the simulation lets you compare.)

> [!key] Classical physics gives ½kT to every quadratic term, however stiff. Quantum mechanics gives it only to motions whose level spacing is small compared with kT; the rest are frozen.

### What to look for in the simulation
Sweep the temperature. The little molecules spin only when rotational levels above the lowest are occupied, and vibrate beyond their zero-point quiver only when $k_BT$ approaches $h\\nu$. The ladders show where $k_BT$ reaches; the graph shows $C_V$ climbing in steps from $\\tfrac32R$ to $\\tfrac52R$ to $\\tfrac72R$.
`,
  ideas: [
    'Classically every quadratic term in the energy holds ½kT on average, whatever the stiffness or inertia.',
    'That predicts C_V = 3/2 R for atoms, 5/2 R for rigid diatomics and 7/2 R when the bond vibrates.',
    'Real diatomic gases have about 5/2 R at room temperature, and hydrogen sinks towards 3/2 R below about 100 K: some motions do not share the energy.',
    'Quantised levels explain it: a motion whose level spacing is much larger than kT stays in its ground state and takes no heat.',
    'The same failure, for the modes of light in a cavity, is the ultraviolet catastrophe that Planck\'s quantum resolved.'
  ],
  pitfalls: [
    'The vibration of N₂ does not count because the bond is too stiff to move — Classically stiffness does not matter at all; the freezing is a quantum effect of widely spaced levels.',
    'A frozen motion is completely absent — The molecule still has its zero-point vibration; it simply cannot take up energy in small amounts.',
    'Heat capacities are constants of a substance — They change with temperature, in steps set by Θ_rot and Θ_vib.'
  ],
  derivation: {
    title: 'Why each quadratic term gets ½kT',
    steps: [
      { text: 'Take one coordinate $x$ whose energy is $a x^2$. By Boltzmann\'s law the chance of a value near $x$ is proportional to $e^{-ax^2/k_BT}$ — a Gaussian.', tex: 'P(x) \\propto e^{-a x^2/k_B T}' },
      { text: 'The average energy is the [[?integral]] of $a x^2$ weighted by this chance, divided by the integral of the chance alone.', tex: '\\langle a x^2\\rangle = \\dfrac{\\int a x^2\\, e^{-ax^2/k_BT}\\,dx}{\\int e^{-ax^2/k_BT}\\,dx}' },
      { text: 'Substitute $u = x\\sqrt{a/k_BT}$: every $a$ drops out, leaving $k_BT$ times a pure number, the mean of $u^2$ for the weight $e^{-u^2}$, which is ½.', tex: '\\langle a x^2\\rangle = k_B T\\,\\dfrac{\\int u^2 e^{-u^2}du}{\\int e^{-u^2}du} = \\tfrac12 k_B T' },
      { text: 'So the average does not depend on $a$ — stiff or soft, heavy or light, each quadratic term gets ½kT. With discrete quantum levels the integrals become sums, and this independence is lost.' }
    ]
  },
  formulas: [
    {
      name: 'Heat capacity from equipartition',
      expr: 'Cv = f/2*R', tex: 'C_V = \\dfrac{f}{2}\\,R',
      vars: {
        Cv: { name: 'molar heat capacity at constant volume', q: 'molarheat', unit: 'J/(mol·K)', tex: 'C_V' },
        f: { name: 'number of active quadratic terms', int: true, value: 5 },
        R: { const: 'R' }
      },
      note: 'f = 3 for atoms, 5 for diatomics with rotation, 7 if the vibration is fully active.',
      stories: { Cv: 'A gas has {f} active quadratic terms per molecule. What is its molar heat capacity at constant volume?', f: 'A gas has C_V = {Cv}. How many quadratic terms per molecule are taking up energy?' }
    },
    {
      name: 'Ratio of specific heats',
      expr: 'gam = (f + 2)/f', tex: '\\gamma = \\dfrac{f + 2}{f}',
      vars: {
        gam: { name: 'ratio of specific heats C_p/C_V', tex: '\\gamma' },
        f: { name: 'number of active quadratic terms', int: true, value: 5 }
      },
      note: 'From C_p = C_V + R for an ideal gas. Measuring γ (for instance from the speed of sound) counts the active terms.',
      stories: { gam: 'What is γ for a gas with {f} active quadratic terms?', f: 'A gas has γ = {gam}. How many quadratic terms per molecule are active?' }
    },
    {
      name: 'Mean energy of a quantum oscillator (Planck)',
      expr: 'E = h*nu/(exp(h*nu/(kB*T)) - 1)', tex: '\\bar{E} = \\dfrac{h\\nu}{e^{h\\nu/k_B T} - 1}',
      vars: {
        E: { name: 'mean vibrational energy above the ground state', q: 'energy', unit: 'eV', tex: '\\bar{E}' },
        h: { const: 'h' },
        nu: { name: 'vibration frequency', q: 'frequency', unit: 'THz', value: 70.7, tex: '\\nu' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'Tends to kT when kT ≫ hν (the classical value) and to hν·e^(−hν/kT) when kT ≪ hν. 70.7 THz is the vibration of N₂.',
      stories: { E: 'A bond vibrates at {nu}. What is its mean vibrational energy at {T}?', T: 'At what temperature does an oscillator of {nu} hold a mean energy of {E}?' }
    },
    {
      name: 'Heat capacity of a vibration (Einstein)',
      expr: 'Cvib = R*(th/T)^2*exp(th/T)/(exp(th/T) - 1)^2',
      tex: 'C_{\\mathrm{vib}} = R\\,\\dfrac{(\\Theta_v/T)^2\\, e^{\\Theta_v/T}}{\\left(e^{\\Theta_v/T} - 1\\right)^2}',
      vars: {
        Cvib: { name: 'molar heat capacity of the vibration', q: 'molarheat', unit: 'J/(mol·K)', tex: 'C_{\\mathrm{vib}}' },
        R: { const: 'R' },
        th: { name: 'vibrational temperature hν/k', q: 'temperature', unit: 'K', value: 3374, tex: '\\Theta_v' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 1000 }
      },
      note: 'Rises from 0 (T ≪ Θ) to R (T ≫ Θ), the classical kinetic plus potential ½R + ½R. Θ = 3374 K is nitrogen.',
      stories: { Cvib: 'A molecule has a vibrational temperature of {th}. What does its vibration add to the molar heat capacity at {T}?', T: 'At what temperature does a vibration with Θ = {th} add {Cvib} to the molar heat capacity?' }
    }
  ],
  examples: [
    {
      title: 'Counting motions with γ',
      q: 'Predict γ for argon, for nitrogen treated as a rigid dumbbell, and for nitrogen with a fully active vibration. Measured: argon 1.67, nitrogen 1.40.',
      steps: [
        'Argon: $f = 3$, $\\gamma = 5/3 = 1.67$ ✓.',
        'Rigid N₂: $f = 5$, $\\gamma = 7/5 = 1.40$ ✓.',
        'Vibrating N₂: $f = 7$, $\\gamma = 9/7 = 1.29$ ✗ — the vibration is not taking up energy at room temperature.'
      ],
      a: '1.67, 1.40 and 1.29; the measured 1.40 says nitrogen\'s vibration is frozen.'
    },
    {
      title: 'Why nitrogen does not vibrate at room temperature',
      q: 'N₂ has $\\Theta_{\\mathrm{vib}} = 3374$ K. At 300 K, what fraction of molecules are in the first excited vibrational level, and what does the vibration add to $C_V$?',
      steps: [
        '$x = \\Theta/T = 3374/300 = 11.2$; the first level is populated in proportion to $e^{-11.2} = 1.3\\times10^{-5}$.',
        'For large $x$ the Einstein formula is about $R x^2 e^{-x} = R \\times 126 \\times 1.3\\times10^{-5} = 0.0016\\,R$.',
        'That is 0.014 J/(mol·K), against 8.3 J/(mol·K) if the vibration were classical.'
      ],
      a: 'About 1 molecule in 77 000 is excited; the vibration adds only 0.2 % of its classical share.'
    },
    {
      title: 'Chlorine, half awake',
      q: 'Cl₂ has $\\Theta_{\\mathrm{vib}} = 808$ K. Estimate its $C_V$ at 300 K.',
      steps: [
        '$x = 808/300 = 2.69$, $e^x = 14.8$.',
        '$C_{\\mathrm{vib}}/R = x^2 e^x/(e^x - 1)^2 = 7.25 \\times 14.8/13.8^2 = 0.56$.',
        '$C_V = (2.5 + 0.56)R = 3.06\\,R = 25.5$ J/(mol·K). Measured: about 25.6.'
      ],
      a: 'About 3.06 R: a heavy, soft molecule vibrates partly even at room temperature.'
    }
  ],
  quiz: [
    { q: 'According to the classical equipartition theorem, how much average energy does each quadratic term in a molecule\'s energy hold?', choices: ['½kT', 'kT', '3/2 kT', 'it depends on the stiffness'], a: 0, why: 'Each square term gets ½kT, independent of its coefficient. A vibration has two (kinetic and potential), so kT.' },
    { q: 'Why is the heat capacity of nitrogen at room temperature 5/2 R and not 7/2 R?', choices: ['the vibrational levels are spaced much more widely than kT, so the vibration cannot take up energy', 'the bond is too stiff to vibrate classically', 'nitrogen molecules do not rotate', 'the molecules are too heavy'], a: 0, why: 'hν/k = 3374 K ≫ 300 K: nearly every molecule stays in its vibrational ground state.' },
    { q: 'In classical physics, a stiffer bond would add less to the heat capacity than a soft one.', a: false, why: 'Classically each quadratic term gets ½kT whatever its stiffness — which is exactly why the classical theory could not explain frozen motions.' },
    { q: 'Hydrogen gas is cooled to 40 K (and kept a gas). Its C_V approaches…', choices: ['3/2 R', '5/2 R', '7/2 R', 'zero'], a: 0, why: 'Θ_rot = 85 K: rotation freezes, leaving only the three translations.' },
    { q: 'What γ does equipartition predict for a diatomic gas whose vibration is fully active (f = 7)?', answer: 1.2857, why: '(f + 2)/f = 9/7 ≈ 1.29.' }
  ],
  problems: [
    { q: 'The vibrational quantum of N₂ is hν = 0.289 eV. At what temperature does kT equal it?', answer: 3354, unit: 'K', tol: 0.02, hint: 'k = 8.617 × 10⁻⁵ eV/K.',
      steps: ['$T = h\\nu/k_B = 0.289/8.617\\times10^{-5}$.', '$T = 3354$ K — ten times room temperature, which is why the vibration is frozen at 300 K.'] },
    { q: 'Use the Einstein formula to find the vibrational heat capacity of N₂ (Θ = 3374 K) at 1000 K.', answer: 3.48, unit: 'J/(mol·K)', tol: 0.03, hint: 'x = Θ/T = 3.374.',
      steps: ['$e^{3.374} = 29.2$, $(e^x - 1)^2 = 794$.', '$C_{\\mathrm{vib}} = 8.314 \\times 11.38 \\times 29.2/794 = 3.48$ J/(mol·K) — 42 % of the classical R.'] }
  ],
  applications: [
    'Hot gases in engines and turbines have larger heat capacities than at room temperature, as vibrations wake; engineering tables of c_p(T) show it.',
    'The heat capacity of solids falls towards zero in the cold for the same reason (Einstein 1907, Debye 1912) — see [[physics:heat-capacity-solids]].',
    'The colour of glowing bodies — black-body radiation — is the same story told for light: see [[bosons-and-lasers]].'
  ],
  history: 'Maxwell already worried in the 1860s–70s that measured specific heats did not match equipartition. In a lecture of April 1900 Lord Kelvin listed this as one of two "clouds" over the dynamical theory of heat and light. That December Max Planck introduced quanta to explain black-body radiation, and in 1907 Albert Einstein used them to explain why the heat capacity of solids falls in the cold. In 1912 Arnold Eucken measured the heat capacity of hydrogen falling to 3/2 R at low temperatures; its detailed shape was explained by David Dennison in 1927, who realised that the ortho and para forms of hydrogen hardly convert into each other.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 40 (The Principles of Statistical Mechanics) — its closing sections on the specific heats of gases and the failure of classical physics.',
    'Vol. I, ch. 41 (The Brownian Movement) — equipartition of energy, the thermal equilibrium of radiation, and equipartition and the quantum oscillator.',
    'Vol. I, ch. 39 (The Kinetic Theory of Gases) — γ for a gas of atoms from the kinetic theory.'
  ],
  sim: 'heat-hydrogen-cv'
},

/* ================================================================ BROWNIAN MOTION */
{
  id: 'brownian-movement', parent: 'kinetic-statistical', title: 'Brownian motion', level: 2,
  short: 'A speck of dust in water jiggles for ever, kicked unevenly by the molecules around it. It has the same average kinetic energy as a molecule, ³⁄₂kT, but it forgets each velocity in nanoseconds, so what we see is a random walk: the mean-square distance grows in proportion to time, ⟨R²⟩ = 6Dt with D = kT/6πηa.',
  keywords: ['Brownian motion', 'Brownian movement', 'random walk', 'mean square displacement', 'Einstein', 'Perrin', 'Stokes drag', 'diffusion coefficient', 'Stokes–Einstein', 'equipartition', 'thermal noise', 'Johnson noise', 'Avogadro number'],
  prereq: ['kinetic-theory-feyn', 'probability-feyn', 'newtons-laws-numerically'],
  related: ['diffusion-random-walk', 'equipartition-failure', 'boltzmann-law', 'ratchet-and-pawl', 'atomic-hypothesis', 'flow-of-wet-water'],
  body: `
In 1827 the botanist Robert Brown watched tiny particles from pollen grains suspended in water and saw them jiggle without ever stopping. Fine dust of every kind, living or not, did the same. The explanation, which Feynman presented as the atomic hypothesis caught in the act, is that each particle is bombarded from all sides by water molecules, and at any instant the kicks do not quite balance.

### Equipartition for a big particle
A bead one micrometre across contains some $10^{11}$ atoms, yet in the water it is just one more member of a crowd in thermal equilibrium: its average kinetic energy is $\\tfrac32k_BT$, exactly that of a water molecule. For a sphere 1 µm in diameter and 1050 kg/m³ (mass $5.5\\times10^{-16}$ kg) at 20 °C this means $v_{\\mathrm{rms}} = \\sqrt{3k_BT/m} \\approx 4.7$ mm/s — about five of its own diameters per millisecond. Nobody sees that speed. The water's viscosity stops any motion within $\\tau = m/6\\pi\\eta a \\approx 58$ ns, a distance of a fraction of a nanometre, and the next kicks start it off in a new random direction. What the microscope shows is the sum of countless tiny, uncorrelated steps: a [[?random-walk]].

### The mean-square distance grows with time
Feynman's derivation follows one coordinate $x$ of the grain. Newton's law, with Stokes' drag $\\mu\\dot x$ ($\\mu = 6\\pi\\eta a$ for a sphere of radius $a$, see [[flow-of-wet-water]]) and a rapidly fluctuating force $F(t)$ from the molecules, reads
$$m\\ddot x + \\mu\\dot x = F(t).$$
Multiply by $x$ and average over many grains ([[?dot-notation]]: $\\dot x$ is the velocity, $\\ddot x$ the acceleration). The kicks do not care where the grain is, so $\\langle xF\\rangle = 0$. Using $x\\dot x = \\tfrac12\\,d(x^2)/dt$ and $x\\ddot x = d(x\\dot x)/dt - \\dot x^2$, and noting that in steady conditions $\\langle x\\dot x\\rangle$ settles to a constant, what remains is
$$\\frac{\\mu}{2}\\frac{d\\langle x^2\\rangle}{dt} = m\\langle\\dot x^2\\rangle = k_BT \\qquad\\text{(equipartition)}.$$
So $\\langle x^2\\rangle$ grows at a steady rate, and in three dimensions
$$\\langle R^2\\rangle = \\frac{6k_BT}{\\mu}\\,t = 6Dt, \\qquad D = \\frac{k_BT}{6\\pi\\eta a}.$$
The distance goes as the [[?square-root]] of the time: to wander ten times farther takes a hundred times longer.

| Sphere in water at 20 °C | $D$ | rms distance in 1 s | in 1 min | in 1 h |
|---|---|---|---|---|
| 0.1 µm diameter | 4.3 µm²/s | 5.1 µm | 39 µm | 300 µm |
| 1 µm | 0.43 µm²/s | 1.6 µm | 12 µm | 96 µm |
| 10 µm | 0.043 µm²/s | 0.5 µm | 3.9 µm | 30 µm |

### Weighing atoms with a microscope
Einstein saw in 1905 that this formula turns a microscope into a balance for atoms: measure $\\langle R^2\\rangle$, the time, the viscosity and the bead size, and out comes Boltzmann's constant — and with $R = N_Ak_B$, Avogadro's number. Jean Perrin did it in 1908–09 with resin grains and got about $6\\times10^{23}$ per mole, persuading most of the remaining sceptics that atoms are real.

### The jiggling is everywhere
Equipartition does not care what the system is. A small mirror hung on a fine fibre twists back and forth with $\\tfrac12\\kappa\\langle\\theta^2\\rangle = \\tfrac12k_BT$; the electrons in every resistor make a noise voltage with $\\langle V^2\\rangle = 4k_BTR\\,\\Delta f$ (Johnson–Nyquist noise). Such thermal noise sets the ultimate limit of sensitive instruments. The same restlessness is what the [[ratchet-and-pawl]] tries, and fails, to turn into work.

> [!key] A Brownian particle has the thermal energy of a molecule, but its velocity is forgotten almost at once; its position performs a random walk with $\\langle R^2\\rangle = 6Dt$, $D = k_BT/6\\pi\\eta a$.

### What to look for in the simulations
In *Kicked by molecules* a big grain sits among small, fast molecules; each flash is a kick, and the grain's trail is a random walk. Watch its average kinetic energy climb to that of one molecule. In *Brownian motion under the microscope* beads in water move in real time; the graph of mean-square displacement against time is a straight line of slope $4D$ (the microscope sees two of the three dimensions). Make the beads smaller, or the water hotter, and the slope rises.
`,
  ideas: [
    'A suspended particle is kicked unevenly by molecules; by equipartition it has the same average kinetic energy as a molecule, 3/2 kT.',
    'Viscous drag erases its velocity in nanoseconds, so its position performs a random walk.',
    'The mean-square displacement grows linearly in time: ⟨R²⟩ = 6Dt, with D = kT/(6πηa) for a sphere (Stokes–Einstein).',
    'Measuring Brownian motion gives Boltzmann\'s constant and Avogadro\'s number — Perrin\'s proof of atoms.',
    'The same thermal agitation appears as noise in mirrors, resistors and every sensitive instrument.'
  ],
  pitfalls: [
    'The speed of a Brownian particle can be found from its displacement divided by time — The displacement grows like √t, so that "speed" depends on how often you look and tends to zero for long intervals; the true thermal speed is far higher and invisible.',
    'Brownian motion slowly dies out as the particles tire — It never stops; energy flows in from the molecules as fast as drag removes it.',
    'Heavier particles of the same size diffuse more slowly — D = kT/6πηa does not contain the mass; size and viscosity set it.'
  ],
  formulas: [
    {
      name: 'Diffusion coefficient of a sphere (Stokes–Einstein)',
      expr: 'D = kB*T/(6*pi*eta*a)', tex: 'D = \\dfrac{k_B T}{6\\pi\\eta a}',
      vars: {
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 293 },
        eta: { name: 'viscosity of the liquid', q: 'viscosity', unit: 'mPa·s', value: 1.0, tex: '\\eta' },
        a: { name: 'radius of the sphere', q: 'length', unit: 'µm', value: 0.5 }
      },
      note: 'Stokes drag 6πηa for a sphere; water is 1.0 mPa·s at 20 °C and 0.47 mPa·s at 60 °C.',
      stories: { D: 'What is the diffusion coefficient of a sphere of radius {a} in a liquid of viscosity {eta} at {T}?', a: 'Beads in a liquid of viscosity {eta} at {T} diffuse with D = {D}. What is their radius?', eta: 'Spheres of radius {a} at {T} have D = {D}. What is the viscosity of the liquid?' }
    },
    {
      name: 'How far a Brownian particle wanders',
      expr: 'r = sqrt(6*D*t)', tex: 'r_{\\mathrm{rms}} = \\sqrt{6Dt}',
      vars: {
        r: { name: 'root-mean-square distance in three dimensions', q: 'length', unit: 'µm', tex: 'r_{\\mathrm{rms}}' },
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s', value: 4.29e-13 },
        t: { name: 'time', q: 'time', unit: 's', value: 60 }
      },
      note: 'In a plane (as seen in a microscope) use 4Dt; along one line, 2Dt.',
      stories: { r: 'A particle with D = {D} wanders for {t}. How far does it typically get?', t: 'How long does a particle with D = {D} take to wander {r} from where it started?' }
    },
    {
      name: 'How quickly a particle forgets its velocity',
      expr: 'tau = m/(6*pi*eta*a)', tex: '\\tau = \\dfrac{m}{6\\pi\\eta a}',
      vars: {
        tau: { name: 'velocity relaxation time', q: 'time', unit: 'ns', tex: '\\tau' },
        m: { name: 'mass of the particle', q: 'mass', unit: 'kg', value: 5.5e-16 },
        eta: { name: 'viscosity of the liquid', q: 'viscosity', unit: 'mPa·s', value: 1.0, tex: '\\eta' },
        a: { name: 'radius of the particle', q: 'length', unit: 'µm', value: 0.5 }
      },
      note: 'Mass over drag coefficient. Over times much longer than τ the motion is a random walk.',
      stories: { tau: 'A bead of mass {m} and radius {a} moves in a liquid of viscosity {eta}. How long does it take to forget its velocity?' }
    },
    {
      name: 'Thermal noise of a resistor (Johnson–Nyquist)',
      expr: 'V = sqrt(4*kB*T*R*df)', tex: 'V_{\\mathrm{rms}} = \\sqrt{4k_B T R\\,\\Delta f}',
      vars: {
        V: { name: 'rms noise voltage', q: 'voltage', unit: 'µV', tex: 'V_{\\mathrm{rms}}' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 },
        R: { name: 'resistance', q: 'resistance', unit: 'MΩ', value: 1 },
        df: { name: 'bandwidth of the measurement', q: 'frequency', unit: 'kHz', value: 10, tex: '\\Delta f' }
      },
      note: 'Equipartition applied to the electrical oscillations of a circuit; valid while hf ≪ kT.',
      stories: { V: 'What rms noise voltage does a {R} resistor at {T} produce in a bandwidth of {df}?', T: 'A {R} resistor shows {V} of noise in {df}. What is its temperature?' }
    }
  ],
  examples: [
    {
      title: 'A bead in water',
      q: 'A polystyrene bead 1.0 µm in diameter is in water at 20 °C (η = 1.00 mPa·s). Find $D$ and how far it typically wanders in a minute.',
      steps: [
        '$k_BT = 1.381\\times10^{-23}\\times293 = 4.05\\times10^{-21}$ J; $6\\pi\\eta a = 6\\pi\\times10^{-3}\\times0.5\\times10^{-6} = 9.42\\times10^{-9}$ kg/s.',
        '$D = 4.05\\times10^{-21}/9.42\\times10^{-9} = 4.29\\times10^{-13}$ m²/s.',
        '$r_{\\mathrm{rms}} = \\sqrt{6 \\times 4.29\\times10^{-13} \\times 60} = 1.24\\times10^{-5}$ m.'
      ],
      a: 'D ≈ 0.43 µm²/s; about 12 µm in a minute.'
    },
    {
      title: 'A very long walk',
      q: 'How long would the same bead need to wander 1 mm?',
      steps: [
        '$t = r^2/6D = (10^{-3})^2/(6\\times4.29\\times10^{-13})$.',
        '$t = 3.9\\times10^5$ s — about four and a half days.'
      ],
      a: 'About 4.5 days: 80 times farther than in a minute takes 6400 times as long.'
    },
    {
      title: 'The speed nobody sees',
      q: 'The bead has mass $5.5\\times10^{-16}$ kg. Find its thermal speed and the time and distance over which it keeps a velocity.',
      steps: [
        '$v_{\\mathrm{rms}} = \\sqrt{3k_BT/m} = \\sqrt{3\\times4.05\\times10^{-21}/5.5\\times10^{-16}} = 4.7\\times10^{-3}$ m/s.',
        '$\\tau = m/6\\pi\\eta a = 5.5\\times10^{-16}/9.42\\times10^{-9} = 5.8\\times10^{-8}$ s.',
        'Distance: $v\\tau \\approx 2.7\\times10^{-10}$ m — about the size of an atom.'
      ],
      a: '4.7 mm/s, kept for only 58 ns over 0.3 nm: invisible, leaving only the random walk.'
    }
  ],
  quiz: [
    { q: 'You watch a Brownian particle four times as long. Its typical distance from the start becomes…', choices: ['2 times larger', '4 times larger', '16 times larger', 'the same'], a: 0, why: '⟨R²⟩ ∝ t, so R_rms ∝ √t: √4 = 2.' },
    { q: 'The liquid is replaced by one twice as viscous (same temperature). The diffusion coefficient…', choices: ['halves', 'doubles', 'is unchanged', 'quarters'], a: 0, why: 'D = kT/6πηa ∝ 1/η.' },
    { q: 'A Brownian bead has, on average, the same kinetic energy as one water molecule around it.', a: true, why: 'Equipartition: every body in thermal equilibrium has ³⁄₂kT of translational kinetic energy on average, whatever its mass.' },
    { q: 'Two beads of the same size, one of glass and one of plastic (lighter), wander in the same water. The glass one wanders…', choices: ['the same distance on average', 'less, because it is heavier', 'more, because it has more momentum', 'not at all'], a: 0, why: 'D depends on size, viscosity and temperature, not on mass (the mass only sets the tiny time τ). (Gravity would pull the glass one down faster, but that is another matter.)' },
    { q: 'Why does the Brownian particle\'s visible motion look like a random walk rather than straight flights at its thermal speed?', choices: ['drag erases each velocity in nanoseconds, so the path is a sum of countless tiny random steps', 'the microscope is too slow', 'the molecules push it in a regular pattern', 'the particle is alive'], a: 0, why: 'τ = m/6πηa ≈ 10⁻⁷ s for a micrometre bead: far shorter than anything a microscope resolves.' }
  ],
  problems: [
    { q: 'A 1.00 µm-diameter bead in water at 20 °C (η = 1.00 mPa·s) is tracked along one axis: after 3.0 s its mean-square displacement is 2.6 µm². What value of Boltzmann\'s constant does this give?', answer: 1.39e-23, unit: 'J/K', tol: 0.03, hint: 'Along one axis ⟨x²⟩ = 2Dt; then k = 6πηaD/T.',
      steps: ['$D = \\langle x^2\\rangle/2t = 2.6\\times10^{-12}/6.0 = 4.33\\times10^{-13}$ m²/s.', '$k_B = 6\\pi\\eta a D/T = 9.42\\times10^{-9}\\times4.33\\times10^{-13}/293 = 1.39\\times10^{-23}$ J/K.', 'With $R = 8.314$ J/(mol·K), $N_A = R/k_B \\approx 6.0\\times10^{23}$ — Perrin\'s kind of result.'] },
    { q: 'What rms noise voltage does a 1 MΩ resistor at 300 K produce over a 10 kHz bandwidth?', answer: 12.9, unit: 'µV', tol: 0.02, hint: 'V = √(4kTRΔf).',
      steps: ['$4k_BTR\\Delta f = 4\\times1.381\\times10^{-23}\\times300\\times10^6\\times10^4 = 1.66\\times10^{-10}$ V².', '$V = 1.29\\times10^{-5}$ V = 12.9 µV.'] }
  ],
  applications: [
    'Particle sizers measure nanoparticles and proteins by timing their Brownian motion (dynamic light scattering).',
    'Microrheology measures the viscosity inside cells from the jiggling of tracer beads.',
    'Thermal noise limits radio receivers, amplifiers and gravitational-wave detectors; it is reduced by cooling.'
  ],
  history: 'Robert Brown reported the motion in 1828 after observing it in 1827. Albert Einstein (1905) and Marian Smoluchowski (1906) explained it by molecular kicks and predicted ⟨R²⟩ ∝ t; Paul Langevin gave the equation-of-motion derivation in 1908. Jean Perrin\'s measurements of 1908–09 confirmed the theory and gave Avogadro\'s number, and he received the 1926 Nobel Prize. John B. Johnson measured the thermal noise of resistors in 1927–28 and Harry Nyquist explained it from equipartition in 1928.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 41 (The Brownian Movement) — equipartition of energy, and the derivation that the mean-square distance of a jiggling particle grows in proportion to time.',
    'Vol. I, ch. 6 (Probability) — the random walk and its √N law.'
  ],
  sim: ['heat-kicks', 'heat-brownian']
},

/* ================================================================ DIFFUSION */
{
  id: 'diffusion-random-walk', parent: 'kinetic-statistical', title: 'Diffusion and the random walk', level: 2,
  short: 'A molecule zigzags from collision to collision; after N free paths of length l it is typically only l√N from where it started. That random walk is diffusion: a drop of ink spreads as a Gaussian of width √(2Dt), fast over micrometres and hopelessly slow over metres.',
  keywords: ['diffusion', 'random walk', 'mean free path', 'diffusion coefficient', 'Fick\'s law', 'diffusion equation', 'Gaussian', 'mobility', 'Einstein relation', 'collisions', 'square root of time'],
  prereq: ['probability-feyn', 'brownian-movement', 'kinetic-theory-feyn'],
  related: ['boltzmann-law', 'past-and-future', 'entropy-and-order', 'electrostatic-analogs', 'physics:mean-free-path', 'math:heat-equation', 'math:normal-distribution'],
  body: `
Put a drop of ink into a glass of still water and watch. It spreads — but slowly, over minutes and hours, although its molecules move at hundreds of metres per second. Nothing pushes the ink outwards. Each molecule simply wanders at random, jostled by the water, and a crowd of random walkers that start together drifts apart.

### The random walk
A walker takes $N$ steps of length $l$, each in a random direction. Its displacement is the vector sum $\\vec R_N = \\vec R_{N-1} + \\vec L$. Squaring,
$$R_N^2 = R_{N-1}^2 + 2\\,\\vec R_{N-1}\\cdot\\vec L + l^2 .$$
The direction of the next step has nothing to do with where the walker is, so the [[?dot-product]] averages to zero and each step adds $l^2$ to the mean square:
$$\\langle R^2\\rangle = N\\,l^2, \\qquad R_{\\mathrm{rms}} = l\\sqrt N .$$
This is the coin-tossing law of [[probability-feyn]] in space.

### Molecules: free paths between collisions
In a gas a molecule flies straight until it hits another. It sweeps out a tube of cross-section $\\pi d^2$ ($d$ = molecular diameter) and meets a molecule every time the tube contains one; allowing for the motion of the others, the **mean free path** is $l = 1/(\\sqrt2\\,n\\pi d^2)$. For nitrogen at 1 atm and 300 K ($d \\approx 0.37$ nm), $l \\approx 68$ nm — some 200 molecular diameters — and at a mean speed of 476 m/s a molecule collides about $7\\times10^9$ times a second. In a second it flies 476 m but ends up only about 6 mm away.

### The diffusion coefficient
In a time $t$ a molecule makes $N = \\bar v t/l$ steps, so $\\langle R^2\\rangle$ grows in proportion to $t$. We write $\\langle x^2\\rangle = 2Dt$ along one axis ($\\langle R^2\\rangle = 6Dt$ in space), and averaging carefully over free paths of different lengths gives
$$D \\approx \\tfrac13\\,\\bar v\\, l .$$
For nitrogen this is $1.1\\times10^{-5}$ m²/s; the measured value is about $2\\times10^{-5}$ m²/s. Halve the pressure and the free path doubles, and so does $D$.

Feynman also looked at molecules pushed by a steady force $F$: they drift at a speed $v_d = \\mu F$, where $\\mu$ is the **mobility**. In equilibrium the drift must exactly balance diffusion against the Boltzmann density gradient, $n \\propto e^{-U/k_BT}$, and that fixes a beautiful link, the Einstein relation:
$$D = \\mu\\,k_BT .$$
For a sphere in a liquid $\\mu = 1/6\\pi\\eta a$, which is the [[brownian-movement]] result.

### The diffusion equation
Molecules drift, on balance, from crowded to empty places: the flux is $J = -D\\,\\partial n/\\partial x$ (Fick's law, a [[?partial-derivative]]). Counting what goes in and out of a thin slice turns that into a [[?differential-equation]]:
$$\\frac{\\partial n}{\\partial t} = D\\,\\frac{\\partial^2 n}{\\partial x^2}.$$
It is the same equation as heat flow (see [[electrostatic-analogs]]). Its answer for a drop is a [[?gaussian]] whose width $\\sigma = \\sqrt{2Dt}$ grows as the square root of time.

| Diffusing | $D$ (m²/s) | to spread 1 µm | 1 mm | 1 m |
|---|---|---|---|---|
| a gas in air | $2\\times10^{-5}$ | 25 ns | 25 ms | 7 hours |
| sugar in water | $5\\times10^{-10}$ | 1 ms | 17 min | 32 years |
| a protein in water | $6\\times10^{-11}$ | 8 ms | 2.3 hours | 260 years |

(Times $t = x^2/2D$.) Diffusion is fast over the size of a cell and useless over the size of a person: that is why animals have blood vessels, why we stir our tea, and why a smell crosses a room on air currents rather than by diffusion.

> [!key] Random steps add in squares: $\\langle R^2\\rangle = Nl^2 = 6Dt$. Twice the distance takes four times the time.

### What to look for in the simulation
A drop of dye spreads in water. The histogram of positions along the cell stays a Gaussian, and its measured width tracks $\\sqrt{\\sigma_0^2 + 2Dt}$. Follow one molecule to see its ragged walk. Switch the substance and watch how differently the clock has to run.
`,
  ideas: [
    'In a random walk the steps add in squares: after N steps of length l the rms distance is l√N.',
    'A gas molecule\'s steps are free paths of about 70 nm at atmospheric pressure, taken billions of times a second.',
    'Diffusion is a random walk: ⟨x²⟩ = 2Dt along a line, with D ≈ ⅓ v̄ l in a gas.',
    'Drift under a force and diffusion are two faces of the same agitation: D = μkT (Einstein).',
    'A diffusing drop is a Gaussian whose width grows as √(2Dt); diffusion is fast over micrometres and slow over metres.'
  ],
  pitfalls: [
    'Molecules move at hundreds of m/s, so gases mix almost instantly — Each flight lasts ~70 nm; the random walk makes a metre take hours.',
    'Diffusing ten times as far takes ten times as long — It takes a hundred times as long: the distance grows as √t.',
    'Diffusion needs a force pushing molecules from high to low concentration — There is no force; there are simply more random walkers leaving a crowded region than entering it.'
  ],
  formulas: [
    {
      name: 'The random walk',
      expr: 'R = l*sqrt(N)', tex: 'R_{\\mathrm{rms}} = l\\sqrt{N}',
      vars: {
        R: { name: 'root-mean-square distance from the start', q: 'length', unit: 'mm', tex: 'R_{\\mathrm{rms}}' },
        l: { name: 'length of each step (free path)', q: 'length', unit: 'nm', value: 68 },
        N: { name: 'number of steps', int: true, value: 7.0e9 }
      },
      note: 'Steps of equal length in random, independent directions. 7 × 10⁹ free paths of 68 nm is one second in the life of a nitrogen molecule.',
      stories: { R: 'A molecule makes {N} free flights of {l} each. How far from the start does it typically end up?', N: 'How many random steps of {l} are needed to get typically {R} away?' }
    },
    {
      name: 'Spreading by diffusion',
      expr: 'x = sqrt(2*D*t)', tex: 'x_{\\mathrm{rms}} = \\sqrt{2Dt}',
      vars: {
        x: { name: 'rms spread along one direction', q: 'length', unit: 'mm', tex: 'x_{\\mathrm{rms}}' },
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s', value: 5e-10 },
        t: { name: 'time', q: 'time', unit: 'min', value: 20 }
      },
      note: 'Along one axis; in the plane 4Dt, in space 6Dt. 5 × 10⁻¹⁰ m²/s is sugar in water.',
      stories: { x: 'Sugar with D = {D} diffuses for {t}. How far does it spread?', t: 'How long does a substance with D = {D} take to spread {x}?' }
    },
    {
      name: 'Diffusion coefficient of a gas (kinetic estimate)',
      expr: 'D = 1/3*v*l', tex: 'D = \\tfrac13\\,\\bar v\\, l',
      vars: {
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s' },
        v: { name: 'mean molecular speed', q: 'speed', unit: 'm/s', value: 476, tex: '\\bar v' },
        l: { name: 'mean free path', q: 'length', unit: 'nm', value: 68 }
      },
      note: 'An estimate good to a factor of two; l itself is 1/(√2 n π d²).',
      stories: { D: 'Molecules with a mean speed of {v} and a mean free path of {l}: estimate their diffusion coefficient.', l: 'A gas with mean molecular speed {v} has D = {D}. Estimate the mean free path.' }
    },
    {
      name: 'The Einstein relation',
      expr: 'D = mu*kB*T', tex: 'D = \\mu\\, k_B T',
      vars: {
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s' },
        mu: { name: 'mobility (drift speed per unit force)', unit: 'm/(N·s)', value: 1.06e8, tex: '\\mu' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 293 }
      },
      note: 'Holds for anything jiggled by a bath at temperature T. For a sphere in a liquid μ = 1/(6πηa); 1.06 × 10⁸ m/(N·s) is a 1 µm bead in water.',
      stories: { D: 'A particle drifts with mobility {mu} in a liquid at {T}. What is its diffusion coefficient?', mu: 'A particle at {T} diffuses with D = {D}. What is its mobility?' }
    }
  ],
  examples: [
    {
      title: 'One second in the life of a molecule',
      q: 'A nitrogen molecule at 1 atm and 300 K moves at 476 m/s with a mean free path of 68 nm. How many collisions does it make in a second, and how far does it get?',
      steps: [
        'Collisions: $N = \\bar v/l = 476/6.8\\times10^{-8} = 7.0\\times10^9$ per second.',
        'Random walk: $R = l\\sqrt N = 6.8\\times10^{-8}\\times\\sqrt{7.0\\times10^9} = 6.8\\times10^{-8}\\times8.4\\times10^4 = 5.7\\times10^{-3}$ m.'
      ],
      a: 'Seven billion collisions; 476 m of flight, but only about 6 mm of progress.'
    },
    {
      title: 'Why we stir our tea',
      q: 'Sugar diffuses in water with $D = 5\\times10^{-10}$ m²/s. How long does it take to spread 1 cm by diffusion alone?',
      steps: [
        '$t = x^2/2D = (10^{-2})^2/(2\\times5\\times10^{-10})$.',
        '$t = 10^5$ s, about 28 hours.'
      ],
      a: 'More than a day — a spoon does it in seconds by carrying the liquid bodily.'
    },
    {
      title: 'Oxygen for a cell',
      q: 'Oxygen diffuses in water with $D \\approx 2\\times10^{-9}$ m²/s. How long does it take to cross 10 µm (a cell) and 1 mm?',
      steps: [
        '10 µm: $t = (10^{-5})^2/(2\\times2\\times10^{-9}) = 0.025$ s.',
        '1 mm: $t = (10^{-3})^2/(4\\times10^{-9}) = 250$ s.'
      ],
      a: 'A fortieth of a second across a cell, but four minutes across a millimetre: large animals need a circulation.'
    }
  ],
  quiz: [
    { q: 'Ink has spread 1 mm after 10 minutes. How long until it has spread 2 mm?', choices: ['40 minutes', '20 minutes', '14 minutes', '100 minutes'], a: 0, why: 'x ∝ √t: twice the distance needs four times the time.' },
    { q: 'A walker takes 100 steps of 1 m in random directions. How far from the start does she typically end up?', choices: ['about 10 m', 'about 100 m', 'about 1 m', 'exactly 0 m'], a: 0, why: 'l√N = 1 × √100 = 10 m.' },
    { q: 'The pressure of a gas is halved at constant temperature. Its diffusion coefficient…', choices: ['doubles', 'halves', 'is unchanged', 'quadruples'], a: 0, why: 'D ≈ ⅓ v̄ l; the speed is unchanged, and the mean free path ∝ 1/n doubles.' },
    { q: 'Because gas molecules move at hundreds of metres per second, a smell crosses a still room in about a second by diffusion.', a: false, why: 'Each molecule changes direction billions of times a second; diffusing a few metres takes many hours. Smells travel on air currents.' },
    { q: 'A thin line of dye spreads in still water. Its concentration profile across the line becomes…', choices: ['a Gaussian bell whose width grows as √t', 'a rectangle that widens at constant speed', 'two peaks moving apart', 'uniform at once'], a: 0, why: 'The diffusion equation spreads a point source into a Gaussian of width √(2Dt).' }
  ],
  problems: [
    { q: 'Estimate the mean free path of nitrogen molecules (diameter 0.37 nm) at 1 atm and 300 K, where n = 2.45 × 10²⁵ m⁻³.', answer: 67, unit: 'nm', tol: 0.03, hint: 'l = 1/(√2 n π d²).',
      steps: ['$\\pi d^2 = \\pi (0.37\\times10^{-9})^2 = 4.30\\times10^{-19}$ m².', '$l = 1/(1.414 \\times 2.45\\times10^{25} \\times 4.30\\times10^{-19}) = 6.7\\times10^{-8}$ m = 67 nm.'] },
    { q: 'A dye has D = 4 × 10⁻¹⁰ m²/s in water. How many minutes until the rms spread of a thin line of dye reaches 2 mm (along one direction)?', answer: 83, unit: 'min', tol: 0.03, hint: 't = x²/2D.',
      steps: ['$t = (2\\times10^{-3})^2/(2\\times4\\times10^{-10}) = 5000$ s.', '5000 s = 83 minutes.'] }
  ],
  applications: [
    'Oxygen, nutrients and signalling molecules cross cells and synapses by diffusion — fast at those tiny scales.',
    'Doping of semiconductors: impurity atoms are diffused into hot silicon to depths of micrometres.',
    'Uranium enrichment by gaseous diffusion used the slightly faster random walk of the lighter isotope.',
    'Heat conduction is the diffusion of thermal energy and obeys the same equation.'
  ],
  history: 'Thomas Graham measured the rates at which gases diffuse in 1831–33, and Adolf Fick wrote the laws of diffusion in 1855 by analogy with heat conduction. In 1858 C. H. D. Buys Ballot objected that if gas molecules were as fast as the kinetic theory claimed, smells would cross a room at once; Rudolf Clausius replied by introducing the mean free path. Einstein\'s relation D = μkT (1905) tied diffusion to mobility, and Karl Pearson named the "random walk" in a letter to Nature the same year.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 43 (Diffusion) — collisions between molecules, the mean free path, drift speed and mobility, molecular diffusion and thermal conductivity.',
    'Vol. I, ch. 6 (Probability) and ch. 41 (The Brownian Movement) — the random walk.',
    'Vol. II, ch. 12 (Electrostatic Analogs) — the diffusion equation shares its mathematics with heat flow and electrostatics, illustrated by the diffusion of neutrons.'
  ],
  sim: 'heat-ink'
},

/* ================================================================ THE LAWS OF THERMODYNAMICS */
{
  id: 'laws-of-thermodynamics-feyn', parent: 'thermo-arrow', title: 'The laws of thermodynamics and Carnot\'s engine', level: 2,
  short: 'Energy is conserved, heat included (the first law); heat cannot be turned wholly into work, nor flow by itself from cold to hot (the second law). Carnot\'s reversible engine shows the best possible efficiency between two temperatures is 1 − T₂/T₁, whatever the engine is made of.',
  keywords: ['first law', 'second law', 'thermodynamics', 'heat engine', 'Carnot cycle', 'Carnot engine', 'efficiency', 'reversible', 'isothermal', 'adiabatic', 'P–V diagram', 'thermodynamic temperature', 'refrigerator', 'heat pump', 'Kelvin', 'Clausius'],
  prereq: ['conservation-of-energy', 'kinetic-theory-feyn', 'physics:first-law-thermodynamics'],
  related: ['entropy-and-order', 'ratchet-and-pawl', 'past-and-future', 'physics:carnot-cycle', 'physics:heat-engines', 'physics:second-law-thermodynamics', 'physics:refrigerators-heat-pumps'],
  body: `
Steam engines were built long before anyone understood them. The science of heat that grew up to explain them — thermodynamics — turned out to rest on two laws so general that Feynman could derive a startling amount from them without ever mentioning atoms.

### The first law: heat is energy
Heat is energy in transit, the random motion of atoms (see [[kinetic-theory-feyn]]). Counting it along with work, energy is conserved:
$$\\Delta U = Q - W,$$
the increase of a body's internal energy equals the heat put in minus the work it does. Early in the lecture Feynman brought out a rubber band: stretch one quickly against your lip and it warms; heat a stretched one and it *contracts*, lifting a weight — a heat engine in miniature.

### The second law: not all heat can become work
Energy conservation alone would allow a ship to run by cooling the sea. It never works. **It is impossible to take heat from a body at one temperature and turn it into work with no other change** (Kelvin's form); equivalently, **heat does not flow by itself from a colder body to a hotter one** (Clausius's form). The only way to get work from heat is to let heat $Q_1$ flow from a hot body at $T_1$ towards a cold one at $T_2$ and divert part of it, $W = Q_1 - Q_2$.

### Carnot's reversible engine
Sadi Carnot's insight (1824) was that the best engine is a **reversible** one: no friction, and no heat ever crossing a finite temperature difference, so every step could be run backwards by a tiny nudge. With a gas in a cylinder:
1. **Isothermal expansion** at $T_1$, in contact with the hot body: the gas takes heat $Q_1 = nRT_1\\ln(V_2/V_1)$ and does the same amount of work.
2. **Adiabatic expansion**, insulated: the gas does more work and cools from $T_1$ to $T_2$.
3. **Isothermal compression** at $T_2$, in contact with the cold body: it gives out heat $Q_2$.
4. **Adiabatic compression** back to the start, warming from $T_2$ to $T_1$.

The net work is the area enclosed on the pressure–volume diagram (an [[?integral]], $W = \\oint p\\,dV$).

### Why nothing beats it
Carnot's argument, which Feynman retold with care: suppose some engine A, taking $Q_1$ from the hot body, gave more work than a reversible engine B taking the same $Q_1$. Run B backwards as a refrigerator, using part of A's work to pump $Q_1$ back into the hot body. The hot body ends unchanged, some work is left over — and it can only have come from the cold body. That breaks the second law. So **every reversible engine between the same two temperatures has the same efficiency**, whether it uses steam, air or rubber bands.

### Temperature defined by an engine
The ratio $Q_1/Q_2$ of a reversible engine therefore depends only on the two temperatures — and Kelvin turned this round to *define* absolute temperature: $Q_1/T_1 = Q_2/T_2$. (For an ideal gas this agrees with $pV = nRT$.) The efficiency follows at once:
$$\\eta = \\frac{W}{Q_1} = 1 - \\frac{T_2}{T_1}.$$

| Engine | $T_1$ | $T_2$ | Carnot limit | Real, roughly |
|---|---|---|---|---|
| steam power station | 838 K (565 °C) | 303 K | 64 % | 40 % |
| gas-turbine combined cycle | about 1700 K | 303 K | 82 % | 60 % |
| ocean thermal plant | 298 K | 278 K | 6.7 % | 3 % |

Run a Carnot engine backwards and it is a refrigerator or heat pump: with work $W$ it moves heat out of the cold side and delivers $Q_1 = W\\,T_1/(T_1 - T_2)$ into the warm side — almost 15 times the work when heating a house at 20 °C from 0 °C air. In the next lecture Feynman used the same reasoning to derive, for example, how the boiling point of a liquid changes with pressure.

> [!key] No engine working between $T_1$ and $T_2$ can beat a reversible one, and every reversible one has $\\eta = 1 - T_2/T_1$. The waste heat is not bad design; it is the second law.

### What to look for in the simulation
The cylinder slides from the hot block to insulation to the cold block and back while the state point runs round the P–V diagram. Heat arrows show $Q_1$ coming in and $Q_2$ going out; the shaded area is the work. Compare $W/Q_1$ with $1 - T_2/T_1$ for any settings, and see that $Q_1/T_1 = Q_2/T_2$. Reverse it to make a refrigerator.
`,
  ideas: [
    'First law: ΔU = Q − W — heat is energy, and energy is conserved.',
    'Second law: heat cannot be converted wholly into work at a single temperature, nor flow unaided from cold to hot.',
    'A reversible engine is the best possible; all reversible engines between T₁ and T₂ have the same efficiency, whatever their substance.',
    'Kelvin defined absolute temperature by Q₁/T₁ = Q₂/T₂ for a reversible engine, giving η = 1 − T₂/T₁.',
    'Run backwards, a Carnot engine is an ideal refrigerator or heat pump.'
  ],
  pitfalls: [
    'A better working fluid or cleverer design could beat the Carnot efficiency — Carnot\'s argument shows any engine that did so could be combined with a reversed Carnot engine to break the second law.',
    'The rejected heat Q₂ is a loss that good engineering could eliminate — Some rejection is required by the second law; only the excess over T₂Q₁/T₁ is waste.',
    'A refrigerator with its door open cools a closed room — It moves heat from inside to the back coils and adds the work it consumes: the room warms.'
  ],
  formulas: [
    {
      name: 'Efficiency of a reversible engine',
      expr: 'eta = 1 - T2/T1', tex: '\\eta = 1 - \\dfrac{T_2}{T_1}',
      vars: {
        eta: { name: 'efficiency W/Q₁', q: 'ratio', unit: '%', tex: '\\eta' },
        T1: { name: 'temperature of the hot reservoir', q: 'temperature', unit: 'K', value: 500 },
        T2: { name: 'temperature of the cold reservoir', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'Absolute temperatures. No engine between these temperatures can do better.',
      stories: { eta: 'What is the greatest possible efficiency of an engine working between {T1} and {T2}?', T1: 'An ideal engine rejecting heat at {T2} has an efficiency of {eta}. What is its hot temperature?', T2: 'An ideal engine takes in heat at {T1} with efficiency {eta}. At what temperature does it reject heat?' }
    },
    {
      name: 'Heat in and heat out of a reversible engine',
      expr: 'Q2/T2 = Q1/T1', tex: '\\dfrac{Q_2}{T_2} = \\dfrac{Q_1}{T_1}', solveFor: 'Q2',
      vars: {
        Q2: { name: 'heat given to the cold reservoir', q: 'energy', unit: 'J' },
        T2: { name: 'cold temperature', q: 'temperature', unit: 'K', value: 300 },
        Q1: { name: 'heat taken from the hot reservoir', q: 'energy', unit: 'J', value: 2881 },
        T1: { name: 'hot temperature', q: 'temperature', unit: 'K', value: 500 }
      },
      note: 'Kelvin\'s definition of absolute temperature; Q/T is the entropy carried by the heat.',
      stories: { Q2: 'A reversible engine takes {Q1} from a reservoir at {T1} and rejects heat at {T2}. How much heat does it reject?' }
    },
    {
      name: 'Heat taken in an isothermal expansion of an ideal gas',
      expr: 'Q = n*R*T*ln(V2/V1)', tex: 'Q = nRT\\ln\\dfrac{V_2}{V_1}',
      vars: {
        Q: { name: 'heat absorbed (equal to the work done)', q: 'energy', unit: 'J' },
        n: { name: 'amount of gas', q: 'amount', unit: 'mol', value: 1 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 500 },
        V1: { name: 'volume at the start', q: 'volume', unit: 'L', value: 10 },
        V2: { name: 'volume at the end', q: 'volume', unit: 'L', value: 20 }
      },
      note: 'At constant temperature the internal energy of an ideal gas does not change, so Q = W.',
      stories: { Q: '{n} of gas expands slowly at {T} from {V1} to {V2}. How much heat does it absorb?', V2: 'How far must {n} of gas at {T}, starting at {V1}, expand to absorb {Q}?' }
    },
    {
      name: 'Heat delivered per unit work by an ideal heat pump',
      expr: 'K = T1/(T1 - T2)', tex: 'K_{\\mathrm{hp}} = \\dfrac{T_1}{T_1 - T_2}',
      vars: {
        K: { name: 'coefficient of performance Q₁/W', tex: 'K_{\\mathrm{hp}}' },
        T1: { name: 'temperature delivered to (inside)', q: 'temperature', unit: 'K', value: 293 },
        T2: { name: 'temperature taken from (outside)', q: 'temperature', unit: 'K', value: 273 }
      },
      note: 'A reversed Carnot engine. Real heat pumps reach a third to a quarter of this.',
      stories: { K: 'An ideal heat pump warms a house to {T1} using outside air at {T2}. How many joules of heat does it deliver per joule of work?', T2: 'An ideal heat pump delivering heat at {T1} has K = {K}. What is the outside temperature?' }
    }
  ],
  examples: [
    {
      title: 'The limit of a power station',
      q: 'A steam turbine takes steam at 565 °C and condenses it at 30 °C. What is its Carnot limit, and what fraction of the heat must be rejected even by a perfect engine?',
      steps: [
        'Absolute temperatures: $T_1 = 838$ K, $T_2 = 303$ K.',
        '$\\eta = 1 - 303/838 = 0.638$.',
        'At least $303/838 = 36$ % of the heat must go to the cooling water; real plants reject about 60 %.'
      ],
      a: '64 % at most; real stations reach about 40 %.'
    },
    {
      title: 'One turn of a Carnot engine',
      q: 'One mole of ideal gas runs a Carnot cycle between 500 K and 300 K, doubling its volume in the hot isothermal stroke. Find $Q_1$, $Q_2$, $W$ and the efficiency.',
      steps: [
        '$Q_1 = nRT_1\\ln 2 = 1 \\times 8.314 \\times 500 \\times 0.693 = 2881$ J.',
        'The cold isotherm has the same volume ratio (the adiabats see to that), so $Q_2 = nRT_2\\ln 2 = 1729$ J — or directly $Q_2 = Q_1T_2/T_1$.',
        '$W = Q_1 - Q_2 = 1153$ J; $\\eta = 1153/2881 = 0.40 = 1 - 300/500$ ✓.'
      ],
      a: 'Q₁ = 2881 J, Q₂ = 1729 J, W = 1153 J, η = 40 %.'
    },
    {
      title: 'A heat pump',
      q: 'How many joules of heat can an ideal heat pump deliver into a house at 20 °C per joule of electrical work, taking heat from air at 0 °C?',
      steps: [
        '$K = T_1/(T_1 - T_2) = 293/(293 - 273) = 14.7$.',
        'Real heat pumps manage 3–4: their heat exchangers need finite temperature differences, which widens the effective $T_1 - T_2$.'
      ],
      a: 'Ideally 14.7 J of heat per joule of work.'
    }
  ],
  quiz: [
    { q: 'What is the greatest possible efficiency of an engine working between 400 K and 300 K?', choices: ['25 %', '75 %', '33 %', '100 %'], a: 0, why: '1 − 300/400 = 0.25.' },
    { q: 'An inventor claims an engine with a special fluid that beats the Carnot efficiency between the same two temperatures. Carnot\'s argument shows that…', choices: ['combined with a reversed Carnot engine it would turn heat from one reservoir wholly into work, which is impossible', 'it is possible if the fluid is dense enough', 'it only fails for steam', 'efficiency depends on the fluid, so it might work'], a: 0, why: 'All reversible engines between the same temperatures have the same efficiency; nothing can exceed it.' },
    { q: 'Leaving the refrigerator door open in a closed, insulated kitchen cools the kitchen.', a: false, why: 'The refrigerator only moves heat from the inside to the coils at the back, both in the kitchen, and adds its electrical work: the kitchen warms.' },
    { q: 'An ideal engine works between 600 K and 300 K. Which improves its efficiency more?', choices: ['lowering the cold temperature by 100 K', 'raising the hot temperature by 100 K', 'both the same', 'neither changes it'], a: 0, why: 'Lowering T₂: 1 − 200/600 = 67 %. Raising T₁: 1 − 300/700 = 57 %.' },
    { q: 'What is the ideal coefficient of performance of a heat pump heating a house to 20 °C from air at −10 °C?', answer: 9.77, why: 'K = 293/(293 − 263) = 9.77.' }
  ],
  problems: [
    { q: 'A reversible engine takes 1000 J of heat at 600 K and rejects heat at 300 K. How much work does it do?', answer: 500, unit: 'J', tol: 0.01, hint: 'Q₂ = Q₁T₂/T₁.',
      steps: ['$Q_2 = 1000 \\times 300/600 = 500$ J.', '$W = Q_1 - Q_2 = 500$ J.'] },
    { q: 'Two moles of ideal gas expand isothermally at 400 K from 5 L to 15 L. How much heat do they absorb?', answer: 7.31, unit: 'kJ', tol: 0.02, hint: 'Q = nRT ln(V₂/V₁).',
      steps: ['$Q = 2 \\times 8.314 \\times 400 \\times \\ln 3 = 6651 \\times 1.0986$.', '$Q = 7307$ J = 7.31 kJ.'] }
  ],
  applications: [
    'Every thermal power station, car engine and jet engine is bounded by the Carnot efficiency of its temperatures — why engineers push turbine inlet temperatures ever higher.',
    'Heat pumps and refrigerators are reversed engines; their best performance is T/(T₁ − T₂).',
    'The kelvin scale itself rests on Carnot\'s reasoning.'
  ],
  history: 'Sadi Carnot published Reflections on the Motive Power of Fire in 1824, reasoning (with the old idea of heat as a fluid) that the best engine is reversible. Émile Clapeyron put his cycle on a pressure–volume diagram in 1834. After James Joule showed in the 1840s that heat and work are interchangeable, William Thomson (Lord Kelvin) proposed the absolute temperature scale in 1848, and Rudolf Clausius (1850) and Thomson (1851) stated the second law in its two classic forms.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 44 (The Laws of Thermodynamics) — heat engines and the first law, the second law, reversible engines, Carnot\'s argument for the efficiency of an ideal engine, the thermodynamic temperature, and entropy.',
    'Vol. I, ch. 45 (Illustrations of Thermodynamics) — the same reasoning applied, including the Clausius–Clapeyron equation.',
    'Vol. I, ch. 4 (Conservation of Energy) — energy bookkeeping, with heat as one of its forms.'
  ],
  sim: 'heat-carnot'
},

/* ================================================================ ENTROPY */
{
  id: 'entropy-and-order', parent: 'thermo-arrow', title: 'Entropy and disorder', level: 2,
  short: 'Entropy is the heat taken in reversibly divided by the temperature — and, in Boltzmann\'s deeper view, the logarithm of the number of ways the inside of a system can be arranged without changing how it looks from outside: S = k ln W. It grows because mixed states can be made in overwhelmingly more ways than ordered ones.',
  keywords: ['entropy', 'disorder', 'order', 'Boltzmann', 'S = k log W', 'number of arrangements', 'microstates', 'mixing', 'free expansion', 'second law', 'Clausius', 'irreversibility'],
  prereq: ['laws-of-thermodynamics-feyn', 'probability-feyn', 'math:logarithms'],
  related: ['past-and-future', 'ratchet-and-pawl', 'diffusion-random-walk', 'computation-reversible', 'physics:entropy', 'math:combinatorics'],
  body: `
In a Carnot engine the heat taken from the hot reservoir and the heat given to the cold one obey $Q_1/T_1 = Q_2/T_2$. Something passes through the engine unchanged, and it is not heat — it is heat divided by temperature. Clausius called it **entropy**.

### Entropy from heat
When heat $Q$ enters a body reversibly at temperature $T$, its entropy rises by
$$\\Delta S = \\frac{Q}{T}.$$
Round any reversible cycle the total is zero, so entropy, like energy, belongs to the state of a body, not to its history. In every real, irreversible process the total entropy goes up. Let 1 J of heat leak straight from a body at 400 K into one at 300 K: the hot body loses $1/400$ J/K, the cold one gains $1/300$ J/K, a net gain of 0.83 mJ/K. The reverse never happens by itself. That is the second law in its most compact form: **the entropy of an isolated system never decreases.**

### Entropy as a count of arrangements
Why should $Q/T$ behave like this? Boltzmann's answer, which Feynman gave at the end of his lecture on the ratchet: entropy counts how many microscopic arrangements $W$ of the atoms look exactly the same from outside,
$$S = k_B\\ln W .$$
The [[?logarithm]] is there because arrangements of two independent systems *multiply* ($W = W_AW_B$) while entropies *add* ($S = S_A + S_B$).

Test it on a gas that doubles its volume by leaking into an empty box — no heat, no work, no change of temperature. Each molecule now has twice as many places to be, so $W$ is multiplied by $2^N$ and $\\Delta S = Nk_B\\ln2$: for a mole, $R\\ln 2 = 5.76$ J/K. Now reach the same end state reversibly, by an isothermal expansion: $Q/T = nRT\\ln2/T = 5.76$ J/K. Two quite different definitions agree.

### Mixing
Put 50 dark molecules in the left half of a box and 50 light ones in the right, then remove the partition. Count the ways to have $k$ dark and $j$ light molecules on the left: $\\binom{50}{k}\\binom{50}{j}$ (a [[?factorial]] count). The starting state, $k = 50$ and $j = 0$, can be made in exactly **one** way. The evenly mixed state, $k = j = 25$, in $\\binom{50}{25}^2 = 1.6\\times10^{28}$ ways. Of all $2^{100} = 1.3\\times10^{30}$ ways of placing the molecules left or right, only one in $10^{30}$ is the unmixed one. The gas does not *want* to mix; there are simply overwhelmingly more mixed arrangements, and random motion wanders among them all.

| Process | Entropy change |
|---|---|
| 1 J of heat flows from 400 K to 300 K | +0.83 mJ/K |
| one mole of gas doubles its volume | +5.76 J/K |
| 1 kg of water warms from 20 °C to 80 °C | +780 J/K |
| 1 kg of ice melts at 0 °C | +1223 J/K |

Melting that ice multiplies the number of arrangements by $e^{1223/k_B} = e^{8.9\\times10^{25}}$: a number with about $3.8\\times10^{25}$ digits.

### Order and disorder
"Disorder" is a fair word if used carefully. An ordered state — the dark molecules all on one side, heat all in the hot body, the energy of a weight held high — is one that can be made in comparatively few ways. The rise of entropy is the drift from the few to the many. It is statistical, not absolute: with only 4 molecules of each colour the "unmixed" state turns up by chance about once in 256 looks. With $10^{23}$ molecules it never will.

> [!key] $S = Q_{\\mathrm{rev}}/T$ from the outside; $S = k_B\\ln W$ from the inside. Entropy increases because disordered arrangements vastly outnumber ordered ones.

### What to look for in the simulation
Pull out the partition and watch the count of dark molecules on the left sink to about half and stay there, jittering. The bars show $\\binom{n}{k}$ for every possible $k$ — the current state always sits in the fat middle. The graph of $\\ln W$ rises and levels off near its maximum. Put the partition back: nothing unmixes. Try 4 molecules of each colour and catch the rare moments when they sort themselves.
`,
  ideas: [
    'Clausius: heat Q entering reversibly at temperature T raises the entropy by Q/T; entropy is a property of the state.',
    'Boltzmann: S = k ln W, where W counts the microscopic arrangements that look the same from outside.',
    'The logarithm makes entropy additive, because the numbers of arrangements multiply.',
    'Free expansion and mixing increase entropy with no heat flow; the count ΔS = Nk ln 2 matches the heat-based value.',
    'Entropy rises because ordered states are rare and disordered ones overwhelmingly common — a statistical law that becomes certain for large numbers.'
  ],
  pitfalls: [
    'The entropy of any system can never decrease — Only the total entropy of an isolated system. A freezing lake or a refrigerator\'s inside loses entropy, while the surroundings gain more.',
    'Molecules have a tendency or force pushing them to mix — There is no such force; mixed arrangements are simply far more numerous, and random motion samples them all.',
    'Entropy is the same as untidiness of anything, like a messy room — Only arrangements counted at the level of atoms, with the same outside appearance, enter S = k ln W; the thermodynamic entropy of a messy room is not measurably different from a tidy one.'
  ],
  formulas: [
    {
      name: 'Boltzmann\'s entropy',
      expr: 'S = kB*ln(W)', tex: 'S = k_B \\ln W',
      vars: {
        S: { name: 'entropy', q: 'entropy', unit: 'J/K' },
        kB: { const: 'kB' },
        W: { name: 'number of arrangements', value: 1.6e28 }
      },
      note: '1.6 × 10²⁸ is the number of ways to have 25 of 50 dark and 25 of 50 light molecules on one side of a box. Choose the unit k_B to see S/k = ln W.',
      stories: { S: 'A state can be made in {W} ways. What is its entropy?', W: 'In how many ways can a state with entropy {S} be made?' }
    },
    {
      name: 'Entropy from heat',
      expr: 'dS = Q/T', tex: '\\Delta S = \\dfrac{Q}{T}',
      vars: {
        dS: { name: 'entropy change', q: 'entropy', unit: 'J/K', signed: true, tex: '\\Delta S' },
        Q: { name: 'heat taken in reversibly', q: 'energy', unit: 'kJ', signed: true, value: 334 },
        T: { name: 'temperature at which it enters', q: 'temperature', unit: 'K', value: 273.15 }
      },
      note: 'At constant temperature (melting, boiling, a large reservoir). 334 kJ melts 1 kg of ice.',
      stories: { dS: '{Q} of heat is taken in reversibly at {T}. By how much does the entropy change?', Q: 'How much heat must enter at {T} to raise the entropy by {dS}?' }
    },
    {
      name: 'Entropy of expansion of an ideal gas',
      expr: 'dS = n*R*ln(V2/V1)', tex: '\\Delta S = nR\\ln\\dfrac{V_2}{V_1}',
      vars: {
        dS: { name: 'entropy change', q: 'entropy', unit: 'J/K', signed: true, tex: '\\Delta S' },
        n: { name: 'amount of gas', q: 'amount', unit: 'mol', value: 1 },
        R: { const: 'R' },
        V1: { name: 'volume before', q: 'volume', unit: 'L', value: 1 },
        V2: { name: 'volume after', q: 'volume', unit: 'L', value: 2 }
      },
      note: 'At the same temperature, however the change happens — slowly, or by free expansion into a vacuum.',
      stories: { dS: '{n} of ideal gas expands from {V1} to {V2} at constant temperature. What is its entropy change?', V2: 'To what volume must {n} of gas at {V1} expand for its entropy to rise by {dS}?' }
    },
    {
      name: 'Entropy of mixing two ideal gases',
      expr: 'dS = -n*R*(x*ln(x) + (1 - x)*ln(1 - x))', tex: '\\Delta S = -nR\\left[x\\ln x + (1-x)\\ln(1-x)\\right]',
      vars: {
        dS: { name: 'entropy of mixing', q: 'entropy', unit: 'J/K', tex: '\\Delta S' },
        n: { name: 'total amount of gas', q: 'amount', unit: 'mol', value: 2 },
        R: { const: 'R' },
        x: { name: 'fraction of the molecules that are of the first kind', value: 0.3, min: 0.001, max: 0.999 }
      },
      note: 'Two different gases at the same temperature and pressure mixing. Largest, nR ln 2, for an even mix; solving for x gives x and 1 − x.',
      stories: { dS: '{n} of gas, a fraction {x} of one kind and the rest another, mix. By how much does the entropy rise?' }
    }
  ],
  examples: [
    {
      title: 'A mole doubles its volume',
      q: 'One mole of ideal gas leaks into an equal empty volume. Find the entropy change, and by what factor the number of arrangements grows.',
      steps: [
        '$\\Delta S = nR\\ln 2 = 8.314 \\times 0.693 = 5.76$ J/K.',
        '$W$ grows by $2^{N}$ with $N = 6.02\\times10^{23}$: each molecule may be in either half.',
        'Check: $k_B\\ln 2^N = Nk_B\\ln2 = R\\ln2$ ✓.'
      ],
      a: '5.76 J/K; the number of arrangements is multiplied by 2^(6 × 10²³).'
    },
    {
      title: 'Counting the mixed box',
      q: '50 dark and 50 light molecules can each be in the left or right half of a box. In how many ways is the box evenly mixed (25 and 25 of each on each side), and what is the chance that a glance finds it fully unmixed?',
      steps: [
        '$\\binom{50}{25} = 1.26\\times10^{14}$, so $W = (1.26\\times10^{14})^2 = 1.6\\times10^{28}$; $\\ln W = 64.9$.',
        'Unmixed (all dark left, all light right) is one arrangement out of $2^{100} = 1.27\\times10^{30}$.',
        'Chance: $7.9\\times10^{-31}$ per glance.'
      ],
      a: '1.6 × 10²⁸ ways; about 10⁻³⁰ per glance — never, in practice.'
    },
    {
      title: 'Melting ice',
      q: 'What is the entropy change when 1 kg of ice melts at 0 °C (latent heat 334 kJ/kg)?',
      steps: [
        '$\\Delta S = Q/T = 334\\,000/273.15 = 1223$ J/K.',
        'In units of $k_B$: $1223/1.381\\times10^{-23} = 8.9\\times10^{25}$ — the logarithm of the growth in the number of arrangements.'
      ],
      a: '1223 J/K.'
    }
  ],
  quiz: [
    { q: '1 J of heat leaks from a body at 400 K to one at 300 K. The total entropy…', choices: ['rises by about 0.83 mJ/K', 'falls by about 0.83 mJ/K', 'does not change', 'rises by 1 J/K'], a: 0, why: '−1/400 + 1/300 = +0.00083 J/K. Heat flowing from hot to cold always raises the total.' },
    { q: 'Why is entropy the logarithm of the number of arrangements, not the number itself?', choices: ['numbers of arrangements multiply for independent systems, while entropy must add', 'the logarithm makes the numbers smaller', 'Boltzmann preferred logarithms', 'it gives the right units'], a: 0, why: 'ln(W_A W_B) = ln W_A + ln W_B.' },
    { q: 'The entropy of a system can never decrease.', a: false, why: 'A system can lose entropy (water freezing, the inside of a refrigerator) provided its surroundings gain at least as much. Only the total for an isolated system cannot decrease.' },
    { q: 'A gas of N molecules doubles its volume at constant temperature. The number of arrangements is multiplied by…', choices: ['2^N', '2N', '2', 'N²'], a: 0, why: 'Each molecule independently has twice the room: a factor 2 per molecule.' },
    { q: 'What is the entropy change (J/K) when one mole of ideal gas doubles its volume at constant temperature?', answer: 5.763, unit: 'J/K', why: 'R ln 2 = 8.314 × 0.693 = 5.76 J/K.' }
  ],
  problems: [
    { q: 'What is the entropy change of 2.0 kg of water heated from 20 °C to 80 °C (c = 4186 J/(kg·K))?', answer: 1559, unit: 'J/K', tol: 0.02, hint: 'Add up dQ/T: ΔS = mc ln(T₂/T₁).',
      steps: ['Each small heat $mc\\,dT$ enters at temperature $T$; adding up $mc\\,dT/T$ gives $mc\\ln(T_2/T_1)$.', '$\\Delta S = 2.0 \\times 4186 \\times \\ln(353.15/293.15) = 8372 \\times 0.1862 = 1559$ J/K.'] },
    { q: 'Twenty molecules move at random in a box. What is the chance that at a given instant all of them are in the left half?', answer: 9.54e-7, tol: 0.02, hint: 'Each is on the left with probability ½, independently.',
      steps: ['$(\\tfrac12)^{20} = 1/1\\,048\\,576$.', '$= 9.54\\times10^{-7}$: about once in a million looks — rare, but it happens. For $10^{23}$ molecules it never does.'] }
  ],
  applications: [
    'Chemists predict which reactions go by the change of free energy, ΔG = ΔH − TΔS, where the entropy of mixing and of disorder plays a central role.',
    'Rubber is elastic mainly because stretching lines up its long molecules and lowers their entropy.',
    'Information theory measures information with the same formula, and erasing a bit costs at least kT ln 2 of heat (see [[computation-reversible]]).'
  ],
  history: 'Rudolf Clausius coined the word entropy in 1865 and summed up thermodynamics in two laws: the energy of the world stays constant, and its entropy tends towards a maximum. Ludwig Boltzmann connected entropy with the number of molecular arrangements in 1877. The formula S = k log W is carved on his tombstone in Vienna, though it was Max Planck, around 1900, who first wrote it in that form and introduced the constant k. J. Willard Gibbs discussed the entropy of mixing, and the puzzle of mixing identical gases, in 1875–78.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 44 (The Laws of Thermodynamics) — entropy defined from reversible heat, and the statement that it never decreases.',
    'Vol. I, ch. 46 (Ratchet and pawl) — the closing sections on irreversibility, order and entropy, with entropy as the logarithm of the number of ways the inside can be arranged.',
    '*The Character of Physical Law*, lecture 5 (The Distinction of Past and Future) — order, disorder and why things run one way.'
  ],
  sim: 'heat-mixing'
},

/* ================================================================ THE RATCHET AND PAWL */
{
  id: 'ratchet-and-pawl', parent: 'thermo-arrow', title: 'The ratchet and pawl', level: 3,
  short: 'A paddle wheel in a gas, joined to a ratchet that lets it turn only one way, seems to turn random molecular kicks into work. It does not: the pawl jiggles too, and at equal temperatures forward and backward steps balance exactly. With the two sides at different temperatures it becomes a tiny heat engine — at best a Carnot engine.',
  keywords: ['ratchet and pawl', 'Brownian ratchet', 'perpetual motion', 'second law', 'Maxwell\'s demon', 'Boltzmann factor', 'heat engine', 'Carnot efficiency', 'molecular motor', 'Smoluchowski', 'fluctuations'],
  prereq: ['laws-of-thermodynamics-feyn', 'boltzmann-law', 'brownian-movement'],
  related: ['entropy-and-order', 'past-and-future', 'computation-reversible', 'physics:second-law-thermodynamics', 'physics:carnot-cycle'],
  body: `
Here is a machine that seems to break the second law. A little paddle wheel sits in a box of gas at temperature $T_1$. Its axle runs into a second box, at $T_2$, where it carries a **ratchet** — a wheel with sawtooth teeth — and a **pawl**, a latch pressed onto the teeth by a spring, so that the wheel can turn only one way. Molecules hit the vanes at random, some pushing forwards, some backwards. The pawl blocks the backward kicks and lets the forward ones through, so the wheel should creep forward and could wind a thread and lift a weight — work drawn from the heat of a gas at a single temperature. Feynman gave a whole lecture to finding the catch.

### The catch: the pawl jiggles too
To turn one tooth forward, the vanes must lift the pawl over the tip of a tooth, storing an energy $\\varepsilon$ in its spring. Random kicks deliver that much at once only rarely: by [[boltzmann-law|Boltzmann's law]] the rate is proportional to $e^{-\\varepsilon/k_BT_1}$ (a [[?boltzmann-factor]]).

But the pawl lives in a gas at $T_2$, and it jiggles as well. Every so often its own thermal agitation lifts it by $\\varepsilon$, and while it is up the wheel is free. Worse, when it comes down it lands on the sloping back of a tooth, and the spring, pressing it down, pushes the wheel *backwards*. These backward steps happen at a rate proportional to $e^{-\\varepsilon/k_BT_2}$.

When $T_1 = T_2$ the two rates are exactly equal. The wheel jiggles a tooth forwards, a tooth back, and goes nowhere. The machine has to be tiny to feel single molecular kicks at all — and at that size its pawl feels them too.

### An engine after all
Now make the temperatures differ and hang a weight on the axle, so that each forward tooth lifts it, doing work $W = L\\theta$ (the load torque $L$ times the angle $\\theta$ of one tooth). Energy accounting, step by step:

| Step | Needs | Heat from box 1 | Heat into box 2 | Work done |
|---|---|---|---|---|
| forward | $\\varepsilon + L\\theta$ from the vanes | $\\varepsilon + L\\theta$ | $\\varepsilon$ (pawl snaps down) | $+L\\theta$ |
| backward | $\\varepsilon$ from the pawl's box | $-(\\varepsilon + L\\theta)$ | $-\\varepsilon$ | $-L\\theta$ |

Forward steps happen at the rate $f_0\\,e^{-(\\varepsilon + L\\theta)/k_BT_1}$, backward ones at $f_0\\,e^{-\\varepsilon/k_BT_2}$. The wheel turns forward if $(\\varepsilon + L\\theta)/T_1 < \\varepsilon/T_2$. Each net forward step takes heat $Q_1 = \\varepsilon + L\\theta$ from the hot side, gives $Q_2 = \\varepsilon$ to the cold side and does work $L\\theta$: an efficiency $L\\theta/(\\varepsilon + L\\theta)$.

Increase the load until the rates balance: $(\\varepsilon + L\\theta)/T_1 = \\varepsilon/T_2$, that is $Q_1/T_1 = Q_2/T_2$ — exactly Carnot's condition — and the efficiency becomes $1 - T_2/T_1$. At that point the device is reversible: add a feather and it runs backwards; lighten it and it lifts. Make the ratchet side the hotter one and, with no load, the wheel turns the *wrong* way.

| Temperatures | Load | What the wheel does |
|---|---|---|
| $T_1 = T_2$ | none | jiggles, no net turning |
| $T_1 > T_2$ | light | turns forward, lifting the weight |
| $T_1 > T_2$ | $L\\theta = \\varepsilon(T_1 - T_2)/T_2$ | stalls: Carnot efficiency |
| $T_1 < T_2$ | none | turns backward |

### A second look, and real molecular ratchets
Feynman's accounting treats each step as an independent event. In 1996 Juan Parrondo and Pep Español pointed out that the axle itself, jiggling while it joins two boxes at different temperatures, leaks heat steadily from hot to cold, so a real ratchet-and-pawl falls short of Carnot even at the balance point. The main lesson is untouched: no work from a single temperature. Living cells are full of one-way molecular machines — motor proteins such as kinesin step along filaments — but each step is paid for with chemical energy (about $20\\,k_BT$ from splitting an ATP molecule), not taken from heat.

> [!key] A one-way device cannot sort thermal kicks, because its own latch is thermally agitated too. At equal temperatures forward and backward steps balance; with a temperature difference it is at best a Carnot engine.

### What to look for in the simulation
Steps happen at the rates above. At equal temperatures the counter wanders but has no trend. Warm the vane box: the wheel creeps forward and the weight rises. Add load until it stalls and compare the efficiency with $1 - T_2/T_1$. Swap the temperatures and it runs backwards.
`,
  ideas: [
    'A ratchet in a gas at one temperature cannot turn steadily: its pawl is thermally agitated and lets the wheel slip back as often as the vanes push it forward.',
    'Forward steps occur at a rate ∝ e^(−(ε + Lθ)/kT₁), backward steps at a rate ∝ e^(−ε/kT₂).',
    'With T₁ > T₂ the device is a heat engine: it takes ε + Lθ from the hot side, gives ε to the cold side and lifts the weight by Lθ per step.',
    'At the balance point (ε + Lθ)/T₁ = ε/T₂ it is reversible, with Carnot efficiency 1 − T₂/T₁.',
    'Such devices only move at molecular scale; real molecular motors are driven by chemical energy, not by heat alone.'
  ],
  pitfalls: [
    'The ratchet fails only because of friction — Even a perfect, frictionless ratchet fails: the pawl\'s own thermal motion is the reason.',
    'At equal temperatures the wheel stays still — It jiggles forwards and backwards all the time; only its average progress is zero.',
    'A cleverer one-way valve or a tiny demon could still sort the molecules — Any device small enough to respond to single molecules is itself jiggled by them (or, for a demon, must pay to erase its memory).'
  ],
  formulas: [
    {
      name: 'Rate of forward steps',
      expr: 'Rf = f0*exp(-(eps + W)/(kB*T1))', tex: 'R_f = f_0\\, e^{-(\\varepsilon + W)/k_B T_1}',
      vars: {
        Rf: { name: 'forward steps per second', q: 'rate', unit: '1/s', tex: 'R_f' },
        f0: { name: 'attempt rate (kicks per second)', q: 'rate', unit: '1/s', value: 1e10, tex: 'f_0' },
        eps: { name: 'energy to lift the pawl over a tooth', q: 'energy', unit: 'eV', value: 0.1, tex: '\\varepsilon' },
        W: { name: 'work to lift the weight by one tooth, Lθ', q: 'energy', unit: 'eV', value: 0.02 },
        kB: { const: 'kB' },
        T1: { name: 'temperature of the vane box', q: 'temperature', unit: 'K', value: 400 }
      },
      note: 'The vanes must gather ε + Lθ in one fluctuation (Feynman\'s estimate).',
      stories: { Rf: 'Kicks arrive at {f0}; a forward step needs {eps} plus {W} from a gas at {T1}. How many forward steps per second?' }
    },
    {
      name: 'Rate of backward steps',
      expr: 'Rb = f0*exp(-eps/(kB*T2))', tex: 'R_b = f_0\\, e^{-\\varepsilon/k_B T_2}',
      vars: {
        Rb: { name: 'backward steps per second', q: 'rate', unit: '1/s', tex: 'R_b' },
        f0: { name: 'attempt rate', q: 'rate', unit: '1/s', value: 1e10, tex: 'f_0' },
        eps: { name: 'energy to lift the pawl', q: 'energy', unit: 'eV', value: 0.1, tex: '\\varepsilon' },
        kB: { const: 'kB' },
        T2: { name: 'temperature of the ratchet box', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'The pawl is lifted by its own thermal agitation; the wheel then slips back one tooth.',
      stories: { Rb: 'A pawl needing {eps} to lift sits in a gas at {T2}, with attempts at {f0}. How often does the wheel slip back?' }
    },
    {
      name: 'The load that stalls the wheel',
      expr: 'W = eps*(T1 - T2)/T2', tex: 'W = \\varepsilon\\,\\dfrac{T_1 - T_2}{T_2}',
      vars: {
        W: { name: 'work per tooth at the balance point, Lθ', q: 'energy', unit: 'eV', signed: true },
        eps: { name: 'energy to lift the pawl', q: 'energy', unit: 'eV', value: 0.1, tex: '\\varepsilon' },
        T1: { name: 'temperature of the vane box', q: 'temperature', unit: 'K', value: 400 },
        T2: { name: 'temperature of the ratchet box', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'From (ε + W)/T₁ = ε/T₂. A heavier load makes the wheel run backwards.',
      stories: { W: 'A ratchet with pawl energy {eps} has its vanes at {T1} and its pawl at {T2}. What work per tooth stalls it?' }
    },
    {
      name: 'Efficiency of the ratchet engine',
      expr: 'eta = W/(eps + W)', tex: '\\eta = \\dfrac{W}{\\varepsilon + W}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        W: { name: 'work per tooth, Lθ', q: 'energy', unit: 'eV', value: 0.02 },
        eps: { name: 'energy to lift the pawl', q: 'energy', unit: 'eV', value: 0.1, tex: '\\varepsilon' }
      },
      note: 'Work Lθ out for heat ε + Lθ in, per net forward step. At the stall load it equals 1 − T₂/T₁.',
      stories: { eta: 'Each tooth lifts the weight by {W} and the pawl needs {eps}. What is the efficiency?' }
    }
  ],
  examples: [
    {
      title: 'One temperature: no progress',
      q: 'Both boxes are at 300 K, the pawl needs 0.1 eV, and there is no load. Compare the forward and backward rates.',
      steps: [
        'Forward: $f_0e^{-0.1/0.02585} = f_0e^{-3.87}$. Backward: $f_0e^{-0.1/0.02585}$ — the same.',
        'The wheel steps forwards and backwards equally often: it jiggles without turning.'
      ],
      a: 'Equal rates, zero net rotation — the second law survives.'
    },
    {
      title: 'A warm vane box',
      q: 'Vanes at 400 K, ratchet at 300 K, ε = 0.1 eV, load 0.02 eV per tooth. Does the wheel turn forward? What is its efficiency, and what load would stall it?',
      steps: [
        'Forward: $e^{-0.12/0.03447} = e^{-3.48} = 0.0308$; backward: $e^{-0.1/0.02585} = e^{-3.87} = 0.0209$. Forward wins by a factor 1.47.',
        'Efficiency: $0.02/(0.1 + 0.02) = 16.7$ %.',
        'Stall: $W = 0.1 \\times 100/300 = 0.0333$ eV, where the efficiency is $0.0333/0.1333 = 25$ % $= 1 - 300/400$.'
      ],
      a: 'It turns forward at 16.7 % efficiency; at the stall load of 0.033 eV the efficiency reaches the Carnot 25 %.'
    },
    {
      title: 'Why a real ratchet never moves by itself',
      q: 'A small mechanical ratchet has a pawl spring storing 1 µJ. At 300 K, how big a fluctuation, in units of kT, is needed to lift it?',
      steps: [
        '$k_BT = 1.381\\times10^{-23}\\times300 = 4.14\\times10^{-21}$ J.',
        '$\\varepsilon/k_BT = 10^{-6}/4.14\\times10^{-21} = 2.4\\times10^{14}$.',
        'The chance per attempt is $e^{-2.4\\times10^{14}}$ — zero for all purposes.'
      ],
      a: 'About 2.4 × 10¹⁴ kT: it never happens; only molecular-sized ratchets jiggle.'
    }
  ],
  quiz: [
    { q: 'Both boxes are at the same temperature and there is no load. The wheel…', choices: ['jiggles back and forth with no net rotation', 'turns steadily forward', 'turns steadily backward', 'stays perfectly still'], a: 0, why: 'Forward and backward rates are both f₀e^(−ε/kT): equal.' },
    { q: 'What spoils the apparent perpetual motion?', choices: ['the pawl is itself thermally agitated and sometimes lifts, letting the wheel slip back', 'friction in the axle', 'the vanes are too heavy', 'the gas runs out of energy'], a: 0, why: 'Even a frictionless ratchet fails: the pawl\'s own Boltzmann jiggling produces backward steps.' },
    { q: 'If the ratchet box is hotter than the vane box, with no load, the wheel turns backwards.', a: true, why: 'Backward rate e^(−ε/kT₂) then exceeds forward rate e^(−ε/kT₁).' },
    { q: 'At the load where the wheel just stalls, the efficiency of the device equals…', choices: ['the Carnot efficiency 1 − T₂/T₁', 'zero', '100 %', 'Lθ/kT'], a: 0, why: '(ε + Lθ)/T₁ = ε/T₂ means Q₁/T₁ = Q₂/T₂, the condition for a reversible engine.' },
    { q: 'The pawl needs 0.1 eV, the vanes are at 400 K and the ratchet at 300 K. What work per tooth (in eV) stalls the wheel?', answer: 0.0333, unit: 'eV', why: 'W = ε(T₁ − T₂)/T₂ = 0.1 × 100/300.' }
  ],
  problems: [
    { q: 'A ratchet\'s pawl needs 0.05 eV. The vanes are at 600 K and the ratchet at 300 K. What load (work per tooth) stalls it, and what is the efficiency there?', answer: 0.05, unit: 'eV', tol: 0.02, hint: 'W = ε(T₁ − T₂)/T₂.',
      steps: ['$W = 0.05 \\times 300/300 = 0.05$ eV.', 'Efficiency $0.05/(0.05 + 0.05) = 50$ % $= 1 - 300/600$.'] },
    { q: 'At 300 K, how many times more often is a pawl lifted over a 0.05 eV tooth than over a 0.10 eV tooth?', answer: 6.92, tol: 0.02, hint: 'Ratio of Boltzmann factors: e^(Δε/kT).',
      steps: ['$k_BT = 0.02585$ eV.', 'Ratio $= e^{0.05/0.02585} = e^{1.934} = 6.92$.'] }
  ],
  applications: [
    'Motor proteins (kinesin, myosin) and molecular pumps are ratchets driven by chemical energy — the second law allows them because they are not powered by heat at one temperature.',
    'Brownian ratchets are used in microfluidic devices to sort particles, always with an external energy source.',
    'The same reasoning disposes of Maxwell\'s demon: the sorter\'s own thermal motion, or the cost of erasing its memory, saves the second law (see [[computation-reversible]]).'
  ],
  history: 'James Clerk Maxwell imagined his sorting demon in 1867 and published it in 1871. Marian Smoluchowski argued in 1912 that trapdoors and ratchets meant to exploit molecular fluctuations are defeated by fluctuations of the device itself. Feynman\'s lecture on the ratchet and pawl, from his 1961–63 course, gave the detailed rate argument and turned the device into a heat engine; in 1996 J. M. R. Parrondo and P. Español showed in the American Journal of Physics that the heat leak through the coupling keeps a real one below Carnot efficiency.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 46 (Ratchet and pawl) — how a ratchet works, why it cannot turn at a single temperature, and the ratchet as an engine with its efficiency at the balance point.',
    'Vol. I, ch. 44 (The Laws of Thermodynamics) — the second law and the reversible engine that the ratchet is compared with.'
  ],
  sim: 'heat-ratchet'
},

/* ================================================================ PAST AND FUTURE */
{
  id: 'past-and-future', parent: 'thermo-arrow', title: 'The distinction of past and future', level: 2,
  short: 'Every microscopic law of motion runs equally well backwards, yet ink spreads and never gathers, and we remember the past, not the future. The arrow of time comes not from the laws but from the circumstances: the world started in a very ordered, very improbable state and is running down.',
  keywords: ['arrow of time', 'time reversal', 'irreversibility', 'reversibility', 'entropy', 'second law', 'Loschmidt', 'initial conditions', 'Boltzmann', 'past hypothesis', 'fluctuation', 'chaos'],
  prereq: ['entropy-and-order', 'diffusion-random-walk', 'symmetry-in-physical-law'],
  related: ['ratchet-and-pawl', 'laws-of-thermodynamics-feyn', 'probability-feyn', 'parity-violation', 'matter-antimatter', 'quantum-reality'],
  body: `
Film two billiard balls colliding and run the film backwards: nothing looks wrong. Film a drop of ink spreading in water, or a glass shattering on the floor, and run it backwards: everyone laughs. In the Messenger Lectures of 1964 Feynman devoted a whole lecture to this puzzle. If the laws of physics do not care which way time runs, where does the difference between past and future come from?

### Laws that run both ways
Newton's law $F = ma$ involves the acceleration, the [[?second-derivative]] of position. Replace $t$ by $-t$: every velocity changes sign, but accelerations — and so the law — do not. Reverse every velocity of every particle at some instant, and the whole system retraces its past exactly. The same holds for electromagnetism and, apart from a tiny effect found in some weak decays of particles, for quantum mechanics too. And that tiny exception has nothing to do with ink or glasses.

### Likely and unlikely beginnings
Feynman's answer, following Boltzmann, is that the one-way-ness lives not in the laws but in the **conditions**. Start with the ink in a small drop — an arrangement that can be made in comparatively few ways. Let every molecule move by laws that do not care about direction. Almost every way of going on leads to more spread-out states, for the simple reason that there are overwhelmingly more of them ([[entropy-and-order]]). The reversed film is perfectly lawful; but to make it happen you would have to set every molecule's velocity just so, aimed to bring them all together at one moment. Such a start is fantastically improbable, and nature never supplies it by accident.

How improbable depends on the number of molecules. The chance that $N$ molecules moving at random are all found in one half of their box is $(\\tfrac12)^N$ ([[?exponent]]):

| Molecules | Chance of all in one half | Looking a billion times a second, wait about |
|---|---|---|
| 10 | 1 in 1024 | a microsecond |
| 50 | 1 in $1.1\\times10^{15}$ | 13 days |
| 100 | 1 in $1.3\\times10^{30}$ | $4\\times10^{13}$ years |
| $10^{20}$ | 1 in $10^{3\\times10^{19}}$ | never |

A film of ten molecules can be run either way without anyone noticing. A film of a real drop cannot. Irreversibility is a matter of large numbers — a [[probability-feyn|probability]] so close to certainty that the difference never shows.

A computer makes the point sharper. Reverse the velocities of a spreading gas exactly and it gathers itself up again. Move one molecule by a hair before reversing, and after a few collisions the error has spread to every molecule and the gas never re-gathers. Special states are not only rare; they are fragile. (This emphasis on sensitivity is a modern one, added here to Feynman's argument.)

### Why was the past so ordered?
If disorder grows towards the future, the past must have been more ordered — and the further back, the more so. Could our ordered world be just a huge chance fluctuation out of disorder? Feynman argued not: a fluctuation would most likely produce only as much order as needed for what we have already seen, so every new place we looked at — a new region of sky, older rocks — should be a mess. Instead we keep finding more order. He concluded that to understand irreversibility we must add to the laws a statement about the universe itself: that it was once in a highly ordered state, and has been running down ever since. Modern cosmology agrees that the early universe was in a remarkably low-entropy state (smooth, which for gravity, which makes matter clump, is very orderly) — though why it began that way is still an open question.

> [!key] The laws are reversible; the world is not, because it began in an improbable, ordered state and ordered states give way to disordered ones — not by law, but by overwhelming odds.

### What to look for in the simulation
Molecules start packed in the left quarter of a box and spread. Press *Reverse every velocity*: they retrace their paths and gather again — the laws run perfectly backwards. Tick *Nudge one molecule* and reverse again after a while: now they never return. Try *Mystery clip*: guess whether a short film runs forwards or backwards. Early clips are easy; once the gas is spread, you cannot tell. With 20 molecules, watch for the rare moments when many happen to be on the left.
`,
  ideas: [
    'The fundamental laws of motion (apart from a tiny weak-interaction effect) are unchanged if time runs backwards.',
    'Irreversibility comes from the conditions, not the laws: ordered starting states evolve into the far more numerous disordered ones.',
    'The chance of spontaneous re-ordering falls like (½)^N — likely for 10 molecules, impossible for 10²⁰.',
    'Reversing a spreading gas works only with perfect precision; a tiny error grows and destroys the return.',
    'The arrow of time therefore needs an extra assumption: the universe began in a very ordered, low-entropy state.'
  ],
  pitfalls: [
    'Friction and dissipation show the laws themselves are irreversible — Friction is the sharing of ordered motion among many atoms; each atom still obeys reversible laws.',
    'The second law is an absolute law like conservation of energy — It is statistical: violations are possible but, for large systems, absurdly improbable; with a few molecules they happen all the time.',
    'The tiny time asymmetry in weak interactions explains why ink spreads — It is far too small and too rare to matter; the arrow of time is statistical.'
  ],
  formulas: [
    {
      name: 'Chance that N molecules are all in one half',
      expr: 'P = 0.5^N', tex: 'P = \\left(\\tfrac12\\right)^N',
      vars: {
        P: { name: 'probability at a given instant' },
        N: { name: 'number of molecules', int: true, value: 20 }
      },
      note: 'Each molecule independently in either half.',
      stories: { P: 'What is the chance that all {N} molecules in a box are in its left half at a given instant?', N: 'For how many molecules is the chance of finding them all in one half {P}?' }
    },
    {
      name: 'Waiting time for such a fluctuation',
      expr: 't = 2^N/f', tex: 't = \\dfrac{2^N}{f}',
      vars: {
        t: { name: 'typical waiting time', q: 'time', unit: 'yr' },
        N: { name: 'number of molecules', int: true, value: 80 },
        f: { name: 'number of independent looks per second', q: 'rate', unit: '1/s', value: 1e9 }
      },
      note: 'Taking the arrangement to be reshuffled f times a second (roughly the collision rate).',
      stories: { t: '{N} molecules are reshuffled {f}. How long must we typically wait to find them all in one half?', N: 'How many molecules would make the typical wait {t} at {f}?' }
    },
    {
      name: 'Chance of a fluctuation that lowers the entropy',
      expr: 'P = exp(-dS/kB)', tex: 'P = e^{-\\Delta S/k_B}',
      vars: {
        P: { name: 'relative probability of the lower-entropy state' },
        dS: { name: 'decrease of entropy', q: 'entropy', unit: 'k_B', value: 50, tex: '\\Delta S' },
        kB: { const: 'kB' }
      },
      note: 'From S = k ln W: a state with entropy lower by ΔS has e^(ΔS/k) times fewer arrangements. The unit k_B shows ΔS/k directly.',
      stories: { P: 'How likely is a fluctuation that lowers the entropy of a system by {dS}?', dS: 'A fluctuation happens with relative probability {P}. By how much does it lower the entropy?' }
    },
    {
      name: 'Entropy made by heat flowing downhill',
      expr: 'dS = Q*(1/T2 - 1/T1)', tex: '\\Delta S = Q\\left(\\dfrac{1}{T_2} - \\dfrac{1}{T_1}\\right)',
      vars: {
        dS: { name: 'total entropy produced', q: 'entropy', unit: 'J/K', signed: true, tex: '\\Delta S' },
        Q: { name: 'heat that flows', q: 'energy', unit: 'J', value: 1 },
        T2: { name: 'temperature of the colder body', q: 'temperature', unit: 'K', value: 300 },
        T1: { name: 'temperature of the warmer body', q: 'temperature', unit: 'K', value: 301 }
      },
      note: 'Positive whenever heat flows from hot to cold; the reverse flow would need an entropy decrease of the same size.',
      stories: { dS: '{Q} of heat flows from a body at {T1} to one at {T2}. How much entropy is produced?' }
    }
  ],
  examples: [
    {
      title: 'A film of ten molecules',
      q: 'Ten molecules bounce in a box. How often does a snapshot find them all in the left half?',
      steps: [
        '$P = (\\tfrac12)^{10} = 1/1024$.',
        'About once in a thousand snapshots the "unmixed" state appears by itself; a film that shows ten molecules gathering is not absurd.'
      ],
      a: 'About once in a thousand frames — with ten molecules you cannot tell the direction of the film.'
    },
    {
      title: 'Waiting for the air to leave',
      q: 'Suppose 100 molecules are reshuffled $10^9$ times a second. How long before they are all in one half? Compare with the age of the universe, $1.4\\times10^{10}$ years.',
      steps: [
        '$2^{100} = 1.27\\times10^{30}$ looks.',
        '$t = 1.27\\times10^{30}/10^9 = 1.27\\times10^{21}$ s $= 4.0\\times10^{13}$ years.',
        'That is 3000 times the age of the universe — for just 100 molecules.'
      ],
      a: 'About 4 × 10¹³ years; for a real gas, never.'
    },
    {
      title: 'Coffee does not warm up in a cool room',
      q: '1 J of heat flows from coffee at 301 K to a room at 300 K. How much entropy is produced, in units of $k_B$, and how likely is the reverse?',
      steps: [
        '$\\Delta S = 1 \\times (1/300 - 1/301) = 1.11\\times10^{-5}$ J/K.',
        'In units of $k_B$: $1.11\\times10^{-5}/1.381\\times10^{-23} = 8.0\\times10^{17}$.',
        'The reverse flow has relative probability $e^{-8\\times10^{17}}$.'
      ],
      a: 'About 8 × 10¹⁷ k — so the reverse has odds of e^(−8 × 10¹⁷): never.'
    }
  ],
  quiz: [
    { q: 'At some instant the velocity of every molecule in a spread-out drop of ink is exactly reversed. According to the laws of motion, the ink…', choices: ['gathers back into a drop, retracing its history', 'keeps spreading', 'stops moving', 'spreads twice as fast'], a: 0, why: 'The laws are time-reversible; reversed velocities retrace the past. Only the extreme precision required makes it impossible in practice.' },
    { q: 'Where does the difference between past and future come from, in the picture Feynman gave?', choices: ['from the ordered, improbable state the world started in, and the overwhelming number of disordered states', 'from a time-asymmetric term in Newton\'s laws', 'from friction, which is a basic force', 'from quantum uncertainty'], a: 0, why: 'The laws are symmetric; the conditions are not.' },
    { q: 'Newton\'s laws of motion contain a built-in direction of time.', a: false, why: 'They involve the second derivative of position, which is unchanged when t → −t.' },
    { q: 'You are shown a silent film of four molecules bouncing in a box. Can you tell whether it runs forwards or backwards?', choices: ['no — with so few molecules both directions look equally natural', 'yes, from the spreading', 'yes, because collisions lose energy', 'only if it is in colour'], a: 0, why: 'Few-particle motion is reversible and unremarkable either way; the arrow appears only with many particles and an ordered start.' },
    { q: 'What is the chance that 30 randomly moving molecules are all in the left half of their box at a given instant?', answer: 9.31e-10, why: '(½)³⁰ = 1/1 073 741 824 ≈ 9.3 × 10⁻¹⁰.' }
  ],
  problems: [
    { q: 'Sixty molecules are reshuffled 10⁹ times a second. Roughly how many years must you wait to find all of them in one half of their box?', answer: 36.5, unit: 'yr', tol: 0.03, hint: 't = 2^N/f.',
      steps: ['$2^{60} = 1.15\\times10^{18}$.', '$t = 1.15\\times10^{18}/10^9 = 1.15\\times10^9$ s $= 36.5$ years.'] },
    { q: 'What is the relative probability of a fluctuation that lowers a system\'s entropy by 10 k_B?', answer: 4.54e-5, tol: 0.02, hint: 'P = e^(−ΔS/k).',
      steps: ['$P = e^{-10} = 4.54\\times10^{-5}$.', 'For a decrease of $10^{20}\\,k_B$ — a speck of matter — the chance is $e^{-10^{20}}$.'] }
  ],
  applications: [
    'Every record — a footprint, a photograph, a memory — is an ordered trace that points to the past because the past had lower entropy.',
    'Spin-echo experiments in magnetic resonance reverse the dephasing of nuclear spins and see a signal return, a real "time reversal" of an apparently irreversible process.',
    'Understanding why the early universe had such low entropy is an open problem in cosmology.'
  ],
  history: 'Ludwig Boltzmann\'s H-theorem (1872) seemed to derive irreversibility from mechanics. Josef Loschmidt objected in 1876 that reversed motions are equally lawful, and Ernst Zermelo in 1896, using Henri Poincaré\'s recurrence theorem of 1890, that a closed system must eventually return near its start; Boltzmann answered that the second law is statistical. Arthur Eddington coined the phrase "arrow of time" in his Gifford Lectures of 1927 (published in 1928). Feynman\'s Messenger Lecture on the distinction of past and future was given at Cornell in November 1964 and filmed by the BBC.',
  sources: [
    '*The Character of Physical Law*, lecture 5 (The Distinction of Past and Future) — reversible laws and irreversible happenings, why ordered states run down, and the assumption that the universe was more ordered in the past.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 46 (Ratchet and pawl) — reversibility in mechanics, irreversibility, and order and entropy.'
  ],
  sim: 'heat-film'
}

);
