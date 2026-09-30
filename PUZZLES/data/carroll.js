/* The Puzzle Cabinet · data/carroll.js
 * Lewis Carroll's problems, retold in modern words: A Tangled Tale (1885), Pillow Problems (1893)
 * and the syllogisms of The Game of Logic (1886) and Symbolic Logic (1896).
 * Every numeric answer and every logical conclusion was checked by computer. */
Cabinet.concepts([
  { id: 'syllogism', name: 'Syllogisms and sorites',
    text: 'A syllogism draws a conclusion from two statements ("No ducks waltz; all my poultry are ducks; so my poultry do not waltz"). A sorites chains many: each statement is turned into an "all A are B" (or "no A are B"), and the conclusion is what you get by following the arrows from the first thing to the last. Lewis Carroll, an Oxford logician, made a game of it: he liked premises so silly that only the logic could be trusted.\n\nThe key move is the **contrapositive**: "all A are B" is the same as "anything that is not B is not A". Use it to turn the chain round whenever the next link starts at the wrong end.' }
]);

Cabinet.family({
  id: 'carroll', engine: 'question', cat: 'riddles', name: 'Lewis Carroll\'s problems', order: 4,
  blurb: 'Knots to untie, bags of counters, and syllogisms about kangaroos: the mathematics that Charles Dodgson worked out in bed and in the pages of a magazine.',
  origin: { year: 1885, who: 'Lewis Carroll (Charles L. Dodgson, 1832–1898)', note: 'Dodgson, a mathematics lecturer at Oxford, wrote the Alice books as Lewis Carroll and puzzles under both names. A Tangled Tale (ten "knots" of problems, printed in a magazine from 1880 and as a book in 1885) and Pillow Problems (1893, thought out in the dark, without pen or paper) are full of neat ones. His logic books of 1886 and 1896 hold the famous syllogisms. All are in the public domain.' },
  concepts: ['deduction', 'syllogism', 'probability']
}, [
  {
    id: 'car-sea-serpent', title: 'The Sea-Serpent Story', diff: 1, year: 1896,
    links: ['car-dragons', 'car-cakes'],
    source: 'Carroll, *Symbolic Logic* (1896), the opening example.',
    text: `Take these two statements as true:<br>1. Your story about meeting the sea-serpent always sets me yawning.<br>2. I never yawn unless I am listening to something totally devoid of interest.\n\nWhat follows?`,
    hints: ['Use the second statement backwards: what does yawning tell you?', 'If I yawn, I must be listening to something totally devoid of interest.'],
    explain: `Statement 2 says that yawning happens *only* when I am listening to something devoid of interest. Statement 1 says your story makes me yawn. So the story is **totally devoid of interest**. (It does not follow that you never met a serpent, only that the tale is a bore.)`,
    data: {
      answer: { choice: 1, choices: ['You never really met a sea-serpent', 'Your story is totally devoid of interest', 'I yawn whenever anyone tells me a story', 'I am never interested in anything'] },
      traps: [{ match: 0, msg: 'The statements say nothing about whether the story is true.' }],
      glyph: '🐉'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-dragons', title: 'Dragons and Scotsmen', diff: 1, year: 1886,
    links: ['car-cakes', 'car-ducks'],
    source: 'Carroll, *The Game of Logic* (1886).',
    text: `Take these statements as true (and take "canny" and "uncanny" to be opposites):<br>1. All dragons are uncanny.<br>2. All Scotsmen are canny.\n\nWhat follows?`,
    hints: ['Draw two circles: dragons, and uncanny things. Then Scotsmen inside a circle that stays clear of uncanny things.', 'Can anything be both canny and uncanny?'],
    explain: `Everything that is a Scotsman is canny, and every dragon is uncanny, and nothing can be both, so **no dragon is a Scotsman** (and no Scotsman is a dragon). Carroll writes it as "all dragons are not-Scotsmen".`,
    data: {
      answer: { choice: 3, choices: ['All Scotsmen are dragons', 'Some dragons are Scotsmen', 'Some Scotsmen are uncanny', 'No dragon is a Scotsman'] },
      traps: [{ match: 1, msg: 'A dragon is uncanny, and a Scotsman is canny. Can one thing be both?' }],
      glyph: '🏴'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-cakes', title: 'New Cakes, Nice Cakes', diff: 2, year: 1886,
    links: ['car-lions', 'car-dragons'],
    source: 'Carroll, *The Game of Logic* (1886).',
    text: `Take these statements as true:<br>1. Some new cakes are unwholesome.<br>2. No nice cakes are unwholesome.\n\nWhich conclusion follows from them?`,
    hints: ['Look at the new cakes that are unwholesome. Can they be nice?', 'They cannot be nice, because no nice cake is unwholesome.'],
    explain: `Some new cakes are unwholesome, and nothing nice is unwholesome, so those cakes are not nice: **some new cakes are not nice**. It does not follow that *all* new cakes are not nice: the statements only speak of "some".`,
    data: {
      answer: { choice: 3, choices: ['All new cakes are nice', 'No new cakes are nice', 'All nice cakes are new', 'Some new cakes are not nice'] },
      traps: [{ match: 1, msg: 'Careful: the first statement only says "some" new cakes are unwholesome.' }],
      glyph: '🍰'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-ducks', title: 'Ducks, Officers and Poultry', diff: 2, year: 1896,
    links: ['car-babies', 'car-guinea-pigs'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these statements as true:<br>1. No ducks waltz.<br>2. No officers ever decline to waltz.<br>3. All my poultry are ducks.\n\nWhat follows about my poultry and officers?`,
    hints: ['Turn statement 2 round: every officer waltzes.', 'Poultry are ducks, ducks do not waltz, officers do waltz.'],
    explain: `My poultry are ducks; ducks do not waltz; officers always waltz. So none of my poultry can be an officer: **none of my poultry are officers**. It is one of Carroll's best-known chains of reasoning, and the statements can be as silly as you like while the logic stays firm.`,
    data: {
      answer: { choice: 2, choices: ['All my poultry are officers', 'Some of my poultry are officers', 'None of my poultry are officers', 'All officers are my poultry'] },
      traps: [{ match: 1, msg: 'Officers all waltz and ducks never do. Could a bird be both?' }],
      glyph: '🦆'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-babies', title: 'Babies and Crocodiles', diff: 2, year: 1896,
    links: ['car-ducks', 'car-times'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these statements as true:<br>1. Babies are illogical.<br>2. Nobody is despised who can manage a crocodile.<br>3. Illogical persons are despised.\n\nWhat follows about babies?`,
    hints: ['Follow the chain from babies: illogical, then...', 'Illogical persons are despised. And who is never despised?'],
    explain: `Babies are illogical; illogical people are despised; nobody who can manage a crocodile is despised. So **babies cannot manage crocodiles**.`,
    data: {
      answer: { choice: 0, choices: ['Babies cannot manage crocodiles', 'Babies can manage crocodiles', 'All despised persons are babies', 'Only babies are illogical'] },
      traps: [{ match: 2, msg: 'That turns statement 1 round the wrong way. Follow the arrows from "babies".' }],
      glyph: '🐊'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-guinea-pigs', title: 'Guinea-Pigs and the Moonlight Sonata', diff: 2, year: 1896,
    links: ['car-times', 'car-jury'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these statements as true:<br>1. Nobody who really appreciates Beethoven fails to keep silent while the Moonlight Sonata is being played.<br>2. Guinea-pigs are hopelessly ignorant of music.<br>3. No one who is hopelessly ignorant of music ever keeps silent while the Moonlight Sonata is being played.\n\nWhat follows about guinea-pigs?`,
    hints: ['Guinea-pigs are ignorant of music, and the ignorant never keep silent.', 'Those who appreciate Beethoven always keep silent. Guinea-pigs do not.'],
    explain: `Guinea-pigs are hopelessly ignorant of music, so they never keep silent during the sonata. Anyone who really appreciates Beethoven does keep silent. So **guinea-pigs never really appreciate Beethoven**.`,
    data: {
      answer: { choice: 3, choices: ['Guinea-pigs sometimes appreciate Beethoven', 'Everyone who keeps silent is a guinea-pig', 'Only guinea-pigs are ignorant of music', 'Guinea-pigs never really appreciate Beethoven'] },
      traps: [{ match: 1, msg: 'That reads statement 1 the wrong way round. Follow the arrows from "guinea-pigs".' }],
      glyph: '🎹'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-lions', title: 'Fierce Lions', diff: 2, year: 1896,
    links: ['car-cakes', 'car-jenkins'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these statements as true:<br>1. All lions are fierce.<br>2. Some lions do not drink coffee.\n\nWhich conclusion follows?`,
    hints: ['Look at one of the lions that does not drink coffee. What else is it?', 'It is fierce, because all lions are.'],
    explain: `Some lions do not drink coffee, and every lion is fierce, so those lions are fierce creatures that do not drink coffee: **some fierce creatures do not drink coffee**. That is all we can say: the statements never mention fierce creatures other than lions.`,
    data: {
      answer: { choice: 0, choices: ['Some fierce creatures do not drink coffee', 'No lions drink coffee', 'All fierce creatures drink coffee', 'No fierce creature drinks coffee'] },
      traps: [{ match: 1, msg: 'The second statement only says that *some* lions do not.' }, { match: 3, msg: 'That is far more than the statements say: they only speak of lions.' }],
      glyph: '🦁'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-times', title: 'Hedgehogs and the Times', diff: 2, year: 1896,
    links: ['car-babies', 'car-guinea-pigs'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these statements as true:<br>1. No one takes in the *Times* unless he is well-informed.<br>2. No hedgehogs can read.<br>3. Those who cannot read are not well-informed.\n\nWhat follows about hedgehogs?`,
    hints: ['Follow the chain from hedgehogs: they cannot read, so they are not...', 'Not well-informed people do not take in the Times.'],
    explain: `Hedgehogs cannot read, so they are not well-informed, and only the well-informed take in the *Times*. So **no hedgehog takes in the Times**.`,
    data: {
      answer: { choice: 2, choices: ['Hedgehogs are well-informed', 'Some hedgehogs take in the Times', 'No hedgehog takes in the Times', 'Only hedgehogs take in the Times'] },
      traps: [{ match: 1, msg: 'Follow the arrows: hedgehogs cannot read, and so...' }],
      glyph: '🦔'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-jury', title: 'Your Sons and the Jury', diff: 2, year: 1896,
    links: ['car-jenkins', 'car-humming-birds'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these statements as true (and take a "lunatic" to be someone who is not sane):<br>1. Everyone who is sane can do logic.<br>2. No lunatics are fit to serve on a jury.<br>3. None of your sons can do logic.\n\nWhat follows about your sons?`,
    hints: ['If your sons cannot do logic, can they be sane?', 'Not sane means lunatic, and no lunatic is fit for a jury.'],
    explain: `Your sons cannot do logic, and everyone sane can, so your sons are not sane, that is, they are lunatics; and no lunatic is fit to serve on a jury. So **none of your sons is fit to serve on a jury**.`,
    data: {
      answer: { choice: 2, choices: ['All your sons are fit to serve on a jury', 'Everyone who can do logic is sane', 'None of your sons is fit to serve on a jury', 'Some sane people are lunatics'] },
      traps: [{ match: 1, msg: 'The first statement only says that the sane can do logic. It does not say the reverse.' }],
      glyph: '⚖'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-jenkins', title: 'Jenkins the Blunderer', diff: 2, year: 1896,
    links: ['car-jury', 'car-lions'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these statements as true:<br>1. No experienced person is incompetent.<br>2. Jenkins is always blundering.<br>3. No competent person is always blundering.\n\nWhat follows about Jenkins?`,
    hints: ['Jenkins always blunders. Which people never always blunder?', 'Competent people. And what do experienced people turn out to be?'],
    explain: `Nobody competent is always blundering, but Jenkins is, so Jenkins is not competent. Every experienced person is competent, so Jenkins is not experienced: **Jenkins is inexperienced**.`,
    data: {
      answer: { choice: 1, choices: ['Jenkins is competent', 'Jenkins is inexperienced', 'Jenkins is experienced', 'Every competent person is experienced'] },
      traps: [{ match: 3, msg: 'Statement 1 says all the experienced are competent, not the other way round.' }],
      glyph: '🛠'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-excelsior', title: 'Excelsior', diff: 3, year: 1885,
    links: ['dud-hill-road', 'dud-average-speed'],
    source: 'Carroll, *A Tangled Tale* (1885), Knot I (Excelsior).',
    text: `Two travellers spend the time from **3 o'clock till 9** walking along a level road, up a hill, and home again by the same way. Their pace is **4 miles an hour** on the level, **3** uphill and **6** downhill.\n\nHow many miles did they walk altogether?`,
    hints: ['Every stretch of road is walked twice, once each way. How long does a mile of level road take there and back? A mile of hillside?', 'A mile of level road takes ¼ + ¼ hour; a mile of hillside takes ⅓ + ⅙ hour, going up one way and down the other.'],
    explain: `Every mile of road is walked twice. On the level a mile takes ¼ hour each way, ½ hour there and back. On the hillside a mile is walked once uphill (⅓ hour) and once downhill (⅙ hour), which is also ½ hour. So **every mile of road costs half an hour**, whatever the slope. Six hours gives 12 miles of road, and the travellers walked **24 miles**. (Carroll's own answer adds that the summit was reached at about half-past six.)`,
    data: { answer: { num: 24, unit: 'miles' }, glyph: '⛰' },
    concepts: ['rates', 'invariant'], tags: ['speed', 'hill']
  },
  {
    id: 'car-governors-dinner', title: 'The Governor\'s Small Dinner', diff: 3, year: 1885,
    links: ['dud-family-party'],
    source: 'Carroll, *A Tangled Tale* (1885), Knot II (Eligible Apartments).',
    text: `The Governor of Kgovjni wants to give a very small dinner party. He invites his **father's brother-in-law**, his **brother's father-in-law**, his **father-in-law's brother** and his **brother-in-law's father**.\n\nWhat is the smallest number of guests he might have to feed?`,
    hints: ['Could one man be all four? Try to describe a family in which he is.', 'Let the guest be married to the Governor\'s father\'s sister. Now make him the father of the Governor\'s brother-in-law and of his brother\'s wife.'],
    explain: `One man can be all four. Let the guest be married to an aunt of the Governor (his father's sister): then he is his **father's brother-in-law**. Let his daughter be the wife of the Governor's brother: he is his **brother's father-in-law**. Let his son marry the Governor's sister: he is his **brother-in-law's father**. And let the Governor's own wife be the daughter of the guest's brother: he is his **father-in-law's brother**. Carroll's answer: **one**.`,
    data: { answer: { num: 1 }, traps: [{ match: 4, msg: 'That is the most it could be. Can some of these relatives be the same person?' }], ask: 'The smallest number of guests', glyph: '1' },
    concepts: ['deduction', 'lateral'], tags: ['relations']
  },
  {
    id: 'car-dead-reckoning', title: 'The Dead Reckoning', diff: 3, year: 1885,
    links: ['dud-trusses'],
    source: 'Carroll, *A Tangled Tale* (1885), Knot IV (The Dead Reckoning).',
    text: `Five sacks are weighed in groups. The first and second together weigh **12 lb**, the second and third **13½ lb**, the third and fourth **11½ lb**, the fourth and fifth **8 lb**, and the first, third and fifth together **16 lb**.\n\nHow much does each sack weigh, in pounds? Give the five weights in order.`,
    hints: ['Add up the five sacks in two different ways, using the first three pair-weights.', 'The total is 12 + 11½ + (the fifth) and also (the first) + 13½ + 8. So the first is 2 lb heavier than the fifth.'],
    explain: `The whole load is (1st + 2nd) + (3rd + 4th) + 5th = 12 + 11½ + 5th, and also 1st + (2nd + 3rd) + (4th + 5th) = 1st + 13½ + 8. So the 1st is 2 lb heavier than the 5th. Put that in 1st + 3rd + 5th = 16: 3rd = 14 − 2 × (5th). Then 4th = 8 − 5th, and 3rd + 4th = 11½ gives 22 − 3 × (5th) = 11½, so the 5th weighs 3½. The weights are **5½, 6½, 7, 4½ and 3½ lb**.`,
    data: { answer: { nums: [5.5, 6.5, 7, 4.5, 3.5], ordered: true }, ask: 'The five weights in order, as decimals, separated by commas', glyph: '5⚖' },
    concepts: ['equations', 'deduction'], tags: ['weights']
  },
  {
    id: 'car-petty-cash', title: 'Petty Cash', diff: 3, year: 1885,
    links: ['car-dead-reckoning'],
    source: 'Carroll, *A Tangled Tale* (1885), Knot VII (Petty Cash).',
    text: `Clara's aunt keeps her household accounts. **Yesterday's** lunch of **1 lemonade, 3 sandwiches and 7 biscuits** cost **1s 2d** (14 pence). The day before, **1 lemonade, 4 sandwiches and 10 biscuits** cost **1s 5d** (17 pence).\n\nHow much would **1 lemonade, 1 sandwich and 1 biscuit** cost? Give the answer in pence.`,
    hints: ['You cannot find each price, but you may not need to. Can you mix the two lunches (some of one, less of the other) to make just 1 lemonade, 1 sandwich and 1 biscuit?', 'Try three of the first lunch and take away two of the second.'],
    explain: `Three of yesterday's lunches make 3 lemonades, 9 sandwiches and 21 biscuits. Take away two of the other lunches (2 lemonades, 8 sandwiches, 20 biscuits) and what is left is exactly **1 lemonade, 1 sandwich and 1 biscuit**. The price is 3 × 14 − 2 × 17 = **8 pence**. The prices of the individual items are not fixed by the data, but their sum is.`,
    data: { answer: { num: 8, unit: 'pence' }, glyph: '8d' },
    concepts: ['equations', 'diophantine'], tags: ['money']
  },
  {
    id: 'car-chelsea-buns', title: 'Chelsea Buns', diff: 3, year: 1885,
    source: 'Carroll, *A Tangled Tale* (1885), Knot X (Chelsea Buns).',
    text: `In a very hard-fought battle, **at least 70 per cent** of the fighters lost an eye, **at least 75 per cent** an ear, **at least 80 per cent** an arm and **at least 85 per cent** a leg.\n\nWhat percentage, **at least**, must have lost **all four**?`,
    hints: ['Count the ones who did *not* lose an eye, an ear, an arm or a leg: 30, 25, 20 and 15 per cent, at most.', 'How many can be missing at least one of the four?'],
    explain: `At most 30% kept both eyes, at most 25% kept both ears, at most 20% kept both arms and at most 15% kept both legs. So at most 30 + 25 + 20 + 15 = 90% are in one of these groups (missing at least one loss), and the rest, at least **10%**, lost all four.`,
    data: { answer: { num: 10, unit: 'per cent' }, glyph: '10%' },
    concepts: ['pigeonhole', 'combinatorics'], tags: ['percentages']
  },
  {
    id: 'car-pillow-5', title: 'The Bag with One Counter', diff: 3, year: 1893,
    links: ['car-pillow-19', 'car-pillow-23'],
    source: 'Carroll, *Pillow Problems* (1893), no. 5.',
    text: `A bag holds **one counter**, and all you know is that it is either white or black, with equal chances. You put in a **white counter**, shake the bag and draw one out at random: it is **white**.\n\nWhat is now the chance that the counter still in the bag is white? Give a fraction.`,
    hints: ['Imagine the two cases: the original counter was white, or black. How likely is it to draw a white counter in each?', 'If the original was white the draw is certainly white. If it was black, the chance of drawing the white one is only ½.'],
    explain: `If the counter in the bag was white, a white draw is certain; if it was black, a white draw has chance ½. Since the draw was white, the two cases become **2 : 1** in favour of "white". The counter left in the bag is the *other* one, and it is white exactly when the original was white, so the chance is **2 ⁄ 3**. (It is not ½: the white draw is evidence.)`,
    data: { answer: { num: 0.666667, tol: 0.001, show: '2/3' }, traps: [{ match: 0.5, msg: 'That is the tempting half. But drawing a white counter tells you something about the one that was in the bag.' }], glyph: '⅔' },
    concepts: ['conditional-probability', 'probability'], tags: ['probability', 'Bayes']
  },
  {
    id: 'car-pillow-21', title: 'A Sum of Threes', diff: 3, year: 1893,
    source: 'Carroll, *Pillow Problems* (1893), no. 21.',
    text: `Carroll, in bed with no pencil, sums the series **1×3×5 + 2×4×6 + 3×5×7 + …**, each term being three numbers two apart, and starting one higher each time.\n\nWhat is the sum of the first **100** terms?`,
    hints: ['The n-th term is n(n + 2)(n + 4) = n³ + 6n² + 8n. So you need the sums of the first hundred cubes, squares and whole numbers.', 'Carroll finds a compact formula for n terms: n(n + 1)(n + 4)(n + 5) ⁄ 4.'],
    explain: `The n-th term is n(n + 2)(n + 4) = n³ + 6n² + 8n, so the sum to n terms is (n(n+1) ⁄ 2)² + n(n+1)(2n+1) + 4n(n+1) = n(n + 1)(n + 4)(n + 5) ⁄ 4. For n = 100 this is 100 × 101 × 104 × 105 ⁄ 4 = **27,573,000**, which is Carroll's answer.`,
    data: { answer: { num: 27573000 }, glyph: 'Σ' },
    concepts: ['sequence'], tags: ['series']
  },
  {
    id: 'car-humming-birds', title: 'Humming-Birds and Honey', diff: 3, year: 1896,
    links: ['car-jury', 'car-kittens'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these statements as true (and take "richly coloured" and "dull in colour" to be opposites):<br>1. All humming-birds are richly coloured.<br>2. No large birds live on honey.<br>3. Birds that do not live on honey are dull in colour.\n\nWhat follows about humming-birds?`,
    hints: ['Follow humming-birds forward: richly coloured, so not dull in colour, so...', 'Birds that do not live on honey are dull. So which birds live on honey? And what does that say about size?'],
    explain: `Humming-birds are richly coloured, so not dull; birds that do not live on honey are dull; so humming-birds **do** live on honey. No large bird lives on honey, so no humming-bird is large: **all humming-birds are small**.`,
    data: {
      answer: { choice: 0, choices: ['All humming-birds are small', 'All small birds are humming-birds', 'Humming-birds are dull in colour', 'Only humming-birds are richly coloured'] },
      traps: [{ match: 1, msg: 'That turns the conclusion round. Follow the arrows only in the direction they point.' }],
      glyph: '🐦'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-not-easy', title: 'The Sorites Are Not Easy', diff: 3, year: 1896,
    links: ['car-poems', 'car-sharks'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these statements as true. The writer is talking about logic examples ("sorites") that he is working through:<br>1. When I work a logic example without grumbling, it is one I can understand.<br>2. These sorites are not arranged in the regular order I am used to.<br>3. No easy example ever gives me a headache.<br>4. I cannot understand examples that are not arranged in the regular order I am used to.<br>5. I never grumble at an example unless it gives me a headache.\n\nWhat follows about these sorites?`,
    hints: ['Start with statement 2 and follow the chain: not in regular order, so I cannot understand them, so...', 'If I cannot understand an example, I must have grumbled at it (statement 1 backwards), and grumbling means a headache.'],
    explain: `These sorites are not in the usual order, so the writer cannot understand them; if he could not understand them he must have grumbled (by statement 1, turned round); grumbling means a headache (statement 5); and no easy example gives a headache. So **these sorites are not easy**: a small joke on the reader, who has been chewing on them.`,
    data: {
      answer: { choice: 1, choices: ['These sorites are easy', 'These sorites are not easy', 'These sorites give me no headache', 'I grumble at every logic example'] },
      traps: [{ match: 2, msg: 'Follow the chain: they are not in regular order, so I cannot understand them, so...' }],
      glyph: '?'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-kittens', title: 'Kittens and the Gorilla', diff: 3, year: 1896,
    links: ['car-poems', 'car-kangaroo'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these statements about kittens as true:<br>1. No kitten that loves fish is unteachable.<br>2. No kitten without a tail will play with a gorilla.<br>3. Kittens with whiskers always love fish.<br>4. No teachable kitten has green eyes.<br>5. No kittens have tails unless they have whiskers.\n\nWhat follows about green-eyed kittens?`,
    hints: ['Start with green eyes and go: not teachable, so...', 'A kitten that is not teachable does not love fish, so it has no whiskers, so it has no tail. And what does no tail mean for gorillas?'],
    explain: `Green-eyed kittens are not teachable (4); kittens that are not teachable do not love fish (1); those that do not love fish have no whiskers (3); those without whiskers have no tails (5); and kittens without tails will not play with a gorilla (2). So **no green-eyed kitten will play with a gorilla**.`,
    data: {
      answer: { choice: 2, choices: ['Every green-eyed kitten will play with a gorilla', 'Every kitten that plays with a gorilla has green eyes', 'No green-eyed kitten will play with a gorilla', 'Only kittens with tails have green eyes'] },
      traps: [{ match: 3, msg: 'Follow the chain: green eyes lead, step by step, to having no tail. So can a green-eyed kitten have one?' }],
      glyph: '🐱'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-poems', title: 'Your Poems', diff: 3, year: 1896,
    links: ['car-kittens', 'car-not-easy'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these statements as true (and take every poem to be either ancient or modern):<br>1. No interesting poems are unpopular among people of real taste.<br>2. No modern poetry is free from affectation.<br>3. All your poems are on the subject of soap-bubbles.<br>4. No affected poetry is popular among people of real taste.<br>5. No ancient poem is on the subject of soap-bubbles.\n\nWhat follows about your poems?`,
    hints: ['Start from "your poems" and follow the chain: soap-bubbles, so not ancient, so...', 'Not ancient means modern, and modern means affected. What do people of real taste think of affected poetry?'],
    explain: `Your poems are about soap-bubbles, so they are not ancient (5), so they are modern, so they are affected (2), so they are not popular among people of real taste (4), so they are not interesting (1: the interesting ones are popular with such people). So **all your poems are uninteresting**. Carroll enjoyed giving a logical proof of a poet's failure.`,
    data: {
      answer: { choice: 0, choices: ['All your poems are uninteresting', 'All your poems are interesting', 'All your poems are ancient', 'Some of your poems are popular among people of real taste'] },
      traps: [{ match: 2, msg: 'Statement 5 says the opposite: no ancient poem is about soap-bubbles.' }],
      glyph: '🫧'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-mad-mathesis', title: 'Mad Mathesis and the Railway', diff: 4, year: 1885,
    links: ['dud-two-trains'],
    source: 'Carroll, *A Tangled Tale* (1885), Knot III (Mad Mathesis).',
    text: `A circular railway has a single station. **Trains leave the station every 15 minutes in each direction.** An eastbound train takes **3 hours** to go all the way round and get back to the station; a westbound train takes **2 hours**.\n\nA traveller boards an eastbound train and rides all the way round. **How many westbound trains does she meet on the way?** (Do not count any that are at the station at the moment she leaves or at the moment she arrives.)`,
    hints: ['Which westbound trains are on the line at some moment of her trip? Think about when they left the station.', 'A westbound train that left 2 hours before she started is just reaching the station as she leaves. One that leaves 3 hours after she started is just leaving as she arrives.'],
    explain: `Only westbound trains that left between **2 hours before** she set off and **3 hours after** she set off can be on the line while she is travelling. The 21 departures in that window (at quarter-hour spacing, both ends included) include the two at the ends, one arriving at the station as she leaves and one leaving as she arrives; each of the other **19** passes her exactly once. (By the same reasoning a westbound traveller meets 19 eastbound trains.)`,
    data: { answer: { num: 19 }, traps: [{ match: 20, msg: 'Close: one train at either end of the window is only at the station, not on the line, and is not counted.' }, { match: 21, msg: 'That counts the trains at the station at the two ends, which the puzzle says not to count.' }], glyph: '🚆' },
    concepts: ['rates', 'sequence'], tags: ['trains']
  },
  {
    id: 'car-pillow-19', title: 'Three Bags', diff: 4, year: 1893,
    links: ['car-pillow-27', 'car-pillow-5'],
    source: 'Carroll, *Pillow Problems* (1893), no. 19.',
    text: `Three bags hold counters: the first has **1 white and 1 black**, the second **2 white and 1 black**, the third **3 white and 1 black**. Two of the bags are chosen at random and one counter is drawn from each: one turns out **white**, the other **black**.\n\nWhat is the chance that a counter drawn from the **third** bag is white? Give a fraction.`,
    hints: ['List the possible bags for "white came from here, black came from there". Weight each by how likely it is to give exactly that result.', 'Put the weights over the total of all six arrangements, and multiply by the chance that the leftover bag gives white.'],
    explain: `Take every way of choosing which bag gave the white counter and which the black one, and weight it by the chance of that pair of draws (chances of white: ½, ⅔, ¾; of black: ½, ⅓, ¼). The six weights add to 34 ⁄ 24, and the weights multiplied by the chance that the remaining bag gives white add to 11 ⁄ 12. The chance is (11 ⁄ 12) ÷ (34 ⁄ 24) = **11 ⁄ 17**.`,
    data: { answer: { num: 0.647059, tol: 0.001, show: '11/17' }, glyph: '11/17' },
    concepts: ['conditional-probability', 'probability'], tags: ['probability', 'Bayes']
  },
  {
    id: 'car-pillow-27', title: 'Bags of Six', diff: 4, year: 1893,
    links: ['car-pillow-19', 'car-pillow-38'],
    source: 'Carroll, *Pillow Problems* (1893), no. 27.',
    text: `Three bags each hold **six counters**: the first has **5 white and 1 black**, the second **4 white and 2 black**, the third **3 white and 3 black**. Two of the bags are chosen at random, and a counter is drawn from each: one is **white** and one is **black**.\n\nWhat is the chance that a counter drawn from the **remaining** bag is white? Give a fraction.`,
    hints: ['Work as in a table: for each arrangement of "white bag, black bag, leftover bag" find the chance of the two draws.', 'Then weigh the leftover bag\'s chance of white by those chances.'],
    explain: `Weight each arrangement (white from one bag, black from another) by the chance of that pair of draws, then weigh by the chance that the left-over bag gives white. The weights come to 17 ⁄ 25 of the total: **17 ⁄ 25** (0.68).`,
    data: { answer: { num: 0.68, show: '17/25' }, glyph: '17/25' },
    concepts: ['conditional-probability', 'probability'], tags: ['probability', 'Bayes']
  },
  {
    id: 'car-pillow-39', title: 'The Two Walkers', diff: 4, year: 1893,
    links: ['dud-thief'],
    source: 'Carroll, *Pillow Problems* (1893), no. 39.',
    text: `A and B set out at 6 a.m. on the same road in the same direction. B starts **14 miles ahead** of A. Both walk from 6 a.m. to 6 p.m. each day at a steady pace, and rest at night.\n\n**A** walks 10 miles on the first day, 9 on the second, 8 on the third, and so on, one mile less each day. **B** walks 2 miles on the first day, 4 on the second, 6 on the third, and so on, two more each day.\n\nThey meet twice. How many miles from A's starting place are they at the first meeting and at the second? Give both distances.`,
    hints: ['Make a table of A\'s and B\'s positions at the end of each day. When does A overtake B, and when does B catch up again?', 'At the end of day 2 A is at 19 miles and B at 20. A gains 2 miles over the third day, so they meet during that day: after how many hours?'],
    explain: `A's positions at the ends of days 1, 2, 3, 4…: 10, 19, 27, 34; B's: 16, 20, 26, 34. On day 3 A gains 2 miles on B (A goes 8, B goes 6), and needs to gain 1 to catch up, so they meet **halfway through day 3**, six hours into it, at 19 + 4 = **23 miles**. They are together again at the **end of day 4**, at **34 miles**, after which B pulls ahead for good, as A's steps shrink and B's grow.`,
    data: { answer: { nums: [23, 34], ordered: true }, ask: 'First meeting, then second meeting, separated by a comma', glyph: '23·34' },
    concepts: ['sequence', 'rates'], tags: ['walking']
  },
  {
    id: 'car-pillow-49', title: 'The Pyramid and the Tetrahedron', diff: 4, year: 1893,
    links: ['car-pillow-54'],
    source: 'Carroll, *Pillow Problems* (1893), no. 49.',
    text: `Four equilateral triangles are stood up as the sloping faces of a pyramid with a **square** base. Four more triangles of the same size are made into a **regular tetrahedron**.\n\nHow many times as big as the tetrahedron is the square pyramid?`,
    hints: ['Call the edge a. Both solids have edges of length a. Find the height of each.', 'The square pyramid stands on a square of side a and has height a ⁄ √2. The tetrahedron has height a ⁄ √(3 ⁄ 2) over an equilateral triangle base.'],
    explain: `With edge a, the square pyramid has base area a² and height a ⁄ √2 (its apex is over the centre, and slant edges are a), so its volume is a³ ⁄ (3√2) = (√2 ⁄ 6)a³. The regular tetrahedron of edge a has volume (√2 ⁄ 12)a³. The ratio is exactly **2**. (Another way to see it: the square pyramid is exactly half of a regular octahedron of the same edge, and an octahedron holds the volume of four such tetrahedra.)`,
    data: { answer: { num: 2 }, glyph: '▲◇' },
    concepts: ['projection', 'area'], tags: ['volume']
  },
  {
    id: 'car-pillow-54', title: 'The Hexagon in the Triangle', diff: 4, year: 1893,
    links: ['car-pillow-28', 'car-pillow-49'],
    source: 'Carroll, *Pillow Problems* (1893), no. 54.',
    text: `Take a triangle with sides **3, 4 and 5**. Cut a small triangle off each of its three corners, with each cut parallel to the side opposite that corner, so that the six-sided figure that is left has **all six sides equal**.\n\nHow long is each side of the hexagon?`,
    hints: ['Each of the three cut-off triangles is similar to the whole triangle. If the cut near one corner has length s, by what ratio is that triangle smaller?', 'Along the side of length a, the hexagon side s and two cut-off pieces (of lengths a·s ⁄ b and a·s ⁄ c) make up a.'],
    explain: `The corner triangle cut by a line of length s parallel to the side a has scale s ⁄ a. Along the side a, the pieces are s (the hexagon's side) plus a·s ⁄ b and a·s ⁄ c (from the two neighbouring corner triangles). So a = s + as ⁄ b + as ⁄ c, and dividing by a, 1 = s(1 ⁄ a + 1 ⁄ b + 1 ⁄ c). The side is s = 1 ⁄ (1 ⁄ a + 1 ⁄ b + 1 ⁄ c), for 3-4-5 that is 1 ⁄ (47 ⁄ 60) = **60 ⁄ 47**, about 1.277.`,
    data: { answer: { num: 1.276596, tol: 0.005, show: '60/47' }, glyph: '⬡' },
    concepts: ['dissection', 'area'], tags: ['geometry']
  },
  {
    id: 'car-sharks', title: 'The Well-Fitted Shark', diff: 4, year: 1896,
    links: ['car-kangaroo', 'car-letters'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these statements about fishes as true. (A fish that is *not quite certain* it is well fitted out is one that *doubts* it, and the other way round.)<br>1. No shark ever doubts that it is well fitted out.<br>2. A fish that cannot dance a minuet is contemptible.<br>3. No fish is quite certain that it is well fitted out, unless it has three rows of teeth.<br>4. All fishes, except sharks, are kind to children.<br>5. No heavy fish can dance a minuet.<br>6. A fish with three rows of teeth is not to be despised.\n\nWhat follows about heavy fish?`,
    hints: ['Start from "heavy fish" and go: cannot dance a minuet, so...', 'Contemptible fish do not have three rows of teeth, so they are not quite certain, so they doubt. And who never doubts?'],
    explain: `A heavy fish cannot dance a minuet (5), so it is contemptible (2), so it does not have three rows of teeth (6), so it is not quite certain it is well fitted out (3), so it doubts it, so it is not a shark (1), so it is kind to children (4). **No heavy fish is unkind to children.**`,
    data: {
      answer: { choice: 3, choices: ['Every heavy fish is a shark', 'All fishes with three rows of teeth are heavy', 'Every heavy fish can dance a minuet', 'No heavy fish is unkind to children'] },
      traps: [{ match: 0, msg: 'Follow the chain from "heavy": it ends by excluding sharks, not by making sharks of them.' }],
      glyph: '🦈'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic']
  },
  {
    id: 'car-pillow-23', title: 'Two Counters, Then More', diff: 5, year: 1893,
    links: ['car-pillow-5', 'car-pillow-38'],
    source: 'Carroll, *Pillow Problems* (1893), no. 23.',
    text: `A bag holds **two counters**, each of which is white or black, each colour equally likely and independent of the other. You put in **two white counters and one black counter**, shake the bag and draw out three counters: **two white and one black**. Then you put in **one more white counter**, shake, and draw out one counter: it is **white**.\n\nWhat is the chance that the bag now holds **two white counters**? Give a fraction.`,
    hints: ['Start with the three possibilities for the original pair: two white, one of each, or two black. Find the chance of the first draw (two white, one black) in each case.', 'Then for each, find the chance that the second draw is white, and weigh. Only one case leaves two white counters in the bag.'],
    explain: `Start with three cases for the first two counters: two white (chance ¼), one of each (½), two black (¼). For each, work out the chance of the first draw giving two white and one black and of the second draw giving white; only the "originally two white" case ends with two white counters in the bag. Weighing everything gives **2 ⁄ 5**.`,
    data: { answer: { num: 0.4, show: '2/5' }, glyph: '2/5' },
    concepts: ['conditional-probability', 'probability'], tags: ['probability', 'Bayes']
  },
  {
    id: 'car-pillow-38', title: 'A Red Counter Twice', diff: 5, year: 1893,
    links: ['car-pillow-23', 'car-pillow-27'],
    source: 'Carroll, *Pillow Problems* (1893), no. 38.',
    text: `Three bags hold counters: **A** has 3 red; **B** has 2 red and 1 white; **C** has 1 red and 2 white. Two bags are taken at random and one counter is drawn from each: **both are red**. The counters are put back.\n\nNow the same two bags are used again. One of them, picked at random, gives a counter, and it is **red**. What is the chance that a counter drawn from the **other** of the two bags is also red? Give a fraction.`,
    hints: ['First find, for each pair of bags (AB, AC, BC), how likely the first experiment (both red) was, and so how likely each pair now is.', 'Then, for each pair, find the chance that a random draw from a random member of the pair is red, and the chance that both draws are red.'],
    explain: `The first experiment (both red) has chances 2 ⁄ 3, 1 ⁄ 3 and 2 ⁄ 9 for the pairs AB, AC and BC, so the pairs are now in the ratio 6 : 3 : 2. In the second experiment the chance that a draw from a random one of the two bags is red is 5 ⁄ 6, 2 ⁄ 3 and ½ for AB, AC, BC, and the chance that both draws are red is 2 ⁄ 3, 1 ⁄ 3 and 2 ⁄ 9. Weighing by the pairs, the chance that both are red given that one is red is (49 ⁄ 99) ÷ (8 ⁄ 11) = **49 ⁄ 72**.`,
    data: { answer: { num: 0.680556, tol: 0.001, show: '49/72' }, glyph: '49/72' },
    concepts: ['conditional-probability', 'probability'], tags: ['probability', 'Bayes']
  },
  {
    id: 'car-pillow-28', title: 'Golden Cuts in a Triangle', diff: 5, year: 1893,
    links: ['car-pillow-54'],
    source: 'Carroll, *Pillow Problems* (1893), no. 28.',
    text: `Each side of a triangle is cut in **extreme and mean ratio** (the golden section: the whole is to the longer part as the longer part is to the shorter). The cuts are made all the same way round the triangle, so that each side's longer part starts at the corner that comes first as you go round. The three cut points are joined to make a new triangle inside.\n\nWhat fraction of the area of the original triangle is the new one? Give a decimal to four places.`,
    hints: ['If each cut divides a side in the ratio t : (1 − t) going round, the three corner triangles each have area t(1 − t) of the whole.', 'The new triangle is 1 − 3t(1 − t) of the whole, where t is the golden section 0.618… So work out t(1 − t).'],
    explain: `Each cut takes a fraction t of its side from one corner, with t = (√5 − 1) ⁄ 2 ≈ 0.618 for the golden section. The three corner triangles cut off each have area t(1 − t) of the whole, and t(1 − t) = √5 − 2. So the inner triangle is 1 − 3(√5 − 2) = **7 − 3√5 ≈ 0.2918** of the original.`,
    data: { answer: { num: 0.2917961, tol: 0.0005, show: '0.2918' }, glyph: 'φ' },
    concepts: ['area', 'geometric-series'], tags: ['golden section', 'geometry']
  },
  {
    id: 'car-kangaroo', title: 'The Kangaroo Sorites', diff: 5, year: 1896,
    links: ['car-sharks', 'car-letters'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `Take these ten statements about animals as true:<br>1. The only animals in this house are cats.<br>2. Every animal is suitable for a pet if it loves to gaze at the moon.<br>3. When I detest an animal, I avoid it.<br>4. No animals are carnivorous unless they prowl at night.<br>5. No cat fails to kill mice.<br>6. No animals ever take to me, except those that are in this house.<br>7. Kangaroos are not suitable for pets.<br>8. None but carnivora kill mice.<br>9. I detest animals that do not take to me.<br>10. Animals that prowl at night always love to gaze at the moon.\n\nWhat follows about kangaroos and me?`,
    hints: ['Begin with kangaroos: not suitable for pets, so they do not love to gaze at the moon, so...', 'They do not prowl at night, so they are not carnivorous, cannot kill mice, are not cats, are not in this house, do not take to me. What follows for me?'],
    explain: `Kangaroos are not suitable for pets (7), so they do not love to gaze at the moon (2), so they do not prowl at night (10), so they are not carnivorous (4), so they do not kill mice (8), so they are not cats (5), so they are not in this house (1), so they do not take to me (6), so I detest them (9), so **I always avoid a kangaroo** (3). Every one of the ten statements is used once.`,
    data: {
      answer: { choice: 2, choices: ['I never avoid a kangaroo', 'Every kangaroo takes to me', 'I always avoid a kangaroo', 'No animal in this house prowls at night'] },
      traps: [{ match: 0, msg: 'Follow the chain from "kangaroo": at the end it is about detesting, and detesting leads to avoiding.' }],
      glyph: '🦘'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic', 'sorites']
  },
  {
    id: 'car-letters', title: 'Brown\'s Letters', diff: 5, year: 1896,
    links: ['car-kangaroo', 'car-sharks'],
    source: 'Carroll, *Symbolic Logic* (1896).',
    text: `The letters in a certain room obey these rules. Take them as true:<br>1. All the dated letters are written on blue paper.<br>2. None of them is in black ink, except those written in the third person.<br>3. I have not filed any of them that I can read.<br>4. None of them written on one sheet is undated.<br>5. All of them that are not crossed are in black ink.<br>6. All of them written by Brown begin with "Dear Sir".<br>7. All of them written on blue paper are filed.<br>8. None of them written on more than one sheet is crossed.<br>9. None of them beginning "Dear Sir" is written in the third person.\n\nWhat follows about Brown's letters?`,
    hints: ['Start with Brown and follow: "Dear Sir", so not in the third person, so not in black ink, so...', 'Not in black ink means crossed (5). Crossed means on one sheet (8). On one sheet means dated (4), so blue (1), so filed (7). And what do I do with filed letters?'],
    explain: `Brown's letters begin "Dear Sir" (6), so are not in the third person (9), so are not in black ink (2), so are crossed (5), so are written on one sheet (8), so are dated (4), so are on blue paper (1), so are filed (7), so I cannot read them (3): **I cannot read any of Brown's letters.**`,
    data: {
      answer: { choice: 0, choices: ['I cannot read any of Brown\'s letters', 'I can read all of Brown\'s letters', 'None of Brown\'s letters is filed', 'All of Brown\'s letters are written in black ink'] },
      traps: [{ match: 2, msg: 'Follow the chain: Brown\'s letters end up on blue paper, and blue paper means filed.' }],
      glyph: '✉'
    },
    concepts: ['syllogism', 'deduction'], tags: ['logic', 'sorites']
  }
].sort(function (a, b) { return a.diff - b.diff; })); // easiest first (the sort is stable)

Cabinet.history([
  { year: 1885, title: 'Carroll\'s A Tangled Tale', text: 'Lewis Carroll, the Oxford mathematician Charles Dodgson, publishes ten "knots" of problems wrapped in a comic story. They ran in a magazine from 1880, and readers sent in answers that he marked, and printed the best.', links: ['carroll', 'car-petty-cash'] },
  { year: 1893, title: 'Carroll\'s Pillow Problems', text: 'Carroll publishes seventy-two problems that he worked out in the dark on sleepless nights, without pen or paper, many of them on probability and geometry.', links: ['carroll', 'car-pillow-5'] },
  { year: 1896, title: 'Carroll\'s Symbolic Logic', text: 'Carroll, who as Charles Dodgson lectured on mathematics at Oxford, publishes the first part of Symbolic Logic, full of silly chains of reasoning about ducks, kangaroos and hedgehogs. They teach the reader to spot a valid argument in the silliest words.', links: ['carroll', 'car-kangaroo'] }
]);
