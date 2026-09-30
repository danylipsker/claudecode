/* The Puzzle Cabinet · data/dudeney.js
 * Henry Ernest Dudeney's puzzles, retold in modern words: The Canterbury Puzzles (1907)
 * and Amusements in Mathematics (1917). Every numeric answer was checked by computer. */
Cabinet.concepts([
  { id: 'equations', name: 'Letting x be the unknown',
    text: 'Most of the old arithmetic puzzles fall to one habit: give the thing you do not know a letter, say what each sentence of the story says about it, and solve. "Two more apples would make them a penny a dozen cheaper" becomes an equation in the number of apples; the story is only there to hide it. Dudeney, who wrote hundreds of these for newspapers, loved the ones where the equation is easy but the sentence is not.' },
  { id: 'right-triangles', name: 'Right angles and circles',
    text: 'A right angle turns up wherever a circle touches a wall, a rope hangs from a ceiling or a stone lies at a corner. Pythagoras (a² + b² = c²) turns the picture into an equation, and a circle helps in another way: every triangle has a circle through its three corners, whose centre is the one point equally far from all three.' },
  { id: 'number-bases', name: 'Numbers in other bases',
    text: 'We write numbers in tens: 4,712 means 4 thousands, 7 hundreds, 1 ten and 2 units. Any other number can play the part of ten. Write a number in base 7 and each digit tells how many 1s, 7s, 49s, 343s… it needs, with no digit above 6. That is why a rule such as "no more than six of any one gift" always leads to the base-7 digits of the total.' }
]);

