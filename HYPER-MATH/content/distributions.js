/* HYPER-MATH · content/distributions.js — the shapes chance takes: binomial, Poisson,
 * normal and exponential distributions, and the central limit theorem. */
Hyper.add(

{
  id: 'binomial-distribution', parent: 'distributions', title: 'The binomial distribution', level: 2,
  short: 'The number of successes in a fixed number of independent yes/no trials that all have the same probability of success.',
  keywords: ['binomial', 'binomial distribution', 'Bernoulli trial', 'successes', 'trials', 'n choose k', 'coin tosses', 'Galton board', 'quality control', 'np', 'sampling'],
  prereq: ['combinatorics', 'conditional-probability', 'random-variables'],
  related: ['poisson-distribution', 'normal-distribution', 'binomial-theorem', 'central-limit-theorem'],
  body: `
Toss a coin ten times and count the heads; test twenty components and count the faulty ones; fire a hundred photons at a detector that catches each with probability 0.3 and count the clicks. Each is a string of $n$ independent yes/no **trials** with the same probability of success $p$, and the number of successes $X$ follows the **binomial distribution**.

### The formula
Any particular sequence with $k$ successes and $n - k$ failures — say S S F S F … — has probability $p^k(1 - p)^{n-k}$, because independent probabilities multiply. There are $\\binom{n}{k}$ such sequences, one for each choice of which trials succeed ([[combinatorics|combinations]]). So

$$P(X = k) = \\binom{n}{k}\\,p^k\\,(1 - p)^{n-k}, \\qquad k = 0, 1, \\dots, n$$

Ten tosses of a fair coin give exactly five heads with probability $\\binom{10}{5}/2^{10} = 252/1024 = 0.246$ — the most likely single result, yet it happens less than a quarter of the time. The probabilities add up to 1 by the [[binomial-theorem|binomial theorem]], $\\bigl(p + (1 - p)\\bigr)^n = 1$, which is where the distribution gets its name.

### Mean and spread
Each trial contributes $p$ to the mean and $p(1 - p)$ to the variance, and for independent trials both simply add ([[expected-value|expected value and variance]]):

$$\\mu = np, \\qquad \\sigma = \\sqrt{np(1 - p)}$$

In 100 tosses expect $50 \\pm 5$ heads; in 10 000 tosses, $5000 \\pm 50$. The spread of the count grows like $\\sqrt{n}$, but as a fraction of $n$ it shrinks like $1/\\sqrt{n}$ — the law of large numbers in numbers.

### Its shape, and two famous limits
For $p = 1/2$ the distribution is symmetric; for small $p$ it piles up near zero with a tail to the right. As $n$ grows it becomes bell-shaped around $np$, and the [[normal-distribution|normal distribution]] with the same mean and standard deviation is an excellent approximation once $np(1 - p)$ is about 10 or more. If instead $n$ is large and $p$ small with $np$ moderate, it turns into the [[poisson-distribution|Poisson distribution]]. The Galton board in the simulation shows the first limit happening in front of you: every ball makes $n$ left-or-right choices, and the bins fill up binomially.

### In physics and engineering
Take $N$ radioactive nuclei and wait one half-life. Each decays independently with probability $\\tfrac12$, so the number that decayed is binomial, with mean $N/2$ and spread $\\sqrt{N}/2$. For ten nuclei the chance that exactly five decay is only 25 %: "half of them decay in one half-life" is a statement about averages, sharp only for enormous $N$ ([[physics:half-life|half-life]]). Photon counting with an imperfect detector, the number of spins pointing up in a paramagnet and the number of defective items in a sample are all binomial counts.
`,
  ideas: [
    'The binomial distribution counts successes in $n$ independent trials, each with the same probability $p$.',
    '$P(X = k) = \\binom{n}{k}p^k(1-p)^{n-k}$: the probability of one sequence times the number of such sequences.',
    'Mean $np$ and standard deviation $\\sqrt{np(1-p)}$.',
    'For large $n$ it looks normal; for large $n$ with small $p$ it becomes Poisson.'
  ],
  pitfalls: [
    'Any count of successes is binomial — The trials must be independent with a constant $p$. Aces in a hand dealt from one pack are not binomial: each card dealt changes the chances for the next.',
    'The most likely outcome is likely — Exactly 50 heads in 100 tosses has probability only 0.08. When there are many possible values, even the peak holds little probability.',
    'Forgetting the $\\binom{n}{k}$ — $p^k(1 - p)^{n-k}$ is the probability of one particular sequence. Two heads in four tosses has probability $6 \\times (1/2)^4 = 3/8$, not $1/16$.'
  ],
  formulas: [
    {
      name: 'Probability of exactly k successes',
      expr: 'P = nCr(n, k)*p^k*(1 - p)^(n - k)', tex: 'P(X = k) = \\binom{n}{k}\\, p^k (1 - p)^{n-k}',
      vars: {
        P: { name: 'probability of exactly k successes', min: 0, max: 1 },
        n: { name: 'number of trials', int: true, min: 1, value: 20 },
        k: { name: 'number of successes', int: true, min: 0, value: 2 },
        p: { name: 'probability of success in one trial', value: 0.05, min: 0, max: 1 }
      },
      note: 'Solving for $p$ usually finds two values, one each side of $k/n$ — both give the same probability.',
      practice: { unknowns: ['P', 'p'] },
      stories: {
        P: 'Each item from a production line is faulty with probability {p}, independently. In a box of {n}, what is the probability that the number of faulty items is exactly {k}?',
        p: 'In {n} independent trials, the number of successes is exactly {k} with probability {P}. What could the success probability of a single trial be?'
      }
    },
    {
      name: 'Mean number of successes',
      expr: 'mu = n*p', tex: '\\mu = np',
      vars: {
        mu: { name: 'mean number of successes' },
        n: { name: 'number of trials', int: true, min: 1, value: 20 },
        p: { name: 'probability of success in one trial', value: 0.05, min: 0, max: 1 }
      },
      practice: { unknowns: ['mu', 'p'] },
      stories: { mu: 'A basketball player scores a free throw with probability {p}. How many does she score, on average, in {n} attempts?' }
    },
    {
      name: 'Standard deviation of the number of successes',
      expr: 'sigma = sqrt(n*p*(1 - p))', tex: '\\sigma = \\sqrt{np(1 - p)}',
      vars: {
        sigma: { name: 'standard deviation of the number of successes' },
        n: { name: 'number of trials', int: true, min: 1, value: 100 },
        p: { name: 'probability of success in one trial', value: 0.5, min: 0, max: 1 }
      },
      note: 'Largest for $p = 1/2$. Solving for $p$ gives a pair, $p$ and $1 - p$.',
      practice: { unknowns: ['sigma'] },
      stories: { sigma: 'A fair process succeeds with probability {p} per trial. By how much does the number of successes in {n} trials typically vary (one standard deviation)?' }
    }
  ],
  examples: [
    {
      title: 'Ten tosses',
      q: 'A fair coin is tossed 10 times. Find the probability of (a) exactly 5 heads, (b) at least 8 heads.',
      steps: [
        'All $2^{10} = 1024$ sequences are equally likely, and $\\binom{10}{k}$ of them have $k$ heads.',
        '(a) $P(5) = \\binom{10}{5}/1024 = 252/1024 = 0.246$.',
        '(b) $P(\\ge 8) = \\bigl[\\binom{10}{8} + \\binom{10}{9} + \\binom{10}{10}\\bigr]/1024 = (45 + 10 + 1)/1024 = 0.0547$.'
      ],
      a: '(a) 0.246, (b) 0.055'
    },
    {
      title: 'Faulty components',
      q: 'Components are faulty with probability 0.05, independently. In a box of 20, find the probability of 0, 1, 2 and more than 2 faulty ones.',
      steps: [
        '$P(0) = 0.95^{20} = 0.358$.',
        '$P(1) = 20 \\times 0.05 \\times 0.95^{19} = 0.377$.',
        '$P(2) = \\binom{20}{2}\\,0.05^2 \\times 0.95^{18} = 190 \\times 0.0025 \\times 0.397 = 0.189$.',
        '$P(> 2) = 1 - (0.358 + 0.377 + 0.189) = 0.075$.',
        'The mean is $np = 1$ and the standard deviation $\\sqrt{20 \\times 0.05 \\times 0.95} = 0.97$.'
      ],
      a: '0.358, 0.377, 0.189 and 0.075'
    }
  ],
  quiz: [
    { q: 'Which of these counts is NOT binomial?', choices: ['the number of heads in 20 tosses', 'the number of sixes in 10 rolls', 'the number of aces in 5 cards dealt from one pack', 'the number of faulty bulbs in a sample of 50 from a huge batch'], a: 2,
      why: 'Cards dealt from one pack are not independent: once an ace is gone, the next card is less likely to be one. (A sample from a huge batch is very nearly independent.)' },
    { q: 'For $n = 100$ and $p = 0.5$, the standard deviation of the number of successes is…', choices: ['50', '25', '5', '0.5'], a: 2,
      why: '$\\sigma = \\sqrt{100 \\times 0.5 \\times 0.5} = \\sqrt{25} = 5$. (25 is the variance.)' },
    { q: 'A fair coin is tossed 4 times. What is the probability of exactly 2 heads?', choices: ['1/2', '3/8', '1/4', '1/16'], a: 1,
      why: '$\\binom{4}{2} = 6$ of the 16 sequences have two heads: $6/16 = 3/8$. Forgetting the binomial coefficient gives 1/16.' },
    { q: 'In 10 tosses of a fair coin, getting exactly 5 heads is more likely than not.', a: false,
      why: 'It is the single most likely number, but its probability is only 0.246.' },
    { q: 'Write the probability of no successes at all in $n$ trials with success probability $p$.', answer: '(1-p)^n', vars: ['n', 'p'],
      why: 'All $n$ trials must fail, each with probability $1 - p$, independently: $(1 - p)^n$ (the $k = 0$ term, with $\\binom{n}{0} = 1$).' }
  ],
  problems: [
    { q: 'A test has 10 multiple-choice questions with 4 options each. Guessing every answer at random, what is the probability of getting at least 7 right?', answer: 0.003506, tol: 0.02,
      steps: ['$n = 10$, $p = 0.25$.', '$P(7) = 120 \\times 0.25^7 \\times 0.75^3 = 0.00309$, $P(8) = 45 \\times 0.25^8 \\times 0.75^2 = 0.00039$, $P(9) = 0.00003$, $P(10) \\approx 0.000001$.', 'Sum: $P(\\ge 7) \\approx 0.0035$ — about 1 in 285.'] },
    { q: 'A basketball player scores 80 % of her free throws, independently. What is the probability that she scores all of her next 10?', answer: 0.1074, tol: 0.01,
      steps: ['All ten must go in: $P(10) = \\binom{10}{10}\\,0.8^{10} = 0.107$.', 'So even a good shooter misses at least one of ten about 89 % of the time.'] }
  ],
  applications: [
    'Quality control: accepting or rejecting a batch from the number of faulty items in a sample.',
    'Polls and clinical trials, where each respondent or patient is a yes/no trial.',
    'Counting photons or particles with a detector of known efficiency.',
    'Reliability of k-out-of-n systems, such as an aircraft that can fly on any two of its three hydraulic circuits.'
  ],
  history: 'Jacob Bernoulli analysed repeated independent trials in his Ars Conjectandi, published in 1713 after his death, and proved there the first law of large numbers. In 1733 Abraham de Moivre showed that for many trials the binomial probabilities follow a bell-shaped curve — the first appearance of the normal distribution.',
  sim: 'ps-galton'
},

{
  id: 'poisson-distribution', parent: 'distributions', title: 'The Poisson distribution', level: 2,
  short: 'The number of random, independent events in a fixed interval — clicks of a Geiger counter, calls per minute — when only their average rate is known.',
  keywords: ['Poisson', 'Poisson distribution', 'Poisson process', 'rate', 'rare events', 'counts', 'counting statistics', 'Geiger counter', 'radioactive decay', 'shot noise', 'square-root rule', 'lambda'],
  prereq: ['binomial-distribution', 'number-e'],
  related: ['exponential-distribution', 'normal-distribution', 'physics:activity', 'physics:radioactive-decay'],
  body: `
A Geiger counter near a weak source clicks on average twice a second — but never exactly twice: some seconds bring none, some bring five. The clicks come from nuclei that decay independently and at random, at a steady average rate. Counting events like that in a fixed interval — decays, photons, raindrops on a paving stone, calls to a help desk, misprints on a page — gives the **Poisson distribution**.

### The formula
If events occur independently at an average rate $r$, the number $K$ in an interval of length $t$ has mean $\\lambda = rt$, and

$$P(K = k) = \\frac{\\lambda^k\\,e^{-\\lambda}}{k!}, \\qquad k = 0, 1, 2, \\dots$$

For $\\lambda = 2$: $P(0) = e^{-2} = 0.135$, $P(1) = P(2) = 0.271$, $P(3) = 0.180$, $P(4) = 0.090$. A single number, the mean, fixes the whole distribution.

### Where it comes from
Cut the interval into $n$ tiny slices, each so short that it holds an event with a small probability $p = \\lambda/n$ and never two. The count is then [[binomial-distribution|binomial]], and letting $n \\to \\infty$ with $np = \\lambda$ fixed turns the binomial formula into the Poisson one (see the derivation). The same limit tells you when to use it: many opportunities, each unlikely. A rule of thumb for replacing a binomial by a Poisson is $n \\ge 20$ and $p \\le 0.05$.

### Mean equals variance: the square-root rule
A Poisson count has **variance equal to its mean**, $\\sigma^2 = \\lambda$, so $\\sigma = \\sqrt{\\lambda}$. A count of $N$ events therefore carries a natural uncertainty of about $\\sqrt{N}$ — a relative uncertainty of $1/\\sqrt{N}$:

| counts $N$ | uncertainty $\\sqrt{N}$ | relative |
|---|---|---|
| 100 | 10 | 10 % |
| 10 000 | 100 | 1 % |
| 1 000 000 | 1000 | 0.1 % |

To halve the uncertainty of a radioactivity measurement you must count four times as long. The same $\\sqrt{N}$ appears as **shot noise** in electric currents and camera images: a pixel that caught 10 000 photons is noisy at the 1 % level however perfect the electronics.

### Gaps and sums
The waiting time between successive events of such a process follows the [[exponential-distribution|exponential distribution]] — the simulation shows both at once. Independent Poisson counts add up to a Poisson count, so background plus source simply adds the rates. For large $\\lambda$ the distribution becomes bell-shaped, close to a [[normal-distribution|normal distribution]] with mean $\\lambda$ and standard deviation $\\sqrt{\\lambda}$.

> [!note] Radioactive decay is the textbook Poisson process: the number of decays in a fixed time from a long-lived source is Poisson with $\\lambda = At$, where $A$ is the source's [[physics:activity|activity]]. In 1910 Rutherford and Geiger counted alpha particles in intervals of 7.5 s and found exactly this distribution.
`,
  ideas: [
    'The Poisson distribution counts independent random events in a fixed interval, at a steady average rate.',
    '$P(k) = \\lambda^k e^{-\\lambda}/k!$, where $\\lambda = rt$ is the expected count — one number fixes everything.',
    'Mean and variance are both $\\lambda$, so a count of $N$ is uncertain by about $\\sqrt{N}$.',
    'It is the limit of the binomial for very many trials, each with a small chance.',
    'The gaps between the events are exponentially distributed.'
  ],
  pitfalls: [
    'The average count is the one that usually happens — For $\\lambda = 2$, exactly 2 events occur only 27 % of the time, and exactly 1 is just as likely.',
    'Random events should be evenly spaced — Independence produces clumps and gaps. With 3 events a minute on average, a minute with none still happens 5 % of the time.',
    'Using Poisson when events are not independent — Customers who arrive in groups, or aftershocks triggered by an earthquake, cluster more than Poisson allows, and the variance exceeds the mean.'
  ],
  derivation: {
    title: 'The Poisson formula as a limit of the binomial',
    steps: [
      { text: 'Split the interval into $n$ slices, each holding an event with probability $p = \\lambda/n$:', tex: 'P(k) = \\binom{n}{k}\\left(\\frac{\\lambda}{n}\\right)^k\\left(1 - \\frac{\\lambda}{n}\\right)^{n-k}' },
      { text: 'Sort the factors:', tex: 'P(k) = \\frac{\\lambda^k}{k!}\\cdot\\frac{n(n-1)\\cdots(n-k+1)}{n^k}\\cdot\\left(1 - \\frac{\\lambda}{n}\\right)^{n}\\cdot\\left(1 - \\frac{\\lambda}{n}\\right)^{-k}' },
      { text: 'Let $n \\to \\infty$ with $k$ fixed. The second and fourth factors tend to 1, and the third to $e^{-\\lambda}$ (the limit that defines [[number-e|the number e]]):', tex: '\\lim_{n \\to \\infty}\\left(1 - \\frac{\\lambda}{n}\\right)^{n} = e^{-\\lambda}' },
      { text: 'What remains is the Poisson distribution:', tex: 'P(k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}' }
    ]
  },
  formulas: [
    {
      name: 'Poisson probability of exactly k events',
      expr: 'P = lambda^k*exp(-lambda)/fact(k)', tex: 'P(k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}',
      vars: {
        P: { name: 'probability of exactly k events', min: 0, max: 1 },
        lambda: { name: 'expected number of events in the interval', value: 2 },
        k: { name: 'number of events', int: true, min: 0, value: 3 }
      },
      note: 'Solving for $\\lambda$ generally gives two expected counts with the same probability, one each side of $k$.',
      practice: { unknowns: ['P', 'lambda'] },
      stories: {
        P: 'Background radiation gives on average {lambda} counts per interval. What is the probability of exactly {k} counts in one interval?',
        lambda: 'The probability of exactly {k} random events in an interval is {P}. What average number of events per interval could give this?'
      }
    },
    {
      name: 'Expected count from a rate',
      expr: 'lambda = r*t', tex: '\\lambda = r\\,t',
      vars: {
        lambda: { name: 'expected number of events' },
        r: { name: 'average rate of events', q: 'decayconst', unit: '1/min', value: 4 },
        t: { name: 'length of the interval', q: 'time', unit: 'min', value: 0.5 }
      },
      stories: {
        lambda: 'Calls reach a help desk at an average rate of {r}. How many calls are expected in {t}?',
        t: 'Events occur at an average rate of {r}. How long an interval has an expected {lambda} events?'
      }
    },
    {
      name: 'Relative uncertainty of a count',
      expr: 'u = 1/sqrt(N)', tex: 'u = \\frac{1}{\\sqrt{N}}',
      vars: {
        u: { name: 'relative uncertainty of the count', q: 'ratio', unit: '%' },
        N: { name: 'number of events counted', value: 400 }
      },
      note: 'Follows from $\\sigma = \\sqrt{N}$ for a Poisson count: four times the counts, half the relative uncertainty.',
      stories: {
        u: 'A detector records {N} counts. What is the relative uncertainty of this number?',
        N: 'How many counts must be collected to reach a relative uncertainty of {u}?'
      }
    }
  ],
  examples: [
    {
      title: 'Background counts',
      q: 'A Geiger counter records background radiation at an average 0.5 counts per second. In a 4-second window, what is the probability of (a) no counts, (b) at least 3 counts?',
      steps: [
        'Expected count: $\\lambda = 0.5 \\times 4 = 2$.',
        '(a) $P(0) = e^{-2} = 0.135$.',
        '(b) $P(\\ge 3) = 1 - [P(0) + P(1) + P(2)] = 1 - e^{-2}(1 + 2 + 2) = 1 - 0.677 = 0.323$.'
      ],
      a: '(a) 0.135, (b) 0.323'
    },
    {
      title: 'Binomial or Poisson?',
      q: 'A plant runs 1000 independent components, each with a probability 0.002 of failing in a year. What is the probability that exactly 3 fail? Compare the binomial answer with the Poisson approximation.',
      steps: [
        'Binomial: $\\binom{1000}{3}(0.002)^3(0.998)^{997} = 166\\,167\\,000 \\times 8 \\times 10^{-9} \\times 0.1359 = 0.1806$.',
        'Poisson with $\\lambda = np = 2$: $\\dfrac{2^3 e^{-2}}{3!} = \\dfrac{8 \\times 0.1353}{6} = 0.1804$.',
        'They agree to three decimal places, and the Poisson form needs no huge binomial coefficients.'
      ],
      a: 'About 0.180 either way.'
    },
    {
      title: 'How long to count?',
      q: 'A weak sample gives about 25 counts per minute (background already subtracted). How long must you count to know the count rate to 2 %?',
      steps: [
        'A relative uncertainty of $1/\\sqrt{N} = 0.02$ needs $N = 1/0.02^2 = 2500$ counts.',
        'At 25 counts per minute that takes $2500/25 = 100$ minutes.'
      ],
      a: 'About 100 minutes (2500 counts).'
    }
  ],
  quiz: [
    { q: 'Counts from a steady source follow a Poisson distribution with mean 100 per minute. The typical scatter of the one-minute counts is about…', choices: ['1', '10', '50', '100'], a: 1,
      why: 'The standard deviation of a Poisson count is $\\sqrt{\\lambda} = \\sqrt{100} = 10$.' },
    { q: 'For a Poisson distribution, the mean and the variance are…', choices: ['equal', 'related by variance = mean²', 'unrelated', 'both equal to 1'], a: 0,
      why: 'Both equal $\\lambda$. Data whose variance is much larger than the mean are clustered, not Poisson.' },
    { q: 'Events arrive at random at 3 per hour. How many are expected in 20 minutes?', choices: ['3', '1', '60', '0.15'], a: 1,
      why: '$\\lambda = rt = 3\\ \\mathrm{h^{-1}} \\times \\tfrac13\\ \\mathrm{h} = 1$.' },
    { q: 'If the average is 2 events per interval, exactly 2 events happen in more than half of the intervals.', a: false,
      why: '$P(2) = 2^2 e^{-2}/2 = 0.27$. Exactly 1 event is just as likely, and 0, 3, 4… take the rest.' },
    { q: 'Events occur at random with an expected $m$ events per interval. Write the probability of no events in an interval.', answer: 'exp(-m)', vars: ['m'],
      why: 'Put $k = 0$ in $\\lambda^k e^{-\\lambda}/k!$: $m^0 = 1$ and $0! = 1$, leaving $e^{-m}$.' }
  ],
  problems: [
    { q: 'A call centre receives on average 4 calls per minute. What is the probability of exactly 6 calls in a given minute?', answer: 0.1042, tol: 0.01,
      steps: ['$\\lambda = 4$.', '$P(6) = \\dfrac{4^6 e^{-4}}{6!} = \\dfrac{4096 \\times 0.01832}{720} = 0.104$.'] },
    { q: 'A sample gives 400 counts in 10 minutes. What is the relative uncertainty of the measured count rate (as a fraction)?', answer: 0.05, tol: 0.01,
      steps: ['The count has uncertainty $\\sqrt{400} = 20$.', 'Relative: $20/400 = 0.05$, and dividing by the exact counting time does not change it: 5 %.'] }
  ],
  applications: [
    'Radioactivity measurements and the counting statistics of every particle detector.',
    'Shot noise in photodiodes, cameras and electric currents.',
    'Queues and traffic: calls, arrivals and requests to a web server, used to size staff and servers.',
    'Rare-event counts in biology and industry: mutations, defects per silicon wafer, accidents per year.'
  ],
  history: 'Siméon Denis Poisson derived the distribution in 1837, as a limit of the binomial, in a book on the probability of court verdicts. Ladislaus Bortkiewicz made it famous in 1898 by showing that the numbers of Prussian cavalry soldiers killed by horse kicks each year followed it closely.',
  sim: 'ps-poisson-process'
},

{
  id: 'normal-distribution', parent: 'distributions', title: 'The normal distribution', level: 2,
  short: 'The bell curve: the distribution of measurement errors and of sums of many small random effects, fixed by its mean and standard deviation.',
  keywords: ['normal distribution', 'Gaussian', 'bell curve', 'z-score', 'standard normal', '68-95-99.7', 'empirical rule', 'sigma', 'error function', 'erf', 'five sigma', 'percentile', 'tail probability'],
  prereq: ['random-variables', 'expected-value', 'exponential-functions'],
  related: ['central-limit-theorem', 'standard-deviation', 'error-propagation', 'physics:maxwell-boltzmann'],
  body: `
Measure the length of a table fifty times with a good tape and you will not get fifty identical readings. Plot them as a histogram and a shape appears that turns up everywhere — heights of people, errors of measurement, the positions of diffusing particles, the noise on a signal: a symmetric **bell curve**, peaked at the average, with tails that die away quickly on both sides. It is the **normal** or **Gaussian distribution**.

### The formula
A normal distribution is fixed by two numbers: its mean $\\mu$, where the peak is, and its standard deviation $\\sigma$, how wide it is.

$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}\\,\\exp\\!\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)$$

The curve turns from concave to convex at $\\mu \\pm \\sigma$, and its peak height $1/(\\sigma\\sqrt{2\\pi}) \\approx 0.4/\\sigma$ drops as it widens, keeping the total area equal to 1.

### z-scores and the standard normal
Every normal distribution is the same curve, shifted and stretched. Measure the distance from the mean in units of $\\sigma$,

$$z = \\frac{x - \\mu}{\\sigma}$$

and $z$ follows the **standard normal** distribution, with mean 0 and standard deviation 1. Its cumulative distribution $\\Phi(z) = P(Z < z)$ has no formula in elementary functions; it is written with the error function, $\\Phi(z) = \\tfrac12\\bigl[1 + \\operatorname{erf}(z/\\sqrt2)\\bigr]$, and tabulated or computed — as in the calculators below.

### The 68–95–99.7 rule

| within | probability | outside |
|---|---|---|
| $\\mu \\pm 1\\sigma$ | 68.3 % | about 1 in 3 |
| $\\mu \\pm 2\\sigma$ | 95.4 % | about 1 in 22 |
| $\\mu \\pm 3\\sigma$ | 99.73 % | about 1 in 370 |
| $\\mu \\pm 5\\sigma$ | 99.99994 % | about 1 in 1.7 million |

The tails fall off astonishingly fast. Adult men average about 175 cm with $\\sigma \\approx 7$ cm. A height of 190 cm is $z = 2.14$ and is reached by about 1.6 % of men; 210 cm is $z = 5$, about one man in 3.5 million (only the upper tail counts). Particle physicists announce a discovery only when a signal stands five sigma above the background, because a chance fluctuation that large happens less than once in a million tries.

### Why it is everywhere
Add up many small independent random effects and the total is normally distributed, almost whatever the pieces look like — the [[central-limit-theorem|central limit theorem]]. Measurement errors are sums of many small disturbances; so is the path of a diffusing molecule. Each velocity component of a gas molecule is normal, which is where the [[physics:maxwell-boltzmann|Maxwell–Boltzmann distribution]] of speeds comes from; a drop of dye spreading in still water forms a Gaussian whose width grows like $\\sqrt{t}$ ([[heat-equation|diffusion]]); and the ground state of the [[physics:quantum-harmonic-oscillator|quantum harmonic oscillator]] is a Gaussian too.
`,
  ideas: [
    'The normal distribution is the symmetric bell curve fixed by its mean $\\mu$ and standard deviation $\\sigma$.',
    'The z-score $z = (x - \\mu)/\\sigma$ measures the distance from the mean in standard deviations; it turns every normal into the standard normal.',
    'About 68 %, 95 % and 99.7 % of values lie within 1, 2 and 3 standard deviations of the mean.',
    'The tails shrink extremely fast: beyond $5\\sigma$ lies less than one value in a million.',
    'Sums of many independent effects are close to normal, which is why it is so common.'
  ],
  pitfalls: [
    'Everything is normally distributed — Incomes, earthquake sizes, waiting times and particle lifetimes are strongly skewed. Look at the data before using normal tail probabilities.',
    'The peak height is a probability — It is a density. A narrow normal curve (small $\\sigma$) has a peak far above 1.',
    'Rare means impossible — A $3\\sigma$ deviation happens once in about 370 tries; a factory making a million parts a day sees thousands of them daily.'
  ],
  formulas: [
    {
      name: 'z-score',
      expr: 'z = (x - mu)/sigma', tex: 'z = \\frac{x - \\mu}{\\sigma}',
      vars: {
        z: { name: 'z-score (standard deviations from the mean)', signed: true },
        x: { name: 'value', value: 190 },
        mu: { name: 'mean', value: 175 },
        sigma: { name: 'standard deviation', value: 7 }
      },
      note: 'Use any unit, the same for $x$, $\\mu$ and $\\sigma$. The starting values are heights in cm: 190 cm is 2.14 standard deviations above the mean.',
      practice: { unknowns: ['x'] },
      stories: {
        z: 'A normally distributed quantity has mean {mu} and standard deviation {sigma}. What is the z-score of the value {x}?',
        x: 'A normally distributed quantity has mean {mu} and standard deviation {sigma}. Which value has a z-score of {z}?'
      }
    },
    {
      name: 'Standard normal: probability below z',
      expr: 'Phi = 0.5*(1 + erf(z/sqrt(2)))', tex: '\\Phi(z) = \\tfrac12\\left[1 + \\operatorname{erf}\\left(\\frac{z}{\\sqrt2}\\right)\\right]',
      vars: {
        Phi: { name: 'probability of a value below z', min: 0, max: 1 },
        z: { name: 'z-score', signed: true, value: 1.96 }
      },
      note: 'The "table of the normal distribution" as a calculator. Solve for $z$ to find percentiles: $\\Phi = 0.95$ gives $z = 1.645$.',
      stories: {
        Phi: 'What fraction of a normal population lies below a z-score of {z}?',
        z: 'Which z-score has a fraction {Phi} of a normal population below it?'
      }
    },
    {
      name: 'Probability within k standard deviations',
      expr: 'P = erf(k/sqrt(2))', tex: 'P = \\operatorname{erf}\\left(\\frac{k}{\\sqrt2}\\right)',
      vars: {
        P: { name: 'probability of a value within k standard deviations of the mean', min: 0, max: 1 },
        k: { name: 'number of standard deviations', value: 2 }
      },
      note: '$k = 1, 2, 3$ give 0.683, 0.954 and 0.997; $k = 1.96$ gives exactly 0.95.',
      stories: {
        P: 'What fraction of a normal population lies within {k} standard deviations of the mean?',
        k: 'How many standard deviations either side of the mean enclose a fraction {P} of a normal population?'
      }
    },
    {
      name: 'Normal probability density',
      expr: 'f = exp(-(x - mu)^2/(2*sigma^2))/(sigma*sqrt(2*pi))', tex: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}\\,e^{-(x - \\mu)^2/2\\sigma^2}',
      vars: {
        f: { name: 'probability density at x' },
        x: { name: 'value', signed: true, value: 1.5 },
        mu: { name: 'mean', signed: true, value: 0 },
        sigma: { name: 'standard deviation', value: 1 }
      },
      note: 'A density, not a probability: probabilities are areas under $f$. Solving for $x$ gives the two points, symmetric about $\\mu$, where the curve has a given height.',
      practice: { unknowns: ['f'] }
    }
  ],
  examples: [
    {
      title: 'How rare is 190 cm?',
      q: 'Heights of adult men are roughly normal with mean 175 cm and standard deviation 7 cm. What fraction is taller than 190 cm?',
      steps: [
        '$z = \\dfrac{190 - 175}{7} = 2.14$.',
        '$\\Phi(2.14) = 0.984$, so $P(\\text{taller}) = 1 - 0.984 = 0.016$.',
        'About 1.6 % of men — one in 60.'
      ],
      a: 'About 1.6 %'
    },
    {
      title: 'A machining tolerance',
      q: 'Shafts are turned to a mean diameter of 20.00 mm with standard deviation 0.02 mm. The specification is 20.00 ± 0.05 mm. What fraction is rejected?',
      steps: [
        'The limits are $\\pm 0.05/0.02 = \\pm 2.5$ standard deviations from the mean.',
        'Within $\\pm 2.5\\sigma$: $\\operatorname{erf}(2.5/\\sqrt2) = 0.9876$.',
        'Rejected: $1 - 0.9876 = 0.0124$, about 124 shafts in 10 000.',
        'Halving $\\sigma$ to 0.01 mm would put the limits at $\\pm 5\\sigma$ — fewer than one reject in a million.'
      ],
      a: 'About 1.2 %'
    },
    {
      title: 'Setting a limit',
      q: 'Using the same heights (mean 175 cm, SD 7 cm), what height is exceeded by only 5 % of men?',
      steps: [
        'We need $\\Phi(z) = 0.95$, which gives $z = 1.645$.',
        '$x = \\mu + z\\sigma = 175 + 1.645 \\times 7 = 186.5\\ \\mathrm{cm}$.'
      ],
      a: 'About 186.5 cm'
    }
  ],
  quiz: [
    { q: 'About what fraction of a normal population lies within one standard deviation of the mean?', choices: ['50 %', '68 %', '95 %', '99.7 %'], a: 1,
      why: 'The 68–95–99.7 rule: 68.3 % within $\\pm 1\\sigma$.' },
    { q: 'Exam marks have mean 60 and standard deviation 10. A mark of 80 has z-score…', choices: ['0.2', '2', '20', '−2'], a: 1,
      why: '$z = (80 - 60)/10 = 2$: two standard deviations above the mean.' },
    { q: 'If $\\sigma$ doubles while $\\mu$ stays the same, the height of the peak of the density…', choices: ['doubles', 'halves', 'stays the same', 'quarters'], a: 1,
      why: 'The peak is $1/(\\sigma\\sqrt{2\\pi})$. A curve twice as wide must be half as tall to keep an area of 1.' },
    { q: 'In a normal distribution the mean, the median and the most likely value coincide.', a: true,
      why: 'The curve is symmetric about $\\mu$ and peaks there, so all three are $\\mu$.' },
    { q: 'Which is closest to the probability that a normal value lies more than $3\\sigma$ **above** the mean?', choices: ['0.3 %', '0.13 %', '3 %', '0.003 %'], a: 1,
      why: '0.27 % lies outside $\\pm 3\\sigma$, split equally between the two tails: 0.135 % above.' }
  ],
  problems: [
    { q: 'IQ scores are designed to be normal with mean 100 and standard deviation 15. What fraction of people score above 130?', answer: 0.02275, tol: 0.02,
      steps: ['$z = (130 - 100)/15 = 2$.', '$P(Z > 2) = 1 - \\Phi(2) = 1 - 0.9772 = 0.0228$.'] },
    { q: 'Resistors marked 1000 Ω have a normal spread with standard deviation 20 Ω. What fraction lies within ±30 Ω of the nominal value?', answer: 0.8664, tol: 0.01,
      steps: ['The limits are $\\pm 30/20 = \\pm 1.5\\sigma$.', '$P = \\operatorname{erf}(1.5/\\sqrt2) = 0.866$.'] }
  ],
  applications: [
    'Tolerances and quality control in manufacturing, including "six sigma" process targets.',
    'Error bars: a $\\pm 1\\sigma$ error bar covers the true value about 68 % of the time.',
    'Noise in sensors and electronic circuits, which is very often Gaussian.',
    'Diffusion, heat conduction and Brownian motion, whose spreading profiles are Gaussian.'
  ],
  history: 'Abraham de Moivre found the bell curve in 1733 as an approximation to the binomial distribution for many coin tosses. Carl Friedrich Gauss used it in 1809 to describe errors in astronomical observations and to justify the method of least squares, and Pierre-Simon Laplace linked it to sums of many small errors — the seed of the central limit theorem.',
  sim: 'ps-normal-area'
},

