/* HYPER-MATH · content/probability.js — chance and how to reason with it: probability,
 * counting, conditional probability, Bayes, random variables, expectation and variance. */
Hyper.add(

{
  id: 'probability-basics', parent: 'probability', title: 'Probability', level: 1,
  short: 'A number from 0 to 1 that measures how likely an event is — in the long run, the fraction of trials in which it happens.',
  keywords: ['probability', 'chance', 'likelihood', 'sample space', 'event', 'outcome', 'complement', 'addition rule', 'mutually exclusive', 'relative frequency', 'law of large numbers', 'odds', 'at least one'],
  prereq: ['fractions-ratios', 'percentages'],
  related: ['combinatorics', 'conditional-probability', 'random-variables'],
  body: `
Toss a coin ten times and you may well see seven heads. Toss it ten thousand times and the fraction of heads will sit very close to one half — typically within half a percentage point. That settling down is what a **probability** measures: a number between 0 and 1 giving the fraction of a long run of trials in which an event occurs. Probability 0 means it never happens, 1 means it always does, and $P = 0.25$ means about one trial in four.

### Outcomes, sample space and events
Every chance experiment has a set of possible **outcomes**, its **sample space** $S$. Rolling a die gives $S = \\{1, 2, 3, 4, 5, 6\\}$. An **event** is any collection of outcomes you care about: "an even number" is the event $\\{2, 4, 6\\}$. When all the outcomes are equally likely — a fair die, a well-shuffled pack — the probability of an event is a matter of counting:

$$P(A) = \\frac{\\text{number of outcomes in } A}{\\text{number of outcomes in } S}$$

So $P(\\text{even}) = 3/6 = 1/2$. Two dice have $6 \\times 6 = 36$ equally likely ordered pairs, six of which add up to 7, so $P(\\text{total } 7) = 6/36 = 1/6$. Counting large sample spaces quickly is the business of [[combinatorics|permutations and combinations]].

### The rules every probability obeys
However you interpret it, a probability follows three rules: $0 \\le P(A) \\le 1$; the whole sample space has $P(S) = 1$; and for events that cannot happen together — **mutually exclusive** events — probabilities add. Two consequences do most of the everyday work:

- **Complement:** $P(\\text{not } A) = 1 - P(A)$.
- **Addition rule:** $P(A \\text{ or } B) = P(A) + P(B) - P(A \\text{ and } B)$. The last term removes the outcomes counted twice. A heart or a king from 52 cards: $13/52 + 4/52 - 1/52 = 16/52$.

> [!tip] For any "at least one" question, find the chance of **none** and subtract it from 1. At least one six in four rolls of a die: $1 - (5/6)^4 = 0.518$ — slightly better than even, which is why a seventeenth-century gambler liked the bet.

### Long runs: the law of large numbers
The **relative frequency** of an event — how often it happened divided by the number of trials — drifts towards its probability as trials pile up, with fluctuations that shrink like $1/\\sqrt{n}$. In 100 tosses the fraction of heads typically lands within about 0.05 of one half; in 10 000 tosses within about 0.005. It is the *fraction* that settles: the gap between the number of heads and half the number of tosses actually tends to grow, like $\\sqrt{n}$. The simulation rolls a die thousands of times so you can watch every face approach $1/6$.

### Why science needs it
Chance is built into nature, not only into games. Each unstable nucleus has a fixed probability of decaying in the next second, the root of [[physics:radioactive-decay|radioactive decay]]; the quantum [[physics:wavefunction|wavefunction]] gives only the probability of finding a particle here or there; and the [[physics:entropy|entropy]] of a gas counts how many microscopic arrangements fit what we observe. In engineering, reliability figures, safety margins and weather forecasts are all statements of probability.
`,
  ideas: [
    'A probability runs from 0 (impossible) to 1 (certain) and can be read as the long-run fraction of trials in which the event happens.',
    'With equally likely outcomes, $P(A)$ = (outcomes in $A$) / (all outcomes), so probability often comes down to counting.',
    'The complement rule $P(\\text{not } A) = 1 - P(A)$ is the quickest route to "at least one" questions.',
    'For events that can overlap, $P(A \\text{ or } B) = P(A) + P(B) - P(A \\text{ and } B)$.',
    'Relative frequencies settle towards the probability as trials accumulate (the law of large numbers).'
  ],
  pitfalls: [
    'After five reds in a row, black is "due" — The roulette wheel has no memory. Every spin is independent and black is exactly as likely as always (the gambler\'s fallacy).',
    'Every outcome you can list is equally likely — The totals of two dice run from 2 to 12, but 7 arises in six ways and 2 in only one. Equal likelihood has to come from the mechanism: the 36 ordered pairs.',
    'P(A or B) = P(A) + P(B) always — Only for mutually exclusive events. A heart or a king is 16/52, not 17/52, because the king of hearts must not be counted twice.'
  ],
  formulas: [
    {
      name: 'Probability with equally likely outcomes',
      expr: 'P = m/N', tex: 'P = \\frac{m}{N}',
      vars: {
        P: { name: 'probability of the event', min: 0, max: 1 },
        m: { name: 'outcomes in the event', int: true, value: 6 },
        N: { name: 'equally likely outcomes in all', int: true, value: 36 }
      },
      note: 'Only when every outcome is equally likely. Two dice have $N = 36$ ordered outcomes; six of them total 7.',
      practice: { unknowns: ['P'] },
      stories: { P: 'Of {N} equally likely outcomes, {m} count as a success. What is the probability of a success?' }
    },
    {
      name: 'At least one success in n independent tries',
      expr: 'P = 1 - (1 - p)^n', tex: 'P = 1 - (1 - p)^n',
      vars: {
        P: { name: 'probability of at least one success', min: 0, max: 1 },
        p: { name: 'probability of success in one try', value: 1 / 6, min: 0, max: 1 },
        n: { name: 'number of tries', int: true, min: 1, value: 4 }
      },
      note: 'The chance of no success at all is $(1 - p)^n$; everything else counts as "at least one". To find how many tries reach a target, step $n$ up (or use Graph) until $P$ passes it: with $p = 1/6$, $n = 13$ is the first to exceed 90 %.',
      practice: { unknowns: ['P', 'p'] },
      stories: {
        P: 'Each try succeeds with probability {p}, independently of the others. What is the probability of at least one success in {n} tries?',
        p: 'You get {n} independent tries, and you want a probability {P} of at least one success. How likely must each single try be to succeed?'
      }
    },
    {
      name: 'Probability from odds',
      expr: 'P = O/(1 + O)', tex: 'P = \\frac{O}{1 + O}',
      vars: {
        P: { name: 'probability of the event', min: 0, max: 1 },
        O: { name: 'odds in favour (successes per failure)', value: 1 / 3 }
      },
      note: 'Odds of $a$ to $b$ in favour mean $O = a/b$. "3 to 1 against" is odds of 1 to 3 in favour, $O = 1/3$, so $P = 1/4$. Conversely $O = P/(1 - P)$.',
      stories: {
        P: 'The odds in favour of an event are {O} (successes per failure). What probability does that correspond to?',
        O: 'An event has probability {P}. What are the odds in its favour?'
      }
    }
  ],
  examples: [
    {
      title: 'Two dice, three questions',
      q: 'Two fair dice are rolled. Find the probability that (a) the total is at least 10, (b) at least one die shows a six, (c) the total is 7 or at least one die shows a six.',
      steps: [
        'There are 36 equally likely ordered pairs.',
        '(a) Totals of 10: (4,6), (5,5), (6,4); of 11: (5,6), (6,5); of 12: (6,6). Six pairs, so $P = 6/36 = 1/6$.',
        '(b) Complement: no six on either die happens in $5 \\times 5 = 25$ ways, so $P = 1 - 25/36 = 11/36 \\approx 0.306$.',
        '(c) Addition rule: $P(7) = 6/36$, $P(\\text{a six}) = 11/36$, and both happen for (1,6) and (6,1), so $P = \\frac{6 + 11 - 2}{36} = \\frac{15}{36} \\approx 0.417$.'
      ],
      a: '(a) 1/6, (b) 11/36 ≈ 0.31, (c) 15/36 ≈ 0.42'
    },
    {
      title: 'The Chevalier\'s two bets',
      q: 'Bet A: at least one six in 4 rolls of one die. Bet B: at least one double six in 24 rolls of a pair of dice. Which is the better bet?',
      steps: [
        'Bet A: no six in 4 rolls has probability $(5/6)^4 = 0.482$, so $P_A = 1 - 0.482 = 0.518$.',
        'Bet B: a double six has probability $1/36$ per roll, so none in 24 rolls has probability $(35/36)^{24} = 0.509$, and $P_B = 0.491$.',
        'The naive argument — "4 × 1/6 = 2/3 and 24 × 1/36 = 2/3, so they are equal" — adds probabilities of overlapping events. The complement rule gets it right.'
      ],
      a: 'Bet A wins 51.8 % of the time, bet B only 49.1 %: take bet A.'
    }
  ],
  quiz: [
    { q: 'A fair coin has landed heads five times in a row. The probability of heads on the next toss is…', choices: ['less than 1/2 — tails is due', 'exactly 1/2', 'more than 1/2 — the coin is on a streak', 'impossible to say'], a: 1,
      why: 'Tosses are independent; the coin cannot remember the streak. Long-run frequencies even out because the streak is diluted by later tosses, not corrected.' },
    { q: 'Two dice are rolled. Which total is the most likely?', choices: ['2', '6', '7', '12'], a: 2,
      why: 'Seven can be made in six ways out of 36 — (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) — more than any other total.' },
    { q: 'What is the probability of at least one head in three tosses of a fair coin?', choices: ['1/2', '3/4', '7/8', '1'], a: 2,
      why: 'The only way to miss is three tails, with probability 1/8, so the answer is 1 − 1/8 = 7/8.' },
    { q: 'If $P(A) = 0.6$ and $P(B) = 0.5$, then $A$ and $B$ cannot be mutually exclusive.', a: true,
      why: 'For mutually exclusive events $P(A \\text{ or } B) = 1.1$, which is impossible. They must overlap by at least 0.1.' },
    { q: 'A spinner lands on red with probability $p$. Write the probability that it does **not** land on red in either of two independent spins.', answer: '(1-p)^2', vars: ['p'],
      why: 'Not red has probability $1 - p$ on each spin, and independent probabilities multiply: $(1 - p)^2$.' }
  ],
  problems: [
    { q: 'What is the probability of rolling at least one six in six rolls of a fair die?', answer: 0.6651, tol: 0.01,
      steps: ['No six in six rolls: $(5/6)^6 = 0.3349$.', 'At least one six: $1 - 0.3349 = 0.665$.'] },
    { q: 'A component fails on any given day with probability 0.001, independently of other days. What is the probability that it survives a whole year of 365 days?', answer: 0.6941, tol: 0.01,
      steps: ['Surviving one day has probability $0.999$.', 'Surviving 365 independent days: $0.999^{365} = 0.694$.', 'Even a one-in-a-thousand daily risk adds up to a 31 % chance of failure within a year.'] }
  ],
  applications: [
    'Weather forecasts: "a 70 % chance of rain" means that on days with forecasts like this it rains on about 70 % of them.',
    'Reliability engineering and safety cases, which combine the failure probabilities of components into the risk for a whole system.',
    'Insurance, where premiums are set from the probabilities of claims.',
    'Games of chance — the historical birthplace of the subject.'
  ],
  history: 'Probability theory began in 1654 with letters between Blaise Pascal and Pierre de Fermat about how to split the stakes of an interrupted game, prompted by questions from the gambler Antoine Gombaud, the Chevalier de Méré. Christiaan Huygens wrote the first textbook on the subject in 1657. The modern foundations — probability as a measure on a sample space — were laid by Andrey Kolmogorov in 1933.',
  sim: { id: 'ps-clt', params: { n: 1, norm: false, rate: 20 }, title: 'One die: frequencies settle down' }
},

{
  id: 'combinatorics', parent: 'probability', title: 'Permutations and combinations', level: 1,
  short: 'Counting without listing: how many ways there are to arrange or to choose things — the backbone of probability with equally likely outcomes.',
  keywords: ['permutation', 'combination', 'factorial', 'n choose k', 'binomial coefficient', 'counting', 'multiplication principle', 'arrangements', 'selections', 'lottery', 'Pascal\'s triangle', 'birthday problem'],
  prereq: ['probability-basics', 'exponents'],
  related: ['binomial-theorem', 'binomial-distribution', 'physics:entropy'],
  body: `
How many ways can the letters of a word be shuffled, a committee be picked, a lottery ticket be filled in? Listing them is hopeless beyond a handful. A few counting rules give the answers at once, and when outcomes are equally likely those counts turn straight into [[probability-basics|probabilities]].

### The multiplication principle
If one choice can be made in $a$ ways and, whatever it was, a second in $b$ ways, the pair can be made in $a \\times b$ ways. Three shirts and four pairs of trousers make 12 outfits. A four-digit PIN has $10 \\times 10 \\times 10 \\times 10 = 10^4 = 10\\,000$ possibilities, and in general $k$ picks from $n$ options, repeats allowed, give $n^k$ sequences.

### Permutations: order matters
Arrange $n$ different objects in a row. There are $n$ candidates for the first place, $n - 1$ for the second, and so on down to 1. The product is $n$ **factorial**:

$$n! = n \\times (n-1) \\times \\dots \\times 2 \\times 1, \\qquad 0! = 1$$

Ten books can stand on a shelf in $10! = 3\\,628\\,800$ orders. If only $k$ ordered places are filled from $n$ objects — gold, silver and bronze among 8 finalists — stop after $k$ factors:

$$P(n, k) = n(n-1)\\cdots(n-k+1) = \\frac{n!}{(n-k)!}, \\qquad P(8, 3) = 8 \\times 7 \\times 6 = 336$$

### Combinations: order does not matter
A committee of 3 drawn from 8 people is the same committee whatever order its members were picked in. Each committee appears $3! = 6$ times among the 336 ordered choices, so there are $336/6 = 56$ committees. In general the number of ways to **choose** $k$ objects from $n$ is the **binomial coefficient**

$$\\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}$$

read "$n$ choose $k$". A 6-from-49 lottery has $\\binom{49}{6} = 13\\,983\\,816$ possible tickets, so a single ticket wins the jackpot with probability about $7 \\times 10^{-8}$.

Choosing the $k$ to take is the same as choosing the $n - k$ to leave behind, so $\\binom{n}{k} = \\binom{n}{n-k}$. The coefficients form Pascal's triangle, each entry the sum of the two above it, $\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$. They are the coefficients of the [[binomial-theorem|binomial theorem]], and they reappear in the [[binomial-distribution|binomial distribution]] because $\\binom{n}{k}$ counts the sequences of $n$ trials that contain exactly $k$ successes.

| Order matters? | Repeats allowed? | Number of ways |
|---|---|---|
| yes | yes | $n^k$ |
| yes | no | $n!/(n-k)!$ |
| no | no | $\\binom{n}{k}$ |

### Big numbers, and physics
Factorials explode: $20! \\approx 2.4 \\times 10^{18}$, and for larger $n$ Stirling's approximation $n! \\approx \\sqrt{2\\pi n}\\,(n/e)^n$ takes over. Physics is full of such counts. Toss 100 coins: there is one way to get 100 heads but $\\binom{100}{50} \\approx 1.0 \\times 10^{29}$ ways to get exactly 50. With the $10^{23}$ molecules of a gas the imbalance is beyond imagination, so a gas is practically always found in its "mixed-up" arrangements — the counting behind [[physics:entropy|entropy]] and the [[physics:second-law-thermodynamics|second law of thermodynamics]].
`,
  ideas: [
    'Multiplication principle: stages multiply — $a$ choices then $b$ choices give $a \\times b$ combined choices.',
    '$n!$ counts the orders of $n$ different objects, and $0! = 1$.',
    'Permutations count ordered selections, $n!/(n-k)!$; combinations ignore the order, $\\binom{n}{k} = n!/(k!\\,(n-k)!)$.',
    'Choosing $k$ to take is choosing $n - k$ to leave: $\\binom{n}{k} = \\binom{n}{n-k}$.'
  ],
  pitfalls: [
    'Using combinations when order matters — A podium of gold, silver and bronze is ordered: 8 finalists give 336 podiums, not 56.',
    'Adding up overlapping cases for "at least one" — Cases such as "at least one ace" overlap. Count the complement (no aces at all) and subtract from the total.',
    '$0! = 0$ — It is 1: there is exactly one way to arrange nothing, and it makes $\\binom{n}{0} = \\binom{n}{n} = 1$ come out right.'
  ],
  formulas: [
    {
      name: 'Combinations: choosing k from n',
      expr: 'C = nCr(n, k)', tex: 'C = \\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}',
      vars: {
        C: { name: 'number of combinations', min: 1 },
        n: { name: 'objects to choose from', int: true, value: 49 },
        k: { name: 'objects chosen', int: true, value: 6 }
      },
      note: 'Also written C(n, k). Solving for $k$ finds both $k$ and $n - k$, since they give the same count.',
      practice: { unknowns: ['C'] },
      stories: { C: 'A lottery draws {k} different numbers from 1 to {n}. How many different tickets are possible?' }
    },
    {
      name: 'Permutations: ordered choices of k from n',
      expr: 'P = nPr(n, k)', tex: 'P = \\frac{n!}{(n-k)!}',
      vars: {
        P: { name: 'number of ordered arrangements', min: 1 },
        n: { name: 'objects to choose from', int: true, value: 10 },
        k: { name: 'places to fill, in order', int: true, value: 3 }
      },
      practice: { unknowns: ['P'] },
      stories: { P: 'A race has {n} runners. In how many different ways can the first {k} places be filled?' }
    },
    {
      name: 'Sequences with repetition',
      expr: 'N = n^k', tex: 'N = n^k',
      vars: {
        N: { name: 'number of possible sequences' },
        n: { name: 'symbols available at each position', int: true, value: 10 },
        k: { name: 'length of the sequence', int: true, value: 4 }
      },
      practice: { unknowns: ['N'] },
      stories: { N: 'A code is {k} characters long, and each character is one of {n} symbols. How many codes are possible?' }
    }
  ],
  examples: [
    {
      title: 'The lottery',
      q: 'A lottery draws 6 numbers from 49. What is the probability that one ticket (a) wins the jackpot, (b) has exactly 3 of the 6 numbers right?',
      steps: [
        'All $\\binom{49}{6} = \\frac{49 \\times 48 \\times 47 \\times 46 \\times 45 \\times 44}{6!} = 13\\,983\\,816$ tickets are equally likely.',
        '(a) Exactly one of them is the jackpot: $P = 1/13\\,983\\,816 \\approx 7.2 \\times 10^{-8}$.',
        '(b) Choose which 3 of the 6 winning numbers you have, $\\binom{6}{3} = 20$ ways, and which 3 of the 43 losing numbers fill the rest, $\\binom{43}{3} = 12\\,341$ ways.',
        '$P = \\dfrac{20 \\times 12\\,341}{13\\,983\\,816} = \\dfrac{246\\,820}{13\\,983\\,816} \\approx 0.0177$.'
      ],
      a: '(a) about 1 in 14 million; (b) about 1.8 %, or 1 in 57.'
    },
    {
      title: 'The birthday problem',
      q: 'How likely is it that at least two of 23 people share a birthday? (Ignore leap years and assume all 365 days are equally likely.)',
      steps: [
        'Count the complement: all 23 birthdays different. The first person has 365 free days, the second 364, and so on.',
        '$P(\\text{all different}) = \\dfrac{365 \\times 364 \\times \\dots \\times 343}{365^{23}} = \\dfrac{P(365, 23)}{365^{23}} \\approx 0.493$.',
        'So $P(\\text{a shared birthday}) = 1 - 0.493 = 0.507$.',
        'It is surprisingly high because 23 people form $\\binom{23}{2} = 253$ pairs, and any pair can match.'
      ],
      a: 'About 50.7 % — better than even.'
    }
  ],
  quiz: [
    { q: 'In how many different orders can 5 runners finish a race (no ties)?', choices: ['25', '120', '3125', '15'], a: 1,
      why: '$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$. 3125 would be $5^5$, which allows the same runner in several places.' },
    { q: 'Which is larger: the number of ways to choose 3 people from 10, or to choose 7 people from 10?', choices: ['3 from 10', '7 from 10', 'they are equal', 'it depends on the order'], a: 2,
      why: 'Choosing the 3 who go is the same as choosing the 7 who stay: $\\binom{10}{3} = \\binom{10}{7} = 120$.' },
    { q: 'A PIN has four digits, each 0–9, repeats allowed. How many PINs are there?', choices: ['40', '5040', '10 000', '210'], a: 2,
      why: 'Four independent choices of 10: $10^4$. 5040 would forbid repeated digits (ordered, no repeats), and 210 would also ignore the order.' },
    { q: 'A so-called "combination lock" is, mathematically, a permutation lock.', a: true,
      why: 'The order of the numbers matters — 1-2-3 does not open a lock set to 3-2-1 — and that is the defining feature of a permutation.' },
    { q: 'Each of $n$ people shakes hands once with everyone else. Write the number of handshakes as an expression in $n$.', answer: 'n(n-1)/2', vars: ['n'],
      why: 'A handshake is an unordered pair: $\\binom{n}{2} = \\frac{n(n-1)}{2}$. Counting "each person shakes $n - 1$ hands" counts every handshake twice.' }
  ],
  problems: [
    { q: 'A committee of 4 is chosen from 7 women and 5 men. How many possible committees contain exactly 2 women and 2 men?', answer: 210, tol: 0.001,
      steps: ['Choose the women: $\\binom{7}{2} = 21$ ways.', 'Choose the men: $\\binom{5}{2} = 10$ ways.', 'Multiply: $21 \\times 10 = 210$.'] },
    { q: 'Five cards are dealt from a well-shuffled 52-card pack. What is the probability that all five are of the same suit (a flush, straight flushes included)?', answer: 0.001981, tol: 0.02,
      steps: ['All hands: $\\binom{52}{5} = 2\\,598\\,960$.', 'Pick the suit (4 ways), then 5 of its 13 cards: $4\\binom{13}{5} = 4 \\times 1287 = 5148$.', '$P = 5148 / 2\\,598\\,960 \\approx 0.00198$, about 1 hand in 505.'] }
  ],
  applications: [
    'Probabilities of card hands, lotteries and games of chance.',
    'Password and key strength: a 12-character password from 62 symbols has $62^{12} \\approx 3 \\times 10^{21}$ possibilities.',
    'Statistical mechanics, where the entropy of a system is the logarithm of the number of its microscopic arrangements.',
    'Designing experiments and quality checks: how many ways a sample can be drawn from a batch.'
  ],
  history: 'Counting rules are old. Indian scholars studied selections in the metres of Sanskrit poetry more than two thousand years ago, and Bhāskara II stated the formula for combinations in the 12th century; al-Karajī in Persia and Yang Hui in China described the triangle of binomial coefficients centuries before Blaise Pascal wrote his treatise on it in 1654, after which it took his name in Europe.',
  sim: { id: 'ps-galton', title: 'Galton board: counting routes' }
},

{
  id: 'conditional-probability', parent: 'probability', title: 'Conditional probability and independence', level: 2,
  short: 'How a probability changes once you know that something else has happened — and when it does not change at all.',
  keywords: ['conditional probability', 'given', 'independence', 'independent events', 'multiplication rule', 'tree diagram', 'law of total probability', 'Monty Hall', 'without replacement', 'common-cause failure'],
  prereq: ['probability-basics', 'fractions-ratios'],
  related: ['bayes-theorem', 'binomial-distribution', 'random-variables'],
  body: `
Draw a card from a shuffled pack. The probability that it is a king is $4/52 = 1/13$. Now a friend peeks and tells you it is a picture card — a jack, queen or king. There are 12 picture cards and 4 of them are kings, so the probability becomes $4/12 = 1/3$. The information has shrunk the sample space to the picture cards, and within that smaller world the kings take a bigger share. That is **conditional probability**.

### Definition
The probability of $A$ **given** $B$, written $P(A \\mid B)$, is the share of $B$ that is also $A$:

$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\qquad P(B) > 0$$

Here $A \\cap B$ means "both $A$ and $B$". Turned around it becomes the **multiplication rule**, $P(A \\cap B) = P(B)\\,P(A \\mid B)$: in a tree diagram, multiply along the branches. Two aces in a row, without putting the first back: $\\frac{4}{52} \\times \\frac{3}{51} = \\frac{1}{221} \\approx 0.0045$. The second factor is conditional — one ace has already gone.

### Independence
Two events are **independent** when knowing one tells you nothing about the other, $P(A \\mid B) = P(A)$, or equivalently

$$P(A \\cap B) = P(A)\\,P(B)$$

Separate coin tosses, separate dice and — to a very good approximation — separate radioactive nuclei are independent, so their probabilities simply multiply. Independence is **not** the same as being mutually exclusive. If $A$ and $B$ cannot both happen, then learning that $B$ happened tells you for certain that $A$ did not: they are as dependent as events can be.

> [!warn] Engineers multiply small failure probabilities to justify redundancy: two independent pumps that each fail 1 % of the time fail together only $10^{-4}$ of the time. The argument collapses if a single cause — a power cut, a flood — can knock out both. Such **common-cause failures** are exactly a failure of independence.

### Adding up the cases
If $B$ either happens or does not, every way of getting $A$ lies on one of the two branches. That gives the **law of total probability**,

$$P(A) = P(A \\mid B)\\,P(B) + P(A \\mid \\bar B)\\,P(\\bar B)$$

where $\\bar B$ means "not $B$". A factory whose first machine makes 60 % of the parts with 2 % faulty, and whose second makes the other 40 % with 5 % faulty, turns out $0.6 \\times 0.02 + 0.4 \\times 0.05 = 0.032$ — 3.2 % faulty parts overall.

### The order matters
$P(A \\mid B)$ and $P(B \\mid A)$ are different numbers. Nearly everyone with measles has spots, but most people with spots do not have measles. Turning one into the other is the job of [[bayes-theorem|Bayes' theorem]]. The most famous trap of this kind is the Monty Hall game in the simulation: once the host — who knows where the car is — has opened a door, the two remaining doors are no longer equally likely, and switching wins two times in three.
`,
  ideas: [
    '$P(A \\mid B)$ is the probability of $A$ once you know $B$ happened: the share of $B$ that is also $A$.',
    'Multiplication rule: $P(A \\cap B) = P(B)\\,P(A \\mid B)$ — multiply along the branches of a tree.',
    'Independent events: $P(A \\cap B) = P(A)\\,P(B)$; knowing one does not change the chances of the other.',
    'Law of total probability: split into cases, weight each case by its probability, and add.',
    '$P(A \\mid B)$ and $P(B \\mid A)$ are generally different.'
  ],
  pitfalls: [
    'Mutually exclusive events are independent — The opposite. If $A$ and $B$ cannot happen together, knowing $B$ happened makes the probability of $A$ zero.',
    '$P(A \\mid B) = P(B \\mid A)$ — The confusion behind many false alarms and courtroom errors. Most people with pneumonia cough, but most people with a cough do not have pneumonia.',
    'Multiplying probabilities of events that are not independent — Two cards drawn without replacement, two parts from the same faulty batch, two pumps on one power supply: the second factor must be the conditional probability.'
  ],
  formulas: [
    {
      name: 'Conditional probability',
      expr: 'PAgB = PAB/PB', tex: '\\mathit{P(A \\mid B)} = \\frac{\\mathit{P(A \\cap B)}}{\\mathit{P(B)}}',
      vars: {
        PAgB: { name: 'probability of A given B', tex: '\\mathit{P(A \\mid B)}', min: 0, max: 1 },
        PAB: { name: 'probability of A and B together', tex: '\\mathit{P(A \\cap B)}', value: 1 / 13, min: 0, max: 1 },
        PB: { name: 'probability of B', tex: '\\mathit{P(B)}', value: 3 / 13, min: 0, max: 1 }
      },
      note: 'The starting values are the card example: a king (4/52) given a picture card (12/52) gives 1/3.',
      stories: {
        PAgB: 'In a group, a fraction {PB} of people wear glasses and a fraction {PAB} both wear glasses and are left-handed. What is the probability that someone who wears glasses is left-handed?',
        PAB: 'A fraction {PB} of the parts come from supplier B, and a fraction {PAgB} of those are faulty. What fraction of all parts are faulty ones from supplier B?'
      }
    },
    {
      name: 'Both of two independent events',
      expr: 'PAB = PA*PB', tex: '\\mathit{P(A \\cap B)} = \\mathit{P(A)}\\,\\mathit{P(B)}',
      vars: {
        PAB: { name: 'probability that both happen', tex: '\\mathit{P(A \\cap B)}', min: 0, max: 1 },
        PA: { name: 'probability of A', tex: '\\mathit{P(A)}', value: 0.01, min: 0, max: 1 },
        PB: { name: 'probability of B', tex: '\\mathit{P(B)}', value: 0.01, min: 0, max: 1 }
      },
      note: 'Only for independent events. A shared cause (one power supply for two pumps) breaks it.',
      stories: { PAB: 'Two independent pumps fail on a given day with probabilities {PA} and {PB}. How likely is it that both fail on the same day?' }
    },
    {
      name: 'At least one of two independent events',
      expr: 'P = PA + PB - PA*PB', tex: '\\mathit{P(A \\cup B)} = \\mathit{P(A)} + \\mathit{P(B)} - \\mathit{P(A)}\\,\\mathit{P(B)}',
      vars: {
        P: { name: 'probability that A or B (or both) happens', tex: '\\mathit{P(A \\cup B)}', min: 0, max: 1 },
        PA: { name: 'probability of A', tex: '\\mathit{P(A)}', value: 0.9, min: 0, max: 1 },
        PB: { name: 'probability of B', tex: '\\mathit{P(B)}', value: 0.8, min: 0, max: 1 }
      },
      note: 'The addition rule with the overlap $P(A)P(B)$ that independence gives. Equivalently $1 - (1 - P(A))(1 - P(B))$.',
      stories: { P: 'Two independent smoke alarms detect a fire with probabilities {PA} and {PB}. What is the probability that at least one of them sounds?' }
    },
    {
      name: 'Law of total probability',
      expr: 'PA = PAgB*PB + PAgnB*(1 - PB)', tex: '\\mathit{P(A)} = \\mathit{P(A \\mid B)}\\,\\mathit{P(B)} + \\mathit{P(A \\mid \\bar B)}\\,\\bigl(1 - \\mathit{P(B)}\\bigr)',
      vars: {
        PA: { name: 'overall probability of A', tex: '\\mathit{P(A)}', min: 0, max: 1 },
        PAgB: { name: 'probability of A when B happens', tex: '\\mathit{P(A \\mid B)}', value: 0.02, min: 0, max: 1 },
        PB: { name: 'probability of B', tex: '\\mathit{P(B)}', value: 0.6, min: 0, max: 1 },
        PAgnB: { name: 'probability of A when B does not happen', tex: '\\mathit{P(A \\mid \\bar B)}', value: 0.05, min: 0, max: 1 }
      },
      stories: { PA: 'Machine B makes a fraction {PB} of all parts, and {PAgB} of its parts are faulty. The other machine makes the rest, with {PAgnB} faulty. What fraction of all parts is faulty?' }
    }
  ],
  examples: [
    {
      title: 'Two aces',
      q: 'Two cards are drawn from a 52-card pack. Find the probability that both are aces (a) without replacing the first card, (b) replacing and reshuffling it first.',
      steps: [
        '(a) First ace: $4/52$. Given that, 3 aces remain among 51 cards: $P = \\frac{4}{52} \\times \\frac{3}{51} = \\frac{12}{2652} = \\frac{1}{221} \\approx 0.0045$.',
        '(b) With replacement the draws are independent: $P = \\left(\\frac{4}{52}\\right)^2 = \\frac{1}{169} \\approx 0.0059$.',
        'Without replacement the second ace is less likely, because an ace has been used up.'
      ],
      a: '(a) 1/221 ≈ 0.45 %, (b) 1/169 ≈ 0.59 %'
    },
    {
      title: 'Where did the faulty part come from?',
      q: 'Machine 1 makes 60 % of the parts, 2 % of them faulty; machine 2 makes 40 %, 5 % of them faulty. What fraction of all parts is faulty, and what fraction of the faulty parts comes from machine 2?',
      steps: [
        'Total probability: $P(\\text{faulty}) = 0.6 \\times 0.02 + 0.4 \\times 0.05 = 0.012 + 0.020 = 0.032$.',
        'Faulty parts from machine 2 make up $0.020$ of all parts.',
        'Share of the faulty parts: $P(\\text{machine 2} \\mid \\text{faulty}) = 0.020/0.032 = 0.625$.',
        'Machine 2 makes fewer parts but most of the faulty ones — a first taste of [[bayes-theorem|Bayes\' theorem]].'
      ],
      a: '3.2 % of parts are faulty, and 62.5 % of those come from machine 2.'
    },
    {
      title: 'Monty Hall on a tree',
      q: 'You pick door 1. The host, who knows where the car is, opens a door with a goat behind it and offers a switch. Should you switch?',
      steps: [
        'Car behind door 1 (probability 1/3): the host opens 2 or 3, and switching loses.',
        'Car behind door 2 (probability 1/3): the host must open door 3, and switching wins.',
        'Car behind door 3 (probability 1/3): the host must open door 2, and switching wins.',
        'Switching wins on two of the three equally likely branches. The host\'s choice is constrained by the car\'s position, so opening a door carries information.'
      ],
      a: 'Yes: switching wins with probability 2/3, sticking with 1/3.'
    }
  ],
  quiz: [
    { q: 'A family has two children, and at least one of them is a girl. What is the probability that both are girls? (Take boys and girls as equally likely and independent.)', choices: ['1/2', '1/3', '1/4', '2/3'], a: 1,
      why: 'The equally likely families are GG, GB, BG, BB. "At least one girl" leaves GG, GB, BG, and only one of those three is GG.' },
    { q: 'Events $A$ and $B$ are mutually exclusive and both have non-zero probability. Are they independent?', choices: ['Yes, always', 'No, never', 'Only if P(A) = P(B)', 'Only if they are complements'], a: 1,
      why: '$P(A \\cap B) = 0$ but $P(A)P(B) > 0$. Knowing that $B$ happened rules $A$ out completely — the strongest possible dependence.' },
    { q: 'In the Monty Hall game with three doors, switching after the host opens a goat door wins with probability…', choices: ['1/3', '1/2', '2/3', '1'], a: 2,
      why: 'Switching wins exactly when the first pick was wrong, which happens 2 times in 3. It is not 1/2, because the host never opens the car\'s door.' },
    { q: '$P(A \\mid B)$ and $P(B \\mid A)$ are always equal.', a: false,
      why: 'They share the numerator $P(A \\cap B)$ but divide it by different things, $P(B)$ and $P(A)$. They are equal only when $P(A) = P(B)$.' },
    { q: 'Two independent components work with probabilities $p$ and $q$. Wired in parallel, the system works unless both fail. Write the probability that the system works.', answer: '1 - (1-p)(1-q)', vars: ['p', 'q'],
      why: 'Both fail with probability $(1 - p)(1 - q)$ (independence), and the system works in every other case.' }
  ],
  problems: [
    { q: 'A bag holds 5 red and 3 blue marbles. Two are drawn without replacement. What is the probability that both are blue?', answer: 0.1071, tol: 0.01,
      steps: ['First blue: $3/8$.', 'Second blue, given the first was: $2/7$.', '$P = \\frac{3}{8} \\times \\frac{2}{7} = \\frac{6}{56} \\approx 0.107$.'] },
    { q: 'In a town, 30 % of days are rainy. On rainy days the bus is late with probability 0.4, on dry days with probability 0.1. On what fraction of days is the bus late?', answer: 0.19, tol: 0.01,
      steps: ['Law of total probability: $P(\\text{late}) = 0.4 \\times 0.3 + 0.1 \\times 0.7$.', '$= 0.12 + 0.07 = 0.19$.'] }
  ],
  applications: [
    'Redundant systems in aircraft, power grids and data centres, where independent failures multiply into tiny joint probabilities.',
    'Medical and legal reasoning, where confusing P(evidence | innocent) with P(innocent | evidence) has led to real miscarriages of justice.',
    'Risk models that chain conditional probabilities along a tree of scenarios (event-tree and fault-tree analysis).',
    'Markov chains, in which the next state depends only on the present one: queues, genetics, text prediction.'
  ],
  sim: 'ps-monty-hall'
},

{
  id: 'bayes-theorem', parent: 'probability', title: 'Bayes\' theorem', level: 2,
  short: 'The rule for turning P(evidence | cause) into P(cause | evidence) — how a belief should be updated when new data arrive.',
  keywords: ['Bayes', 'Bayes\' rule', 'prior', 'posterior', 'likelihood', 'likelihood ratio', 'base rate', 'false positive', 'sensitivity', 'specificity', 'screening test', 'inverse probability', 'odds', 'prosecutor\'s fallacy'],
  prereq: ['conditional-probability', 'percentages'],
  related: ['hypothesis-testing', 'binomial-distribution', 'probability-basics'],
  body: `
A screening test for a disease catches 90 % of the people who have it and wrongly flags 9 % of those who do not. One person in a hundred has the disease. You test positive. How worried should you be? Most people — including, in surveys, many doctors — say about 90 %. The right answer is about 9 %.

### Think in people, not percentages
Picture 1000 people. About 10 have the disease, and the test catches 9 of them. Of the 990 healthy people, 9 % — about 89 — test positive anyway. That makes about 98 positives, of whom only 9 are ill:

$$P(\\text{ill} \\mid +) \\approx \\frac{9}{9 + 89} \\approx 9\\,\\%$$

Because the disease is rare, a small false-positive rate applied to the huge healthy majority swamps the true positives. The simulation draws exactly this crowd.

### The theorem
Write $H$ for a hypothesis (ill) and $E$ for the evidence (a positive test). The [[conditional-probability|multiplication rule]] can be written two ways, $P(H \\cap E) = P(H)\\,P(E \\mid H) = P(E)\\,P(H \\mid E)$, and solving for the unknown gives **Bayes' theorem**:

$$P(H \\mid E) = \\frac{P(E \\mid H)\\,P(H)}{P(E)}, \\qquad P(E) = P(E \\mid H)\\,P(H) + P(E \\mid \\bar H)\\,P(\\bar H)$$

Each piece has a name. $P(H)$ is the **prior**, what you believed before; $P(E \\mid H)$ is the **likelihood** of the evidence if the hypothesis is true; $P(H \\mid E)$ is the **posterior**, what you should believe afterwards. The denominator, from the law of total probability, adds up every way the evidence could have arisen.

For a medical test the likelihoods have their own names: the **sensitivity** $P(+ \\mid \\text{ill})$ and the **specificity** $P(- \\mid \\text{healthy})$; the false-positive rate is one minus the specificity. With 1 % prevalence, 90 % sensitivity and 91 % specificity:

$$P(\\text{ill} \\mid +) = \\frac{0.90 \\times 0.01}{0.90 \\times 0.01 + 0.09 \\times 0.99} = \\frac{0.0090}{0.0981} = 0.092$$

### The odds form: evidence multiplies
Bayes' theorem is easiest to use with **odds**, $O = P/(1 - P)$. Then

$$O_{\\text{post}} = \\Lambda \\times O_{\\text{prior}}, \\qquad \\Lambda = \\frac{P(E \\mid H)}{P(E \\mid \\bar H)}$$

where $\\Lambda$ is the **likelihood ratio**. Our test has $\\Lambda = 0.90/0.09 = 10$: a positive result multiplies the odds by ten. Prior odds of 1 to 99 become 10 to 99, a probability of $10/109 = 9.2\\,\\%$. A second, independent positive multiplies by ten again: 100 to 99, just over 50 %. Each independent piece of evidence is one more multiplication, and yesterday's posterior is today's prior.

### Where it is used
Bayesian reasoning filters spam, interprets medical tests and locates lost ships and aircraft by updating a probability map each time a search area comes up empty. In physics and engineering it is how model parameters are estimated from noisy data, and how a surprising measurement is weighed against everything already known: a claim with a tiny prior needs overwhelming evidence, which is one reason particle physicists demand a [[hypothesis-testing|five-sigma]] signal.
`,
  ideas: [
    'Posterior ∝ likelihood × prior: evidence updates what you believed before; it does not replace it.',
    'For a rare condition, false positives can far outnumber true positives, even with a good test.',
    'In odds form, each independent piece of evidence multiplies the odds by its likelihood ratio.',
    'Imagine 1000 or 10 000 people ("natural frequencies"): Bayes\' theorem then becomes plain counting.'
  ],
  pitfalls: [
    'A test that is 95 % accurate means a positive result is 95 % likely to be right — That confuses $P(+ \\mid \\text{ill})$ with $P(\\text{ill} \\mid +)$. The second depends heavily on how common the condition is.',
    'Ignoring the base rate — The same evidence means much more when the hypothesis was plausible to begin with (testing people with symptoms) than when it was rare (screening everyone).',
    'The prosecutor\'s fallacy — "The evidence would match an innocent person only one time in a million" is not the probability that the suspect is innocent. In a city of ten million, about ten innocent people would match.'
  ],
  derivation: {
    title: 'Bayes\' theorem from the multiplication rule',
    steps: [
      { text: 'Write the probability that both $H$ and $E$ happen in two ways, conditioning on either one:', tex: 'P(H \\cap E) = P(H)\\,P(E \\mid H) = P(E)\\,P(H \\mid E)' },
      { text: 'Divide by $P(E)$:', tex: 'P(H \\mid E) = \\frac{P(E \\mid H)\\,P(H)}{P(E)}' },
      { text: 'Expand the denominator with the law of total probability over $H$ and not-$H$:', tex: 'P(E) = P(E \\mid H)\\,P(H) + P(E \\mid \\bar H)\\,\\bigl(1 - P(H)\\bigr)' },
      { text: 'Dividing the theorem for $H$ by the same theorem for $\\bar H$ cancels $P(E)$ and gives the odds form:', tex: '\\frac{P(H \\mid E)}{P(\\bar H \\mid E)} = \\frac{P(E \\mid H)}{P(E \\mid \\bar H)} \\cdot \\frac{P(H)}{P(\\bar H)}' }
    ]
  },
  formulas: [
    {
      name: 'Probability of the condition after a positive test',
      expr: 'Ppost = sens*prior/(sens*prior + fpr*(1 - prior))',
      tex: '\\mathit{P(D \\mid +)} = \\frac{\\mathit{P(+ \\mid D)}\\,\\mathit{P(D)}}{\\mathit{P(+ \\mid D)}\\,\\mathit{P(D)} + \\mathit{P(+ \\mid \\bar D)}\\,\\bigl(1 - \\mathit{P(D)}\\bigr)}',
      vars: {
        Ppost: { name: 'probability of the condition, given a positive test', tex: '\\mathit{P(D \\mid +)}', min: 0, max: 1 },
        sens: { name: 'sensitivity: probability that an ill person tests positive', tex: '\\mathit{P(+ \\mid D)}', value: 0.9, min: 0.5, max: 1 },
        prior: { name: 'prevalence (the prior)', tex: '\\mathit{P(D)}', value: 0.01, min: 0, max: 1 },
        fpr: { name: 'false-positive rate (1 − specificity)', tex: '\\mathit{P(+ \\mid \\bar D)}', value: 0.09, min: 0, max: 0.5 }
      },
      note: 'Specificity is $1 - P(+ \\mid \\bar D)$. Sensitivity runs from 0.5 and the false-positive rate up to 0.5 here — a test worse than a coin toss is no test. Try a prevalence of 0.001 and then 0.3 to see how much the prior matters.',
      stories: {
        Ppost: 'A condition affects a fraction {prior} of the people tested. The test detects it with probability {sens} and gives a false positive with probability {fpr}. You test positive: what is the probability that you have the condition?',
        prior: 'A test has sensitivity {sens} and false-positive rate {fpr}. How common must the condition be for a positive result to mean a probability {Ppost} of having it?'
      }
    },
    {
      name: 'Bayes\' theorem',
      expr: 'PHgE = PEgH*PH/PE', tex: '\\mathit{P(H \\mid E)} = \\frac{\\mathit{P(E \\mid H)}\\,\\mathit{P(H)}}{\\mathit{P(E)}}',
      vars: {
        PHgE: { name: 'posterior: probability of H given the evidence', tex: '\\mathit{P(H \\mid E)}', min: 0, max: 1 },
        PEgH: { name: 'likelihood: probability of the evidence if H is true', tex: '\\mathit{P(E \\mid H)}', value: 0.9, min: 0, max: 1 },
        PH: { name: 'prior probability of H', tex: '\\mathit{P(H)}', value: 0.01, min: 0, max: 1 },
        PE: { name: 'overall probability of the evidence', tex: '\\mathit{P(E)}', value: 0.0981, min: 0, max: 1 }
      },
      stories: { PHgE: 'An alarm sounds with probability {PEgH} when there is an intruder, and an intruder is present on a fraction {PH} of nights. The alarm sounds on a fraction {PE} of all nights. Given that it is sounding, how likely is an intruder?' }
    },
    {
      name: 'Odds form: evidence multiplies the odds',
      expr: 'Opost = LR*Oprior', tex: 'O_{\\text{post}} = \\Lambda\\, O_{\\text{prior}}',
      vars: {
        Opost: { name: 'posterior odds', tex: 'O_{\\text{post}}' },
        LR: { name: 'likelihood ratio P(E | H) / P(E | not H)', tex: '\\Lambda', value: 10 },
        Oprior: { name: 'prior odds', tex: 'O_{\\text{prior}}', value: 1 / 99 }
      },
      note: 'Odds and probability convert as $O = P/(1-P)$ and $P = O/(1+O)$. Independent pieces of evidence multiply their likelihood ratios.',
      stories: { Opost: 'The prior odds of a hypothesis are {Oprior}. A test result is {LR} times as likely if the hypothesis is true as if it is false. What are the odds afterwards?' }
    }
  ],
  examples: [
    {
      title: 'A screening test',
      q: 'A condition affects 1 % of people. A test detects 90 % of cases and gives false positives in 9 % of healthy people. What is the probability that someone who tests positive has the condition?',
      steps: [
        'Imagine 1000 people: 10 are ill, 990 are healthy.',
        'True positives: $0.90 \\times 10 = 9$. False positives: $0.09 \\times 990 = 89.1$.',
        'Of about 98 positives, 9 are ill: $P(\\text{ill} \\mid +) = \\dfrac{9}{98.1} = 0.092$.',
        'Check with the formula: $\\dfrac{0.9 \\times 0.01}{0.9 \\times 0.01 + 0.09 \\times 0.99} = 0.092$.'
      ],
      a: 'About 9 % — most positives are false alarms.'
    },
    {
      title: 'A second test',
      q: 'The person above takes a second, independent test of the same quality and tests positive again. What is the probability now?',
      steps: [
        'Likelihood ratio of one positive: $\\Lambda = 0.90/0.09 = 10$.',
        'Odds after the first test: $10 \\times \\frac{1}{99} = \\frac{10}{99}$ (probability 9.2 %).',
        'After the second: $10 \\times \\frac{10}{99} = \\frac{100}{99}$.',
        'Back to a probability: $P = \\dfrac{100/99}{1 + 100/99} = \\dfrac{100}{199} = 0.50$.'
      ],
      a: 'About 50 %: the first posterior became the prior for the second test.'
    },
    {
      title: 'Fair coin or trick coin?',
      q: 'A bag holds one fair coin and one coin with heads on both sides. You take one at random and toss it three times: three heads. What is the probability that you hold the trick coin?',
      steps: [
        'Prior: $P(\\text{trick}) = 1/2$.',
        'Likelihoods: $P(\\text{HHH} \\mid \\text{trick}) = 1$, $P(\\text{HHH} \\mid \\text{fair}) = 1/8$.',
        '$P(\\text{trick} \\mid \\text{HHH}) = \\dfrac{1 \\times \\frac12}{1 \\times \\frac12 + \\frac18 \\times \\frac12} = \\dfrac{1}{1 + 1/8} = \\dfrac{8}{9}$.'
      ],
      a: '8/9 ≈ 0.89'
    }
  ],
  quiz: [
    { q: 'A condition affects 1 person in 1000. A test is 99 % sensitive and 99 % specific. You test positive. Roughly how likely is it that you have the condition?', choices: ['99 %', 'about 50 %', 'about 9 %', 'about 1 %'], a: 2,
      why: 'Per 100 000 people: 100 ill, 99 caught; 99 900 healthy, 999 false positives. $99/(99 + 999) \\approx 9\\,\\%$.' },
    { q: 'For a rare condition, which improvement raises $P(\\text{ill} \\mid +)$ the most?', choices: ['higher sensitivity', 'higher specificity (fewer false positives)', 'testing more people', 'reporting the results faster'], a: 1,
      why: 'The positives are dominated by false alarms from the large healthy group. Cutting the false-positive rate attacks the big term in the denominator; sensitivity is already near 1 and can at most gain a little.' },
    { q: 'If a test is 95 % accurate, a positive result means a 95 % chance of having the condition.', a: false,
      why: 'Accuracy describes $P(\\text{result} \\mid \\text{condition})$. The chance of the condition given the result also depends on the prior — for rare conditions it can be far lower.' },
    { q: 'In Bayes\' theorem the posterior is proportional to…', choices: ['prior × likelihood', 'prior ÷ likelihood', 'the likelihood alone', 'the prior alone'], a: 0,
      why: '$P(H \\mid E) \\propto P(E \\mid H)\\,P(H)$; the denominator $P(E)$ is the same for every hypothesis and just normalises.' },
    { q: 'A hypothesis has prior probability $p$. Evidence arrives with likelihood ratio 3. Write the posterior probability in terms of $p$.', answer: '3p/(1+2p)', vars: ['p'],
      why: 'Posterior odds are $3p/(1-p)$. Converting back, $P = \\frac{3p/(1-p)}{1 + 3p/(1-p)} = \\frac{3p}{1 - p + 3p} = \\frac{3p}{1 + 2p}$.' }
  ],
  problems: [
    { q: 'Machine A makes 70 % of a factory\'s bolts, 1 % of them defective; machine B makes 30 %, 4 % of them defective. A randomly chosen bolt is defective. What is the probability that machine B made it?', answer: 0.6316, tol: 0.01,
      steps: ['$P(\\text{defective}) = 0.7 \\times 0.01 + 0.3 \\times 0.04 = 0.007 + 0.012 = 0.019$.', '$P(B \\mid \\text{defective}) = 0.012/0.019 = 0.632$.'] },
    { q: 'One bag in 10 000 at an airport contains a prohibited item. The scanner flags 98 % of those bags and 2 % of clean bags. A bag is flagged: what is the probability that it really contains a prohibited item?', answer: 0.004877, tol: 0.02,
      steps: ['True flags per bag: $0.0001 \\times 0.98 = 0.000098$.', 'False flags per bag: $0.9999 \\times 0.02 = 0.019998$.', '$P = \\dfrac{0.000098}{0.000098 + 0.019998} = 0.0049$ — about 1 flagged bag in 200.'] }
  ],
  applications: [
    'Medical diagnosis: deciding whether a positive screening result justifies a more invasive test.',
    'Spam filters, which weigh each word by how much more common it is in spam than in genuine mail.',
    'Search and rescue: updating a probability map of a lost vessel\'s position as areas are searched without success.',
    'Parameter estimation in science and engineering, where a prior is updated by the likelihood of the measurements.'
  ],
  history: 'Thomas Bayes, an English Presbyterian minister, worked out the rule for a special case; his friend Richard Price published it in 1763, two years after Bayes died. Pierre-Simon Laplace found it independently in 1774 and made it a general method of reasoning. During the Second World War Alan Turing\'s team at Bletchley Park used Bayesian scoring of evidence to help break German naval codes.',
  sim: 'ps-bayes-test'
},

{
  id: 'random-variables', parent: 'probability', title: 'Random variables', level: 2,
  short: 'A number decided by chance — the total of two dice, the count of decays in a second, the lifetime of a bulb — described by its probability distribution.',
  keywords: ['random variable', 'discrete', 'continuous', 'probability mass function', 'pmf', 'probability density function', 'pdf', 'cumulative distribution function', 'cdf', 'distribution', 'uniform distribution', 'density'],
  prereq: ['probability-basics', 'functions', 'definite-integral'],
  related: ['expected-value', 'binomial-distribution', 'normal-distribution', 'exponential-distribution'],
  body: `
Roll two dice. The outcome is a pair such as (3, 5), but what you usually care about is a **number**: the total, 8. A **random variable** is exactly that — a rule that attaches a number to every outcome of a chance experiment. It is written with a capital letter, $X$, and its particular values with small ones, $x$. The number of heads in ten tosses, the reading of a noisy voltmeter, the lifetime of a light bulb and the speed of a gas molecule are all random variables.

### Discrete: a list of probabilities
When the possible values can be listed — 0, 1, 2, … — the variable is **discrete**, and it is described by its **probability mass function** $p(x) = P(X = x)$. For the total of two dice:

| total $x$ | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| $36\\,p(x)$ | 1 | 2 | 3 | 4 | 5 | 6 | 5 | 4 | 3 | 2 | 1 |

or compactly $p(x) = (6 - |x - 7|)/36$. The probabilities are never negative and they add up to 1 — something has to happen.

### Continuous: a density
A length, a time or a temperature can take any value in a range, and the chance of hitting one exact value — a lifetime of precisely 1000.000… hours — is zero. A **continuous** random variable is described instead by a **probability density** $f(x)$, and probabilities are **areas** under it:

$$P(a \\le X \\le b) = \\int_a^b f(x)\\,dx, \\qquad \\int_{-\\infty}^{\\infty} f(x)\\,dx = 1$$

A density is probability *per unit of* $x$, so it carries units (per metre, per second) and can exceed 1: a variable spread evenly over $[0, 0.5]$ has density 2. The simplest example is the **uniform** distribution. Arrive at a random moment at a stop served every 12 minutes and your wait is uniform on $[0, 12]$ min, with $f = 1/12$ per minute; the chance of waiting between 5 and 8 minutes is the area $3 \\times \\frac{1}{12} = 0.25$.

### The cumulative distribution function
Both kinds share the **cumulative distribution function** $F(x) = P(X \\le x)$. It climbs from 0 to 1 and never goes down, and for a continuous variable it is the [[definite-integral|integral]] of the density, so $f(x) = F'(x)$. Questions such as "what fraction of the bolts is shorter than 49.8 mm?" are read straight off $F$.

### In physics
Densities of random variables run all through physics. The square of a quantum [[physics:wavefunction|wavefunction]], $|\\psi(x)|^2$, is the probability density for finding the particle at $x$. The [[physics:maxwell-boltzmann|Maxwell–Boltzmann distribution]] is a density of molecular speeds: the fraction of molecules between 400 and 500 m/s is an area under it. And the moment at which a particular nucleus decays is a continuous random variable with an [[exponential-distribution|exponential distribution]].
`,
  ideas: [
    'A random variable attaches a number to each outcome of a chance experiment.',
    'A discrete variable has a probability for each value, and these add up to 1.',
    'A continuous variable has a density: probabilities are areas under it, and any single exact value has probability 0.',
    'The cumulative distribution $F(x) = P(X \\le x)$ rises from 0 to 1 and never decreases; for continuous variables $f = F\'$.'
  ],
  pitfalls: [
    'A value of the density is a probability — It is probability per unit of $x$. Only areas under the density are probabilities, and the density itself may exceed 1.',
    'For a continuous variable, $P(X < a)$ and $P(X \\le a)$ differ — They are equal: the single point $x = a$ carries no probability.',
    'All values of a random variable are equally likely — Only in special (uniform) cases. The total of two dice takes 11 values, and 7 is six times as likely as 2.'
  ],
  formulas: [
    {
      name: 'Uniform distribution: chance of an interval',
      expr: 'P = w/L', tex: 'P = \\frac{w}{L}',
      vars: {
        P: { name: 'probability of landing in the interval', min: 0, max: 1 },
        w: { name: 'width of the interval', q: 'time', unit: 'min', value: 3 },
        L: { name: 'width of the whole range', q: 'time', unit: 'min', value: 12 }
      },
      note: 'For a variable spread evenly over a range of width $L$, every interval of width $w$ inside it has the same probability.',
      practice: { unknowns: ['P'] },
      stories: { P: 'A bus comes every {L}, and you arrive at a random moment. What is the probability that you wait less than {w}?' }
    },
    {
      name: 'Total of two dice',
      expr: 'P = (6 - abs(s - 7))/36', tex: 'P(X = s) = \\frac{6 - |s - 7|}{36}',
      vars: {
        P: { name: 'probability of that total', min: 0, max: 1 },
        s: { name: 'the total', int: true, value: 9, min: 2, max: 12 }
      },
      note: 'A probability mass function. Solving for the total finds both totals with that probability, such as 5 and 9.',
      practice: { unknowns: ['P'] },
      stories: { P: 'Two fair dice are rolled. What is the probability that the total is {s}?' }
    }
  ],
  examples: [
    {
      title: 'The total of two dice',
      q: 'For the total $X$ of two dice, check that the probabilities add up to 1, and find $P(X \\ge 10)$ and $F(4) = P(X \\le 4)$.',
      steps: [
        'Sum of the table: $1 + 2 + 3 + 4 + 5 + 6 + 5 + 4 + 3 + 2 + 1 = 36$, and $36/36 = 1$.',
        '$P(X \\ge 10) = p(10) + p(11) + p(12) = (3 + 2 + 1)/36 = 1/6$.',
        '$F(4) = p(2) + p(3) + p(4) = (1 + 2 + 3)/36 = 1/6$.'
      ],
      a: '$P(X \\ge 10) = 1/6$ and $F(4) = 1/6$.'
    },
    {
      title: 'A density that is not flat',
      q: 'A random variable has density $f(x) = 2x$ for $0 \\le x \\le 1$ (and 0 elsewhere). Check that it is a valid density, and find $P(X > 0.5)$ and the median.',
      steps: [
        'Total area: $\\int_0^1 2x\\,dx = [x^2]_0^1 = 1$, and $f \\ge 0$, so it is valid.',
        'CDF: $F(x) = \\int_0^x 2t\\,dt = x^2$.',
        '$P(X > 0.5) = 1 - F(0.5) = 1 - 0.25 = 0.75$.',
        'Median: $F(m) = 0.5$, so $m^2 = 0.5$ and $m = 0.707$.'
      ],
      a: '$P(X > 0.5) = 0.75$; median $\\approx 0.71$.'
    }
  ],
  quiz: [
    { q: 'For a continuous random variable, $P(X = 2.5)$ is…', choices: ['the density at 2.5', '0', '1', 'undefined'], a: 1,
      why: 'A single point has zero width, so zero area under the density. Only intervals have non-zero probability.' },
    { q: 'Can a probability density take the value 3 somewhere?', choices: ['No: probabilities cannot exceed 1', 'Yes, as long as the total area is 1', 'Only for discrete variables', 'Only at the mean'], a: 1,
      why: 'A density is probability per unit length. A variable squeezed into $[0, 1/3]$ uniformly has density 3 there, with total area $3 \\times 1/3 = 1$.' },
    { q: 'A cumulative distribution function can decrease somewhere.', a: false,
      why: '$F(x) = P(X \\le x)$ can only gain probability as $x$ increases, so it never goes down.' },
    { q: 'Which of these is a discrete random variable?', choices: ['the time until a nucleus decays', 'the number of decays counted in 10 s', 'the temperature at noon', 'the length of a bolt'], a: 1,
      why: 'A count takes the values 0, 1, 2, … The others can take any value in a range, so they are continuous.' },
    { q: '$X$ is uniformly distributed on $[0, L]$. Write its cumulative distribution function $F(x)$ for $0 \\le x \\le L$.', answer: 'x/L', vars: ['x', 'L'],
      why: 'The density is $1/L$, and the area from 0 to $x$ is $x \\cdot \\frac{1}{L}$.' }
  ],
  problems: [
    { q: 'A random variable has density $f(x) = 3x^2$ on $[0, 1]$. Find $P(X > 0.5)$.', answer: 0.875, tol: 0.01,
      steps: ['$F(x) = \\int_0^x 3t^2\\,dt = x^3$.', '$P(X > 0.5) = 1 - 0.5^3 = 1 - 0.125 = 0.875$.'] },
    { q: 'A random variable is uniform on $[2, 10]$. What is the probability that it lies between 3 and 4.5?', answer: 0.1875, tol: 0.01,
      steps: ['Density: $1/(10 - 2) = 1/8$.', 'Probability: $(4.5 - 3) \\times \\frac18 = 0.1875$.'] }
  ],
  applications: [
    'Describing measurement noise, manufacturing tolerances and component lifetimes.',
    'Quantum mechanics, where $|\\psi|^2$ is the probability density of a particle\'s position.',
    'Monte Carlo simulation, which models uncertain inputs as random variables and computes the distribution of the output.'
  ],
  sim: { id: 'ps-clt', params: { n: 2, norm: false, rate: 20 }, title: 'The total of two dice' }
},

{
  id: 'expected-value', parent: 'probability', title: 'Expected value and variance', level: 2,
  short: 'The long-run average of a random variable (its expected value) and how widely it scatters about that average (its variance and standard deviation).',
  keywords: ['expected value', 'expectation', 'mean', 'E[X]', 'variance', 'standard deviation', 'Var(X)', 'linearity of expectation', 'fair game', 'house edge', 'moments', 'quadrature'],
  prereq: ['random-variables', 'probability-basics'],
  related: ['standard-deviation', 'central-limit-theorem', 'error-propagation', 'descriptive-statistics'],
  body: `
A die shows 1, 2, 3, 4, 5 or 6, each a sixth of the time. Roll it many times and the average of the results settles at

$$\\tfrac16(1 + 2 + 3 + 4 + 5 + 6) = 3.5$$

— a value the die can never actually show. That long-run average is the **expected value**, or **mean**, of the random variable, written $E[X]$ or $\\mu$.

### Definition
Weight each value by its probability and add; for a continuous variable, integrate against the density:

$$E[X] = \\sum_x x\\,p(x), \\qquad E[X] = \\int_{-\\infty}^{\\infty} x\\,f(x)\\,dx$$

It is the **balance point** of the distribution, exactly like the [[physics:center-of-mass|centre of mass]] of a rod whose mass is spread out like the probability.

A bet on red in European roulette wins 1 unit with probability $18/37$ and loses 1 with probability $19/37$ (the green zero belongs to the house). Its expected value is $18/37 - 19/37 = -1/37 \\approx -0.027$: on average you lose 2.7 % of every stake. No system of bets can change that sign, because expected values add.

### Linearity: the most useful property
For any random variables and constants,

$$E[aX + b] = a\\,E[X] + b, \\qquad E[X + Y] = E[X] + E[Y]$$

and the second rule holds **even when the variables are dependent**. The expected total of ten dice is $10 \\times 3.5 = 35$, with no counting at all.

### Variance and standard deviation
The mean says nothing about how widely the values scatter. The **variance** is the expected squared distance from the mean,

$$\\operatorname{Var}(X) = E\\big[(X - \\mu)^2\\big] = E[X^2] - \\mu^2$$

and the **standard deviation** $\\sigma = \\sqrt{\\operatorname{Var}(X)}$ brings it back to the units of $X$. For one die $E[X^2] = 91/6$, so $\\operatorname{Var}(X) = 91/6 - 3.5^2 = 35/12$ and $\\sigma = 1.71$.

Shifting does nothing to the spread and scaling multiplies it: $\\operatorname{Var}(aX + b) = a^2 \\operatorname{Var}(X)$. For **independent** variables the variances add,

$$\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$$

so standard deviations combine "in quadrature", like the sides of a right triangle. The total of $n$ independent copies therefore has mean $n\\mu$ but standard deviation only $\\sigma\\sqrt{n}$. That $\\sqrt{n}$ lies behind the [[standard-deviation|standard error]], [[error-propagation|error propagation]] and the [[central-limit-theorem|central limit theorem]].

### In physics
Temperature is an expected value: in the [[physics:kinetic-theory-gases|kinetic theory of gases]] the mean kinetic energy of a molecule is $\\tfrac32 k_B T$. In quantum mechanics a measurement gives random results, and the theory predicts their expected value, $\\langle x \\rangle = \\int x\\,|\\psi(x)|^2\\,dx$, and their spread — the $\\Delta x$ of the [[physics:uncertainty-principle|uncertainty principle]] is a standard deviation.
`,
  ideas: [
    'The expected value is the long-run average: each value weighted by its probability.',
    'Expectation is linear: $E[X + Y] = E[X] + E[Y]$ always, even for dependent variables.',
    'Variance is the mean squared deviation from the mean; the standard deviation is its square root, in the units of $X$.',
    'For independent variables, variances add — so the spread of a sum of $n$ copies grows only like $\\sqrt{n}$.'
  ],
  pitfalls: [
    'The expected value is the most likely value — Not in general. A die never shows 3.5, and a lottery ticket\'s expected payout is an amount no ticket actually pays.',
    'Standard deviations add — Variances add, for independent variables. Two independent errors of 3 combine to $\\sqrt{3^2 + 3^2} \\approx 4.2$, not 6.',
    '$E[X^2] = (E[X])^2$ — Only for a variable with no spread at all; the difference between them is exactly the variance.'
  ],
  formulas: [
    {
      name: 'Expected gain of a simple bet',
      expr: 'E = p*W - (1 - p)*L', tex: 'E = pW - (1 - p)L',
      vars: {
        E: { name: 'expected gain per play', signed: true },
        p: { name: 'probability of winning', value: 18 / 37, min: 0, max: 1 },
        W: { name: 'amount won', value: 1 },
        L: { name: 'amount lost (the stake)', value: 1 }
      },
      note: 'A game is fair when $E = 0$. The starting values are a bet on red in European roulette.',
      practice: { unknowns: ['E', 'p'] },
      stories: {
        E: 'A game pays {W} with probability {p}; otherwise you lose {L}. What is your expected gain per game?',
        p: 'A game pays {W} if you win and costs {L} if you lose. What probability of winning gives an expected gain of {E}?'
      }
    },
    {
      name: 'Standard deviation from the moments',
      expr: 'sigma = sqrt(EX2 - mu^2)', tex: '\\sigma = \\sqrt{\\mathit{E[X^2]} - \\mu^2}',
      vars: {
        sigma: { name: 'standard deviation' },
        EX2: { name: 'mean of the square', tex: '\\mathit{E[X^2]}', value: 91 / 6 },
        mu: { name: 'mean', value: 3.5, signed: true }
      },
      note: 'The starting values are one fair die: $E[X^2] = 91/6$ and $\\mu = 3.5$ give $\\sigma = 1.71$.',
      stories: { sigma: 'A random variable has mean {mu} and mean square {EX2}. What is its standard deviation?' }
    }
  ],
  examples: [
    {
      title: 'One die',
      q: 'Find the mean, variance and standard deviation of the score on one fair die.',
      steps: [
        '$E[X] = \\frac{1 + 2 + 3 + 4 + 5 + 6}{6} = 3.5$.',
        '$E[X^2] = \\frac{1 + 4 + 9 + 16 + 25 + 36}{6} = \\frac{91}{6} = 15.17$.',
        '$\\operatorname{Var}(X) = 15.17 - 3.5^2 = 2.92 = 35/12$, so $\\sigma = \\sqrt{2.92} = 1.71$.'
      ],
      a: 'Mean 3.5, variance 35/12 ≈ 2.92, standard deviation ≈ 1.71.'
    },
    {
      title: 'An insurer\'s view',
      q: 'A policy pays 20 000 with probability 0.002 in a year and nothing otherwise. Find the expected payout and its standard deviation for one policy, and for 10 000 independent policies.',
      steps: [
        'Mean: $E[X] = 0.002 \\times 20\\,000 = 40$ per policy.',
        '$E[X^2] = 0.002 \\times 20\\,000^2 = 800\\,000$, so $\\sigma = \\sqrt{800\\,000 - 40^2} = 894$.',
        'For 10 000 policies: mean $400\\,000$, standard deviation $894\\sqrt{10\\,000} = 89\\,400$.',
        'One policy is wildly unpredictable (spread 22 times its mean); the whole book varies by only 22 % of its mean. Pooling risk is what makes insurance possible.'
      ],
      a: 'Per policy: mean 40, SD ≈ 894. For 10 000: mean 400 000, SD ≈ 89 000.'
    }
  ],
  quiz: [
    { q: 'A game pays 10 points with probability 0.2 and nothing otherwise. What is its expected value?', choices: ['0.2', '2', '8', '10'], a: 1,
      why: '$E = 0.2 \\times 10 + 0.8 \\times 0 = 2$ points per game.' },
    { q: '$X$ has mean 5 and standard deviation 2. What are the mean and standard deviation of $Y = 3X - 4$?', choices: ['11 and 6', '11 and 2', '15 and 6', '11 and 36'], a: 0,
      why: 'Mean: $3 \\times 5 - 4 = 11$. Standard deviation: the shift does nothing and the factor 3 scales it, $3 \\times 2 = 6$ (the variance becomes 36).' },
    { q: '$E[X + Y] = E[X] + E[Y]$ holds only when $X$ and $Y$ are independent.', a: false,
      why: 'Linearity of expectation needs no independence. It is the variance rule, $\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$, that requires it.' },
    { q: 'Two independent measurements each have standard deviation 3. The standard deviation of their sum is…', choices: ['6', '√18 ≈ 4.2', '3', '9'], a: 1,
      why: 'Variances add: $9 + 9 = 18$, and $\\sqrt{18} \\approx 4.24$.' },
    { q: '$X$ is 1 with probability $p$ and 0 otherwise. Write $\\operatorname{Var}(X)$.', answer: 'p(1-p)', vars: ['p'],
      why: '$E[X] = p$ and $E[X^2] = p$ (since $1^2 = 1$), so $\\operatorname{Var}(X) = p - p^2 = p(1 - p)$.' }
  ],
  problems: [
    { q: 'A ticket costs 2. It wins 100 with probability 0.01 and 10 with probability 0.05, and otherwise nothing. What is the expected net gain per ticket?', answer: -0.5, tol: 0.01,
      steps: ['Expected winnings: $0.01 \\times 100 + 0.05 \\times 10 = 1 + 0.5 = 1.5$.', 'Net: $1.5 - 2 = -0.5$ per ticket.'] },
    { q: '$X$ is uniformly distributed on $[0, 1]$. What is its variance?', answer: 0.08333, tol: 0.01,
      steps: ['$E[X] = 1/2$ and $E[X^2] = \\int_0^1 x^2\\,dx = 1/3$.', '$\\operatorname{Var}(X) = 1/3 - 1/4 = 1/12 \\approx 0.0833$.'] }
  ],
  applications: [
    'Pricing insurance and judging bets: the house edge of a casino game is its expected value.',
    'Decision-making under uncertainty in engineering and finance, comparing options by expected cost.',
    'Statistical physics, where temperature, pressure and energy are expected values over molecules.',
    'Quantum mechanics, which predicts expectation values of measurements.'
  ],
  sim: { id: 'ps-clt', params: { n: 10, rate: 40 }, title: 'Mean and spread of the total of ten dice' }
}

);
