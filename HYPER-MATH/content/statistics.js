/* HYPER-MATH · content/statistics.js — from data back to models: averages, spread and
 * the standard error, least-squares fitting, measurement uncertainty and hypothesis tests. */
Hyper.add(

{
  id: 'descriptive-statistics', parent: 'statistics', title: 'Mean, median and mode', level: 1,
  short: 'Three ways to say what a typical value is: the mean balances the data, the median splits it in half, the mode is the most common value.',
  keywords: ['mean', 'average', 'arithmetic mean', 'median', 'mode', 'weighted mean', 'geometric mean', 'harmonic mean', 'quartiles', 'outlier', 'skew', 'robust', 'box plot'],
  prereq: ['fractions-ratios', 'percentages'],
  related: ['standard-deviation', 'expected-value', 'normal-distribution', 'linear-regression'],
  body: `
Ask "what is a typical value?" of a set of numbers and there are three reasonable answers, which can be surprisingly different. Take the annual incomes of ten people: nine earn 30 000 and one earns 1 000 000. The **mean** is 127 000 — more than four times what nine of the ten earn. The **median**, the middle value, is 30 000. Which one you quote changes the story completely.

### The three averages
- The **mean** (arithmetic mean) adds the values and divides by how many there are.
- The **median** is the middle value once the data are sorted: half lie below it, half above. With an even number of values, take the mean of the middle two.
- The **mode** is the most common value. It is the only one that works for categories (the most popular colour of car), and it picks out the peaks of a histogram.

$$\\bar x = \\frac{x_1 + x_2 + \\dots + x_n}{n} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$$

Five timings of ten swings of a pendulum — 20.1, 19.8, 20.3, 19.9, 20.4 s — have mean $100.5/5 = 20.1$ s, and sorted (19.8, 19.9, 20.1, 20.3, 20.4) their median is also 20.1 s. For well-behaved, symmetric data like these, mean and median agree.

### What each one does
The mean is the **balance point** of the data: the deviations $x_i - \\bar x$ always add up to zero, and the mean is the number that makes the sum of **squared** deviations as small as possible. That is why it leads straight to the [[standard-deviation|standard deviation]] and to [[linear-regression|least-squares fitting]]. The median instead minimises the sum of the absolute deviations. It looks only at the order of the data, so it is **robust**: one wild value — a typing error, a faulty sensor — can drag the mean anywhere but barely moves the median.

In a **skewed** distribution the two separate. A long tail to the right (incomes, house prices, earthquake energies) pulls the mean above the median; a tail to the left pulls it below. The median together with the **quartiles** — the values a quarter and three quarters of the way through the sorted data — gives a robust summary of where the data sit and how widely they spread; a box plot draws exactly these five numbers.

### Weighted and other means
When values carry different weights, use a **weighted mean**, $\\bar x = \\sum w_i x_i / \\sum w_i$. Combining two classes — 20 students averaging 64 and 30 averaging 74 — gives $(20 \\times 64 + 30 \\times 74)/50 = 70$, not 69. The [[physics:center-of-mass|centre of mass]] is a weighted mean of positions, weighted by mass.

Two other means answer particular questions. The **geometric mean** $\\sqrt{ab}$ averages growth factors: a price that rises 50 % and then falls 50 % ends at $1.5 \\times 0.5 = 0.75$ of where it began, an average factor of $\\sqrt{0.75} = 0.866$ per step — not "no change". The **harmonic mean** averages rates over equal distances: drive 60 km at 30 km/h and 60 km at 90 km/h and your average speed is $2 \\times 30 \\times 90/(30 + 90) = 45$ km/h, the trap described under [[physics:speed-velocity|speed and velocity]].
`,
  ideas: [
    'The mean is the balance point of the data, the median the middle value, the mode the most common value.',
    'Deviations from the mean always add up to zero.',
    'The median is robust: one wild value barely moves it, but can drag the mean anywhere.',
    'In skewed data the mean is pulled towards the long tail.',
    'Weighted, geometric and harmonic means answer different questions: combining groups, averaging growth factors, averaging rates.'
  ],
  pitfalls: [
    'The average of two group averages is the overall average — Only if the groups are the same size. Otherwise weight each group\'s mean by its size.',
    '"Average" always means the mean — Typical incomes, house prices and waiting times are usually reported as medians, and for skewed data the two differ a lot.',
    'The mean of the percentage changes is the average change — +50 % followed by −50 % is a net loss of 25 %. Growth factors multiply, so their average is the geometric mean.'
  ],
  formulas: [
    {
      name: 'Mean of two groups combined',
      expr: 'xbar = (n1*x1 + n2*x2)/(n1 + n2)', tex: '\\bar x = \\frac{n_1 \\bar x_1 + n_2 \\bar x_2}{n_1 + n_2}',
      vars: {
        xbar: { name: 'mean of the combined group', tex: '\\bar x' },
        n1: { name: 'size of the first group', int: true, min: 1, value: 20 },
        x1: { name: 'mean of the first group', tex: '\\bar x_1', value: 64 },
        n2: { name: 'size of the second group', int: true, min: 1, value: 30 },
        x2: { name: 'mean of the second group', tex: '\\bar x_2', value: 74 }
      },
      note: 'A weighted mean: each group\'s mean counts in proportion to its size.',
      practice: { unknowns: ['xbar', 'x2'] },
      stories: {
        xbar: 'One class of {n1} students averages {x1} marks and another of {n2} students averages {x2}. What is the mean mark of all the students together?',
        x2: 'A class of {n1} students averages {x1} marks. What must a second class of {n2} average for the combined mean to be {xbar}?'
      }
    },
    {
      name: 'Average speed over two equal distances (harmonic mean)',
      expr: 'v = 2*v1*v2/(v1 + v2)', tex: '\\bar v = \\frac{2 v_1 v_2}{v_1 + v_2}',
      vars: {
        v: { name: 'average speed for the whole trip', tex: '\\bar v', q: 'speed', unit: 'km/h' },
        v1: { name: 'speed on the first half of the distance', q: 'speed', unit: 'km/h', value: 30 },
        v2: { name: 'speed on the second half of the distance', q: 'speed', unit: 'km/h', value: 90 }
      },
      note: 'Always below the simple average, because more time is spent at the lower speed.',
      stories: {
        v: 'A cyclist rides a route out at {v1} and back along the same road at {v2}. What is her average speed for the round trip?',
        v2: 'You drive to a town at {v1}. How fast must you drive back along the same road to average {v} for the round trip?'
      }
    },
    {
      name: 'Average growth factor over two steps (geometric mean)',
      expr: 'G = sqrt(g1*g2)', tex: 'G = \\sqrt{g_1\\, g_2}',
      vars: {
        G: { name: 'average growth factor per step' },
        g1: { name: 'growth factor in the first step', value: 1.5 },
        g2: { name: 'growth factor in the second step', value: 0.5 }
      },
      note: 'A rise of 50 % is a factor 1.5 and a fall of 50 % a factor 0.5. Two steps at the factor $G$ give the same overall change as the real two steps.',
      stories: { G: 'An investment grows by a factor {g1} in one year and by a factor {g2} in the next. What is the average growth factor per year?' }
    }
  ],
  examples: [
    {
      title: 'An outlier',
      q: 'Five readings of a length are 12.1, 12.3, 12.2, 12.4 and 21.2 mm; the last was mistyped for 12.2. Find the mean and median with and without the bad value.',
      steps: [
        'With it: mean $= 70.2/5 = 14.04$ mm; sorted 12.1, 12.2, 12.3, 12.4, 21.2, so the median is 12.3 mm.',
        'Without it: mean $= 49.0/4 = 12.25$ mm; median $= (12.2 + 12.3)/2 = 12.25$ mm.',
        'One bad value moved the mean by 1.8 mm and the median by only 0.05 mm.'
      ],
      a: 'Mean 14.04 mm and median 12.3 mm with the outlier; both 12.25 mm without it.'
    },
    {
      title: 'Average growth',
      q: 'An investment gains 50 % in one year and loses 50 % the next. What is the overall change, and what is the average yearly growth factor?',
      steps: [
        'Overall factor: $1.5 \\times 0.5 = 0.75$ — a loss of 25 %.',
        'The arithmetic mean of the changes, $(+50\\,\\% - 50\\,\\%)/2 = 0$, wrongly suggests no change.',
        'Geometric mean of the factors: $\\sqrt{1.5 \\times 0.5} = 0.866$, a loss of 13.4 % a year; indeed $0.866^2 = 0.75$.'
      ],
      a: 'Down 25 % overall; an average factor of 0.866 (−13.4 %) per year.'
    }
  ],
  quiz: [
    { q: 'For the data 2, 3, 3, 5, 100, which number best describes a typical value?', choices: ['the mean, 22.6', 'the median, 3', 'the range, 98', 'the maximum, 100'], a: 1,
      why: 'The single value 100 drags the mean far above four of the five data. The median ignores how extreme the outlier is.' },
    { q: 'In a distribution with a long tail to the right (towards high values), usually…', choices: ['mean < median', 'mean = median', 'mean > median', 'the mode is largest'], a: 2,
      why: 'The few large values pull the mean up, while the median only counts how many values lie on each side.' },
    { q: 'The deviations of a set of data from their mean always add up to zero.', a: true,
      why: '$\\sum (x_i - \\bar x) = \\sum x_i - n\\bar x = 0$, because $n\\bar x = \\sum x_i$ by definition. That is why deviations are squared before averaging.' },
    { q: 'You add 10 to every value in a data set. The mean and the median…', choices: ['both increase by 10', 'the mean increases by 10, the median is unchanged', 'are both unchanged', 'both double'], a: 0,
      why: 'Shifting all values shifts every "centre" by the same amount. (The spread, by contrast, is unchanged.)' },
    { q: 'Three values $a$, $b$ and $c$ have mean $m$. Write $c$ in terms of $a$, $b$ and $m$.', answer: '3m - a - b', vars: ['a', 'b', 'm'],
      why: 'The total is $a + b + c = 3m$, so $c = 3m - a - b$.' }
  ],
  problems: [
    { q: 'In a test, 12 students averaged 68 marks and 8 others averaged 78 marks. What was the mean mark of all 20?', answer: 72, tol: 0.005,
      steps: ['Total marks: $12 \\times 68 + 8 \\times 78 = 816 + 624 = 1440$.', 'Mean: $1440/20 = 72$ — nearer 68, because more students scored that.'] },
    { q: 'A cyclist rides 10 km uphill at 12 km/h and comes back down the same road at 36 km/h. What is her average speed for the round trip?', answer: 18, unit: 'km/h', tol: 0.01,
      steps: ['Times: $10/12 = 0.833$ h up and $10/36 = 0.278$ h down, 1.111 h in all.', 'Average speed: $20/1.111 = 18$ km/h — the harmonic mean, $2 \\times 12 \\times 36/(12 + 36) = 18$, not 24.'] }
  ],
  applications: [
    'Reporting typical values: median household income, median house price, mean daily temperature.',
    'Combining measurements of different quality with a weighted mean (weights proportional to $1/\\sigma^2$).',
    'Median filters, which remove spikes from sensor signals and noisy images without blurring edges.',
    'Averaging rates and growth: the harmonic mean for speeds over equal distances, the geometric mean for growth factors.'
  ],
  sim: 'ps-spread'
},

{
  id: 'standard-deviation', parent: 'statistics', title: 'Spread and standard deviation', level: 1,
  short: 'How far data typically lie from their mean — the standard deviation and its square, the variance — and the standard error that says how well the mean itself is known.',
  keywords: ['standard deviation', 'variance', 'spread', 'dispersion', 'range', 'sample standard deviation', 'n − 1', 'Bessel\'s correction', 'degrees of freedom', 'standard error', 'standard error of the mean', 'SEM', 'root mean square'],
  prereq: ['descriptive-statistics', 'expected-value'],
  related: ['normal-distribution', 'error-propagation', 'central-limit-theorem', 'linear-regression'],
  body: `
Two machines both fill bags with an average of 500 g of flour. One is always within a gram or two; the other ranges from 480 g to 520 g. Their means are the same; their customers' experiences are not. To describe data you need a second number besides the average: how **spread out** the values are.

### From deviations to the standard deviation
The simplest measure, the **range** (largest minus smallest), depends only on the two most extreme values. A better one uses every value's **deviation** from the mean, $x_i - \\bar x$. The deviations always add up to zero, so they are squared first, averaged, and square-rooted to get back to the original units:

$$s = \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^{n}(x_i - \\bar x)^2}$$

This is the **sample standard deviation**; its square $s^2$ is the **variance**. For the five values 4, 7, 8, 9, 12 the mean is 8, the deviations are $-4, -1, 0, 1, 4$, their squares add up to 34, and $s = \\sqrt{34/4} = 2.92$. The simulation draws each squared deviation as a real square, and $s$ as the side of the "average" square.

### Why divide by n − 1?
The deviations are measured from $\\bar x$, which was calculated from the same data and sits right in their middle. Deviations from the true mean $\\mu$ would on average be a little larger, so dividing the squares by $n$ would underestimate the true spread. Dividing by $n - 1$ corrects this exactly (see the derivation); one says that once the mean is fixed, the data keep $n - 1$ **degrees of freedom**. For a complete population, or when $\\mu$ is known independently, divide by $n$ and write $\\sigma$. For large samples the difference is negligible.

### What the number means
For roughly [[normal-distribution|normal]] data, about 68 % of the values lie within one standard deviation of the mean and 95 % within two. A pendulum timed ten times with mean period 2.006 s and $s = 0.021$ s gives single readings that typically miss the mean by about 0.02 s, and only rarely by more than 0.04 s.

### The standard error: how well is the mean known?
Averaging helps. The mean of $n$ independent readings scatters much less than the readings themselves; by the [[central-limit-theorem|central limit theorem]] its standard deviation — the **standard error of the mean** — is

$$s_{\\bar x} = \\frac{s}{\\sqrt{n}}$$

The pendulum's mean period is therefore $2.006 \\pm 0.021/\\sqrt{10} = 2.006 \\pm 0.007$ s. Keep the two apart. The standard deviation $s$ describes the **scatter of single readings** and does not shrink as you take more of them; the standard error describes the **uncertainty of the mean** and does. Results are usually reported as mean ± standard error — the starting point for [[error-propagation|error propagation]] and [[hypothesis-testing|hypothesis tests]].

> [!note] The same quantity appears across physics under other names: the root-mean-square noise voltage of a circuit, the rms distance of a random walk, and the $\\Delta x$ of the [[physics:uncertainty-principle|uncertainty principle]] are all standard deviations.
`,
  ideas: [
    'The standard deviation measures the typical distance of the values from their mean, in the units of the data.',
    'Square the deviations, add them, divide by $n - 1$, take the square root.',
    'For normal data, about 68 % of values lie within ±1 SD of the mean and 95 % within ±2 SD.',
    'The standard error $s/\\sqrt{n}$ is the uncertainty of the mean: it shrinks as readings are added, the SD does not.'
  ],
  pitfalls: [
    'More readings make the standard deviation shrink — The SD settles down to the true scatter of single readings. What shrinks, like $1/\\sqrt{n}$, is the standard error of the mean.',
    'Dividing by n or by n − 1 makes no difference — For five readings it changes the SD by 12 %. Use $n - 1$ whenever the mean was worked out from the same data.',
    'A small standard deviation means the result is right — Spread measures random scatter only. A miscalibrated instrument can give tightly clustered, consistently wrong readings.'
  ],
  derivation: {
    title: 'Why the sample variance divides by n − 1',
    steps: [
      { text: 'Let the readings have true mean $\\mu$ and variance $\\sigma^2$. Split each deviation from the sample mean into two parts:', tex: 'x_i - \\bar x = (x_i - \\mu) - (\\bar x - \\mu)' },
      { text: 'Square and add. Because $\\sum_i (x_i - \\mu) = n(\\bar x - \\mu)$, the cross terms combine:', tex: '\\sum_i (x_i - \\bar x)^2 = \\sum_i (x_i - \\mu)^2 - n(\\bar x - \\mu)^2' },
      { text: 'Take expected values. Each $(x_i - \\mu)^2$ averages $\\sigma^2$, and the sample mean scatters with variance $\\sigma^2/n$:', tex: 'E\\Bigl[\\sum_i (x_i - \\bar x)^2\\Bigr] = n\\sigma^2 - n\\cdot\\frac{\\sigma^2}{n} = (n - 1)\\,\\sigma^2' },
      { text: 'So dividing by $n - 1$, not $n$, gives an estimate of $\\sigma^2$ that is right on average:', tex: 's^2 = \\frac{1}{n-1}\\sum_i (x_i - \\bar x)^2, \\qquad E[s^2] = \\sigma^2' }
    ]
  },
  formulas: [
    {
      name: 'Sample standard deviation from the sum of squares',
      expr: 's = sqrt(SS/(n - 1))', tex: 's = \\sqrt{\\frac{S_{xx}}{n - 1}}',
      vars: {
        s: { name: 'sample standard deviation' },
        SS: { name: 'sum of squared deviations from the mean', tex: 'S_{xx}', value: 34 },
        n: { name: 'number of values', int: true, min: 2, value: 5 }
      },
      note: '$S_{xx} = \\sum (x_i - \\bar x)^2$. The starting values are the five numbers 4, 7, 8, 9 and 12.',
      practice: { unknowns: ['s'] },
      stories: { s: 'The squared deviations of {n} readings from their mean add up to {SS}. What is the sample standard deviation?' }
    },
    {
      name: 'Standard error of the mean',
      expr: 'SE = s/sqrt(n)', tex: 's_{\\bar x} = \\frac{s}{\\sqrt{n}}',
      vars: {
        SE: { name: 'standard error of the mean', tex: 's_{\\bar x}', q: 'time', unit: 's' },
        s: { name: 'standard deviation of single readings', q: 'time', unit: 's', value: 0.021 },
        n: { name: 'number of readings', int: true, min: 1, value: 10 }
      },
      note: 'The starting values are ten timings of a pendulum. Four times as many readings halve the standard error.',
      practice: { unknowns: ['SE'] },
      stories: { SE: 'Timings of a pendulum\'s period scatter with a standard deviation of {s}. What is the standard error of the mean of {n} timings?' }
    }
  ],
  examples: [
    {
      title: 'Five numbers',
      q: 'Find the mean, the sample standard deviation $s$ and the population standard deviation $\\sigma$ of 4, 7, 8, 9, 12.',
      steps: [
        'Mean: $(4 + 7 + 8 + 9 + 12)/5 = 40/5 = 8$.',
        'Deviations: $-4, -1, 0, 1, 4$; squares: $16, 1, 0, 1, 16$; sum $S_{xx} = 34$.',
        '$s = \\sqrt{34/4} = \\sqrt{8.5} = 2.92$ (dividing by $n - 1 = 4$).',
        '$\\sigma = \\sqrt{34/5} = \\sqrt{6.8} = 2.61$ (dividing by $n = 5$).'
      ],
      a: 'Mean 8, s = 2.92, σ = 2.61'
    },
    {
      title: 'Timing a pendulum',
      q: 'Ten timings of a pendulum\'s period have mean 2.006 s and standard deviation 0.021 s. How should the result be reported, and how many timings would give a standard error of 0.002 s?',
      steps: [
        'Standard error: $s_{\\bar x} = 0.021/\\sqrt{10} = 0.0066$ s.',
        'Report $T = 2.006 \\pm 0.007$ s.',
        'For $s_{\\bar x} = 0.002$ s: $\\sqrt{n} = 0.021/0.002 = 10.5$, so $n = 110.25$ — at least 111 timings.',
        'A smarter route: time 20 swings at once, which divides the reaction-time error on each period by 20.'
      ],
      a: 'T = 2.006 ± 0.007 s; about 111 timings for ±0.002 s.'
    }
  ],
  quiz: [
    { q: 'You multiply every value in a data set by 3. The standard deviation…', choices: ['is unchanged', 'triples', 'is multiplied by 9', 'increases by 3'], a: 1,
      why: 'Every deviation triples, so the SD triples. (The variance is multiplied by 9.)' },
    { q: 'You add 5 to every value in a data set. The standard deviation changes by…', choices: ['+5', 'a factor 5', 'nothing', '+√5'], a: 2,
      why: 'The mean also moves up by 5, so every deviation from the mean is unchanged.' },
    { q: 'Compared with the mean of 25 readings, the standard error of the mean of 100 readings (same instrument) is…', choices: ['four times smaller', 'half as large', 'the same', 'twice as large'], a: 1,
      why: 'The standard error goes as $1/\\sqrt{n}$: four times the readings, $\\sqrt{4} = 2$ times smaller.' },
    { q: 'Taking more and more readings makes their standard deviation shrink towards zero.', a: false,
      why: 'The SD estimates the scatter of a single reading, a property of the instrument and method; it settles to a fixed value. The standard error of the mean is what shrinks.' },
    { q: 'Two values $a$ and $b$. Write their sample variance (dividing by $n - 1 = 1$).', answer: '(a-b)^2/2', vars: ['a', 'b'],
      why: 'The mean is $(a + b)/2$ and the deviations are $\\pm(a - b)/2$. Their squares add to $(a - b)^2/2$, divided by $n - 1 = 1$.' }
  ],
  problems: [
    { q: 'Find the sample standard deviation of 2, 4, 4, 4, 5, 5, 7, 9.', answer: 2.138, tol: 0.01,
      steps: ['Mean: $40/8 = 5$.', 'Squared deviations: $9, 1, 1, 1, 0, 0, 4, 16$, adding to 32.', '$s = \\sqrt{32/7} = 2.14$ (the population value would be $\\sqrt{32/8} = 2$).'] },
    { q: 'Twelve measurements of a length have a standard deviation of 0.6 mm. What is the standard error of their mean?', answer: 0.1732, unit: 'mm', tol: 0.01,
      steps: ['$s_{\\bar x} = s/\\sqrt{n} = 0.6/\\sqrt{12}$.', '$s_{\\bar x} = 0.17$ mm.'] }
  ],
  applications: [
    'Quality control: the spread of a process decides what fraction of its parts meets a tolerance.',
    'Reporting measurements as mean ± standard error.',
    'Finance, where the volatility of an investment is the standard deviation of its returns.',
    'Noise specifications of sensors and amplifiers, quoted as rms values.'
  ],
  sim: 'ps-spread'
},

{
  id: 'linear-regression', parent: 'statistics', title: 'Correlation and least-squares fitting', level: 2,
  short: 'Finding the straight line that best fits scattered data by minimising the squared vertical misses, and measuring how well a line describes the data with r and R².',
  keywords: ['least squares', 'linear regression', 'line of best fit', 'best-fit line', 'correlation', 'correlation coefficient', 'r', 'R squared', 'coefficient of determination', 'residuals', 'slope', 'intercept', 'scatter plot', 'curve fitting', 'linearisation'],
  prereq: ['standard-deviation', 'linear-functions', 'partial-derivatives'],
  related: ['error-propagation', 'logarithms', 'optimization', 'physics:mass-spring-system'],
  body: `
Hang masses on a spring and measure how far it stretches. The points on a graph of extension against load lie almost on a straight line, as [[physics:mass-spring-system|Hooke's law]] says they should — but not quite, because every reading carries a little error. Which straight line do the data really suggest, and how well does a line describe them at all? **Least-squares fitting** answers the first question, the **correlation coefficient** the second.

### The least-squares line
For each point the **residual** is the vertical miss between the measured $y_i$ and the line $y = a + bx$. The least-squares line is the one that makes the **sum of the squared residuals** as small as possible:

$$S(a, b) = \\sum_{i=1}^{n}\\bigl(y_i - a - b\\,x_i\\bigr)^2 \\;\\to\\; \\text{minimum}$$

Setting the [[partial-derivatives|partial derivatives]] $\\partial S/\\partial a$ and $\\partial S/\\partial b$ to zero (see the derivation) gives

$$b = \\frac{S_{xy}}{S_{xx}}, \\qquad a = \\bar y - b\\,\\bar x$$

with the sums of squares and products of deviations from the means

$$S_{xx} = \\sum (x_i - \\bar x)^2, \\qquad S_{xy} = \\sum (x_i - \\bar x)(y_i - \\bar y), \\qquad S_{yy} = \\sum (y_i - \\bar y)^2$$

The second equation says that the line always passes through the centre of the data, $(\\bar x, \\bar y)$. Why squares? They are smooth, so calculus finds the minimum in closed form; they punish big misses more than small ones; and when the errors are normally distributed, the least-squares line is the most probable one.

### How good is the fit? r and R²
The **correlation coefficient**

$$r = \\frac{S_{xy}}{\\sqrt{S_{xx}\\,S_{yy}}}$$

runs from $-1$ (points exactly on a falling line) through 0 (no linear trend) to $+1$ (exactly on a rising line). Its square, $R^2$, is the fraction of the variation of $y$ that the line accounts for; the rest is left in the residuals. Two warnings go with it. $r$ measures only **straight-line** association: points on a symmetric parabola have $r = 0$ although $y$ depends perfectly on $x$. And **correlation is not causation**: ice-cream sales and drownings rise together because both follow the weather. Always look at the scatter plot — data sets with the same $r$ can look completely different.

### Making curves straight
Many laws become straight lines after a change of variables, and least squares then applies directly:

| law | plot | the slope gives |
|---|---|---|
| decay, $N = N_0 e^{-\\lambda t}$ | $\\ln N$ against $t$ | $-\\lambda$ |
| power law, $y = Cx^p$ | $\\ln y$ against $\\ln x$ | the exponent $p$ |
| pendulum, $T = 2\\pi\\sqrt{L/g}$ | $T^2$ against $L$ | $4\\pi^2/g$ |

That is the everyday laboratory use of [[logarithms|logarithms]]. The slope has its own uncertainty, $s_b = s_{\\text{res}}/\\sqrt{S_{xx}}$ with $s_{\\text{res}} = \\sqrt{\\sum (\\text{residuals})^2/(n - 2)}$, which carries into any quantity worked out from it ([[error-propagation|error propagation]]).
`,
  ideas: [
    'The least-squares line minimises the sum of the squared vertical distances (residuals) of the data from the line.',
    'Slope $b = S_{xy}/S_{xx}$ and intercept $a = \\bar y - b\\bar x$: the line passes through $(\\bar x, \\bar y)$.',
    'The correlation coefficient $r$ runs from −1 to 1; $R^2$ is the fraction of the variation in $y$ explained by the line.',
    '$r$ measures only straight-line association, and correlation does not prove causation.',
    'Exponential and power laws become straight lines on log and log–log axes.'
  ],
  pitfalls: [
    '$r = 0$ means no relationship — It means no straight-line relationship. Points on a perfect parabola can have $r = 0$.',
    'Correlation proves causation — A third factor can drive both quantities, or the causation can run the other way.',
    'A high $R^2$ means the model is right — A straight line through gently curved data can still give $R^2 = 0.95$. Plot the residuals: a systematic pattern in them means the wrong model.'
  ],
  derivation: {
    title: 'The least-squares equations',
    steps: [
      { text: 'Choose $a$ and $b$ to minimise the sum of squared residuals:', tex: 'S(a, b) = \\sum_i (y_i - a - b x_i)^2' },
      { text: 'At the minimum both partial derivatives vanish. The one with respect to $a$ gives', tex: '\\frac{\\partial S}{\\partial a} = -2\\sum_i (y_i - a - b x_i) = 0 \\;\\Rightarrow\\; \\bar y = a + b\\,\\bar x' },
      { text: 'So the line passes through $(\\bar x, \\bar y)$. Put $a = \\bar y - b\\bar x$ into the derivative with respect to $b$:', tex: '\\frac{\\partial S}{\\partial b} = -2\\sum_i x_i\\bigl[(y_i - \\bar y) - b\\,(x_i - \\bar x)\\bigr] = 0' },
      { text: 'The bracket adds up to zero over all points, so $x_i$ in front of it may be replaced by $x_i - \\bar x$. That leaves', tex: '\\sum_i (x_i - \\bar x)(y_i - \\bar y) = b \\sum_i (x_i - \\bar x)^2 \\;\\Rightarrow\\; b = \\frac{S_{xy}}{S_{xx}}' }
    ]
  },
  formulas: [
    {
      name: 'Slope of the least-squares line',
      expr: 'b = Sxy/Sxx', tex: 'b = \\frac{S_{xy}}{S_{xx}}',
      vars: {
        b: { name: 'slope of the best-fit line', signed: true },
        Sxy: { name: 'sum of products of x and y deviations', tex: 'S_{xy}', signed: true, value: 19.7 },
        Sxx: { name: 'sum of squared x deviations', tex: 'S_{xx}', value: 10 }
      },
      note: 'The starting values are the spring data of the first example.',
      practice: { unknowns: ['b'] },
      stories: { b: 'For a set of measurements, the sum of products of the x and y deviations is {Sxy} and the sum of squared x deviations is {Sxx}. What is the slope of the least-squares line?' }
    },
    {
      name: 'Intercept of the least-squares line',
      expr: 'a = ybar - b*xbar', tex: 'a = \\bar y - b\\,\\bar x',
      vars: {
        a: { name: 'intercept of the best-fit line', signed: true },
        ybar: { name: 'mean of the y values', tex: '\\bar y', signed: true, value: 6 },
        b: { name: 'slope', signed: true, value: 1.97 },
        xbar: { name: 'mean of the x values', tex: '\\bar x', signed: true, value: 3 }
      },
      practice: { unknowns: ['a'] },
      stories: { a: 'A least-squares line has slope {b}. The data have mean x-value {xbar} and mean y-value {ybar}. Where does the line cross the y-axis?' }
    },
    {
      name: 'Correlation coefficient',
      expr: 'r = Sxy/sqrt(Sxx*Syy)', tex: 'r = \\frac{S_{xy}}{\\sqrt{S_{xx}\\,S_{yy}}}',
      vars: {
        r: { name: 'correlation coefficient', signed: true, min: -1, max: 1 },
        Sxy: { name: 'sum of products of x and y deviations', tex: 'S_{xy}', signed: true, value: 19.7 },
        Sxx: { name: 'sum of squared x deviations', tex: 'S_{xx}', value: 10 },
        Syy: { name: 'sum of squared y deviations', tex: 'S_{yy}', value: 38.9 }
      },
      note: '$R^2 = r^2$ is the fraction of the variation of $y$ that the line explains.',
      practice: { unknowns: ['r'] },
      stories: { r: 'For a set of data, the sums of squared deviations are {Sxx} for x and {Syy} for y, and the sum of products of the deviations is {Sxy}. What is the correlation coefficient?' }
    }
  ],
  examples: [
    {
      title: 'Fitting a spring',
      q: 'Loads of 1, 2, 3, 4 and 5 N stretch a spring by 2.1, 3.9, 6.2, 7.8 and 10.0 cm. Find the least-squares line, the correlation coefficient and the spring constant.',
      steps: [
        'Means: $\\bar x = 3$ N, $\\bar y = 30.0/5 = 6.0$ cm.',
        'Deviations: $x$: $-2, -1, 0, 1, 2$; $y$: $-3.9, -2.1, 0.2, 1.8, 4.0$.',
        '$S_{xx} = 4 + 1 + 0 + 1 + 4 = 10$; $S_{xy} = 7.8 + 2.1 + 0 + 1.8 + 8.0 = 19.7$; $S_{yy} = 38.9$.',
        '$b = 19.7/10 = 1.97$ cm/N and $a = 6.0 - 1.97 \\times 3 = 0.09$ cm — close to zero, as it should be.',
        '$r = 19.7/\\sqrt{10 \\times 38.9} = 0.9988$, so $R^2 = 0.998$.',
        'The spring constant is the inverse slope: $k = 1/(0.0197\\ \\mathrm{m/N}) = 50.8$ N/m.'
      ],
      a: '$y = 0.09 + 1.97x$ (cm, N); r = 0.999; k ≈ 51 N/m.'
    },
    {
      title: 'A half-life from a straight line',
      q: 'A counter records 1000, 610, 370 and 225 counts per second at $t$ = 0, 10, 20 and 30 s. Find the decay constant and half-life by fitting a line to $\\ln N$ against $t$.',
      steps: [
        '$\\ln N$ = 6.908, 6.413, 5.914, 5.416; mean 6.163. $\\bar t = 15$ s.',
        '$S_{tt} = 225 + 25 + 25 + 225 = 500\\ \\mathrm{s^2}$.',
        '$S_{t,\\ln N} = (-15)(0.745) + (-5)(0.251) + (5)(-0.249) + (15)(-0.747) = -24.87$ s.',
        'Slope: $-24.87/500 = -0.0497\\ \\mathrm{s^{-1}}$, so $\\lambda = 0.0497\\ \\mathrm{s^{-1}}$.',
        'Half-life: $t_{1/2} = \\ln 2/\\lambda = 0.693/0.0497 = 13.9$ s.'
      ],
      a: 'λ ≈ 0.050 per second, half-life ≈ 13.9 s.'
    }
  ],
  quiz: [
    { q: 'Points lying exactly on the line $y = 5 - 2x$ have correlation coefficient…', choices: ['−2', '−1', '0', '1'], a: 1,
      why: 'All points on a falling straight line give $r = -1$. The correlation coefficient is not the slope; it never goes beyond ±1.' },
    { q: 'Points on $y = x^2$ for $x$ from −3 to 3, spaced evenly and symmetrically, have $r$ close to…', choices: ['1', '−1', '0', '0.5'], a: 2,
      why: 'The left half falls and the right half rises; the linear trends cancel. $y$ depends perfectly on $x$, just not linearly.' },
    { q: 'Least-squares fitting minimises…', choices: ['the sum of the vertical distances', 'the sum of the squared vertical distances', 'the sum of the perpendicular distances', 'the number of points off the line'], a: 1,
      why: 'Plain distances would cancel (positive and negative) or give no neat formula; squares are always positive and smooth.' },
    { q: 'A strong correlation between two quantities proves that one causes the other.', a: false,
      why: 'Both may be driven by a third factor, or the causation may run the other way. Proving cause needs controlled experiments or careful reasoning beyond $r$.' },
    { q: 'The least-squares line always passes through…', choices: ['the origin', 'the first data point', 'the point $(\\bar x, \\bar y)$', 'the highest data point'], a: 2,
      why: 'Setting $\\partial S/\\partial a = 0$ gives $\\bar y = a + b\\bar x$.' }
  ],
  problems: [
    { q: 'A data set has $S_{xx} = 40$, $S_{yy} = 25$ and $S_{xy} = -30$. Find the correlation coefficient.', answer: -0.9487, tol: 0.01,
      steps: ['$r = \\dfrac{-30}{\\sqrt{40 \\times 25}} = \\dfrac{-30}{31.62}$.', '$r = -0.949$: a strong falling trend.'] },
    { q: 'A pendulum experiment plots $T^2$ against the length $L$ and finds a least-squares slope of 4.02 s²/m. What value of $g$ does it give?', answer: 9.8205, unit: 'm/s²', tol: 0.01,
      steps: ['From $T^2 = \\dfrac{4\\pi^2}{g}L$, the slope is $4\\pi^2/g$.', '$g = 4\\pi^2/4.02 = 39.48/4.02 = 9.82\\ \\mathrm{m/s^2}$.'] }
  ],
  applications: [
    'Calibrating instruments against known standards.',
    'Extracting physical constants from straight-line plots: spring constants, $g$ from a pendulum, Planck\'s constant from the photoelectric effect.',
    'Trend estimation in engineering, climate and economic data.',
    'Machine learning, where linear regression is the simplest model and least squares the simplest way to train it.'
  ],
  history: 'Adrien-Marie Legendre published the method of least squares in 1805; Carl Friedrich Gauss, who had used it in 1801 to recover the orbit of the newly discovered Ceres, published his own account in 1809. Francis Galton coined "regression" in the 1880s, when he found that the children of unusually tall parents tend to be less extreme — regression to the mean — and Karl Pearson formalised the correlation coefficient in the 1890s.',
  sim: 'ps-least-squares'
},

{
  id: 'error-propagation', parent: 'statistics', title: 'Measurement uncertainty and error propagation', level: 2,
  short: 'Every measurement comes with an uncertainty; these rules say how the uncertainties of the inputs combine into the uncertainty of a calculated result.',
  keywords: ['uncertainty', 'error', 'error propagation', 'propagation of uncertainty', 'absolute uncertainty', 'relative uncertainty', 'percentage error', 'quadrature', 'random error', 'systematic error', 'error bars', 'tolerance stack-up', 'Monte Carlo'],
  prereq: ['standard-deviation', 'linear-approximation', 'partial-derivatives'],
  related: ['scientific-notation', 'central-limit-theorem', 'linear-regression', 'physics:simple-pendulum'],
  body: `
A measurement is never just a number. A table measured with a steel tape is $1.502 \\pm 0.002$ m long: the $\\pm$ part, the **uncertainty**, says how far the true value might plausibly lie from the reading. Here, as in most of science, the uncertainty is a [[standard-deviation|standard deviation]] — the scatter you would see if the measurement were repeated many times. When you calculate something from measured quantities — a density from a mass and a volume, $g$ from a pendulum — the uncertainties of the inputs carry through into the result. **Error propagation** is the arithmetic of that.

### Random and systematic errors
**Random errors** scatter readings both ways — reaction time, electrical noise, the last digit of a scale — and they shrink when you average ([[central-limit-theorem|central limit theorem]]). **Systematic errors** push every reading the same way — a stretched tape, a clock running fast, an unnoticed zero offset — and averaging does nothing to them; they are found by calibration and by checking one method against another. The rules below are for random, independent errors.

### Sums and differences: absolute uncertainties in quadrature
For $q = x + y$ or $q = x - y$ with independent uncertainties $\\sigma_x$ and $\\sigma_y$, the variances add ([[expected-value|expected value and variance]]):

$$\\sigma_q = \\sqrt{\\sigma_x^2 + \\sigma_y^2}$$

Two lengths each uncertain by 0.3 mm give a total uncertain by $\\sqrt{0.09 + 0.09} = 0.42$ mm, not 0.6 mm: independent errors partly cancel. Simply adding the uncertainties gives a worst case — safe, but pessimistic.

> [!warn] Subtracting two nearly equal numbers is dangerous. $(10.3 \\pm 0.1) - (10.0 \\pm 0.1) = 0.3 \\pm 0.14$: each input is known to 1 %, the difference only to about 50 %. Design experiments to measure small differences directly.

### Products, quotients and powers: relative uncertainties
For $q = xy$ or $q = x/y$ it is the **relative** uncertainties that add in quadrature:

$$\\frac{\\sigma_q}{|q|} = \\sqrt{\\left(\\frac{\\sigma_x}{x}\\right)^2 + \\left(\\frac{\\sigma_y}{y}\\right)^2}$$

and for a power $q = x^n$ the relative uncertainty is multiplied by $|n|$: a radius known to 1 % gives an area known to 2 % and a volume to 3 %. The general rule, for any smooth function $q(x, y, \\dots)$, comes from the [[linear-approximation|linear approximation]] with [[partial-derivatives|partial derivatives]], and the special rules are all cases of it:

$$\\sigma_q = \\sqrt{\\left(\\frac{\\partial q}{\\partial x}\\,\\sigma_x\\right)^2 + \\left(\\frac{\\partial q}{\\partial y}\\,\\sigma_y\\right)^2 + \\dots}$$

### A worked density
A metal cylinder has mass $125.4 \\pm 0.2$ g, diameter $2.00 \\pm 0.02$ cm and height $5.00 \\pm 0.02$ cm. Its density is $\\rho = 4m/(\\pi d^2 h) = 7.98\\ \\mathrm{g/cm^3}$. The relative uncertainties are 0.16 % for $m$, $2 \\times 1\\,\\% = 2\\,\\%$ for $d^2$ and 0.4 % for $h$, so

$$\\frac{\\sigma_\\rho}{\\rho} = \\sqrt{0.16^2 + 2^2 + 0.4^2}\\;\\% = 2.0\\,\\%$$

and $\\rho = 7.98 \\pm 0.16\\ \\mathrm{g/cm^3}$. The squared diameter dominates everything; weighing more carefully would be wasted effort. That is the practical lesson of error propagation: it tells you **which measurement to improve**.

### Reporting
Quote the uncertainty to one or two significant figures and the value to the same decimal place — $7.98 \\pm 0.16$, not $7.983212 \\pm 0.1633$ ([[scientific-notation|significant figures]]). When the formula is awkward, a computer can propagate uncertainties by **Monte Carlo**: draw thousands of random input values with the right spreads, compute the result for each, and take the standard deviation of the results.
`,
  ideas: [
    'Every measured value comes with an uncertainty, usually quoted as one standard deviation.',
    'For sums and differences, absolute uncertainties add in quadrature: $\\sigma_q = \\sqrt{\\sigma_x^2 + \\sigma_y^2}$.',
    'For products and quotients, relative uncertainties add in quadrature; for a power $x^n$ the relative uncertainty is multiplied by $|n|$.',
    'The largest contribution dominates: improve the worst measurement first.',
    'Averaging reduces random errors but not systematic ones.'
  ],
  pitfalls: [
    'Uncertainties simply add — For independent errors they add in quadrature, which gives less. Straight addition is a worst case.',
    'A difference is as precise as the numbers it came from — Subtracting nearly equal values can turn inputs known to 1 % into a result known to 50 %.',
    'Averaging many readings removes all error — It reduces random scatter like $1/\\sqrt{n}$ but leaves systematic errors untouched.'
  ],
  formulas: [
    {
      name: 'Uncertainty of a sum or difference',
      expr: 'sq = sqrt(sx^2 + sy^2)', tex: '\\sigma_q = \\sqrt{\\sigma_x^2 + \\sigma_y^2}',
      vars: {
        sq: { name: 'uncertainty of q = x + y or x − y', tex: '\\sigma_q', q: 'length', unit: 'mm' },
        sx: { name: 'uncertainty of x', tex: '\\sigma_x', q: 'length', unit: 'mm', value: 0.3 },
        sy: { name: 'uncertainty of y', tex: '\\sigma_y', q: 'length', unit: 'mm', value: 0.3 }
      },
      note: 'For independent errors. Straight addition, $\\sigma_x + \\sigma_y$, is the worst case.',
      stories: {
        sq: 'Two lengths with independent uncertainties {sx} and {sy} are added. What is the uncertainty of the total?',
        sx: 'A difference q = x − y must be known to within {sq}. If y is uncertain by {sy}, how precisely must x be measured?'
      }
    },
    {
      name: 'Uncertainty of a product',
      expr: 'sq = x*y*sqrt((sx/x)^2 + (sy/y)^2)', tex: '\\sigma_q = xy\\sqrt{\\left(\\frac{\\sigma_x}{x}\\right)^2 + \\left(\\frac{\\sigma_y}{y}\\right)^2}',
      vars: {
        sq: { name: 'uncertainty of the product q = xy', tex: '\\sigma_q', q: 'area', unit: 'm²' },
        x: { name: 'first factor', q: 'length', unit: 'm', value: 2 },
        sx: { name: 'uncertainty of x', tex: '\\sigma_x', q: 'length', unit: 'm', value: 0.02 },
        y: { name: 'second factor', q: 'length', unit: 'm', value: 1.5 },
        sy: { name: 'uncertainty of y', tex: '\\sigma_y', q: 'length', unit: 'm', value: 0.03 }
      },
      note: 'Relative uncertainties (1 % and 2 % here) add in quadrature to 2.24 %. A quotient $q = x/y$ follows the same relative rule.',
      practice: { unknowns: ['sq'] },
      stories: { sq: 'A rectangular plate measures {x} (uncertainty {sx}) by {y} (uncertainty {sy}). What is the uncertainty of its area?' }
    },
    {
      name: 'Uncertainty of g from a pendulum',
      expr: 'sg = 4*pi^2*L/T^2*sqrt((sL/L)^2 + (2*sT/T)^2)', tex: '\\sigma_g = \\frac{4\\pi^2 L}{T^2}\\sqrt{\\left(\\frac{\\sigma_L}{L}\\right)^2 + \\left(\\frac{2\\sigma_T}{T}\\right)^2}',
      vars: {
        sg: { name: 'uncertainty of g', tex: '\\sigma_g', q: 'accel', unit: 'm/s²' },
        L: { name: 'length of the pendulum', q: 'length', unit: 'm', value: 1 },
        sL: { name: 'uncertainty of the length', tex: '\\sigma_L', q: 'length', unit: 'mm', value: 2 },
        T: { name: 'period', q: 'time', unit: 's', value: 2.006 },
        sT: { name: 'uncertainty of the period', tex: '\\sigma_T', q: 'time', unit: 's', value: 0.005 }
      },
      note: 'From $g = 4\\pi^2 L/T^2$ ([[physics:simple-pendulum|simple pendulum]]): the period is squared, so its relative uncertainty counts twice. Timing 20 swings instead of one divides $\\sigma_T$ by 20.',
      practice: { unknowns: ['sg'] },
      stories: { sg: 'A pendulum of length {L} (uncertainty {sL}) has a period of {T} (uncertainty {sT}). How uncertain is the value of g calculated from them?' }
    }
  ],
  examples: [
    {
      title: 'Measuring g with a pendulum',
      q: 'A pendulum is $1.000 \\pm 0.002$ m long and its period is $2.006 \\pm 0.005$ s. Find $g$ and its uncertainty. Which measurement limits the result?',
      steps: [
        '$g = 4\\pi^2 L/T^2 = 39.48 \\times 1.000/2.006^2 = 9.811\\ \\mathrm{m/s^2}$.',
        'Relative uncertainties: length $0.002/1.000 = 0.2\\,\\%$; period $0.005/2.006 = 0.25\\,\\%$, doubled because $T$ is squared: $0.5\\,\\%$.',
        'Combined: $\\sqrt{0.2^2 + 0.5^2}\\,\\% = 0.54\\,\\%$, so $\\sigma_g = 0.0054 \\times 9.811 = 0.053\\ \\mathrm{m/s^2}$.',
        'The timing dominates. Timing 20 swings in one go would cut its contribution twentyfold.'
      ],
      a: '$g = 9.81 \\pm 0.05\\ \\mathrm{m/s^2}$, limited by the timing.'
    },
    {
      title: 'A small temperature rise',
      q: 'A thermometer reads $24.8 \\pm 0.2$ °C before and $25.3 \\pm 0.2$ °C after a reaction. What is the temperature rise, with its uncertainty?',
      steps: [
        'Rise: $25.3 - 24.8 = 0.5$ °C.',
        'Uncertainty of a difference: $\\sqrt{0.2^2 + 0.2^2} = 0.28$ °C.',
        'Result: $0.5 \\pm 0.3$ °C — each reading was good to 1 %, the rise only to about 60 %.',
        'A better design measures the difference directly, with a differential thermometer, or makes the rise larger.'
      ],
      a: '0.5 ± 0.3 °C'
    }
  ],
  quiz: [
    { q: 'Two lengths, each with an independent uncertainty of ±0.3 mm, are added. The uncertainty of the sum is…', choices: ['0.6 mm', '0.42 mm', '0.3 mm', '0.09 mm'], a: 1,
      why: '$\\sqrt{0.3^2 + 0.3^2} = 0.42$ mm. The errors are independent, so they partly cancel; 0.6 mm is the worst case.' },
    { q: 'A radius is measured to 2 %. The area of the circle is then known to about…', choices: ['1 %', '2 %', '4 %', '8 %'], a: 2,
      why: '$A = \\pi r^2$: a power of 2 doubles the relative uncertainty.' },
    { q: 'A ruler reads 1 mm too long at every mark. Which of these deals with that error?', choices: ['averaging more readings', 'calibrating against a standard', 'writing more significant figures', 'measuring more quickly'], a: 1,
      why: 'It is a systematic error: every reading is off in the same way, so averaging cannot remove it. Calibration can.' },
    { q: 'Averaging many readings reduces random errors but not systematic ones.', a: true,
      why: 'Random errors scatter both ways and cancel in the mean, like $1/\\sqrt{n}$. A systematic offset is present in every reading and survives the averaging intact.' },
    { q: '$q = x/y$, where $x$ and $y$ have independent relative uncertainties $a$ and $b$. Write the relative uncertainty of $q$.', answer: 'sqrt(a^2 + b^2)', vars: ['a', 'b'],
      why: 'For products and quotients the relative uncertainties add in quadrature, whether you multiply or divide.' }
  ],
  problems: [
    { q: 'A runner covers $100.0 \\pm 0.5$ m in $12.5 \\pm 0.2$ s. What is the uncertainty of her average speed of 8.0 m/s?', answer: 0.1341, unit: 'm/s', tol: 0.02,
      steps: ['Relative uncertainties: $0.5/100 = 0.5\\,\\%$ and $0.2/12.5 = 1.6\\,\\%$.', 'Combined: $\\sqrt{0.5^2 + 1.6^2}\\,\\% = 1.68\\,\\%$.', '$\\sigma_v = 0.0168 \\times 8.0 = 0.13$ m/s.'] },
    { q: 'The side of a cube is measured as $3.00 \\pm 0.03$ cm. What is the uncertainty of its volume?', answer: 0.81, unit: 'cm³', tol: 0.02,
      steps: ['$V = 27.0\\ \\mathrm{cm^3}$.', 'The relative uncertainty of the side, 1 %, is tripled by the cube: 3 %.', '$\\sigma_V = 0.03 \\times 27.0 = 0.81\\ \\mathrm{cm^3}$.'] }
  ],
  applications: [
    'Every laboratory report: a result stated as value ± uncertainty with a justified error budget.',
    'Tolerance stack-up in engineering: how the tolerances of parts combine in an assembly (root-sum-square versus worst case).',
    'Metrology and calibration, where international guides lay down exactly these rules.',
    'Designing an experiment: finding which measurement dominates the final uncertainty before building anything.'
  ]
},

{
  id: 'hypothesis-testing', parent: 'statistics', title: 'Hypothesis testing', level: 3,
  short: 'A disciplined way to ask whether data could be due to chance alone: assume nothing is going on, work out how surprising the data would then be, and decide.',
  keywords: ['hypothesis test', 'null hypothesis', 'alternative hypothesis', 'p-value', 'significance level', 'statistical significance', 'z-test', 't-test', 'type I error', 'type II error', 'power', 'confidence interval', 'five sigma', 'two-sided test'],
  prereq: ['normal-distribution', 'central-limit-theorem', 'standard-deviation'],
  related: ['bayes-theorem', 'binomial-distribution', 'linear-regression'],
  body: `
A coin is tossed 100 times and lands heads 60 times. Is it biased, or was that luck? A fair coin gives 50 heads on average with a standard deviation of 5 ([[binomial-distribution|binomial]]), so 60 is two standard deviations high. Results that far out, in either direction, happen about 5 % of the time with a fair coin. Suspicious — but not damning. **Hypothesis testing** turns this kind of reasoning into a procedure.

### The recipe
1. State a **null hypothesis** $H_0$, the dull explanation: "the coin is fair", "the new alloy is no stronger", "there is no signal". State the **alternative** $H_1$ you are looking for.
2. Choose a **test statistic** that measures how far the data are from what $H_0$ predicts — often a z-score.
3. Work out the **p-value**: the probability, **if $H_0$ were true**, of data at least as extreme as those observed.
4. If $p$ falls below a **significance level** $\\alpha$ fixed in advance — 0.05 is common, 0.01 stricter — reject $H_0$. Otherwise the data are consistent with it.

For the coin, $z = (60 - 50)/5 = 2.0$, and a **two-sided** test counts both tails: $p = P(|Z| \\ge 2) = 0.046$ — just below 0.05, so the coin would be judged biased at the 5 % level. The exact binomial calculation, which respects that counts are whole numbers, gives $p = 0.057$: a reminder that 0.05 is a convention, not a cliff edge.

### Testing a mean
Most tests compare an average with a claimed value. Measure $n$ items, find their mean $\\bar x$, and compare it with the claimed mean $\\mu_0$ in units of the [[standard-deviation|standard error]]:

$$z = \\frac{\\bar x - \\mu_0}{\\sigma/\\sqrt{n}}$$

By the [[central-limit-theorem|central limit theorem]] this is close to standard normal when $H_0$ holds. A filling machine meant to put 500 g into each bag, with $\\sigma = 4$ g, yields a sample of 16 bags averaging 497.5 g: $z = -2.5/1 = -2.5$ and the two-sided $p = 0.012$, strong evidence that the machine is set low. When $\\sigma$ is not known and must be estimated from a small sample, the same ratio follows Student's $t$-distribution, whose tails are fatter than the normal curve's.

### Two ways to be wrong
A **type I error** rejects a true $H_0$ — a false alarm; its probability is $\\alpha$. A **type II error** keeps a false $H_0$ — a missed effect. Making $\\alpha$ smaller makes misses more likely unless you collect more data; the probability of catching a real effect of a given size is the test's **power**.

### What a p-value is not
The p-value is $P(\\text{data this extreme} \\mid H_0)$. It is **not** the probability that $H_0$ is true — turning one into the other needs [[bayes-theorem|Bayes' theorem]] and a prior. Nor does a small $p$ mean a large or important effect: with enough data, a trivially small difference becomes "significant". And test twenty useless ideas at $\\alpha = 0.05$ and on average one will pass by luck. Particle physicists guard against this "look-elsewhere effect" by demanding **five sigma** — a one-sided $p \\approx 3 \\times 10^{-7}$ — before claiming a discovery, as for the Higgs boson in 2012.

> [!tip] A **confidence interval** says the same thing in a more useful form. The 95 % interval $\\bar x \\pm 1.96\\,\\sigma/\\sqrt{n}$ contains exactly those values of $\\mu_0$ that a two-sided test at the 5 % level would not reject — and it shows the size of the effect as well as whether there is one.
`,
  ideas: [
    'Assume the dull explanation (the null hypothesis) and ask how surprising the data would be if it were true.',
    'The p-value is the probability, under the null hypothesis, of data at least as extreme as those observed.',
    'Reject the null hypothesis when $p$ is below a significance level chosen in advance, such as 0.05.',
    'For a mean, $z = (\\bar x - \\mu_0)/(\\sigma/\\sqrt{n})$; a two-sided test at 5 % rejects when $|z| > 1.96$.',
    'A confidence interval shows the size of an effect as well as whether it is significant.'
  ],
  pitfalls: [
    'The p-value is the probability that the null hypothesis is true — It is the probability of the data given the null hypothesis. Reversing it needs Bayes\' theorem and a prior.',
    'Not significant means no effect — It means the data could not tell. A small study can easily miss a real effect (a type II error).',
    'Significant means important — With a huge sample a difference too small to matter can have a tiny p-value. Report the size of the effect, ideally as a confidence interval.'
  ],
  formulas: [
    {
      name: 'z statistic for a mean',
      expr: 'z = (xbar - mu0)/(sigma/sqrt(n))', tex: 'z = \\frac{\\bar x - \\mu_0}{\\sigma/\\sqrt{n}}',
      vars: {
        z: { name: 'test statistic', signed: true },
        xbar: { name: 'sample mean', tex: '\\bar x', q: 'mass', unit: 'g', value: 497.5 },
        mu0: { name: 'mean claimed by the null hypothesis', tex: '\\mu_0', q: 'mass', unit: 'g', value: 500 },
        sigma: { name: 'standard deviation of single values', q: 'mass', unit: 'g', value: 4 },
        n: { name: 'sample size', int: true, min: 1, value: 16 }
      },
      note: 'The starting values are the filling machine: 16 bags averaging 497.5 g against a claimed 500 g.',
      practice: { unknowns: ['xbar'] },
      stories: {
        z: 'A machine should fill bags with {mu0}, with a spread of {sigma} per bag. A sample of {n} bags averages {xbar}. What is the z statistic?',
        xbar: 'A machine should fill bags with {mu0}, with a spread of {sigma} per bag. What average of a sample of {n} bags would give a test statistic z = {z}?'
      }
    },
    {
      name: 'Two-sided p-value from z',
      expr: 'p = 1 - erf(abs(z)/sqrt(2))', tex: 'p = 1 - \\operatorname{erf}\\left(\\frac{|z|}{\\sqrt 2}\\right)',
      vars: {
        p: { name: 'two-sided p-value', min: 0, max: 1 },
        z: { name: 'test statistic (a standard normal z)', signed: true, value: 2 }
      },
      note: 'The chance of $|Z| \\ge |z|$ under the null hypothesis. Solving for $z$ gives the critical values: $p = 0.05$ at $z = \\pm 1.96$.',
      practice: { unknowns: ['p', 'z'] },
      stories: {
        p: 'A test statistic comes out at z = {z}. What is the two-sided p-value?',
        z: 'Which values of the test statistic z give a two-sided p-value of {p}?'
      }
    },
    {
      name: 'Margin of error of a mean',
      expr: 'E = z*s/sqrt(n)', tex: 'E = z\\,\\frac{s}{\\sqrt{n}}',
      vars: {
        E: { name: 'margin of error (half-width of the confidence interval)' },
        z: { name: 'critical z (1.96 for 95 % confidence)', value: 1.96 },
        s: { name: 'standard deviation of single values', value: 4 },
        n: { name: 'number of values', value: 16, min: 2, max: 10000, log: true }
      },
      note: 'The confidence interval is $\\bar x \\pm E$. Solving for $n$ gives the sample size needed; round it up.',
      practice: { unknowns: ['E', 'n'] },
      stories: {
        E: 'Single measurements scatter with standard deviation {s}. What is the margin of error (critical z = {z}) of the mean of {n} measurements?',
        n: 'Single measurements scatter with standard deviation {s}. How many are needed for the margin of error of their mean (critical z = {z}) to be {E}? (Round up.)'
      }
    }
  ],
  examples: [
    {
      title: 'A loaded die?',
      q: 'A die rolled 600 times shows 125 sixes. Is it loaded towards six? Test at the 5 % level.',
      steps: [
        '$H_0$: the die is fair, $p = 1/6$. Expected sixes $600/6 = 100$; standard deviation $\\sqrt{600 \\times \\frac16 \\times \\frac56} = 9.13$.',
        '$z = (125 - 100)/9.13 = 2.74$.',
        'Two-sided $p = P(|Z| \\ge 2.74) = 0.006$.',
        '$p < 0.05$: reject $H_0$. Results this extreme would come from a fair die only about 6 times in 1000.'
      ],
      a: 'z = 2.74, p ≈ 0.006: the die appears loaded.'
    },
    {
      title: 'A confidence interval for a resistor batch',
      q: 'Twenty-five resistors from a batch labelled 100 Ω have mean 101.2 Ω; single resistors scatter with $\\sigma = 2$ Ω. Give a 95 % confidence interval for the batch mean. Is the label plausible?',
      steps: [
        'Standard error: $2/\\sqrt{25} = 0.4$ Ω.',
        'Margin of error: $1.96 \\times 0.4 = 0.78$ Ω.',
        'Interval: $101.2 \\pm 0.8$ Ω, from 100.4 to 102.0 Ω.',
        '100 Ω lies outside it, so a test at the 5 % level rejects "mean = 100 Ω" ($z = 1.2/0.4 = 3.0$). The batch runs about 1 % high.'
      ],
      a: '100.4–102.0 Ω; the nominal 100 Ω is not plausible.'
    }
  ],
  quiz: [
    { q: 'A p-value of 0.03 means…', choices: ['there is a 3 % chance that the null hypothesis is true', 'if the null hypothesis were true, data this extreme would turn up about 3 % of the time', 'the effect is 3 % in size', 'there is a 97 % chance that the alternative is true'], a: 1,
      why: 'A p-value is a probability of data given the null hypothesis, not of the hypothesis given the data.' },
    { q: 'Twenty independent, useless treatments are each tested at $\\alpha = 0.05$. How many "significant" results should you expect?', choices: ['0', '1', '5', '20'], a: 1,
      why: 'Each has a 5 % chance of a false alarm: $20 \\times 0.05 = 1$ expected. This is why multiple comparisons need stricter thresholds.' },
    { q: 'The same small real effect is studied with a much larger sample. The p-value becomes…', choices: ['larger', 'smaller', 'the same', 'larger than 1'], a: 1,
      why: 'The standard error shrinks like $1/\\sqrt{n}$, so the same difference becomes more standard errors away from zero and $p$ falls.' },
    { q: 'Failing to reject the null hypothesis proves that it is true.', a: false,
      why: 'It only means the data are consistent with it. Too few data, or too much noise, can hide a real effect.' },
    { q: 'A two-sided test at the 5 % level rejects the null hypothesis when $|z|$ exceeds about…', choices: ['1.00', '1.64', '1.96', '3.00'], a: 2,
      why: '2.5 % in each tail lies beyond $\\pm 1.96$. (1.64 is the one-sided 5 % value.)' }
  ],
  problems: [
    { q: 'A coin tossed 100 times gives 58 heads. Using the normal approximation (no continuity correction), what is the two-sided p-value for "the coin is fair"?', answer: 0.1096, tol: 0.02,
      steps: ['Under $H_0$: mean 50, standard deviation 5.', '$z = (58 - 50)/5 = 1.6$.', '$p = P(|Z| \\ge 1.6) = 0.11$ — not significant at the 5 % level.'] },
    { q: 'A sample of 36 values has mean 101.8. The null hypothesis says the mean is 100, and single values have $\\sigma = 6$. What is the two-sided p-value?', answer: 0.0719, tol: 0.02,
      steps: ['Standard error: $6/\\sqrt{36} = 1$.', '$z = (101.8 - 100)/1 = 1.8$.', '$p = P(|Z| \\ge 1.8) = 0.072$ — not significant at 5 %.'] }
  ],
  applications: [
    'Clinical trials: is a new treatment better than the old one, or is the difference luck?',
    'Quality control: detecting when a production process has drifted from its target.',
    'Particle physics and astronomy: deciding whether a bump in the data is a discovery.',
    'A/B testing of websites and products.'
  ],
  history: 'William Gosset, a chemist at the Guinness brewery in Dublin, published the t-test in 1908 under the pen name "Student". Ronald Fisher popularised p-values and the 5 % level in the 1920s, and in 1933 Jerzy Neyman and Egon Pearson framed testing as a choice between two hypotheses, with its two kinds of error.',
  sim: { id: 'ps-normal-area', params: { mode: 'outside', z: 1.96 }, title: 'Two tails: where p-values live' }
}

);