{
  id: 'exponential-distribution', parent: 'distributions', title: 'The exponential distribution', level: 2,
  short: 'The waiting time until the next random event when events happen independently at a constant rate — memoryless, and the continuous twin of the Poisson count.',
  keywords: ['exponential distribution', 'waiting time', 'lifetime', 'memoryless', 'rate', 'mean lifetime', 'half-life', 'median', 'failure rate', 'MTBF', 'mean time between failures', 'decay'],
  prereq: ['poisson-distribution', 'exponential-growth-decay', 'random-variables'],
  related: ['physics:half-life', 'physics:radioactive-decay', 'physics:mean-free-path', 'improper-integrals'],
  body: `
You stand next to a Geiger counter that clicks on average twice a second. How long until the next click? Not exactly half a second: sometimes the next click comes almost at once, sometimes you wait several seconds. For events that arrive independently at a steady average rate $\\lambda$ — a [[poisson-distribution|Poisson process]] — the waiting time $T$ has the **exponential distribution**.

### From "nothing yet" to the formula
Waiting longer than $t$ means that no event happened in the interval from 0 to $t$. The number of events in that interval is Poisson with mean $\\lambda t$, and the probability of none is $e^{-\\lambda t}$. So

$$P(T > t) = e^{-\\lambda t}, \\qquad F(t) = P(T \\le t) = 1 - e^{-\\lambda t}, \\qquad f(t) = \\lambda e^{-\\lambda t}$$

The density is largest at $t = 0$: **short waits are the most common**. That is why genuinely random events look clumped — the eye sees clusters and gaps and suspects a pattern where there is none.

### Mean, median and spread
The mean wait is $\\tau = 1/\\lambda$ (an [[improper-integrals|improper integral]] done by parts), and the standard deviation is also $1/\\lambda$. The median — the time by which half of all waits are over — is shorter:

$$t_{1/2} = \\frac{\\ln 2}{\\lambda} = 0.693\\,\\tau$$

For radioactive nuclei this median is the **half-life**. A nucleus of iodine-131, half-life 8.0 days, has a mean lifetime of $8.0/0.693 = 11.6$ days, and the familiar decay law $N = N_0 e^{-\\lambda t}$ is simply $P(T > t)$ applied to an enormous number of nuclei ([[physics:half-life|half-life]], [[physics:radioactive-decay|radioactive decay]]).

### No memory
The exponential distribution is **memoryless**:

$$P(T > s + t \\mid T > s) = \\frac{e^{-\\lambda(s + t)}}{e^{-\\lambda s}} = e^{-\\lambda t} = P(T > t)$$

Having already waited a time $s$ does not bring the event any closer. A nucleus that has survived for a million years is exactly as likely to decay in the next second as a freshly made one — nuclei do not age. It is the only continuous distribution with this property, and that makes it a strong assumption: a light bulb or a gearbox that wears out does age, and its lifetime is not exponential. Electronic components during their useful life, after the early failures and before wear-out, come close, which is why reliability engineers quote a constant failure rate and a **mean time between failures**, $1/\\lambda$.

### Other places it appears
The distance a gas molecule travels between collisions is exponentially distributed, with the [[physics:mean-free-path|mean free path]] as its mean. So is the depth at which an X-ray photon is absorbed in lead — which is why radiation is attenuated exponentially as it passes through matter.
`,
  ideas: [
    'The waiting time until the next random event, at a constant rate $\\lambda$, is exponentially distributed.',
    '$P(T > t) = e^{-\\lambda t}$ is the probability that no event has happened yet.',
    'Mean wait $1/\\lambda$; median $\\ln 2/\\lambda$ — for decaying nuclei, the half-life.',
    'Memoryless: time already spent waiting does not shorten the wait still to come.',
    'Short gaps are the most common, so random events look clumped.'
  ],
  pitfalls: [
    'An old nucleus is "due" to decay — Decay is memoryless: the chance of decaying in the next second is the same whatever the nucleus\'s age.',
    'The half-life is the average lifetime — It is the median. The mean lifetime is longer: $\\tau = t_{1/2}/\\ln 2 \\approx 1.44\\,t_{1/2}$.',
    'Every lifetime is exponential — Only when failures happen at a constant rate. Things that wear out (tyres, bearings, people) become more likely to fail as they age.'
  ],
  formulas: [
    {
      name: 'Probability of waiting longer than t',
      expr: 'S = exp(-lambda*t)', tex: 'S = P(T > t) = e^{-\\lambda t}',
      vars: {
        S: { name: 'probability that no event has happened by time t', min: 0, max: 1 },
        lambda: { name: 'rate of events', q: 'decayconst', unit: '1/s', value: 0.5 },
        t: { name: 'time waited', q: 'time', unit: 's', value: 4 }
      },
      note: 'The chance of an event within $t$ is $1 - S$. For decaying nuclei, $S$ is the surviving fraction $N/N_0$.',
      stories: {
        S: 'Clicks arrive at random at an average rate of {lambda}. What is the probability of waiting longer than {t} for the next one?',
        t: 'Events occur at random at a rate of {lambda}. After how long is the probability that none has happened yet down to {S}?',
        lambda: 'Radioactive nuclei survive a time {t} with probability {S}. What is their decay constant?'
      }
    },
    {
      name: 'Half-life (median waiting time)',
      expr: 't_half = ln(2)/lambda', tex: 't_{1/2} = \\frac{\\ln 2}{\\lambda}',
      vars: {
        t_half: { name: 'half-life (median waiting time)', tex: 't_{1/2}', q: 'time', unit: 'day' },
        lambda: { name: 'rate (decay constant)', q: 'decayconst', unit: '1/day', value: 0.0864 }
      },
      stories: {
        t_half: 'A radioactive isotope has a decay constant of {lambda}. What is its half-life?',
        lambda: 'A radioactive isotope has a half-life of {t_half}. What is its decay constant?'
      }
    },
    {
      name: 'Mean lifetime from the half-life',
      expr: 'tau = t_half/ln(2)', tex: '\\tau = \\frac{t_{1/2}}{\\ln 2}',
      vars: {
        tau: { name: 'mean lifetime', q: 'time', unit: 'day' },
        t_half: { name: 'half-life', tex: 't_{1/2}', q: 'time', unit: 'day', value: 8.02 }
      },
      note: 'The mean is 1.44 times the median because a few very long waits pull the average up.',
      stories: { tau: 'Iodine-131 has a half-life of {t_half}. What is the mean lifetime of one of its nuclei?' }
    }
  ],
  examples: [
    {
      title: 'Gaps between clicks',
      q: 'A counter clicks at random at an average rate of 2 per second. Find the mean gap between clicks, the probability that a gap exceeds 1 s, and the probability that it is shorter than 0.1 s.',
      steps: [
        'Mean gap: $1/\\lambda = 0.5\\ \\mathrm{s}$.',
        '$P(T > 1\\ \\mathrm{s}) = e^{-2 \\times 1} = 0.135$.',
        '$P(T < 0.1\\ \\mathrm{s}) = 1 - e^{-0.2} = 0.181$.',
        'Almost one gap in five is under a tenth of a second, although the mean gap is half a second — random clicks come in bunches.'
      ],
      a: 'Mean 0.5 s; P(> 1 s) = 0.135; P(< 0.1 s) = 0.18'
    },
    {
      title: 'A component\'s life',
      q: 'An electronic module has a constant failure rate with mean time between failures 50 000 h. What is the probability that it survives 10 000 h, and that it fails within its first year (8760 h)?',
      steps: [
        '$\\lambda = 1/50\\,000\\ \\mathrm{h^{-1}}$.',
        '$P(T > 10\\,000\\ \\mathrm{h}) = e^{-10\\,000/50\\,000} = e^{-0.2} = 0.819$.',
        '$P(T < 8760\\ \\mathrm{h}) = 1 - e^{-0.1752} = 0.161$.'
      ],
      a: 'Survives 10 000 h with probability 0.82; fails in the first year with probability 0.16.'
    }
  ],
  quiz: [
    { q: 'A light bulb whose lifetime is exponentially distributed has already burned for 1000 h. Its chance of lasting another 500 h is…', choices: ['smaller than for a new bulb', 'the same as for a new bulb', 'larger than for a new bulb', 'zero'], a: 1,
      why: 'The exponential distribution is memoryless: $P(T > 1500 \\mid T > 1000) = P(T > 500)$. (Real filament bulbs wear out, so they are not quite exponential.)' },
    { q: 'For an exponential waiting time, which is the smallest?', choices: ['the mean', 'the median', 'the standard deviation', 'they are all equal'], a: 1,
      why: 'Mean and standard deviation are both $1/\\lambda$; the median is $\\ln 2/\\lambda = 0.69/\\lambda$.' },
    { q: 'For events occurring at random, short gaps between events are more common than long ones.', a: true,
      why: 'The density $\\lambda e^{-\\lambda t}$ is largest at $t = 0$ and falls steadily.' },
    { q: 'Events occur at random at 6 per minute. The mean waiting time between them is…', choices: ['6 s', '10 s', '60 s', '1/6 s'], a: 1,
      why: 'Mean wait $= 1/\\lambda = 1/6$ minute = 10 s.' },
    { q: 'Write the median of an exponential distribution with rate $k$.', answer: 'ln(2)/k', vars: ['k'],
      why: 'Solve $e^{-kt} = \\tfrac12$: $t = \\ln 2/k$.' }
  ],
  problems: [
    { q: 'Radon-222 has a half-life of 3.82 days. What is the mean lifetime of a radon-222 nucleus?', answer: 5.511, unit: 'day', tol: 0.01,
      steps: ['$\\tau = t_{1/2}/\\ln 2 = 3.82/0.693$.', '$\\tau = 5.51$ days.'] },
    { q: 'Buses come at random (a Poisson process) at an average of 4 per hour. What is the probability that you wait more than 30 minutes for one?', answer: 0.1353, tol: 0.01,
      steps: ['$\\lambda t = 4\\ \\mathrm{h^{-1}} \\times 0.5\\ \\mathrm{h} = 2$.', '$P(T > 30\\ \\mathrm{min}) = e^{-2} = 0.135$.'] }
  ],
  applications: [
    'Radioactive decay and the dating methods built on it.',
    'Reliability engineering: failure rates and the mean time between failures of electronics.',
    'Queueing theory: the time between arrivals of customers, calls or data packets.',
    'Attenuation of radiation in shielding and of light in an absorbing medium.'
  ],
  sim: { id: 'ps-poisson-process', params: { rate: 1 }, title: 'Waiting times between random events' }
},