Cabinet.family({
  id: 'dudeney', engine: 'question', cat: 'riddles', name: 'Dudeney\'s puzzles', order: 2,
  blurb: 'Pilgrims, clocks, gardens and quarrelsome shopkeepers: the puzzles of England\'s greatest puzzle-maker, retold with the answers checked by computer.',
  origin: { year: 1907, who: 'Henry Ernest Dudeney (1857–1930)', note: 'Dudeney wrote puzzle columns for the Strand Magazine and newspapers for thirty years. The Canterbury Puzzles (1907) set his problems on the road to Canterbury with Chaucer\'s pilgrims; Amusements in Mathematics (1917) gathered 430 more. Both are in the public domain.' },
  concepts: ['equations', 'combinatorics']
}, [
  {
    id: 'dud-who-first', title: 'Who Knew First?', diff: 1, year: 1917,
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 414.',
    text: `Anderson, Biggs and Carpenter are sitting in a rowing boat a mile out at sea. A rifle is fired from the shore.\n\nAnderson **hears** the bang. Biggs **sees** the puff of smoke. Carpenter **sees the bullet splash** into the water beside the boat.\n\nWhich of the three became aware of the shot first?`,
    hints: ['Think about how fast light, sound and a bullet each cover a mile.', 'Sound takes about five seconds to cover a mile. A rifle bullet takes a couple of seconds. Light takes a few millionths of a second.'],
    explain: `**Biggs** knew first. The flash and smoke reach the boat in about five millionths of a second, before any bullet or bang could. The bullet arrives after roughly two seconds (a fast rifle bullet is quicker than sound), and the bang lags behind at about five seconds. So the order is Biggs, Carpenter, Anderson.`,
    data: {
      answer: { choice: 0, choices: ['Biggs, who saw the smoke', 'Anderson, who heard the bang', 'Carpenter, who saw the splash', 'All three at the same moment'] },
      traps: [{ match: 1, msg: 'Sound is slow: it takes about five seconds to cover a mile.' }, { match: 3, msg: 'They receive the news at very different speeds.' }],
      glyph: '💥'
    },
    concepts: ['lateral'], tags: ['light', 'sound']
  },
  {
    id: 'dud-asparagus', title: 'The Asparagus Bundles', diff: 1, year: 1917,
    links: ['dud-friar-zigzag'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), chapter "The Paradox Party".',
    text: `Mildred usually buys her asparagus in one big bundle that is 12 inches round. Today the greengrocer offers her **two smaller bundles, each 6 inches round**, and says: "Two bundles, madam, must be more than one, so it costs a little extra."\n\nAll the bundles are the same length and the spears are packed equally tightly. Is the greengrocer right?`,
    hints: ['A bundle is roughly a cylinder. What does halving the distance round it do to its width?', 'A circle whose circumference is half as big has a radius half as big, and its area is a quarter.'],
    explain: `The bundles are packed like circles, and area grows with the **square** of the circumference. A bundle 6 inches round is half as wide as the big one and holds a quarter as many spears, so two of them hold only **half** as much. Mildred should be offered a discount, not asked for a surcharge.`,
    data: {
      answer: { choice: 3, choices: ['Two small bundles hold only a quarter as much', 'Two small bundles hold the same as one big bundle', 'Two small bundles hold more, as the greengrocer says', 'Two small bundles hold only half as much'] },
      traps: [{ match: 1, msg: 'Two halves would make a whole only if the bundle grew in proportion to its circumference. Does it?' }, { match: 0, msg: 'One small bundle holds a quarter. But there are two of them.' }],
      glyph: '◯'
    },
    concepts: ['area'], tags: ['paradox party']
  },
  {
    id: 'dud-two-coins', title: 'The Two Old Coins', diff: 1, year: 1917,
    links: ['lat-bargain-45bc'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), chapter "The Paradox Party".',
    text: `Mr Filkins gets a letter from a man who says that, while digging in his garden, he found two old coins. One is dated **51 B.C.**, and the other says "**George I**". Mr Filkins puts the letter down and says at once that the writer is not telling the truth.\n\nHow can he be so sure of the first coin?`,
    hints: ['"B.C." means "before Christ". Who could have known in 51 B.C. that the year would one day be counted back from a birth that had not happened yet?', 'Think about when years first began to be counted from the birth of Christ.'],
    explain: `Nobody living in 51 B.C. could have stamped that on a coin: the years were only counted "before Christ" long afterwards. Dudeney's second giveaway is equally neat: a king is only called "the First" once there has been a second of the name, so a coin struck in George I's own lifetime would not have said so.`,
    data: {
      answer: { choice: 0, choices: ['Nobody in 51 B.C. could have known the year was "before Christ"', 'Coins were not made of metal in 51 B.C.', 'There has never been a king called George I', 'Old coins are never found in gardens'] },
      traps: [{ match: 2, msg: 'There was a George I, king from 1714. Look at the other coin\'s date.' }],
      glyph: 'B.C.'
    },
    concepts: ['lateral'], tags: ['paradox party']
  },
  {
    id: 'dud-dice-trick', title: 'A Trick with Dice', diff: 2, year: 1917,
    links: ['dud-multiples'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 386.',
    text: `A conjuror asks you to throw three dice without showing them to him, and to do this sum in your head:\n\n1. Multiply the first die by 2 and add 5.\n2. Multiply the answer by 5 and add the second die.\n3. Multiply that answer by 10 and add the third die.\n\nYou announce that the total is **604**. He tells you at once what each die showed. What were the three dice, in the order thrown?`,
    hints: ['Follow the sum with letters: first die a, second b, third c. What do you get at the end?', 'The end result is 100a + 10b + c + 250.'],
    explain: `With dice a, b, c the steps give (2a + 5) × 5 + b = 10a + 25 + b, and then × 10 + c = 100a + 10b + c + 250. The conjuror just **subtracts 250**, and the three digits of the result are the dice: 604 − 250 = 354, so the throws were **3, 5 and 4**.`,
    data: { answer: { nums: [3, 5, 4], ordered: true }, ask: 'The three dice, in order, separated by commas', glyph: '⚂' },
    concepts: ['equations'], tags: ['trick']
  },
  {
    id: 'dud-manciple', title: 'The Manciple\'s Loaves', diff: 2, year: 1907,
    links: ['dud-cyclists-feast'],
    source: 'Dudeney, *The Canterbury Puzzles* (1907), no. 31 (The Manciple\'s Puzzle).',
    text: `On the road to Canterbury the Miller has **5 loaves** and the Weaver has **3 loaves**. The Manciple has no bread, but he does have 8 pennies. They cut the 8 loaves so that all three men eat exactly the same amount, and the Manciple pays his 8 pennies for his share.\n\nThe Miller and the Weaver must split the money fairly. How many pennies does the **Miller** get?`,
    hints: ['Every man eats 8 ⁄ 3 loaves. How much of that came from the Miller\'s loaves, and how much from the Weaver\'s?', 'The Manciple ate 7 ⁄ 3 of the Miller\'s bread… and how much of the Weaver\'s?'],
    explain: `Each of the three eats 8 ⁄ 3 loaves. The Miller, with 5 loaves, contributed 5 − 8 ⁄ 3 = 7 ⁄ 3 of a loaf to the Manciple, while the Weaver, with 3 loaves, contributed only 3 − 8 ⁄ 3 = 1 ⁄ 3. The Manciple's money should be shared in that ratio, 7 : 1, so the Miller gets **7 pennies** and the Weaver just 1. (Sharing 5 : 3 is the tempting mistake, since it forgets that the two friends ate their own bread too.)`,
    data: { answer: { num: 7 }, traps: [{ match: 5, msg: 'That splits the money by loaves owned. But the Miller and the Weaver each ate a share of their own bread.' }], glyph: '7:1' },
    concepts: ['equations'], tags: ['fair shares']
  },
  {
    id: 'dud-post-office', title: 'A Post-Office Perplexity', diff: 2, year: 1917,
    links: ['dud-tea', 'dud-honey'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 1.',
    text: `A gentleman goes into a post office with a crown (5 shillings, which is **60 pence**) and asks for some twopenny stamps, **six times as many penny stamps**, and the rest of the money in stamps of twopence-halfpenny (2½d each). He spends the whole crown.\n\nHow many stamps of each kind did he get?`,
    hints: ['Call the number of twopenny stamps x. Then there are 6x penny stamps. How much do those two kinds cost together?', 'That is 2x + 6x = 8x pence. What is left must be a whole number of 2½d stamps.'],
    explain: `With x twopenny stamps and 6x penny stamps, 8x pence are spent, leaving 60 − 8x for the 2½d stamps. Multiply everything by 2: 16x + 5y = 120. Since 120 and 5y are multiples of 5, x must be a multiple of 5, and x = 5 is the only value that leaves something over: **5 twopenny, 30 penny and 8 twopence-halfpenny stamps** (10 + 30 + 20 = 60 pence).`,
    data: { answer: { nums: [5, 30, 8], ordered: true }, ask: 'Twopenny, penny and twopence-halfpenny stamps, in that order', glyph: '✉' },
    concepts: ['diophantine', 'equations'], tags: ['money']
  },
  {
    id: 'dud-cyclists-feast', title: 'The Cyclists\' Feast', diff: 2, year: 1917,
    links: ['dud-apples', 'dud-costermonger'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 11.',
    text: `A party of cyclists sit down to a feast that costs **£4** altogether (80 shillings), to be shared equally. Two of them slip away without paying, and every one of the others has to pay **2 shillings more** than he had expected.\n\nHow many cyclists were there at the start?`,
    hints: ['If there were n cyclists, each expected to pay 80 ⁄ n shillings.', 'After two leave, each pays 80 ⁄ (n − 2). The difference is 2 shillings.'],
    explain: `80 ⁄ (n − 2) − 80 ⁄ n = 2 gives 160 = 2n(n − 2), so n(n − 2) = 80 and n = **10**. Check: 10 cyclists would each pay 8s; the remaining 8 pay 10s, which is 2s more.`,
    data: { answer: { num: 10 }, glyph: '10' },
    concepts: ['equations'], tags: ['money']
  },
  {
    id: 'dud-aeroplanes', title: 'The Two Aeroplanes', diff: 2, year: 1917,
    links: ['dud-costermonger'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 9.',
    text: `A dealer sells two aeroplanes for **£600 each**. On one he makes a profit of **20%** on what he paid for it; on the other he takes a loss of **20%** on what he paid for it.\n\nOverall, does he gain, lose or break even?`,
    hints: ['A profit of 20% means he sold it for 120% of the cost. What did that plane cost?', 'The other plane was sold for 80% of its cost.'],
    explain: `The plane sold at a 20% profit cost 600 ⁄ 1.2 = £500. The plane sold at a 20% loss cost 600 ⁄ 0.8 = £750. Together they cost £1,250 and brought in £1,200: he is **£50 down**. The two 20%s are taken of different amounts, so they do not cancel.`,
    data: {
      answer: { choice: 1, choices: ['He breaks even', 'He loses £50', 'He gains £50', 'He loses £120'] },
      traps: [{ match: 0, msg: 'That is the tempting answer. But is each 20% taken of the same amount?' }],
      glyph: '±20'
    },
    concepts: ['equations'], tags: ['money', 'percent']
  },
  {
    id: 'dud-average-speed', title: 'Average Speed', diff: 2, year: 1917,
    links: ['dud-two-trains', 'dud-hill-road', 'dud-sir-edwyn'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 67.',
    text: `A man rides from town to town at **10 miles an hour** and comes back along the same road at **15 miles an hour**.\n\nWhat is his average speed for the whole round trip, in miles an hour?`,
    hints: ['Pick a convenient distance, say 30 miles each way. How long does each half take?', 'The trip is 60 miles. The times are 3 hours and 2 hours.'],
    explain: `Take 30 miles each way: going takes 3 hours and coming back 2 hours, so 60 miles take 5 hours: **12 mph**. The average is not the middle of 10 and 15, because he spends more time at the slower speed.`,
    data: { answer: { num: 12, unit: 'mph' }, traps: [{ match: 12.5, msg: 'That is the plain average of 10 and 15. But he spends more time going slowly.' }], glyph: '12' },
    concepts: ['rates'], tags: ['speed']
  },
  {
    id: 'dud-mother-daughter', title: 'Mother and Daughter', diff: 2, year: 1917,
    links: ['dud-mrs-timpkins', 'dud-their-ages'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 45.',
    text: `A girl of **12** longs for a bicycle. Her mother, who is **45**, promises to buy it "when I am only three times as old as you are".\n\nHow many years must the girl wait?`,
    hints: ['After x years the mother is 45 + x and the girl is 12 + x.', 'You need 45 + x = 3 × (12 + x).'],
    explain: `45 + x = 3(12 + x) = 36 + 3x, so 2x = 9 and x = **4½ years**. Then mother is 49½ and daughter 16½, exactly three times as old. (The gap of 33 years never changes, so the ratio of their ages keeps shrinking as both grow.)`,
    data: { answer: { num: 4.5, show: '4.5', unit: 'years' }, glyph: '4½' },
    concepts: ['equations'], tags: ['ages']
  },
  {
    id: 'dud-mrs-timpkins', title: 'Mrs Timpkins\'s Age', diff: 2, year: 1917,
    links: ['dud-mother-daughter', 'dud-mamma-age'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 43.',
    text: `Eighteen years ago, on the day they were married, Mr Timpkins was **three times** as old as his bride. Today he is only **twice** as old as she is.\n\nHow old is Mrs Timpkins today?`,
    hints: ['Let the bride be w years old on the wedding day. How old is her husband then, and how old are they now?', 'Now she is w + 18 and he is 3w + 18, and that is twice her age.'],
    explain: `3w + 18 = 2(w + 18) = 2w + 36, so w = 18. On the wedding day she was 18 and he was 54; today she is **36** and he is 72.`,
    data: { answer: { num: 36 }, glyph: '36' },
    concepts: ['equations'], tags: ['ages']
  },
  {
    id: 'dud-their-ages', title: 'Their Ages', diff: 2, year: 1917,
    links: ['dud-mrs-timpkins', 'dud-census'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 41.',
    text: `A lady's age is a two-figure number, and her husband's age is the same number **with the digits reversed**. The husband is the older, and the difference between their ages is **one-eleventh of their combined ages**.\n\nHow old is the husband?`,
    hints: ['Write her age as 10a + b. His is 10b + a.', 'The difference is 9(a − b). The sum is 11(a + b).'],
    explain: `The condition says 9(a − b) = (11(a + b)) ⁄ 11 = a + b, so 8a = 10b, or 4a = 5b. With single digits the only choice is a = 5 and b = 4. Hers is 45 and his is **54**: the difference 9 is one-eleventh of 99.`,
    data: { answer: { num: 54 }, glyph: '54' },
    concepts: ['equations'], tags: ['ages', 'digits']
  },
  {
    id: 'dud-labourer', title: 'The Labourer\'s Puzzle', diff: 2, year: 1917,
    links: ['dud-bell-ropes'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 100.',
    text: `A man stands in a hole he is digging. He is **5 feet 10 inches** tall. "When I have dug down **twice as deep** as I am now," he says, "my head will be **twice as far below** the ground as it is above the ground now."\n\nHow deep will the hole be when he has finished, in feet?`,
    hints: ['Let the hole be d inches deep now. How far is his head above ground now?', 'It is 70 − d inches above now. When the hole is 2d deep, his head is 2d − 70 below ground.'],
    explain: `Now his head is 70 − d above the ground; later it is 2d − 70 below. So 2d − 70 = 2(70 − d), which gives d = 52½ inches. The finished hole is twice that: 105 inches, or **8¾ feet** (8 ft 9 in).`,
    data: { answer: { num: 8.75, show: '8.75', unit: 'feet' }, traps: [{ match: 105, msg: 'That is the depth in inches. The question asks for feet.' }], glyph: '⛏' },
    concepts: ['equations'], tags: ['digging']
  },
  {
    id: 'dud-muddletown', title: 'The Muddletown Election', diff: 2, year: 1917,
    links: ['dud-trusses'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 106.',
    text: `In a four-cornered election at Muddletown **5,473** votes were cast. The Liberal came first: he beat the Conservative by **18** votes, the Independent by **146** and the Socialist by **575**.\n\nHow many votes did the winner get?`,
    hints: ['Call the winner\'s total x. What are the other three totals?', 'They are x − 18, x − 146 and x − 575, and all four add up to 5,473.'],
    explain: `The four totals are x, x − 18, x − 146 and x − 575, which sum to 4x − 739 = 5,473. So 4x = 6,212 and x = **1,553**. The others got 1,535, 1,407 and 978, and the total checks: 5,473.`,
    data: { answer: { num: 1553 }, glyph: '4' },
    concepts: ['equations'], tags: ['election']
  },
  {
    id: 'dud-barrel-beer', title: 'The Barrel of Beer', diff: 2, year: 1917,
    links: ['dud-honey'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 76.',
    text: `A man has six barrels holding **15, 31, 19, 20, 16 and 18** gallons. Five are full of wine and one is full of beer. He sells a quantity of wine to one customer, and **exactly twice as much** wine to a second, emptying whole barrels each time. The barrel he keeps is the beer.\n\nHow many gallons are in the barrel of beer?`,
    hints: ['Whatever he sold, the wine total is one part plus two parts.', 'So the total amount of wine is a multiple of 3. What is the sum of all six barrels?'],
    explain: `All six barrels hold 119 gallons. The wine sold is a share plus double that share, a multiple of 3, so 119 minus the beer must be divisible by 3. Only 20 works (119 − 20 = 99). Then the customers got 33 gallons (15 + 18) and 66 gallons (31 + 19 + 16). The beer is the **20-gallon** barrel.`,
    data: { answer: { num: 20, unit: 'gallons' }, glyph: '🍺' },
    concepts: ['modular'], tags: ['barrels']
  },
  {
    id: 'dud-banner', title: 'St George\'s Banner', diff: 2, year: 1917,
    links: ['dud-cistern'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 185.',
    text: `A flag is **4 feet long and 3 feet high**. It is white with a red cross like St George's: two red bands of the same width, one running the full length and one the full height, crossing in the middle.\n\nThe red and the white need exactly the same quantity of cloth. How wide, in feet, are the bands of the cross?`,
    hints: ['The flag has 12 square feet, so the cross covers 6. Call the width of the bands w.', 'The two bands together cover 4w + 3w, but the square where they cross is counted twice. What must you subtract?'],
    explain: `The cross covers 4w + 3w − w² square feet (the centre square is counted in both bands). Setting that equal to 6 gives w² − 7w + 6 = 0, so (w − 1)(w − 6) = 0, and only w = **1 foot** fits on the flag. The cross is a 1-foot band, red 6 square feet and white 6 square feet.`,
    data: { answer: { num: 1, unit: 'foot' }, glyph: '✚' },
    concepts: ['area', 'equations'], tags: ['flag']
  },
  {
    id: 'dud-what-time', title: 'What Was the Time?', diff: 2, year: 1917,
    links: ['dud-time-puzzle', 'dud-puzzling-watch', 'dud-three-clocks'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 57.',
    text: `"What is the time?" someone asks the Professor. He replies:\n\n*"If you add a quarter of the time from noon until now to half of the time from now until noon tomorrow, you get exactly the time now."*\n\nWhat time is it? (The hours are counted from noon.)`,
    hints: ['Let it be x hours after noon. Then there are 24 − x hours from now until noon tomorrow.', 'The sentence says x = x ⁄ 4 + (24 − x) ⁄ 2.'],
    explain: `x = x ⁄ 4 + (24 − x) ⁄ 2 = x ⁄ 4 + 12 − x ⁄ 2, so x × (1 − 1 ⁄ 4 + 1 ⁄ 2) = 12, which gives x = 9.6 hours after noon, that is **9:36 in the evening**. Check: a quarter of 9.6 is 2.4, half of the remaining 14.4 is 7.2, and 2.4 + 7.2 = 9.6.`,
    data: {
      answer: { choice: 1, choices: ['8:00 p.m.', '9:36 p.m.', '10:30 p.m.', '7:12 p.m.'] },
      traps: [{ match: 0, msg: 'Try it: a quarter of 8 hours plus half of 16 hours is 10 hours, not 8.' }],
      glyph: '🕘'
    },
    concepts: ['equations'], tags: ['clock']
  },
  {
    id: 'dud-time-puzzle', title: 'A Time Puzzle', diff: 2, year: 1917,
    links: ['dud-what-time', 'dud-three-clocks'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 58.',
    text: `It is some time before six o'clock. **Fifty minutes ago** the number of minutes past three o'clock was **four times** the number of minutes now remaining before six.\n\nHow many minutes is it to six o'clock now?`,
    hints: ['Call the minutes past three o\'clock now t. How many minutes past three was it fifty minutes ago, and how many minutes are there to six now?', 'The equation is t − 50 = 4 × (180 − t).'],
    explain: `Between three and six o'clock there are 180 minutes. If it is t minutes past three now, then t − 50 = 4(180 − t), so 5t = 770 and t = 154. It is 5:34, which is **26** minutes to six. Fifty minutes ago it was 104 minutes past three, and 4 × 26 = 104.`,
    data: { answer: { num: 26, unit: 'minutes' }, glyph: '26′' },
    concepts: ['equations'], tags: ['clock']
  },
  {
    id: 'dud-pearls', title: 'The Thirty-Three Pearls', diff: 2, year: 1917,
    links: ['dud-potatoes'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 99.',
    text: `A string holds **33 pearls**, and the pearl in the middle is the largest and most valuable. Going out from it along one half, each pearl is worth **£100 less** than the one before it; going out along the other half, each pearl is worth **£150 less** than the one before it.\n\nThe whole string is worth **£65,000**. How much is the middle pearl worth, in pounds?`,
    hints: ['There are 16 pearls on each side of the middle one. If the middle pearl is worth c, how much less than c is the first pearl on each side?', 'On the two sides the losses add up to 100 × (1 + 2 + … + 16) and 150 × (1 + 2 + … + 16).'],
    explain: `1 + 2 + … + 16 = 136. The pearls on one side lose 100 × 136 = £13,600 in total compared with 16 pearls of value c, and the other side loses 150 × 136 = £20,400. So 33c − 34,000 = 65,000, giving c = **£3,000**. (The cheapest pearl is then still worth £600.)`,
    data: { answer: { num: 3000 }, glyph: '£' },
    concepts: ['sequence', 'equations'], tags: ['arithmetic series']
  },
  {
    id: 'dud-hill-road', title: 'Up the Hill and Down', diff: 2, year: 1917,
    links: ['dud-average-speed', 'dud-hydroplane'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 70 (Drawing Her Pension).',
    text: `An old woman walks to the top of a hill to collect her pension and comes back by the same road. She climbs at **1½ miles an hour** and comes down at **4½ miles an hour**. The whole trip takes exactly **6 hours**.\n\nHow far is it from the bottom of the hill to the top, in miles?`,
    hints: ['If the way up is d miles, how long does she take going up, and how long coming down?', 'The times are d ⁄ 1.5 and d ⁄ 4.5 hours, and together they are 6.'],
    explain: `The time is d ⁄ 1.5 + d ⁄ 4.5 = (3d + d) ⁄ 4.5 = 4d ⁄ 4.5 = 6, so d = 6.75. The hill road is **6¾ miles** long. (Her average speed over the whole trip is 2¼ mph, not the 3 you get by averaging 1½ and 4½: she spends more time on the slow climb.)`,
    data: { answer: { num: 6.75, show: '6.75', unit: 'miles' }, glyph: '⛰' },
    concepts: ['rates'], tags: ['speed']
  },
  {
    id: 'dud-potato-slice', title: 'The Potato Puzzle', diff: 2, year: 1917,
    links: ['dud-glass-balls'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 164.',
    text: `You lay a round slice of potato flat on the table and make **six straight cuts** across it with a knife, without moving any of the pieces between cuts. The cuts may cross each other wherever you like.\n\nWhat is the largest number of pieces you can make?`,
    hints: ['Start small: one cut makes 2 pieces, two cuts make at most 4. What about three?', 'Each new cut can cross every earlier cut once, and every extra crossing adds one more piece.'],
    explain: `The k-th cut can cross the k − 1 earlier cuts, and it is split by them into k stretches, each of which cuts an old piece in two. So a new cut adds k pieces, and the total is 1 + 1 + 2 + 3 + 4 + 5 + 6 = **22**. (You need every cut to cross every other cut inside the slice, and no three at the same spot.)`,
    data: { answer: { num: 22 }, traps: [{ match: 16, msg: 'That is what a neat arrangement of the cuts gives, but they can cross more cleverly.' }], glyph: '22' },
    concepts: ['combinatorics'], tags: ['cutting']
  },
  {
    id: 'dud-bag-coins', title: 'A Fair Price for a Draw', diff: 2, year: 1917,
    links: ['dud-coins-five'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 30 (second question).',
    text: `A bag holds **three sovereigns and one shilling**. A sovereign is worth 20 shillings. You are allowed to draw one coin out without looking, and keep it.\n\nWhat is a fair price to pay for the right to draw, in shillings?`,
    hints: ['A fair price is what you would win on average if you played many times.', 'Three times in four you win 20 shillings. One time in four you win 1.'],
    explain: `The average prize is (3 × 20 + 1 × 1) ⁄ 4 = 61 ⁄ 4 = 15¼ shillings, that is **15s 3d**. This is the *expected value* of the draw: pay less and you expect to profit, pay more and you expect to lose.`,
    data: { answer: { num: 15.25, show: '15.25', unit: 'shillings' }, glyph: '15¼' },
    concepts: ['expected-value', 'probability'], tags: ['odds']
  },
  {
    id: 'dud-calendar', title: 'The End of the World', diff: 2, year: 1917,
    links: ['dud-village-simpleton'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 416 (A Calendar Puzzle).',
    text: `Suppose the world were to end on the **first day of a new century**, on 1 January of a year such as 1901 or 2001 (or, if you count differently, 1900 or 2000). We use the ordinary Gregorian calendar.\n\nHow likely is it that this fatal day would be a **Sunday**?`,
    hints: ['The calendar repeats exactly every 400 years. So there are only four centuries to look at.', 'Work out the weekday of 1 January in 1901, 2001, 2101 and 2201.'],
    explain: `The Gregorian calendar repeats every 400 years, so only four different starts of a century exist. New Year's Day fell on a Tuesday in 1901, a Monday in 2001, a Saturday in 2101 and a Thursday in 2201 (and if you count 1900, 2000, 2100, 2200 you get Monday, Saturday, Friday, Wednesday). **Sunday never appears**: the world cannot end on a Sunday at the turn of a century.`,
    data: {
      answer: { choice: 2, choices: ['1 in 7, like any other day', '1 in 4', 'It can never happen', '1 in 400'] },
      traps: [{ match: 0, msg: 'The centuries are not spread evenly over the week. Check the actual weekdays.' }],
      glyph: '☉'
    },
    concepts: ['modular'], tags: ['calendar']
  },
  {
    id: 'dud-multiples', title: 'Twice and Three Times', diff: 2, year: 1917,
    links: ['dud-three-groups', 'dud-century'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 77.',
    text: `Use each of the digits **1 to 9 exactly once** to make three three-digit numbers, so that the second is **exactly twice** the first and the third is **exactly three times** the first. (192, 384 and 576 is one answer.) There are four such sets in all.\n\nWhat is the **largest** possible first number?`,
    hints: ['The three numbers together use 1 to 9, whose sum is 45. So the digit sums are constrained modulo 9.', 'The first number is at most 333, and every digit must be different from every digit of its double and triple.'],
    explain: `Trying first numbers from 100 to 333 gives exactly four sets: 192-384-576, 219-438-657, 273-546-819 and **327**-654-981. The largest first number is **327**.`,
    data: { answer: { num: 327 }, traps: [{ match: 192, msg: 'That works, but it is the smallest set. There are three more.' }], glyph: '×3' },
    concepts: ['alphametic'], tags: ['digits']
  },
  {
    id: 'dud-family-party', title: 'A Family Party', diff: 3, year: 1917,
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 54.',
    text: `A family party is made up of: **1 grandfather, 1 grandmother, 2 fathers, 2 mothers, 4 children, 3 grandchildren, 1 brother, 2 sisters, 2 sons, 2 daughters, 1 father-in-law, 1 mother-in-law and 1 daughter-in-law.**\n\nYet the whole party is only **seven** people. How many of them are men or boys?`,
    hints: ['One person can be several of these at once: the same man can be a father and a son. Start with the three grandchildren. Whose children are they?', 'The grandparents are themselves a father and a mother. There is one more father and one more mother: the grandchildren\'s parents.'],
    explain: `The seven are the grandfather, the grandmother, their son (a father, and a son of the grandparents), his wife (a mother, a daughter-in-law), and their three children: one boy and two girls. The boy is the brother, the girls are the sisters, and the four "children" are the grandparents' son and his three children. Men and boys: grandfather, his son and the grandson, so **3**. (It is the smallest possible party, and the only shape it can take.)`,
    data: { answer: { num: 3 }, glyph: '7' },
    concepts: ['deduction'], tags: ['family']
  },
  {
    id: 'dud-charity', title: 'Indiscriminate Charity', diff: 3, year: 1917,
    links: ['dud-queer-coincidence'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 8.',
    text: `A gentleman with a pocketful of pennies is stopped by three beggars in turn. To the first he gives **a penny more than half** of what he has. To the second he gives **twopence more than half** of what he has left. To the third he gives **threepence more than half** of what he has left.\n\nHe walks home with exactly **one penny**. How many pennies did he start with?`,
    hints: ['Work backwards from the end: after the third beggar he has 1 penny.', 'Before the third beggar he had x, and x − (x ⁄ 2 + 3) = 1. What is x?'],
    explain: `Work backwards. Before the third beggar he had 8 pennies (half of 8 is 4, plus 3 is 7, leaving 1). Before the second he had 20 (half of 20 is 10, plus 2 is 12, leaving 8). Before the first he had **42** (half is 21, plus 1 is 22, leaving 20).`,
    data: { answer: { num: 42, unit: 'pennies' }, glyph: '42' },
    concepts: ['working-backwards'], tags: ['money']
  },
  {
    id: 'dud-apples', title: 'A Deal in Apples', diff: 3, year: 1917,
    links: ['dud-costermonger', 'dud-cyclists-feast'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 21.',
    text: `A boy asks for a shilling's worth of apples (12 pence). The shopkeeper, feeling generous, throws in **two extra apples**, so that the apples work out at **a penny a dozen cheaper** than the price he first asked.\n\nHow many apples does the boy take home?`,
    hints: ['Let n apples be the number he was first to get for 12 pence. Then the price per dozen was 144 ⁄ n pence.', 'With two more, the price per dozen is 144 ⁄ (n + 2), which is one less.'],
    explain: `144 ⁄ n − 144 ⁄ (n + 2) = 1 gives 288 = n(n + 2), so n = 16. He was to get 16 apples (9d a dozen) but gets 16 + 2 = **18** (8d a dozen).`,
    data: { answer: { num: 18 }, traps: [{ match: 16, msg: 'That is the number he was promised. The extra two are on top.' }], glyph: '🍎' },
    concepts: ['equations'], tags: ['money']
  },
  {
    id: 'dud-costermonger', title: 'The Costermonger\'s Puzzle', diff: 3, year: 1917,
    links: ['dud-apples'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 39.',
    text: `Bill haggles with an orange-seller and gets the price **knocked down by fourpence a hundred**. As a result, he gets **five more oranges** for ten shillings (120 pence) than he would have.\n\nHow many shillings per hundred did Bill pay?`,
    hints: ['Let the first price be p pence per hundred. 120 pence buys 12,000 ⁄ p oranges.', 'After the discount it buys 12,000 ⁄ (p − 4), which is 5 more.'],
    explain: `12,000 ⁄ (p − 4) − 12,000 ⁄ p = 5 gives 48,000 = 5p(p − 4), so p(p − 4) = 9,600 and p = 100. The seller first asked 100 pence a hundred (one penny each); after the haggle Bill pays 96 pence, that is **8 shillings** a hundred. Check: 120 pence buy 125 oranges instead of 120.`,
    data: { answer: { num: 8, unit: 'shillings' }, traps: [{ match: 96, msg: 'That is pence. The question asks for shillings (12 pence each).' }], glyph: '8s' },
    concepts: ['equations'], tags: ['money']
  },
  {
    id: 'dud-census', title: 'A Census Puzzle', diff: 3, year: 1917,
    links: ['dud-their-ages', 'dud-how-old-mary'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 44.',
    text: `Mr and Mrs Jorkins have **fifteen children**, born at regular intervals of **eighteen months** (there are no twins). The eldest, Ada, is exactly **seven times** as old as the youngest, Johnnie.\n\nHow old is Ada?`,
    hints: ['Between the eldest and the youngest there are fourteen gaps of a year and a half.', 'That makes 14 × 1½ = 21 years between Ada and Johnnie.'],
    explain: `The gap between Ada and Johnnie is 14 × 1½ = 21 years. If Johnnie is x, then Ada is x + 21 = 7x, so x = 3½ and Ada is **24½**.`,
    data: { answer: { num: 24.5, show: '24.5', unit: 'years' }, glyph: '15' },
    concepts: ['equations'], tags: ['ages']
  },
  {
    id: 'dud-gubbins', title: 'Mr Gubbins in a Fog', diff: 3, year: 1917,
    links: ['dud-what-time'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 102.',
    text: `Mr Gubbins lights two candles of the same length at the same moment. One would burn out in **4 hours**, the other in **5 hours**. After a while he notices that what is left of one candle is **exactly four times** the length of what is left of the other.\n\nFor how many hours had the candles been burning?`,
    hints: ['After t hours the four-hour candle has 1 − t ⁄ 4 of its length left. What is left of the five-hour candle?', 'The five-hour candle is the longer one at all times. It has 1 − t ⁄ 5 left, and that is four times 1 − t ⁄ 4.'],
    explain: `1 − t ⁄ 5 = 4 (1 − t ⁄ 4) = 4 − t, so t − t ⁄ 5 = 3, t = 15 ⁄ 4 = **3¾ hours**. Then the four-hour candle has 1 − (3¾) ⁄ 4 = 1 ⁄ 16 of its length left, and the five-hour candle has 1 − (3¾) ⁄ 5 = 1 ⁄ 4 left: four times as much.`,
    data: { answer: { num: 3.75, show: '3.75', unit: 'hours' }, glyph: '🕯' },
    concepts: ['rates', 'equations'], tags: ['candles']
  },
  {
    id: 'dud-thief', title: 'Catching the Thief', diff: 3, year: 1917,
    links: ['dud-two-trains', 'dud-hydroplane'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 104.',
    text: `A constable chases an escaped prisoner who has a lead of **27 of the prisoner's own steps**. The prisoner takes **8 steps** in the time the constable takes **5**; but **2 of the constable's steps are as long as 5 of the prisoner's**.\n\nHow many steps must the constable take to catch him?`,
    hints: ['Measure everything in prisoner-steps. While the constable takes 5 steps, how far does he go, and how far does the prisoner go?', 'The constable covers 12½ prisoner-steps while the prisoner covers 8, so he gains 4½ every 5 of his steps.'],
    explain: `In the time of 5 constable-steps the constable covers 5 × 2½ = 12½ prisoner-steps and the prisoner 8, a gain of 4½. To close a lead of 27 he needs 27 ÷ 4½ = 6 such rounds, that is 6 × 5 = **30 steps**.`,
    data: { answer: { num: 30 }, glyph: '👮' },
    concepts: ['rates'], tags: ['pursuit']
  },
  {
    id: 'dud-bag-of-nuts', title: 'The Bag of Nuts', diff: 3, year: 1917,
    links: ['dud-manciple'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 50.',
    text: `Herbert, Robert and Christopher share **770 nuts**. Every time Herbert takes 4 nuts, Robert takes 3. Every time Herbert takes 6, Christopher takes 7. (They were dividing in proportion to their ages, which add up to 17½ years.)\n\nHow many nuts did each boy get?`,
    hints: ['Make Herbert\'s "4 for 3" and "6 for 7" agree on a single number for Herbert: 12 works for both.', 'For every 12 that Herbert takes, Robert takes 9 and Christopher takes 14. How many nuts is each round of 12 + 9 + 14?'],
    explain: `Herbert : Robert = 4 : 3 = 12 : 9, and Herbert : Christopher = 6 : 7 = 12 : 14, so the nuts go in the ratio 12 : 9 : 14 (35 parts). 770 ÷ 35 = 22, so Herbert gets **264**, Robert **198** and Christopher **308**. Since ages share in the same ratio, they are 6, 4½ and 7 years old.`,
    data: { answer: { nums: [264, 198, 308], ordered: true }, ask: 'Herbert, Robert and Christopher\'s nuts, in that order', glyph: '770' },
    concepts: ['equations'], tags: ['ratio']
  },
  {
    id: 'dud-village-simpleton', title: 'The Village Simpleton', diff: 3, year: 1917,
    links: ['dud-calendar'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 66.',
    text: `A village simpleton is asked what day of the week it is. He answers:\n\n*"When the day after tomorrow is yesterday, today will be as far from Sunday as today was from Sunday when the day before yesterday was tomorrow."*\n\nWhat day is it?`,
    hints: ['"When the day after tomorrow is yesterday" is three days from now. "When the day before yesterday was tomorrow" is three days ago.', 'So the question is: on which day of the week are "three days ahead" and "three days behind" equally far from Sunday?'],
    explain: `The first "today" lies **three days ahead** and the second three days **behind**. They are equally far from Sunday only if Sunday is exactly in the middle of them, so today is **Sunday**: three days ahead is Wednesday and three days back is Thursday, each three days from Sunday, one after and one before.`,
    data: {
      answer: { choice: 1, choices: ['Wednesday', 'Sunday', 'Thursday', 'Saturday'] },
      traps: [{ match: 0, msg: 'Wednesday is three days after Sunday. Which day would put Sunday exactly halfway?' }],
      glyph: '☉'
    },
    concepts: ['modular', 'lateral'], tags: ['calendar']
  },
  {
    id: 'dud-two-trains', title: 'The Two Trains', diff: 3, year: 1917,
    links: ['dud-average-speed', 'dud-sir-edwyn'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 68.',
    text: `Two trains leave London and Liverpool at the same moment and run toward each other, each at a steady speed. After they pass, one train takes **1 hour** to finish its journey and the other takes **4 hours**.\n\nHow many times as fast as the slower train is the faster one?`,
    hints: ['Suppose they meet after t hours. The faster train then needs 1 hour for the stretch the slower train covered in t hours.', 'The slower train needs 4 hours for the stretch the faster train covered in t hours.'],
    explain: `Let the speeds be v (fast) and w (slow), and let them meet after t hours. Then w·t = v·1 and v·t = w·4. Dividing, w ⁄ v = v ⁄ (4w), so (v ⁄ w)² = 4 and v ⁄ w = **2**. They meet after 2 hours, and the journeys take 3 and 6 hours.`,
    data: { answer: { num: 2 }, glyph: '🚂' },
    concepts: ['rates'], tags: ['trains']
  },
  {
    id: 'dud-sir-edwyn', title: 'Sir Edwyn de Tudor', diff: 3, year: 1917,
    links: ['dud-average-speed', 'dud-two-trains'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 71.',
    text: `Sir Edwyn de Tudor is told to reach the castle at exactly **five o'clock**. If he rides at **15 miles an hour** he will arrive an hour too early. If he rides at **10 miles an hour** he will arrive an hour too late.\n\nAt what steady speed, in miles an hour, must he ride to arrive on the stroke of five?`,
    hints: ['Let the distance be d miles. The two speeds give arrival times that differ by 2 hours.', 'd ⁄ 10 − d ⁄ 15 = 2.'],
    explain: `d ⁄ 10 − d ⁄ 15 = 2 gives d = 60 miles. At 10 mph the ride takes 6 hours (an hour late), so the right time is 5 hours: 60 ÷ 5 = **12 mph**. (The plain average of 10 and 15, which is 12½, is the classic wrong answer.)`,
    data: { answer: { num: 12, unit: 'mph' }, traps: [{ match: 12.5, msg: 'Averaging the two speeds is tempting, but time and speed do not average like that.' }], glyph: '🐎' },
    concepts: ['rates'], tags: ['speed']
  },
  {
    id: 'dud-courtesies', title: 'Academic Courtesies', diff: 3, year: 1917,
    links: ['dud-glass-balls'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 98.',
    text: `A school has **twice as many girls as boys**. Every morning each girl bows to every other girl, to every boy and to the teacher; and each boy bows to every other boy, to every girl and to the teacher. In all, **900 bows** are made.\n\nHow many boys are there?`,
    hints: ['Count bows by giver: each pupil bows to everyone else in the room. If there are n pupils, how many does each make?', 'Every pupil bows to the other pupils and to the teacher: n bows each.'],
    explain: `With n pupils in the room, each bows to the other n − 1 pupils and to the teacher: n bows each, n² in all. So n² = 900, n = 30. With twice as many girls as boys: **10 boys** and 20 girls.`,
    data: { answer: { num: 10 }, glyph: '🎓' },
    concepts: ['combinatorics'], tags: ['counting']
  },
  {
    id: 'dud-hydroplane', title: 'The Hydroplane Question', diff: 3, year: 1917,
    links: ['dud-hill-road', 'dud-average-speed'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 72.',
    text: `A hydroplane flies the **5 miles** from Slocomb to Poodleville in **10 minutes** with the wind behind it, and the return trip against the wind takes **1 hour**.\n\nHow many minutes would the 5 miles take in calm air?`,
    hints: ['Find the speeds: 5 miles in 10 minutes and 5 miles in 60 minutes, in miles per hour.', 'With the wind it flies at speed + wind, against it at speed − wind. So the calm speed is halfway between the two.'],
    explain: `With the wind: 5 miles in ⅙ hour is 30 mph. Against it: 5 mph. If the plane flies at v and the wind blows w, then v + w = 30 and v − w = 5, so v = 17½ mph. The 5 miles take 5 ÷ 17½ = 2 ⁄ 7 hour = **17 1⁄7 minutes**. (Averaging the times, 35 minutes, is the tempting mistake.)`,
    data: { answer: { num: 17.142857, tol: 0.01, show: '17 1/7', unit: 'minutes' }, traps: [{ match: 35, msg: 'That averages the two times. The wind adds to and subtracts from the speed, not the time.' }], glyph: '✈' },
    concepts: ['rates'], tags: ['wind']
  },
  {
    id: 'dud-potatoes', title: 'The Basket of Potatoes', diff: 3, year: 1917,
    links: ['dud-pearls'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 74.',
    text: `Fifty potatoes lie in a straight line. The first is right beside the basket. The second is **1 yard** beyond the first, the third is **3 yards** beyond the second, the fourth **5 yards** beyond the third, and so on, each gap two yards longer than the one before.\n\nA boy fetches the potatoes one at a time, carrying each back to the basket. How many yards does he walk in all?`,
    hints: ['Where is the k-th potato from the basket? The gaps 1, 3, 5, … add up to a square.', 'The k-th potato lies (k − 1)² yards away. He walks there and back: 2 × (k − 1)² yards.'],
    explain: `The gaps 1, 3, 5, …, add up to the squares: the k-th potato is (k − 1)² yards from the basket, and the last is 49² = 2,401 yards away. Fetching potatoes 2 to 50 costs 2 × (1² + 2² + … + 49²) = 2 × 40,425 = **80,850 yards**: about 45 miles and 1,650 yards. The boy's day is a long one.`,
    data: { answer: { num: 80850, unit: 'yards' }, glyph: '🥔' },
    concepts: ['sequence'], tags: ['sum of squares']
  },
  {
    id: 'dud-three-groups', title: 'The Three Groups', diff: 3, year: 1917,
    links: ['dud-multiples', 'dud-century'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 80.',
    text: `Use each of the digits **1 to 9 exactly once** to write a **two-digit** number, a **three-digit** number and a **four-digit** number, so that the first two multiplied together give the third. For example 4 × 1738 = 6952 does the same with a one-digit and a four-digit number.\n\nHow many different ways are there to do it with a two-digit number times a three-digit number? (Swapping the two factors is not a new way.)`,
    hints: ['The product has four digits, so the two-digit number times the three-digit number must be between 1,000 and 9,999.', 'The digits 1 to 9 add to 45, a multiple of 9. A number leaves the same remainder mod 9 as its digit sum, so "casting out nines" gives a check on the two factors and the product together.'],
    explain: `A computer search finds exactly **seven**: 12 × 483 = 5796, 42 × 138 = 5796, 18 × 297 = 5346, 27 × 198 = 5346, 39 × 186 = 7254, 48 × 159 = 7632 and 28 × 157 = 4396. The "casting out nines" check helps by hand: 45 leaves remainder 0, so the digits of the two factors and the product together add to a multiple of 9.`,
    data: { answer: { num: 7 }, glyph: '2·3=4' },
    concepts: ['alphametic'], tags: ['digits']
  },
  {
    id: 'dud-digital-century', title: 'The Digital Century', diff: 3, year: 1917,
    links: ['dud-century'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 94.',
    text: `Take the digits **1 2 3 4 5 6 7 8 9** in this order. Put a sign (**+**, **−**, **×** or **÷**) between some of them, and leave others joined up to make bigger numbers, so that the whole thing equals **100**. There are no brackets, and the usual order of operations applies. For example, 1 + 2 + 3 − 4 + 5 + 6 + 78 + 9 = 100 uses seven signs.\n\nWhat is the **fewest signs** with which you can do it?`,
    hints: ['With few signs you need big numbers such as 123 or 89.', 'Try 123 − 45 − 67 + … Then see what the last number must be.'],
    explain: `The neatest answer is 123 − 45 − 67 + 89 = 100, which uses just **three** signs. A computer search of every way of splitting and signing the nine digits shows this is the only three-sign answer and that two signs cannot do it. (With four signs there are two: 123 + 4 − 5 + 67 − 89 and 123 + 45 − 67 + 8 − 9.)`,
    data: { answer: { num: 3 }, traps: [{ match: 4, msg: 'That can be done, but there is a way with one fewer sign.' }], glyph: '100' },
    concepts: ['alphametic'], tags: ['digits', 'signs']
  },
  {
    id: 'dud-spot-table', title: 'The Spot on the Table', diff: 3, year: 1917,
    links: ['dud-bell-ropes', 'dud-railway-stations'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 97.',
    text: `A round table stands in the corner of a room and just touches both walls, which meet at a right angle. On the part of its edge that faces the corner there is a spot that is **8 inches** from one wall and **9 inches** from the other.\n\nWhat is the diameter of the table, in inches?`,
    hints: ['Put the corner at the origin. The centre of the table is at (r, r), where r is the radius.', 'The spot is at (8, 9), a distance r from the centre: (r − 8)² + (r − 9)² = r².'],
    explain: `From (r − 8)² + (r − 9)² = r² we get r² − 34r + 145 = 0, so r = 29 or r = 5. The root r = 5 is a tiny circle that also passes through the point (8, 9), but there the spot lies on the far side of the circle, away from the corner. With the spot on the side facing the corner, r = 29 and the table is **58 inches** across.`,
    data: {
      answer: { num: 58, unit: 'inches' },
      traps: [{ match: 34, msg: 'That is 2 × (8 + 9). Set up the right triangle from the centre of the table to the spot and to the walls.' }],
      figure: { w: 400, h: 230, svg: '<g fill="none" stroke="#3a3020" stroke-width="3" stroke-linecap="round"><path d="M40 16 V212 H384"/></g><circle cx="132.8" cy="117.2" r="92.8" fill="#e6cf9c" stroke="#8a6a35" stroke-width="2.5"/><g stroke="#3a3020" stroke-width="1.5" stroke-dasharray="4 3"><path d="M40 181.2 H65.6 M65.6 181.2 V212"/></g><circle cx="65.6" cy="181.2" r="5" fill="#b0472f"/><g font-family="Georgia,serif" font-size="14" fill="#3a3020"><text x="44" y="175">8″</text><text x="71" y="200">9″</text><text x="150" y="122" fill="#b0472f" font-weight="700">diameter?</text></g>' },
      glyph: '58'
    },
    concepts: ['right-triangles'], tags: ['geometry']
  },
  {
    id: 'dud-trusses', title: 'The Trusses of Hay', diff: 3, year: 1917,
    links: ['dud-muddletown'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 101.',
    text: `Five trusses of hay were put on the scales two at a time, in every possible pair. The ten weights in pounds were:\n\n**110, 112, 113, 114, 115, 116, 117, 118, 120, 121**.\n\nHow heavy is each truss? Give the five weights.`,
    hints: ['If you add up all ten pair-weights, each truss has been counted four times. What is the total of the five trusses?', 'The total is 1,156 ÷ 4 = 289. The lightest pair (110) is the two lightest trusses; the next pair (112) is the lightest with the third-lightest.'],
    explain: `The ten sums add to 1,156, and each truss appears in four pairs, so the five trusses weigh 289 lb altogether. Call them a < b < c < d < e. The lightest pair is a + b = 110 and the heaviest is d + e = 121, so the middle truss is c = 289 − 110 − 121 = 58. The next pair up, a + c = 112, gives a = 54, and then b = 56. Likewise c + e = 120 gives e = 62 and d = 59. The weights are **54, 56, 58, 59 and 62 lb**; check that the ten pair sums are 110, 112, 113, 114, 115, 116, 117, 118, 120 and 121.`,
    data: { answer: { nums: [54, 56, 58, 59, 62], ordered: false }, ask: 'The five weights in pounds', glyph: '⚖' },
    concepts: ['deduction', 'equations'], tags: ['weights']
  },
  {
    id: 'dud-parish-election', title: 'The Parish Council Election', diff: 3, year: 1917,
    links: ['dud-glass-balls', 'dud-bishops'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 105.',
    text: `**Twenty-three** candidates stand for **nine** seats on a parish council. Each voter may vote for any number of candidates from **one to nine**, but no more.\n\nIn how many different ways can one voter fill in their paper?`,
    hints: ['A vote for k candidates is a choice of k names from 23: C(23, k) ways.', 'Add C(23, k) for k = 1, 2, …, 9.'],
    explain: `The number of ways of choosing k from 23 is C(23, k): 23, 253, 1,771, 8,855, 33,649, 100,947, 245,157, 490,314 and 817,190 for k = 1 to 9. Their sum is **1,698,159**. (Allowing a blank paper as well would make 1,698,160.)`,
    data: { answer: { num: 1698159 }, glyph: 'C(23,9)' },
    concepts: ['combinatorics'], tags: ['counting', 'election']
  },
  {
    id: 'dud-coins-five', title: 'Five Pennies', diff: 3, year: 1917,
    links: ['dud-bag-coins'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 30 (first question).',
    text: `Five pennies are thrown at once. What is the chance that **at least four of them land the same way up**: four or five heads, or four or five tails?\n\nGive the answer as a fraction or a decimal.`,
    hints: ['There are 2⁵ = 32 equally likely ways for the five coins to fall.', 'Count the ways for exactly four heads and for five heads, then double for the tails.'],
    explain: `Of the 32 equally likely results, 5 have exactly four heads and 1 has five, so 6 give at least four heads; by symmetry 6 give at least four tails. That is 12 results out of 32: **3 ⁄ 8** (0.375).`,
    data: { answer: { num: 0.375, show: '3/8' }, traps: [{ match: 0.1875, msg: 'That is only one of the two cases (heads or tails).' }], glyph: '3/8' },
    concepts: ['probability', 'combinatorics'], tags: ['coins']
  },
  {
    id: 'dud-cardboard-box', title: 'The Cardboard Box', diff: 3, year: 1917,
    links: ['dud-cistern'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 178.',
    text: `A rectangular cardboard box has a **top of 120 square inches**, a **side of 96 square inches** and an **end of 80 square inches**.\n\nWhat are its length, width and height in inches?`,
    hints: ['Call the sides l, w and h. Then lw = 120, lh = 96 and wh = 80.', 'Multiply the three equations: (lwh)² = 120 × 96 × 80.'],
    explain: `Multiplying, (lwh)² = 120 × 96 × 80 = 921,600, so lwh = 960 (the volume). Then l = 960 ÷ 80 = 12, w = 960 ÷ 96 = 10 and h = 960 ÷ 120 = 8: the box is **12 × 10 × 8** inches.`,
    data: { answer: { nums: [12, 10, 8], ordered: false }, ask: 'Length, width and height in inches (any order)', glyph: '📦' },
    concepts: ['equations'], tags: ['boxes']
  },
  {
    id: 'dud-bell-ropes', title: 'Stealing the Bell-Ropes', diff: 3, year: 1917,
    links: ['dud-spot-table', 'dud-railway-stations'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 179.',
    text: `A bell-rope hangs straight down from the belfry ceiling, and its lower end just touches the church floor. A thief pulls the end sideways until the rope is stretched **taut and straight** to a point on the floor, **4 feet** from the spot where the rope used to hang. But the end does not quite reach the floor: it is **3 inches above** it.\n\nHow long is the rope, in feet?`,
    hints: ['Draw a right triangle: the rope is the hypotenuse, from the ceiling point to the pulled end.', 'The horizontal side is 48 inches, and the vertical side is the rope length L minus 3 inches.'],
    explain: `In inches: L² = 48² + (L − 3)², so 0 = 2,304 − 6L + 9, and L = 2,313 ÷ 6 = 385½ inches, that is **32 feet 1½ inches** (32⅛ feet).`,
    data: { answer: { num: 32.125, show: '32 1/8', unit: 'feet' }, traps: [{ match: 385.5, msg: 'That is the length in inches. The question asks for feet.' }], glyph: '🔔' },
    concepts: ['right-triangles'], tags: ['geometry']
  },
  {
    id: 'dud-clothesline', title: 'The Clothes Line Puzzle', diff: 3, year: 1917,
    links: ['dud-spot-table'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 186.',
    text: `Two upright poles stand in a garden, one **7 feet** high and the other **5 feet** high. A boy ties a cord from the top of each pole to the **foot of the other**, so the cords cross.\n\nHow high above the ground do the two cords cross, in feet? The distance between the poles is not given.`,
    hints: ['You might guess that the answer depends on how far apart the poles stand. Try drawing it with two different gaps.', 'Similar triangles: the height h where the cords cross satisfies h ⁄ 7 + h ⁄ 5 = 1.'],
    explain: `Let the crossing be h above the ground. Measured from the 7-foot pole, the crossing is h ⁄ 5 of the way across the gap (the cord rising from the foot of the tall pole to the top of the 5-foot pole is at height h there); measured from the 5-foot pole it is h ⁄ 7 of the way. The two fractions together make the whole gap: h ⁄ 7 + h ⁄ 5 = 1. So h = 35 ⁄ 12 = **2 11⁄12 feet**, whatever the gap between the poles.`,
    data: {
      answer: { num: 2.916667, tol: 0.005, show: '2 11/12', unit: 'feet' },
      figure: { w: 400, h: 230, svg: '<g stroke="#3a3020" stroke-width="3" stroke-linecap="round"><path d="M30 210 H380" stroke="#5a8a3a"/><path d="M80 210 V35 M320 210 V85"/></g><g stroke-width="2" fill="none"><path d="M80 35 L320 210" stroke="#b0472f"/><path d="M320 85 L80 210" stroke="#3a6ea5"/></g><path d="M220 137.1 V210" stroke="#3a3020" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="220" cy="137.1" r="5" fill="#3a3020"/><g font-family="Georgia,serif" font-size="15" fill="#3a3020"><text x="36" y="120">7 ft</text><text x="330" y="150">5 ft</text><text x="228" y="182" fill="#b0472f" font-weight="700">?</text></g>' },
      glyph: '✕'
    },
    concepts: ['area'], tags: ['geometry']
  },
  {
    id: 'dud-ball', title: 'The Ball Problem', diff: 3, year: 1917,
    links: ['dud-kite'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 188 (second question).',
    text: `A boy asks: "If the number of **square feet** in the surface of a ball is exactly the same as the number of **cubic feet** in its volume, how wide is the ball?"\n\nWhat is the diameter, in feet?`,
    hints: ['The surface of a sphere is 4πr² and its volume is (4 ⁄ 3)πr³.', 'Set 4πr² = (4 ⁄ 3)πr³ and cancel.'],
    explain: `4πr² = (4 ⁄ 3)πr³ gives r = 3 feet, so the diameter is **6 feet**. (The numbers agree only for this one size; for a ball of any other radius the volume outgrows the surface, or the reverse, and the units would not match anyway.)`,
    data: { answer: { num: 6, unit: 'feet' }, traps: [{ match: 3, msg: 'That is the radius. The question asks for the diameter.' }], glyph: '⚽' },
    concepts: ['area'], tags: ['sphere']
  },
  {
    id: 'dud-kite', title: 'A Kite-Flying Puzzle', diff: 3, year: 1917,
    links: ['dud-ball'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 200.',
    text: `A professor unwinds the wire from a ball of wire that is **2 feet across**. The wire is **one hundredth of an inch** thick. Imagine the ball is solid wire all the way through, with no gaps between the turns and no hole for an axle.\n\nHow long is the wire, in miles? A guess within a mile will do.`,
    hints: ['The wire and the ball hold the same volume of metal.', 'Volume of the ball ÷ cross-section of the wire = length. Work in inches.'],
    explain: `The ball's volume is (4 ⁄ 3)π × 12³ cubic inches. The wire's cross-section is π × (0.005)² square inches. Dividing gives 92,160,000 inches, which is 7,680,000 feet or about **1,454½ miles**: well over a thousand miles of wire in a ball you could hold on your lap. (In a real ball, round wire would leave gaps, so it would hold rather less.)`,
    data: { answer: { num: 1454.5, tol: 1, show: '1454.5', unit: 'miles' }, glyph: '🪁' },
    concepts: ['area'], tags: ['volume']
  },
  {
    id: 'dud-glass-balls', title: 'The Glass Balls', diff: 3, year: 1917,
    links: ['dud-potato-slice', 'dud-parish-election'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 270.',
    text: `Sixteen glass balls hang in **four strings of four**. A marksman shoots one ball at a time, and the rule is that he must always shoot the **lowest ball that is left on any string**.\n\nIn how many different orders can he break all sixteen balls?`,
    hints: ['Within one string the balls must go in a fixed order, bottom to top. So an order is just a way of deciding which string each of the 16 shots goes to.', 'How many sequences of 16 shots use each of four strings exactly four times?'],
    explain: `An order is fixed by choosing the string for each shot: a word of 16 letters with four A's, four B's, four C's and four D's. The number of them is 16! ⁄ (4!)⁴ = **63,063,000**.`,
    data: { answer: { num: 63063000 }, glyph: '16!' },
    concepts: ['combinatorics'], tags: ['counting']
  },
  {
    id: 'dud-queens', title: 'The Eight Queens', diff: 3, year: 1917,
    links: ['dud-bishops'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 300.',
    text: `Place **eight queens** on a chessboard so that no two of them attack each other: no two in the same row, column or diagonal.\n\nDudeney counts two solutions as the same if one can be turned or reflected into the other. How many **essentially different** solutions are there, and how many are there in all if turned and reflected copies are counted separately?`,
    hints: ['Each solution has up to eight copies: four turns, each with or without a reflection. Some solutions look the same when turned.', 'Eleven of the essentially different solutions have all eight copies distinct. One of them is symmetrical, and has only four.'],
    explain: `There are **12** essentially different solutions. Eleven of them give 8 distinct boards when turned and reflected, and the twelfth is symmetrical under a half turn and gives only 4, so the total is 11 × 8 + 4 = **92**. Dudeney adds that the puzzle was first put forward in 1850 (it is often credited to Franz Nauck).`,
    data: { answer: { nums: [12, 92], ordered: true }, ask: 'Essentially different, then total, separated by a comma', glyph: '♛' },
    concepts: ['symmetry', 'combinatorics'], tags: ['chess']
  },
  {
    id: 'dud-doctors-query', title: 'The Doctor\'s Query', diff: 3, year: 1917,
    links: ['dud-wine-water', 'dud-keg'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 363.',
    text: `A doctor has two bottles: one holds **10 ounces of spirit**, the other **10 ounces of water**. He pours a **quarter of an ounce of spirit** into the water and stirs it well. Then he pours a **quarter of an ounce of the mixture** back into the spirit bottle.\n\nWhat is the ratio of spirit to water in the spirit bottle now? Give the answer as "x to 1" and say what x is.`,
    hints: ['Both bottles again hold 10 ounces. How does the amount of water in the spirit bottle compare with the amount of spirit in the water bottle?', 'They are equal, so the two bottles have the ratios turned round: what is the ratio of water to spirit in the water bottle?'],
    explain: `After the first pouring the water bottle holds 10¼ ounces, 40 parts water to 1 part spirit. Pouring back a quarter ounce of it leaves the water bottle with 10 ounces, 40 parts water to 1 spirit still (400 ⁄ 41 of water to 10 ⁄ 41 of spirit). The water that came across is exactly as much as the spirit that was left behind, so the spirit bottle is a mirror image: **40 to 1** spirit to water.`,
    data: { answer: { num: 40 }, glyph: '40:1' },
    concepts: ['invariant'], tags: ['mixtures']
  },
  {
    id: 'dud-wine-water', title: 'Wine and Water', diff: 3, year: 1917,
    links: ['dud-doctors-query', 'dud-keg'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 367.',
    text: `A wine glass is filled **half full of wine**. Another glass, **twice the size**, is filled **one-third full of wine**. Each is then filled up with water, and the contents of both are emptied into a tumbler.\n\nWhat fraction of the mixture in the tumbler is wine?`,
    hints: ['Call the small glass 1 unit. How much wine and how much water goes into the tumbler from each glass?', 'Wine: ½ + ⅔. Water: ½ + 4 ⁄ 3. The tumbler holds 3 units in all.'],
    explain: `The small glass holds ½ unit of wine and ½ of water. The large glass holds 2 units, of which ⅔ is wine and 1⅓ is water. In the tumbler: wine ½ + ⅔ = 7 ⁄ 6, water ½ + 1⅓ = 11 ⁄ 6, total 3. So **7 ⁄ 18** is wine and 11 ⁄ 18 is water.`,
    data: { answer: { num: 0.388889, tol: 0.0005, show: '7/18' }, glyph: '🍷' },
    concepts: ['area'], tags: ['mixtures']
  },
  {
    id: 'dud-friar-zigzag', title: 'The Friar\'s Staircase', diff: 3, year: 1907,
    links: ['dud-asparagus'],
    source: 'Dudeney, *The Canterbury Puzzles* (1907), no. 28 (The Great Dispute between the Friar and the Sompnour).',
    text: `The Friar argues that the diagonal of a square is exactly **as long as two of its sides**. "Walk from one corner to the opposite one along a staircase: along, up, along, up… Every step along adds to one side and every step up adds to the other, so the staircase is two sides long. Now make the steps smaller and smaller. The finer the steps, the closer the staircase lies to the diagonal, until they cannot be told apart. So the diagonal is two sides long!"\n\nThe Sompnour is sure that is nonsense. Where does the Friar's argument go wrong?`,
    hints: ['Try it with steps as small as a grain of sand. What is the total length of all the steps along, and of all the steps up?', 'The staircase gets closer to the diagonal in *position*. Does that mean it gets closer in *length*?'],
    explain: `However fine the steps, the staircase is always exactly **two sides** long: all the "along" bits add up to one side and all the "up" bits to another. The diagonal is only √2 ≈ 1.414 sides. A path can hug a line closely without being anywhere near its length: each tiny step is a small detour, and the detours never add up to nothing. (The same trick "proves" that π = 4, using a staircase around a circle.)`,
    data: {
      answer: { choice: 3, choices: ['The diagonal of a square really is two sides long', 'The steps get shorter, so the staircase gets shorter too', 'The diagonal of a square cannot be measured', 'The staircase stays two sides long however fine the steps are; being close to the diagonal is not the same as being as short as the diagonal'] },
      traps: [{ match: 1, msg: 'Add up the "along" parts and the "up" parts for smaller and smaller steps. Do they get smaller?' }, { match: 0, msg: 'Measure a diagonal on graph paper against two sides: it is clearly shorter.' }],
      figure: { w: 400, h: 250, svg: '<rect x="100" y="20" width="200" height="200" fill="none" stroke="#3a3020" stroke-width="2"/><path d="M100 220 L300 20" stroke="#3a3020" stroke-width="2" stroke-dasharray="6 4"/><path d="M100 220 H150 V170 H200 V120 H250 V70 H300 V20" fill="none" stroke="#b0472f" stroke-width="2.5"/><path d="M100 220 H125 V195 H150 V170 H175 V145 H200 V120 H225 V95 H250 V70 H275 V45 H300 V20" fill="none" stroke="#3a6ea5" stroke-width="2"/><g font-family="Georgia,serif" font-size="14" fill="#3a3020"><text x="196" y="240">1</text><text x="310" y="125">1</text><text transform="translate(160 138) rotate(-45)">the diagonal</text></g>' },
      glyph: '⌇'
    },
    concepts: ['area'], tags: ['paradox', 'limits']
  },
  {
    id: 'dud-three-clocks', title: 'The Three Clocks', diff: 3, year: 1917,
    links: ['dud-what-time', 'dud-puzzling-watch'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 64.',
    text: `Three clocks are set exactly right at noon on Friday, 1 April 1898. By noon the next day **clock A** is still exactly right, **clock B** has gained exactly one minute and **clock C** has lost exactly one minute. Each keeps steadily to its own rate.\n\nHow many days later will all three clocks next show exactly **twelve o'clock** at the same moment?`,
    hints: ['A clock shows twelve o\'clock when its error is a whole number of twelve-hour turns. How big does the error of B have to get?', 'B gains a minute a day. It is wrong by twelve hours (720 minutes) before it shows twelve again at the right moment.'],
    explain: `B is one minute fast on the first day, two on the second, and so on. It shows twelve at the same instant as clock A only when its error reaches a whole twelve-hour turn: 720 minutes, at one minute a day. The same goes for C, running slow. So the three agree again after **720 days**: on 22 March 1900.`,
    data: { answer: { num: 720, unit: 'days' }, traps: [{ match: 360, msg: 'After 360 days B is six hours out. It needs to be out by twelve hours.' }], glyph: '720' },
    concepts: ['modular'], tags: ['clock']
  },
  {
    id: 'dud-digital-squares', title: 'Digital Square Numbers', diff: 4, year: 1917,
    links: ['dud-mystic-eleven'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 92.',
    text: `As a warm-up, the four squares 9, 81, 324 and 576 between them use each of the digits 1 to 9 exactly once. Now do it with a **single** square number.\n\nFind the **smallest** and the **largest** square number that uses all of the digits 1 to 9 once each. Give both.`,
    hints: ['The digits 1 to 9 add to 45, so the number is a multiple of 9, and so is its square root a multiple of 3.', 'The smallest starts 1, 3, …, and its square root is between 11,000 and 12,000. The largest starts with 9 and its root is a little above 30,000.'],
    explain: `A computer finds thirty such squares. The smallest is **139,854,276** (= 11,826²) and the largest is **923,187,456** (= 30,384²). By hand you use that the digits sum to 45, so the square is a multiple of 9 and its root a multiple of 3, then search roots near 11,800 and 30,400.`,
    data: { answer: { nums: [139854276, 923187456], ordered: false }, ask: 'The smallest and the largest, separated by a comma', glyph: '□' },
    concepts: ['alphametic'], tags: ['digits', 'squares']
  },
  {
    id: 'dud-mystic-eleven', title: 'The Mystic Eleven', diff: 4, year: 1917,
    links: ['dud-digital-squares'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 93.',
    text: `Choose **nine different digits** out of the ten digits 0 to 9 and arrange them to make a nine-digit number that can be divided by **11** without a remainder (and does not start with 0).\n\nWhat are the **largest** and the **smallest** such numbers? Give both.`,
    hints: ['A number is divisible by 11 when the sums of its digits in odd positions and even positions differ by 0 or 11 (or a multiple of it).', 'For the largest, start 9 8 7 6 … and look for the first arrangement of the remaining digits that fixes the difference.'],
    explain: `The rule for 11: add the digits in the odd places and in the even places; the two totals must differ by a multiple of 11. Searching gives **987,652,413** as the largest (it is 11 × 89,786,583) and **102,347,586** as the smallest (11 × 9,304,326).`,
    data: { answer: { nums: [987652413, 102347586], ordered: false }, ask: 'The largest and the smallest, separated by a comma', glyph: '11' },
    concepts: ['modular'], tags: ['digits']
  },
  {
    id: 'dud-reve-8', title: 'The Reve\'s Cheeses', diff: 4, year: 1907,
    links: ['dud-reve-10', 'dud-reve-21'],
    source: 'Dudeney, *The Canterbury Puzzles* (1907), no. 1 (The Reve\'s Puzzle).',
    text: `The Reve keeps a pile of **eight cheeses**, each a little smaller than the one below, on one of **four stools**. He must carry the whole pile to another stool, **one cheese at a time**, never putting a bigger cheese on top of a smaller one. He may rest cheeses on any of the four stools on the way.\n\nWhat is the smallest number of moves in which he can do it?`,
    hints: ['With only three stools the answer for eight cheeses would be 255 (that is 2⁸ − 1). The fourth stool saves a great deal.', 'Idea: park the top few cheeses on a spare stool, using all four stools; then move the rest using only three stools; then bring the parked ones back on top.'],
    explain: `Moving k cheeses with four stools takes 1, 3, 5, 9, 13, 17, 25, 33… moves (for k = 1, 2, 3…). For eight, park the top **four** on a spare stool (9 moves), carry the other four across using three stools (2⁴ − 1 = 15 moves), and bring the four back on top (9 moves): 9 + 15 + 9 = **33**. A search through every position of the puzzle confirms that 33 cannot be beaten.`,
    data: { answer: { num: 33 }, traps: [{ match: 255, msg: 'That is the answer with three stools. You have four.' }], glyph: '33' },
    concepts: ['recursion', 'state-space'], tags: ['Hanoi', 'four pegs']
  },
  {
    id: 'dud-reve-10', title: 'The Reve\'s Cheeses, Ten', diff: 4, year: 1907,
    links: ['dud-reve-8', 'dud-reve-21'],
    source: 'Dudeney, *The Canterbury Puzzles* (1907), no. 1 (The Reve\'s Puzzle, second question).',
    text: `The Reve's puzzle again: four stools and **ten cheeses**, each smaller than the one beneath, to be carried one at a time to another stool, never a bigger on a smaller.\n\nWhat is the least number of moves for ten cheeses?`,
    hints: ['Use the same trick as for eight: park the top k cheeses using all four stools, move the rest with three stools, bring the k back.', 'For ten cheeses, try parking the top six (which take 17 moves to move with four stools).'],
    explain: `Parking k cheeses costs T(k) moves, moving the remaining 10 − k with three stools costs 2^(10−k) − 1, and the total is 2T(k) + 2^(10−k) − 1. With T(4) = 9, T(5) = 13, T(6) = 17 and T(7) = 25 the best split is k = 6: 2 × 17 + 15 = **49** moves.`,
    data: { answer: { num: 49 }, glyph: '49' },
    concepts: ['recursion', 'state-space'], tags: ['Hanoi', 'four pegs']
  },
  {
    id: 'dud-reve-21', title: 'The Reve\'s Cheeses, Twenty-One', diff: 5, year: 1907,
    links: ['dud-reve-8', 'dud-reve-10'],
    source: 'Dudeney, *The Canterbury Puzzles* (1907), no. 1 (The Reve\'s Puzzle, third question).',
    text: `Four stools again, and now a tower of **twenty-one cheeses**. What is the smallest number of moves that carries the whole tower to another stool, one cheese at a time, never a bigger cheese on a smaller?`,
    hints: ['Build the answer for k cheeses from the answer for fewer: T(k) = the best of 2·T(j) + 2^(k−j) − 1 over the split j.', 'The values run 1, 3, 5, 9, 13, 17, 25, 33, 41, 49, 65, 81, 97, 113, 129, 161, 193, 225, 257, 289 for one to twenty cheeses.'],
    explain: `The moves for k cheeses with four stools go 1, 3, 5, 9, 13, 17, 25, 33, 41, 49, 65, 81, 97, 113, 129, 161, 193, 225, 257, 289, and then **321** for twenty-one. (The increments between neighbours are 2, 2, 4, 4, 4, 8, 8, 8, 8, 16, … each power of two used one more time than the last.) Dudeney gave this method in 1907; that it is truly the best was only proved, for four stools, by Thierry Bousch in 2014.`,
    data: { answer: { num: 321 }, glyph: '321' },
    concepts: ['recursion', 'state-space'], tags: ['Hanoi', 'four pegs']
  },
  {
    id: 'dud-merchant', title: 'The Merchant\'s Company', diff: 4, year: 1907,
    links: ['dud-shipman'],
    source: 'Dudeney, *The Canterbury Puzzles* (1907), no. 12 (The Merchant\'s Puzzle).',
    text: `The Merchant's party of **thirty pilgrims** can ride the road in single file, in pairs, in threes, in fives, in sixes, in tens, in fifteens, or all abreast: eight different ways, one for every number that divides 30 exactly. "Ah," says the Merchant, "but I know of a larger company that could ride in **exactly 64 different ways**."\n\nWhat is the smallest number of pilgrims a company with 64 ways of riding can have?`,
    hints: ['The number of ways is the number of divisors of the company size.', 'If the size is 2ᵃ × 3ᵇ × 5ᶜ × …, it has (a + 1)(b + 1)(c + 1)… divisors. Write 64 as a product and give the biggest exponents to the smallest primes.'],
    explain: `A number 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ… has (a + 1)(b + 1)(c + 1)(d + 1)… divisors. To make 64 = 4 × 4 × 2 × 2 with the smallest possible number, use exponents 3, 3, 1, 1 on the primes 2, 3, 5, 7: 2³ × 3³ × 5 × 7 = **7,560**. A computer search of all numbers up to 7,560 confirms that no smaller number has exactly 64 divisors.`,
    data: { answer: { num: 7560 }, glyph: '64' },
    concepts: ['combinatorics'], tags: ['divisors']
  },
  {
    id: 'dud-shipman', title: 'The Shipman\'s Voyages', diff: 5, year: 1907,
    links: ['dud-merchant'],
    source: 'Dudeney, *The Canterbury Puzzles* (1907), no. 18 (The Shipman\'s Puzzle).',
    text: `The Shipman knows **five islands**, and between every pair of them runs a sea route: **ten routes** in all. Every year he must sail along **each route exactly once** and finish where he began. He always starts from the same island.\n\nIn how many different ways can he plan a year's voyage? Count a voyage and the same voyage sailed backwards as one and the same.`,
    hints: ['Each island has four routes, an even number, so a voyage of this kind always exists and always ends where it started.', 'Count the voyages by choosing the next island at each step, without using a route twice, and never getting stuck. Careful counting, or a computer, is needed here.'],
    explain: `Exhaustive counting finds **528** orders in which one can sail all ten routes once, starting from a given island (each is a closed circuit, since all islands have an even number of routes). Each voyage can also be sailed in reverse, so there are 528 ÷ 2 = **264** different voyages. This is a question about the number of Euler circuits of the complete graph on five points.`,
    data: { answer: { num: 264 }, traps: [{ match: 528, msg: 'That counts a voyage and its reverse as different. The question treats them as the same.' }], glyph: 'K₅' },
    concepts: ['graph', 'euler-path', 'combinatorics'], tags: ['routes']
  },
  {
    id: 'dud-mamma-age', title: 'Mamma\'s Age', diff: 4, year: 1917,
    links: ['dud-how-old-mary', 'dud-mrs-timpkins'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 40.',
    text: `The ages of Mamma, Papa and their son Tommy add up to **70** years. Papa is **six times** as old as Tommy. Some years from now, when Tommy is **half** as old as Papa, the three ages will add up to **twice 70**, that is 140.\n\nHow old is Mamma now?`,
    hints: ['Let Tommy be t now, so Papa is 6t. In x years, Tommy is t + x and Papa is 6t + x. When is one exactly twice the other?', 'That happens after x = 4t years. In those years the sum of three ages grows by 3x, from 70 to 140.'],
    explain: `In x years Tommy is t + x and Papa 6t + x; Papa is twice Tommy when 6t + x = 2t + 2x, so x = 4t. The total goes up by 3x each x years, from 70 to 140, so 3x = 70 and x = 70 ⁄ 3. Then t = x ⁄ 4 = 35 ⁄ 6 = 5 5⁄6. Papa is 35, Tommy 5 5⁄6, and Mamma is 70 − 35 − 5 5⁄6 = **29 1⁄6** years old.`,
    data: { answer: { num: 29.166667, tol: 0.01, show: '29 1/6', unit: 'years' }, glyph: '29⅙' },
    concepts: ['equations'], tags: ['ages']
  },
  {
    id: 'dud-how-old-mary', title: 'How Old Was Mary?', diff: 5, year: 1917,
    links: ['dud-mamma-age', 'dud-census'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 51.',
    text: `The ages of Mary and Ann add up to **44** years. Mary is **twice as old as Ann was when Mary was half as old as Ann will be when Ann is three times as old as Mary was when Mary was three times as old as Ann.**\n\nHow old is Mary?`,
    hints: ['The difference in their ages never changes. Call it d. Work from the innermost clause outwards, using d.', 'When Mary was three times as old as Ann, Ann was d ⁄ 2 and Mary 3d ⁄ 2. Then Ann is three times that: 9d ⁄ 2. And so on.'],
    explain: `Let d be Mary's age minus Ann's, which is the same at all times. "When Mary was three times as old as Ann": Ann was d ⁄ 2 and Mary 3d ⁄ 2. "When Ann is three times as old as Mary then was": Ann is 9d ⁄ 2. "When Mary was half as old as that": Mary was 9d ⁄ 4, and Ann was 9d ⁄ 4 − d = 5d ⁄ 4. "Mary is twice as old as Ann then was": Mary is 5d ⁄ 2. So Ann is 5d ⁄ 2 − d = 3d ⁄ 2, and together 4d = 44, so d = 11. Mary is **27½** and Ann is 16½.`,
    data: { answer: { num: 27.5, show: '27.5', unit: 'years' }, glyph: '27½' },
    concepts: ['equations'], tags: ['ages']
  },
  {
    id: 'dud-puzzling-watch', title: 'A Puzzling Watch', diff: 4, year: 1917,
    links: ['dud-three-clocks', 'dud-what-time'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 59.',
    text: `A watch has a peculiarity: by its own dial, the minute hand catches up with the hour hand **every 65 minutes**. (On a perfect watch they meet a little less often than every 66 minutes, as you know if you have watched the hands.)\n\nDoes the watch gain or lose, and by how much in 24 hours?`,
    hints: ['On a correct watch, the minute hand gains 55 minutes on the hour hand every hour (it does 60 while the hour hand does 5). How long between meetings?', 'That is 60 ÷ (11 ⁄ 12) = 65 5⁄11 minutes. The watch says 65 in that time.'],
    explain: `On a correct watch the minute hand gains 11 ⁄ 12 of a turn on the hour hand every hour, so it catches up every 12 ⁄ 11 hours = 65 5⁄11 minutes. This watch's dial shows only 65 minutes for that: in each 65 5⁄11 real minutes it counts 65, so it **loses** 5 ⁄ 11 minute in every 65 5⁄11, which is 1 ⁄ 144 of the time. Over 24 hours that is exactly **10 minutes**.`,
    data: {
      answer: { choice: 3, choices: ['It gains 10 minutes in 24 hours', 'It loses 5 minutes in 24 hours', 'It keeps perfect time', 'It loses 10 minutes in 24 hours'] },
      traps: [{ match: 0, msg: 'Compare 65 with the 65 5/11 minutes a perfect watch takes between meetings. Which is shorter, and what does that say?' }],
      glyph: '⌚'
    },
    concepts: ['rates', 'modular'], tags: ['clock']
  },
  {
    id: 'dud-beef-sausages', title: 'Beef and Sausages', diff: 4, year: 1917,
    links: ['dud-apples'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 20.',
    text: `A woman buys the **same weight** of beef at **2 shillings a pound** and of sausages at **1s 6d a pound** (12 pence make a shilling). If she had **spent her money equally** on beef and on sausages, she would have got **2 pounds more** meat altogether.\n\nHow many shillings did she spend?`,
    hints: ['Call the weight of each Q pounds. In pence, beef is 24 a pound and sausages 18 a pound. What does she spend?', 'She spends 42Q pence. Halve it and work out the weight of each.'],
    explain: `With Q pounds of each she spends 24Q + 18Q = 42Q pence. Spending half of that on each item, 21Q pence, buys 21Q ⁄ 24 lb of beef and 21Q ⁄ 18 lb of sausages, together 2Q + Q ⁄ 24 pounds. That is Q ⁄ 24 more, so Q ⁄ 24 = 2 and Q = 48. She spent 42 × 48 = 2,016 pence, which is **168 shillings** (£8 8s).`,
    data: { answer: { num: 168, unit: 'shillings' }, glyph: '168' },
    concepts: ['equations'], tags: ['money']
  },
  {
    id: 'dud-century', title: 'The Century Puzzle', diff: 5, year: 1917,
    links: ['dud-digital-century', 'dud-three-groups'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 90.',
    text: `Write **100** as a mixed number that uses each of the digits **1 to 9 exactly once**. For instance 91 5742⁄638 works: 5742 ÷ 638 is exactly 9, and 91 + 9 = 100.\n\nDudeney found eleven such ways. Ten of them have a whole number of two figures; **one** has a whole number of a single figure. Find that one and give the numerator and the denominator of its fraction.`,
    hints: ['If the whole part is a single digit, the fraction must be a whole number between 91 and 99. Try 3 for the whole part, so the fraction is 97.', 'The denominator has three digits and the numerator five. The numerator is 97 times the denominator, and together with the denominator uses the digits 1, 2, 4, 5, 6, 7, 8, 9.'],
    explain: `The solution is **3 69258⁄714**: 69,258 ÷ 714 = 97, and 3 + 97 = 100, and the digits 3, 6, 9, 2, 5, 8, 7, 1, 4 are all different. The other ten have a two-figure whole number, such as 91 5742⁄638 and 94 1578⁄263.`,
    data: { answer: { nums: [69258, 714], ordered: true }, ask: 'Numerator and denominator, separated by a comma', glyph: '3⁵⁄₇' },
    concepts: ['alphametic'], tags: ['digits', 'fractions']
  },
  {
    id: 'dud-reaping', title: 'Reaping the Corn', diff: 4, year: 1917,
    links: ['dud-banner'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 111.',
    text: `A farmer starts to reap a square field of corn by cutting a strip **one rod wide** all the way round the outside. "That's half of it done," he tells his son. "You can have the square in the middle to cut yourself." The son checks, and the farmer is exactly right.\n\nHow many **square rods** are there in the whole field? (Give the answer to two decimal places.)`,
    hints: ['Let the field be s rods across. What is the side of the square that is left after cutting a strip a rod wide from each side?', 'The remaining square has side s − 2, and its area is half of s².'],
    explain: `The middle square has side s − 2, and (s − 2)² = s² ⁄ 2 gives s − 2 = s ⁄ √2, so s = 2 ⁄ (1 − 1 ⁄ √2) = 4 + 2√2 ≈ 6.83 rods. The area is s² = 24 + 16√2 ≈ **46.63 square rods**, which is a little under a third of an acre (there are 160 square rods to the acre).`,
    data: { answer: { num: 46.627, tol: 0.02, unit: 'square rods' }, glyph: '🌾' },
    concepts: ['area', 'equations'], tags: ['geometry']
  },
  {
    id: 'dud-millionaire', title: 'The Millionaire\'s Perplexity', diff: 4, year: 1917,
    links: ['dud-merchant'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 16.',
    text: `A millionaire decides to give away exactly **$1,000,000** among a number of people. Every gift is either **$1** or a **power of 7 dollars** ($7, $49, $343, $2,401 and so on), and **no more than six people** get the same amount.\n\nHow many people receive a gift?`,
    hints: ['If seven people got the same power of 7, you could replace them with a single gift of the next power up. So that is why the limit is six.', 'Write 1,000,000 in base 7. The digits tell you how many people get each power of 7.'],
    explain: `The rule "no more than six of any amount" means the gifts are the digits of 1,000,000 written in **base 7**: 1,000,000 = 1·823,543 + 1·117,649 + 3·16,807 + 3·2,401 + 3·343 + 3·49 + 1·7 + 1, or 11333311 in base 7. The digits add to 1 + 1 + 3 + 3 + 3 + 3 + 1 + 1 = **16** people, and this is the only way to do it.`,
    data: { answer: { num: 16 }, glyph: '11333311' },
    concepts: ['number-bases'], tags: ['base 7']
  },
  {
    id: 'dud-queer-coincidence', title: 'A Queer Coincidence', diff: 4, year: 1917,
    links: ['dud-charity'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 5.',
    text: `Seven friends (Adams, Baker, Carter, Dobson, Edwards, Francis and Gudgeon) play seven rounds of a game with pennies. In each round one of them wins, and the winner **doubles** everyone else's money by giving each of the others as much as he already holds. Adams wins the first round, Baker the second, and so on to Gudgeon in the seventh.\n\nAfter the seventh round they discover that each of the seven has **exactly 32 pence** (2s 8d). How many pence did **Adams** have at the start? (Farthings, quarters of a penny, are allowed.)`,
    hints: ['Work backwards. In the last round Gudgeon won, and the other six had their money doubled.', 'Before the last round the other six had 16 each; Gudgeon had what he has now plus what he paid out.'],
    explain: `Undo the rounds from the last: before Gudgeon's win the others had 16 each and he had 32 + 6 × 16 = 128; before Francis's win everyone else's holding halves again, and so on. The starting purses are: Adams **112¼**, Baker 56¼, Carter 28¼, Dobson 14¼, Edwards 7¼, Francis 3¾ and Gudgeon 2 pence, which add up to 224, exactly 7 × 32.`,
    data: { answer: { num: 112.25, show: '112.25', unit: 'pence' }, glyph: '7×' },
    concepts: ['working-backwards'], tags: ['money', 'doubling']
  },
  {
    id: 'dud-quilt', title: 'Mrs Perkins\'s Quilt', diff: 4, year: 1917,
    links: ['dud-chequered-board'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 173.',
    text: `Mrs Perkins has a square patchwork quilt made of **169 small square patches**, 13 by 13. She wants to cut it, along the seams only, into **squares of various sizes** (a square may be made of many patches).\n\nWhat is the smallest number of squares into which the quilt can be cut?`,
    hints: ['Cutting nothing, one square of side 13, is cheating: you must cut. Big squares help: which two big squares fit side by side along a 13-patch edge?', 'A square of side 7 and one of side 6 fit side by side along an edge (7 + 6 = 13). The rest of the quilt is then filled with smaller squares.'],
    explain: `The smallest number is **11**. A computer search over all ways of tiling a 13 × 13 square with squares of whole-number sides (not the trivial single square) finds nothing with fewer than 11 pieces, and the pieces of the best tilings have sides 7, 6, 6, 4, 3, 3, 2, 2, 2, 1 and 1 (areas 49 + 36 + 36 + 16 + 9 + 9 + 4 + 4 + 4 + 1 + 1 = 169).`,
    data: { answer: { num: 11 }, glyph: '13²' },
    concepts: ['dissection', 'exact-cover'], tags: ['squares', 'cutting']
  },
  {
    id: 'dud-railway-stations', title: 'The Three Railway Stations', diff: 4, year: 1917,
    links: ['dud-spot-table', 'dud-garden'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 181.',
    text: `"How far is it from the station to your house?" a stranger asks the squire.\n\n"Well," he says, "it is the same distance whether I get out at **Appleford**, or at **Bridgefield**, which is 15 miles further along the line, or at **Carterton**, which is 13 miles by rail from Appleford. I am the same distance from all three stations, so I get a good choice of trains."\n\nNow Bridgefield is 14 miles from Carterton. How many miles (in a straight line) is the squire's house from each of the three stations?`,
    hints: ['The three stations form a triangle with sides 13, 14 and 15. The squire is at the point equally far from all three corners: the centre of the circle through them.', 'The radius of that circle is (product of the sides) ÷ (4 × area). This 13-14-15 triangle has area 84.'],
    explain: `The stations are the corners of a triangle with sides 13, 14 and 15 miles. Its area is 84 square miles (Heron's formula, or split it into two right triangles 5-12-13 and 9-12-15). The circle through the three corners has radius R = (13 × 14 × 15) ÷ (4 × 84) = 2,730 ÷ 336 = **8⅛ miles**.`,
    data: {
      answer: { num: 8.125, show: '8 1/8', unit: 'miles' },
      figure: { w: 340, h: 240, svg: '<g stroke="#3a3020" stroke-width="2" fill="#f3e6c8"><polygon points="60,210 285,210 159,42"/></g><g stroke="#b0472f" stroke-width="1.6" stroke-dasharray="5 4"><path d="M172.5 163.1 L60 210 M172.5 163.1 L285 210 M172.5 163.1 L159 42"/></g><circle cx="172.5" cy="163.1" r="5" fill="#b0472f"/><g font-family="Georgia,serif" font-size="14" fill="#3a3020"><text x="24" y="228">Appleford</text><text x="248" y="228">Bridgefield</text><text x="130" y="34">Carterton</text><text x="160" y="226" text-anchor="middle">15</text><text x="98" y="118" text-anchor="middle">13</text><text x="236" y="118" text-anchor="middle">14</text><text x="180" y="182" fill="#b0472f">squire</text></g>' },
      glyph: '△'
    },
    concepts: ['right-triangles'], tags: ['geometry']
  },
  {
    id: 'dud-garden', title: 'The Garden', diff: 4, year: 1917,
    links: ['dud-railway-stations', 'dud-yorkshire'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 182.',
    text: `A gardener says his four-sided garden could have any number of shapes with the same four walls. "Not this one," says a friend: "you told me there is a tree in the garden exactly the **same distance from each of the four corners**."\n\nThe walls are **80, 45, 100 and 63 yards** long. What is the area of the garden, in square yards?`,
    hints: ['A point equally far from all four corners means the four corners lie on a circle. Such a quadrilateral is determined by its four sides.', 'Brahmagupta\'s formula for the area of a quadrilateral inscribed in a circle: √((s − a)(s − b)(s − c)(s − d)), where s is half the sum of the sides.'],
    explain: `The four corners lie on a circle, and for such a quadrilateral the area is √((s − a)(s − b)(s − c)(s − d)), with s half the perimeter: s = 144, so the area is √(64 × 99 × 44 × 81) = √22,581,504 = **4,752 square yards**. Any order of the four walls gives the same area.`,
    data: { answer: { num: 4752, unit: 'square yards' }, glyph: '▱' },
    concepts: ['area', 'right-triangles'], tags: ['geometry']
  },
  {
    id: 'dud-yorkshire', title: 'The Yorkshire Estates', diff: 4, year: 1917,
    links: ['dud-wurzel', 'dud-garden'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 189.',
    text: `Three square estates meet corner to corner, leaving a triangular piece of land between them that was not for sale. The estates measure **370 acres**, **116 acres** and **74 acres**.\n\nHow many acres are there in the triangle?`,
    hints: ['The sides of the three squares are √370, √116 and √74. They are also the three sides of the triangle.', 'You can use Heron\'s formula in a form that needs only the squares of the sides: 16 × area² = 2(ab + bc + ca) − (a² + b² + c²), with a, b, c the three areas.'],
    explain: `The triangle has sides √370, √116 and √74. Heron's formula, written with the areas a = 370, b = 116, c = 74 of the squares, gives 16K² = 2(ab + bc + ca) − (a² + b² + c²) = 2 × 78,884 − 155,832 = 1,936, so K² = 121 and the triangle is **11 acres**.`,
    data: {
      answer: { num: 11, unit: 'acres' },
      figure: { w: 400, h: 250, svg: '<g stroke="#3a3020" stroke-width="1.5" stroke-linejoin="round"><polygon points="131.9,98.9 268.1,98.9 268.1,235.0 131.9,235.0" fill="#e8d8b8"/><polygon points="268.1,98.9 192.3,90.8 200.4,15.0 276.2,23.1" fill="#cfe0c0"/><polygon points="192.3,90.8 131.9,98.9 123.8,38.5 184.2,30.5" fill="#c9d8ea"/><polygon points="131.9,98.9 268.1,98.9 192.3,90.8" fill="#f3c9b8" stroke="#b0472f" stroke-width="2"/></g><g font-family="Georgia,serif" font-size="15" fill="#3a3020" text-anchor="middle"><text x="200" y="171.9">370 acres</text><text x="234.2" y="61.9">116</text><text x="158.1" y="69.7">74</text><text x="197.4" y="80" fill="#b0472f" font-weight="700">?</text></g>' },
      glyph: '△'
    },
    concepts: ['area', 'right-triangles'], tags: ['geometry']
  },
  {
    id: 'dud-wurzel', title: 'Farmer Wurzel\'s Estate', diff: 4, year: 1917,
    links: ['dud-yorkshire'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 190.',
    text: `Farmer Wurzel owns three square fields of **18, 20 and 26 acres**. Their corners meet round a triangular patch of waste land. To have a fence right around all his property, he buys the triangular patch as well.\n\nHow many acres does his estate cover now?`,
    hints: ['You need the area of the triangle between the squares. Its sides are √18, √20 and √26.', 'Use 16K² = 2(ab + bc + ca) − (a² + b² + c²) for the triangle whose sides are the square roots of a, b and c.'],
    explain: `With a = 18, b = 20, c = 26 the formula gives 16K² = 2(360 + 520 + 468) − (324 + 400 + 676) = 2,696 − 1,400 = 1,296, so K = 9 acres. The estate is now 18 + 20 + 26 + 9 = **73 acres**.`,
    data: {
      answer: { num: 73, unit: 'acres' },
      figure: { w: 400, h: 250, svg: '<g stroke="#3a3020" stroke-width="1.5" stroke-linejoin="round"><polygon points="158.8,152.5 241.3,152.5 241.3,235.0 158.8,235.0" fill="#e8d8b8"/><polygon points="241.3,152.5 213.7,70.0 296.3,42.5 323.8,125.0" fill="#cfe0c0"/><polygon points="213.7,70.0 158.8,152.5 76.2,97.5 131.2,15.0" fill="#c9d8ea"/><polygon points="158.8,152.5 241.3,152.5 213.7,70.0" fill="#f3c9b8" stroke="#b0472f" stroke-width="2"/></g><g font-family="Georgia,serif" font-size="15" fill="#3a3020" text-anchor="middle"><text x="200" y="198.8">18 acres</text><text x="268.8" y="102.5">20</text><text x="145" y="88.8">26</text><text x="204.6" y="130" fill="#b0472f" font-weight="700">?</text></g>' },
      glyph: '⌂'
    },
    concepts: ['area', 'right-triangles'], tags: ['geometry']
  },
  {
    id: 'dud-goat', title: 'The Tethered Goat', diff: 4, year: 1917,
    links: ['dud-reaping'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 196.',
    text: `A meadow in the shape of an **equilateral triangle** covers **half an acre** (2,420 square yards). A goat is tethered by a rope to a post at one corner.\n\nHow long must the rope be, in yards, for the goat to eat **exactly half** of the grass? (Give yards to two decimal places; Dudeney asks for the nearest inch.)`,
    hints: ['At a corner of an equilateral triangle the goat can reach a sector with an angle of 60°: a sixth of a circle.', 'The sector must have half the area of the meadow: 1,210 square yards. So (1 ⁄ 6)πr² = 1,210.'],
    explain: `Half the meadow is 1,210 square yards. The goat reaches a 60° sector, which is one sixth of a circle, so πr² ⁄ 6 = 1,210 and r² = 7,260 ⁄ π ≈ 2,310.9, giving r ≈ 48.07 yards: **48 yards 3 inches**. That is shorter than the side of the meadow (about 74.8 yards), so the sector does fit inside the triangle.`,
    data: { answer: { num: 48.07, tol: 0.02, unit: 'yards' }, glyph: '🐐' },
    concepts: ['area'], tags: ['geometry']
  },
  {
    id: 'dud-cistern', title: 'How to Make Cisterns', diff: 4, year: 1917,
    links: ['dud-cardboard-box', 'dud-banner'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 201.',
    text: `A sheet of zinc is **8 feet long and 3 feet wide**. A square is cut out of each corner, and the four flaps are folded up and soldered to make an open tank (a cistern).\n\nHow big, in inches, should the squares at the corners be for the cistern to hold as much water as possible?`,
    hints: ['If the square has side x inches, the base is (96 − 2x) by (36 − 2x) inches and the height is x. Try x = 6, 8 and 10 and compare the volumes.', 'x = 8 gives 8 × 80 × 20 = 12,800 cubic inches. Compare x = 7 and x = 9.'],
    explain: `With squares of x inches the volume is x(96 − 2x)(36 − 2x). At x = 7 it is 12,628, at x = 9 it is 12,636, and at **x = 8** it is 12,800 cubic inches (about 7.4 cubic feet). Calculus confirms it: the volume peaks where 3x² − 132x + 864 = 0 in inches, or 3x² − 11x + 6 = 0 in feet, that is at exactly 8 inches.`,
    data: { answer: { num: 8, unit: 'inches' }, glyph: '⌷' },
    concepts: ['equations'], tags: ['boxes', 'maximum']
  },
  {
    id: 'dud-chequered-board', title: 'Chequered Board Divisions', diff: 5, year: 1917,
    links: ['dud-quilt'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 288.',
    text: `In how many different ways can a chessboard be cut along the lines between the squares into **two pieces of exactly the same size and shape**?\n\nA board of 4 squares (2 × 2) can be cut in only **one** way. A board of 16 squares (4 × 4) can be cut in **six** ways. Do not count as different two cuts that are just turned round or looked at in a mirror.\n\nHow many ways are there for a board of **36 squares** (6 × 6)?`,
    hints: ['The cut is a path along the grid lines that goes through the centre of the board, and turning the board half a turn must put each piece exactly over the other.', 'So it is enough to draw the half of the cut from the centre to the edge, without letting it touch its own half-turn copy. There are a lot of such paths.'],
    explain: `The two pieces are half-turn images of each other, so the cut runs through the centre and is unchanged by a half turn. Counting all such paths by computer, and identifying those that differ only by turning or reflecting the board, gives 1, 6 and **255** for the boards of 4, 16 and 36 squares: the first two agree with the numbers in the puzzle, which checks the method.`,
    data: { answer: { num: 255 }, glyph: '255' },
    concepts: ['symmetry', 'combinatorics'], tags: ['chessboard', 'cutting']
  },
  {
    id: 'dud-bishops', title: 'Bishops in Convocation', diff: 4, year: 1917,
    links: ['dud-queens'],
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 299.',
    text: `The largest number of bishops that can stand on a chessboard with **no bishop attacking another** is **fourteen**. (Two bishops attack each other if they lie on the same diagonal.)\n\nIn how many different ways can the fourteen bishops be placed?`,
    hints: ['A bishop always stays on squares of one colour, so the bishops on white squares never bother those on black. Count the two colours separately.', 'On one colour, count the ways to place seven bishops with none on the same diagonal, then multiply the two colour counts.'],
    explain: `The white-square bishops and the black-square bishops never attack each other, so the two colours can be counted separately and the results multiplied. Seven bishops can be placed on the squares of one colour in **16** ways, and the same for the other colour: 16 × 16 = **256**. Dudeney gives the general rule: on an n × n board, 2n − 2 bishops can be placed in 2ⁿ ways.`,
    data: { answer: { num: 256 }, glyph: '♗' },
    concepts: ['combinatorics', 'symmetry'], tags: ['chess']
  },
  {
    id: 'dud-keg', title: 'The Keg of Wine', diff: 4, year: 1917,
    links: ['dud-wine-water', 'dud-doctors-query'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 368.',
    text: `A man has a **ten-gallon keg** full of wine and a jug. One day he draws off one jugful of wine and fills the keg up with water. When the wine and water are thoroughly mixed, he draws off a jugful of the mixture and again fills the keg up with water. The keg now holds **equal amounts of wine and water**.\n\nHow many gallons does the jug hold? (Give a decimal answer; about two decimal places will do.)`,
    hints: ['Each time he draws a jugful, the wine left in the keg is multiplied by (1 − j ⁄ 10), where j is the size of the jug.', 'After two drawings the wine is 10 × (1 − j ⁄ 10)², and this must be 5 gallons.'],
    explain: `Each drawing leaves the fraction (10 − j) ⁄ 10 of the wine in the keg. After two the keg holds 10 × ((10 − j) ⁄ 10)² gallons of wine, which must be 5, so (10 − j) ⁄ 10 = 1 ⁄ √2 and j = 10 − 10 ⁄ √2 = 10 − 7.07 = **2.93 gallons**: about 2 gallons 7½ pints. A jug of that size isn't a natural one, which is the charm of the puzzle: the answer involves √2.`,
    data: { answer: { num: 2.929, tol: 0.01, show: '2.93', unit: 'gallons' }, glyph: '🍶' },
    concepts: ['equations'], tags: ['mixtures']
  },
  {
    id: 'dud-tea', title: 'Mixing the Tea', diff: 4, year: 1917,
    links: ['dud-post-office'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 369.',
    text: `A grocer wants to blend **20 pounds** of tea, using three kinds that cost **30 pence**, **27 pence** and **21 pence** a pound, so that the blend is worth **28½ pence** a pound. He will use **whole pounds** of each kind, all three kinds, and as **little of the dearest** as he can.\n\nHow many pounds of the dearest tea should he use?`,
    hints: ['Let there be a, b and c pounds of the three kinds. Then a + b + c = 20 and 30a + 27b + 21c = 570.', 'Subtract 21 × 20 = 420: this gives 9a + 6b = 150, so 3a + 2b = 50. Which a are possible, if b and c must both be positive whole numbers?'],
    explain: `From 3a + 2b = 50, a is even, and c = 20 − a − b must stay positive. The solutions are (a, b, c) = (10, 10, 0) (only two kinds, so not allowed), **(12, 7, 1)**, (14, 4, 2) and (16, 1, 3). The least of the dearest tea, using all three kinds, is **12 pounds**, with 7 pounds of the middle kind and 1 pound of the cheapest.`,
    data: { answer: { num: 12, unit: 'pounds' }, traps: [{ match: 10, msg: 'That uses only two kinds of tea. The grocer insists on all three.' }], glyph: '🍵' },
    concepts: ['diophantine', 'equations'], tags: ['mixtures']
  },
  {
    id: 'dud-honey', title: 'The Barrels of Honey', diff: 4, year: 1917,
    links: ['dud-barrel-beer'],
    source: 'After Dudeney, *Amusements in Mathematics* (1917), no. 372.',
    text: `Three sons inherit **21 barrels of honey**: **7 full**, **7 half full** and **7 empty**. They must share them so that each son gets the **same number of barrels** and the **same amount of honey**, with no barrel poured out. They are also fussy: no son will accept **more than four barrels of any one kind**.\n\nThe father's will says the luckiest son gets the most full barrels. How many full, half-full and empty barrels does that son get? Give the three numbers in that order.`,
    hints: ['Each son gets 7 barrels and 3½ barrels\' worth of honey. If a son has f full barrels and h half-full, then f + h ⁄ 2 = 3½.', 'The possibilities per son are (f, h, e) = (0, 7, 0), (1, 5, 1), (2, 3, 2), (3, 1, 3). Which of them break the "no more than four" rule, and which three make the totals 7, 7, 7?'],
    explain: `Each son needs 7 barrels and 3½ barrels of honey, so his barrels are (full, half, empty) = (0, 7, 0), (1, 5, 1), (2, 3, 2) or (3, 1, 3). The "no more than four of a kind" rule rules out the first two. To use 7 full, 7 half and 7 empty barrels in all, two sons take (2, 3, 2) and one takes **(3, 1, 3)**.`,
    data: { answer: { nums: [3, 1, 3], ordered: true }, ask: 'Full, half-full and empty barrels of the luckiest son', glyph: '🍯' },
    concepts: ['diophantine', 'deduction'], tags: ['sharing']
  },
  {
    id: 'dud-jealous-five', title: 'Five Jealous Husbands', diff: 4, year: 1917,
    source: 'Dudeney, *Amusements in Mathematics* (1917), no. 375.',
    text: `Five married couples are cut off by floods and must cross a river in a boat that holds **three people**. Every husband is jealous: he will not allow his wife to be in the company of another man unless he is there too, on either bank or in the boat. Anyone can row.\n\nWhat is the smallest number of crossings that gets all ten people across? (A crossing is one trip in either direction.)`,
    hints: ['The boat holding three, not two, is what makes five couples possible at all: with a two-seat boat, four or more couples cannot cross.', 'List who is on each bank after every crossing, and never leave a wife with another man on her own. Do not be afraid of bringing people back.'],
    explain: `A search through every position of the puzzle shows that the least number of crossings is **11**. (With a boat for two, three couples need 11 crossings too; four couples cannot cross at all.)`,
    data: { answer: { num: 11 }, glyph: '⛵' },
    concepts: ['state-space'], tags: ['river crossing']
  }
].sort(function (a, b) { return a.diff - b.diff; })); // easiest first (the sort is stable)