{
  id: 'central-limit-theorem', parent: 'distributions', title: 'The central limit theorem', level: 3,
  short: 'Add up many independent random quantities and the total is almost normally distributed, whatever the shape of the pieces — which is why the bell curve is everywhere.',
  keywords: ['central limit theorem', 'CLT', 'sum of random variables', 'sample mean', 'sampling distribution', 'normal approximation', 'standard error', 'law of large numbers', 'random walk', 'square root of n', 'continuity correction'],
  prereq: ['normal-distribution', 'expected-value', 'binomial-distribution'],
  related: ['standard-deviation', 'error-propagation', 'hypothesis-testing', 'heat-equation'],
  body: `
Roll one die and every face is equally likely: the distribution is flat. Roll two and add them: now 7 is the favourite and the distribution is a triangle. Three dice give a rounded hump, and by ten dice the histogram of totals is a smooth bell. Nothing about a single die is bell-shaped — the bell comes from **adding**. That is the **central limit theorem**, and it is why the [[normal-distribution|normal distribution]] is everywhere.

### The statement
Let $X_1, X_2, \\dots, X_n$ be independent random variables with the same distribution, mean $\\mu$ and finite standard deviation $\\sigma$. Their sum $S_n$ has mean $n\\mu$ and standard deviation $\\sigma\\sqrt{n}$ (variances add, see [[expected-value|expected value and variance]]), and as $n$ grows

$$\\frac{S_n - n\\mu}{\\sigma\\sqrt{n}} \\;\\longrightarrow\\; \\text{a standard normal variable}$$

Equivalently, the average $\\bar X = S_n/n$ is approximately normal with mean $\\mu$ and standard deviation $\\sigma/\\sqrt{n}$. The shape of the individual pieces — flat, lopsided, two-valued — washes out; only their mean and spread survive.

### How big must n be?
It depends on the pieces. For roughly symmetric ones, five to ten are plenty. Skewed ones need more; "thirty" is a popular rule of thumb, but very lopsided quantities (lottery winnings, say) need far more. And the theorem needs a finite variance: for heavy-tailed quantities, where rare enormous values dominate, sums never become normal.

### Worked numbers: ten dice
One die has $\\mu = 3.5$ and $\\sigma = 1.708$. The total of ten has mean 35 and standard deviation $1.708\\sqrt{10} = 5.40$. How likely is a total of 45 or more? Totals are whole numbers, so use the half-unit **continuity correction**: $z = (44.5 - 35)/5.40 = 1.76$, and $P = 1 - \\Phi(1.76) = 0.039$. The exact answer, counting all $6^{10}$ outcomes, is also 0.039.

### Consequences
- **Measurement errors** are sums of many small disturbances — vibration, electrical noise, temperature drift, reading errors — so they are usually close to normal. That is why [[standard-deviation|standard deviations]] and [[error-propagation|error propagation]] work so well.
- **Averaging helps, slowly.** The average of $n$ readings scatters by only $\\sigma/\\sqrt{n}$: four readings halve the random error, a hundred cut it tenfold. This standard error sits behind every confidence interval and [[hypothesis-testing|hypothesis test]].
- **Random walks.** After $N$ random steps of length $L$, a molecule is typically about $L\\sqrt{N}$ from where it started, and its position is normally distributed — the microscopic picture of diffusion and the [[heat-equation|heat equation]].
- **Molecular velocities.** Each velocity component of a gas molecule results from countless collisions and is normally distributed — the root of the [[physics:maxwell-boltzmann|Maxwell–Boltzmann distribution]].

> [!key] The law of large numbers says that the average of many trials settles at the mean. The central limit theorem goes further: it describes the fluctuations around the mean — their size, $\\sigma/\\sqrt{n}$, and their shape, the bell curve.
`,
  ideas: [
    'Sums and averages of many independent random variables are approximately normal, whatever the shape of the individual pieces.',
    'A sum of $n$ has mean $n\\mu$ and standard deviation $\\sigma\\sqrt{n}$; an average has mean $\\mu$ and standard deviation $\\sigma/\\sqrt{n}$.',
    'The more lopsided the pieces, the more of them are needed; a finite variance is essential.',
    'It explains why measurement errors, molecular velocities and diffusing particles are Gaussian.'
  ],
  pitfalls: [
    'With a big enough sample, the data themselves become normal — No: individual values keep their own distribution. It is the sum or the average of the sample that becomes normal.',
    '$n = 30$ is always enough — It is a rule of thumb for moderate skew. Very skewed quantities need far more, and heavy-tailed ones may never get there.',
    'Averaging $n$ readings divides the error by $n$ — It divides the random error by $\\sqrt{n}$, and does nothing to a systematic error.'
  ],
  derivation: {
    title: 'The mean and spread of an average',
    steps: [
      { text: 'The average of $n$ independent readings, each with mean $\\mu$ and standard deviation $\\sigma$:', tex: '\\bar X = \\frac{1}{n}\\,(X_1 + X_2 + \\dots + X_n)' },
      { text: 'Expectation is linear:', tex: 'E[\\bar X] = \\frac{1}{n}\\,(\\mu + \\mu + \\dots + \\mu) = \\mu' },
      { text: 'Variances of independent variables add, and the factor $1/n$ scales a variance by $1/n^2$:', tex: '\\operatorname{Var}(\\bar X) = \\frac{1}{n^2}\\,(n\\sigma^2) = \\frac{\\sigma^2}{n}' },
      { text: 'So the standard deviation of the average — the standard error — is', tex: '\\sigma_{\\bar X} = \\frac{\\sigma}{\\sqrt{n}}' },
      { text: 'The central limit theorem adds the shape: for large $n$ the distribution of $\\bar X$ is normal. A full proof needs more machinery (characteristic functions), but the simulation shows it happening.' }
    ]
  },
  formulas: [
    {
      name: 'z-score of a total of n values',
      expr: 'z = (S - n*mu)/(sigma*sqrt(n))', tex: 'z = \\frac{S - n\\mu}{\\sigma\\sqrt{n}}',
      vars: {
        z: { name: 'z-score of the total', signed: true },
        S: { name: 'the total', q: 'mass', unit: 'kg', value: 1000 },
        n: { name: 'number of values added', int: true, min: 1, value: 13 },
        mu: { name: 'mean of one value', q: 'mass', unit: 'kg', value: 75, min: 40, max: 120 },
        sigma: { name: 'standard deviation of one value', q: 'mass', unit: 'kg', value: 12, min: 2, max: 30 }
      },
      note: 'Then $P(\\text{total} > S) = 1 - \\Phi(z)$. The starting values are a lift rated for 1000 kg carrying 13 passengers of mean mass 75 kg; the ranges suit people\'s masses.',
      practice: { unknowns: ['S'] },
      stories: {
        z: 'Passengers have a mean mass of {mu} with a standard deviation of {sigma}. With {n} people in a lift, what is the z-score of a total mass of {S}?',
        S: 'Passengers have a mean mass of {mu} with a standard deviation of {sigma}. With {n} people in a lift, which total mass has a z-score of {z}?'
      }
    },
    {
      name: 'Spread of a total of n independent values',
      expr: 'sigma_S = sigma*sqrt(n)', tex: '\\sigma_S = \\sigma\\sqrt{n}',
      vars: {
        sigma_S: { name: 'standard deviation of the total', tex: '\\sigma_S' },
        sigma: { name: 'standard deviation of one value', value: 1.708 },
        n: { name: 'number of values added', int: true, min: 1, value: 10 }
      },
      note: 'The starting values are ten dice: one die has $\\sigma = 1.708$.',
      practice: { unknowns: ['sigma_S'] },
      stories: { sigma_S: 'Each of {n} independent random values has standard deviation {sigma}. What is the standard deviation of their total?' }
    },
    {
      name: 'Spread of an average of n independent values',
      expr: 'sigma_m = sigma/sqrt(n)', tex: '\\sigma_{\\bar x} = \\frac{\\sigma}{\\sqrt{n}}',
      vars: {
        sigma_m: { name: 'standard deviation of the average (standard error)', tex: '\\sigma_{\\bar x}' },
        sigma: { name: 'standard deviation of one value', value: 0.5 },
        n: { name: 'number of values averaged', int: true, min: 1, value: 25 }
      },
      practice: { unknowns: ['sigma_m'] },
      stories: { sigma_m: 'A thermometer reading scatters with standard deviation {sigma} (in °C). How much does the average of {n} independent readings scatter?' }
    }
  ],
  examples: [
    {
      title: 'A crowded lift',
      q: 'A lift is rated for 1000 kg. Passengers\' masses have mean 75 kg and standard deviation 12 kg. With 13 people aboard, what is the probability that the rating is exceeded?',
      steps: [
        'Total: mean $13 \\times 75 = 975\\ \\mathrm{kg}$, standard deviation $12\\sqrt{13} = 43.3\\ \\mathrm{kg}$.',
        'By the central limit theorem the total is close to normal: $z = (1000 - 975)/43.3 = 0.58$.',
        '$P(\\text{total} > 1000) = 1 - \\Phi(0.58) = 0.28$.',
        'This assumes the passengers are independent. A group of rugby players boarding together is not a random sample — which is why real ratings include a large safety margin.'
      ],
      a: 'About 28 %'
    },
    {
      title: 'Averaging readings',
      q: 'A single thermometer reading has a random error of standard deviation 0.5 °C. How precise is the average of 25 readings, and how many would give 0.05 °C?',
      steps: [
        '$\\sigma_{\\bar x} = 0.5/\\sqrt{25} = 0.1$ °C.',
        'For 0.05 °C: $\\sqrt{n} = 0.5/0.05 = 10$, so $n = 100$ readings.',
        'Each halving of the error costs four times as many readings — and no amount of averaging removes a calibration error.'
      ],
      a: '0.1 °C from 25 readings; 100 readings for 0.05 °C.'
    },
    {
      title: 'A random walk',
      q: 'A particle takes 10 000 steps of 1 mm, each equally likely to the left or right. How far from its start is it typically, and within what distance is it found 95 % of the time?',
      steps: [
        'Each step has mean 0 and standard deviation 1 mm.',
        'After $N = 10\\,000$ steps: mean 0, standard deviation $1\\ \\mathrm{mm} \\times \\sqrt{10\\,000} = 100\\ \\mathrm{mm}$.',
        'The position is nearly normal, so 95 % of the time it lies within $\\pm 2\\sigma = \\pm 200\\ \\mathrm{mm}$.',
        'It walked 10 m in all, yet typically ended only 0.1 m away — the slowness of diffusion.'
      ],
      a: 'Typically about 10 cm away; within ±20 cm 95 % of the time.'
    }
  ],
  quiz: [
    { q: 'Individual waiting times are strongly skewed (exponential). The average of 50 such waiting times is distributed…', choices: ['exponentially', 'uniformly', 'approximately normally', 'exactly normally'], a: 2,
      why: 'Averages of many independent values are approximately normal whatever the individual shape — the central limit theorem. "Exactly" would be too strong for a skewed parent.' },
    { q: 'To halve the standard error of an average you need…', choices: ['twice as many readings', 'four times as many readings', 'half as many readings', '√2 times as many readings'], a: 1,
      why: 'The standard error is $\\sigma/\\sqrt{n}$, so halving it needs $\\sqrt{n}$ doubled: $n$ four times as large.' },
    { q: 'The central limit theorem says that a large enough sample of data will itself look normally distributed.', a: false,
      why: 'It is about the distribution of the sum or average, not of the individual data. A big sample of exponential waiting times still looks exponential.' },
    { q: '100 independent values each have mean 2 and standard deviation 3. The standard deviation of their sum is…', choices: ['300', '30', '3', '0.3'], a: 1,
      why: '$\\sigma\\sqrt{n} = 3\\sqrt{100} = 30$. (0.3 is the standard deviation of their average.)' },
    { q: 'Each of $n$ independent steps is $+1$ or $-1$ with equal probability. Write the standard deviation of the final position.', answer: 'sqrt(n)', vars: ['n'],
      why: 'One step has mean 0 and variance $E[X^2] = 1$. The variances of $n$ steps add to $n$, so the standard deviation is $\\sqrt{n}$.' }
  ],
  problems: [
    { q: 'A fair die is rolled 100 times. What is the standard deviation of the total score?', answer: 17.08, tol: 0.01,
      steps: ['One die: $\\sigma = \\sqrt{35/12} = 1.708$.', 'Total of 100: $1.708 \\times \\sqrt{100} = 17.1$ (about a mean of 350).'] },
    { q: 'Resistors of nominal value 100 Ω have a standard deviation of 2 Ω. Twenty-five are connected in series. What is the standard deviation of the total resistance?', answer: 10, unit: 'Ω', tol: 0.01,
      steps: ['Resistances in series add, and for independent resistors the variances add.', '$\\sigma_{\\text{total}} = 2\\ \\Omega \\times \\sqrt{25} = 10\\ \\Omega$ on a total of 2500 Ω — only 0.4 %, compared with 2 % for one resistor.'] }
  ],
  applications: [
    'Error analysis: justifying Gaussian error bars and the averaging of repeated measurements.',
    'Polls and quality control: the margin of error of a sample average.',
    'Insurance and finance: the total of many independent claims or returns.',
    'Physics of diffusion, Brownian motion and electrical noise.'
  ],
  history: 'Abraham de Moivre found the bell curve as the limit of coin-tossing counts in 1733, and Pierre-Simon Laplace extended the result to sums of other quantities around 1810. Aleksandr Lyapunov gave the first rigorous general proof in 1901, and George Pólya coined the name "central limit theorem" in 1920.',
  sim: 'ps-clt'
}

);
