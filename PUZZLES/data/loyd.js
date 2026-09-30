/* The Puzzle Cabinet · data/loyd.js
 * Sam Loyd's puzzles, retold in modern words after Sam Loyd's Cyclopedia of 5000 Puzzles,
 * Tricks and Conundrums (1914) and his best-documented inventions. Numeric answers checked by computer. */
(function () {
  'use strict';

  // the 14-15 tray: blocks in order except the last two swapped
  function trayFig() {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0];
    let s = '<rect x="110" y="10" width="184" height="184" rx="8" fill="#c99a5b" stroke="#6b4a1f" stroke-width="3"/>';
    nums.forEach(function (n, i) {
      const r = Math.floor(i / 4), c = i % 4, x = 118 + c * 44, y = 18 + r * 44;
      if (!n) return;
      const hot = n === 14 || n === 15;
      s += '<rect x="' + x + '" y="' + y + '" width="40" height="40" rx="5" fill="' + (hot ? '#f0c9b8' : '#fbf8ef') + '" stroke="#3a3020" stroke-width="1.5"/>';
      s += '<text x="' + (x + 20) + '" y="' + (y + 27) + '" text-anchor="middle" font-family="Georgia,serif" font-size="20" font-weight="700" fill="' + (hot ? '#b0472f' : '#3a3020') + '">' + n + '</text>';
    });
    return s;
  }
  // a daisy of 13 petals
  function daisyFig() {
    let s = '<g transform="translate(200 110)">';
    for (let i = 0; i < 13; i++) {
      s += '<ellipse cx="0" cy="-62" rx="17" ry="34" transform="rotate(' + (i * 360 / 13).toFixed(2) + ')" fill="#fbf8ef" stroke="#3a3020" stroke-width="1.5"/>';
    }
    return s + '<circle r="24" fill="#e6b93a" stroke="#8a6a1f" stroke-width="2"/></g>';
  }

  // ten points that lie in five rows of four: the ten points of a five-pointed star (only the points are drawn)
  function starFig() {
    const cx = 200, cy = 118, R = 96, r = R * (3 - Math.sqrt(5)) / 2;
    const P = [], Q = [];
    for (let k = 0; k < 5; k++) {
      const a = (-90 + 72 * k) * Math.PI / 180, b = (-90 + 72 * k + 36) * Math.PI / 180;
      P.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
      Q.push([cx + r * Math.cos(b), cy + r * Math.sin(b)]);
    }
    let s = '';
    P.concat(Q).forEach((p) => { s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="8" fill="#e6b93a" stroke="#3a3020" stroke-width="1.5"/>'; });
    return s;
  }

  const SRC = 'Loyd, *Sam Loyd\'s Cyclopedia of 5000 Puzzles, Tricks and Conundrums* (1914)';

  Cabinet.family({
    id: 'loyd', engine: 'question', cat: 'riddles', name: 'Sam Loyd\'s puzzles', order: 3,
    blurb: 'Seesaws, cows on bridges, a vanishing swordsman and a daisy game you can always win: the newspaper puzzles of America\'s showman of puzzles.',
    origin: { year: 1914, who: 'Sam Loyd (1841–1911)', note: 'Sam Loyd wrote puzzle columns and sold puzzle novelties for forty years, and his showman\'s tales were often taller than his puzzles: he claimed inventions that were not his, and Henry Dudeney later accused him of publishing Dudeney\'s puzzles as his own. His son collected the columns in the Cyclopedia of 5000 Puzzles, Tricks and Conundrums (1914), which is in the public domain. Where a famous claim is disputed, the puzzle says so.' },
    concepts: ['equations', 'parity']
  }, [
    {
      id: 'loyd-teeter', title: 'The Seesaw Puzzle', diff: 1,
      links: ['loyd-bank-teller'],
      source: SRC + ', "Elementary Lessons in Algebra".',
      text: `At the playground **five boys** on one end of a seesaw balance **three boys and three girls** on the other end. All the boys weigh the same, and all the girls weigh the same.\n\nHow many girls would it take to balance **eight boys**?`,
      hints: ['Take three boys off each end of the seesaw. It stays balanced. What is left?', 'Two boys balance three girls.'],
      explain: `Take three boys off each end: two boys are left on one side, three girls on the other, still balanced. So two boys weigh the same as three girls, and eight boys (four lots of two) weigh the same as four lots of three girls: **12 girls**. Loyd used the little puzzle to show that algebra is only careful cancelling.`,
      data: { answer: { num: 12, unit: 'girls' }, glyph: '⚖' },
      concepts: ['equations'], tags: ['balance']
    },
    {
      id: 'loyd-watch-compass', title: 'The Watch Compass', diff: 2,
      links: ['loyd-time-problem', 'dud-what-time'],
      source: SRC + ', the watch-compass trick.',
      text: `Loyd tells lost travellers in the northern hemisphere to use their watch as a compass: **lay the watch flat and turn it until the hour hand points at the sun; south is then halfway between the hour hand and the 12** (measured the short way round).\n\nIt is **4 o'clock in the afternoon** by the sun. You lay your watch flat with the hour hand aimed at the sun. Which mark on the dial now points south?`,
      hints: ['At 4 o\'clock the hour hand points at the 4. What is halfway between 12 and 4?', 'The sun moves round the sky at half the speed of the hour hand, which is why "halfway" works.'],
      explain: `At 4 o'clock the hour hand points at the 4, and halfway between the 4 and the 12 is the **2**: south is in the direction of the 2 on the dial. The hour hand goes round twice a day while the sun goes round once, so the angle between the hour hand and the 12 is twice the angle between the sun and south: south lies halfway. (This is only a rough compass: the watch must show sun time, not summer time, and it works north of the tropics.)`,
      data: {
        answer: { choice: 1, choices: ['The 12', 'The 2', 'The 3', 'The 6'] },
        traps: [{ match: 0, msg: 'The 12 is only south at noon. Where do you find "halfway between the hour hand and the 12" at four o\'clock?' }],
        glyph: '🧭'
      },
      concepts: ['gear-ratio'], tags: ['clock', 'navigation']
    },
    {
      id: 'loyd-four-players', title: 'Four Winning Players', diff: 2,
      links: ['loyd-ship-lies'],
      source: 'After Loyd\'s Cyclopedia (1914), the rhyme of the four players.',
      text: `Four men sat down to play and **played all night** until the morning. Yet when they settled up at daybreak **not one of them had lost a penny**: all four had **come out with money in their pockets**.\n\nHow could that be?`,
      hints: ['It is not a game of chance with a loser. Think about other things that people "play".', 'Perhaps someone else paid them for it.'],
      explain: `They were **musicians**, playing at a dance or a party: they played all night and were paid for it, so all four went home richer. Loyd's rhyme leaves the word "play" to do the work.`,
      data: {
        answer: { choice: 2, choices: ['They played cards for imaginary money', 'They cheated the fifth man, who left early', 'They were musicians, paid for playing', 'The banker made up the losses'] },
        traps: [{ match: 0, msg: 'Play money would give nobody real winnings. Think about who could be paying them.' }],
        glyph: '🎻'
      },
      concepts: ['lateral'], tags: ['wordplay']
    },
    {
      id: 'loyd-bank-teller', title: 'The Bank Teller\'s Puzzle', diff: 2,
      links: ['loyd-teeter', 'loyd-lost-cent'],
      source: 'After Loyd\'s Cyclopedia (1914), the bank-teller puzzle.',
      text: `A customer hands a bank teller a cheque for **$200** and asks for it in **some one-dollar bills**, **ten times as many two-dollar bills**, and **the rest in five-dollar bills**.\n\nHow many bills of each kind does the teller hand over?`,
      hints: ['If there are x one-dollar bills, there are 10x two-dollar bills. How many dollars do these two kinds come to?', 'x + 20x = 21x dollars. The rest, 200 − 21x, is a whole number of fives.'],
      explain: `With x one-dollar bills and 10x two-dollar bills, those kinds come to 21x dollars. What remains, 200 − 21x, must be a multiple of 5, so x is a multiple of 5, and x = 5 is the only one that leaves something over (x = 10 already costs 210). So the teller gives **5 ones, 50 twos and 19 fives**: 5 + 100 + 95 = 200.`,
      data: { answer: { nums: [5, 50, 19], ordered: true }, ask: 'One-, two- and five-dollar bills, in that order', glyph: '$' },
      concepts: ['diophantine', 'equations'], tags: ['money']
    },
    {
      id: 'loyd-lost-cent', title: 'The Lost Cent', diff: 3,
      links: ['loyd-bank-teller', 'dud-costermonger'],
      source: 'After Loyd\'s Cyclopedia (1914), "The Lost Cent" (the Covent Garden problem).',
      text: `Two women sell apples at the market. Mary has **30 apples** and sells them at **two for a cent**, so she takes **15 cents**. Ann has **30 apples** and sells them at **three for a cent**, so she takes **10 cents**: **25 cents** in all.\n\nOne day Ann has to sell both lots. "Two for a cent and three for a cent," she thinks, "so it is **five for two cents**." She sells all 60 apples that way and takes **24 cents**.\n\nWhere did the missing cent go?`,
      hints: ['Sell one bundle: two of Mary\'s apples and three of Ann\'s. What does it fetch, in the old way? And in the new way?', 'Ann sells 5 apples for 2 cents as if they were always 2 dear ones and 3 cheap ones. But she has as many cheap as dear.'],
      explain: `Five for two cents assumes each bundle contains two dear apples (two for a cent) and three cheap ones (three for a cent). But she has **30 of each**, half and half, and a half-and-half bundle is worth more: 60 apples at the true average price bring 25 cents. By selling as though there were more cheap apples than there are, Ann undervalued the dear ones, and the cent vanished into that mistake.`,
      data: {
        answer: { choice: 1, choices: ['Ann pocketed it for herself', 'The mixed price of five for two cents undervalues the dearer apples: the two kinds are not in the ratio 2 to 3', 'A cent is always lost when apples are sold in mixed lots', 'There is no missing cent: 25 and 24 are the same'] },
        traps: [{ match: 3, msg: 'Count again: Mary and Ann together made 25 cents before, and 24 now.' }],
        glyph: '¢'
      },
      concepts: ['equations'], tags: ['money', 'paradox']
    },
    {
      id: 'loyd-time-problem', title: 'The Time Problem', diff: 3,
      links: ['loyd-watch-compass', 'dud-puzzling-watch'],
      source: 'After Loyd\'s Cyclopedia (1914), "The Time Problem".',
      text: `At 12 o'clock the two hands of a clock lie exactly on top of each other. They do so again some time after one o'clock.\n\nHow many **minutes past one o'clock** is it when they next lie exactly on top of each other?`,
      hints: ['The minute hand goes round 12 times as fast as the hour hand. How far does each go in m minutes, measured in minutes of the dial?', 'At m minutes after one, the hour hand is at 5 + m ⁄ 12 (in dial minutes), the minute hand at m.'],
      explain: `At m minutes past one the minute hand is at position m on the dial and the hour hand at 5 + m ⁄ 12. They meet when m = 5 + m ⁄ 12, so 11m ⁄ 12 = 5 and m = 60 ⁄ 11 = **5 5⁄11 minutes** past one. (All the meetings are 65 5⁄11 minutes apart: the hands meet 11 times in 12 hours.)`,
      data: { answer: { num: 5.454545, tol: 0.01, show: '5 5/11', unit: 'minutes' }, glyph: '⌚' },
      concepts: ['rates', 'modular'], tags: ['clock']
    },
    {
      id: 'loyd-casey-parade', title: 'Casey\'s St Patrick\'s Day Parade', diff: 3,
      links: ['loyd-dummies-50'],
      source: SRC + ', "The St. Patrick\'s Day Parade".',
      text: `Casey is drilling his men for the parade. He tries **rows of 10**, and the last row has **9** men (one short of a full row). He tries **rows of 9**: the last row has **8**. **Rows of 8**: the last has **7**. And so on down to **rows of 2**, where the last row has **1** man: every time the last row is exactly one man short.\n\nWhat is the smallest number of men Casey can have?`,
      hints: ['If Casey had one more man, what would happen with rows of 10, 9, 8, … 2?', 'N + 1 would divide exactly by all of 2 to 10. Find the smallest such number.'],
      explain: `Adding one man to the ranks would fill every last row, so N + 1 is divisible by every number from 2 to 10. The smallest such number is their least common multiple, 2520 (= 8 × 9 × 5 × 7). So Casey has **2,519** men. (The next possible parade is 5,039 strong.)`,
      data: { answer: { num: 2519 }, traps: [{ match: 2520, msg: 'That number divides evenly in every row. Casey\'s rows are always one man short.' }], glyph: '☘' },
      concepts: ['modular', 'gcd'], tags: ['remainders']
    },
    {
      id: 'loyd-dummies-50', title: 'The Squarest Game on the Beach', diff: 3,
      links: ['loyd-casey-parade'],
      source: 'After Loyd\'s Cyclopedia (1914), the ten-dummies game on the beach.',
      text: `At a seaside stall ten wooden dummies stand in a row, marked **3, 6, 9, 12, 15, 19, 21, 25, 27 and 30**. You get three balls, and each ball knocks down exactly one dummy (a dummy can only be hit once). Your score is the sum of the three numbers. Score **exactly 50** and you win a cigar.\n\nWhich three dummies must you knock down?`,
      hints: ['Look at the numbers modulo 3: most of them are multiples of 3. Which two are not?', 'A total of 50 leaves remainder 2 when divided by 3. Only 19 and 25 leave remainder 1.'],
      explain: `Every number is a multiple of 3 except 19 and 25, which each leave remainder 1. A total of 50 leaves remainder 2, so **both** 19 and 25 must be hit (1 + 1 = 2). Together they make 44, so the third is 6. The winning score is **6 + 19 + 25 = 50**, and no other set of dummies adds up to 50.`,
      data: { answer: { nums: [6, 19, 25], ordered: false }, ask: 'The three numbers, separated by commas', glyph: '50' },
      concepts: ['modular', 'deduction'], tags: ['sums']
    },
    {
      id: 'loyd-turf-odds', title: 'The Turf Puzzle', diff: 4,
      links: ['loyd-lost-cent', 'dud-bag-coins'],
      source: 'After Loyd\'s Cyclopedia (1914), "The Turf Puzzle" (odds against Cucumber).',
      text: `Three horses run a race, and one of them is certain to win. A fair bookmaker offers **3 to 1 against Apple Pie** and **6 to 5 against Bumble Bee**. (Odds of 3 to 1 against mean a bet of 1 wins 3 if the horse wins.)\n\nWhat are the fair odds against the third horse, **Cucumber**? Give the odds as a number x meaning "x to 1".`,
      hints: ['Odds of a to b against mean a probability of b ⁄ (a + b) that the horse wins. What are the chances of Apple Pie and Bumble Bee?', 'The three winning chances must add up to 1. What is left for Cucumber?'],
      explain: `Odds of 3 to 1 against Apple Pie mean a 1 ⁄ 4 chance; 6 to 5 against Bumble Bee mean 5 ⁄ 11. That leaves 1 − 1 ⁄ 4 − 5 ⁄ 11 = 13 ⁄ 44 for Cucumber. His chance of losing is 31 ⁄ 44, so the fair odds against him are 31 to 13, which is **2 5⁄13 to 1** (about 2.38 to 1).`,
      data: { answer: { num: 2.384615, tol: 0.01, show: '31/13' }, ask: 'The odds against Cucumber as a number x to 1 (a fraction is fine)', glyph: '🐎' },
      concepts: ['probability'], tags: ['odds']
    },
    {
      id: 'loyd-corner-in-wheat', title: 'A Corner in Wheat', diff: 2,
      links: ['loyd-hanoi-13'],
      source: 'After Loyd\'s Cyclopedia (1914), "A Corner in Wheat" (the chessboard of wheat).',
      text: `A miller puts **one grain** of wheat on the first square of a chessboard, **two** on the second, **four** on the third, and keeps doubling until the 64th square has its share.\n\nRoughly how many grains lie on the board altogether?`,
      hints: ['The last square alone holds 2⁶³ grains. Roughly how big is 2⁶³?', '2¹⁰ is about a thousand. So 2⁶⁰ is about a thousand cubed, a thousand million million million.'],
      explain: `The total is 1 + 2 + 4 + … + 2⁶³ = 2⁶⁴ − 1 = 18,446,744,073,709,551,615: about **eighteen quintillion** grains (1.8 × 10¹⁹). A rough guess for the whole world's wheat harvest in a year is about 2 × 10¹⁶ grains, so the board would need on the order of a thousand years of it.`,
      data: {
        answer: { choice: 3, choices: ['About eighteen thousand grains', 'About eighteen million grains', 'About eighteen billion grains', 'About eighteen quintillion grains: 18 followed by 18 zeros'] },
        traps: [{ match: 2, msg: 'Keep doubling: the 33rd square alone already holds about four billion grains.' }],
        glyph: '🌾'
      },
      concepts: ['geometric-series'], tags: ['doubling']
    },
    {
      id: 'loyd-daisy', title: 'The Daisy Puzzle', diff: 4,
      links: ['loyd-14-15'],
      source: 'After Loyd\'s Cyclopedia (1914), "A Daisy Puzzle Game".',
      text: `Two players sit with a daisy of **13 petals**. They take turns to pick **one petal**, or **two petals that are still next to each other** on the flower (a gap breaks the connection). The player who picks the **last petal wins**.\n\nWould you rather go **first** or **second**, and what is your plan?`,
      hints: ['Try a daisy with only a few petals and see who wins. Then think about making the position symmetrical.', 'Suppose two equal separate groups of petals are left and it is your opponent\'s turn. Can you always copy whatever he does on the other group?'],
      explain: `The **second** player wins. Whatever the first player takes, the second player takes the middle of what remains, leaving **two equal groups**: if one petal was taken, twelve are left in a row, so take the two in the middle (5 and 5 remain); if two were taken, eleven are left, so take the middle one (5 and 5 remain). Afterwards, whatever the opponent takes from one group, take the matching petals from the other. A computer search of the game confirms it: the second player wins on every ring of five or more petals.`,
      data: {
        answer: { choice: 1, choices: ['Go first, take one petal and copy your opponent afterwards', 'Go second: make two equal groups of petals, then copy every move on the other group', 'Go first and take two petals', 'It makes no difference: both players can win'] },
        traps: [{ match: 0, msg: 'After a first-player move the second player can make a symmetrical position, and then copying wins for him.' }, { match: 3, msg: 'One of the players can always force a win. Which one, and how?' }],
        figure: { w: 400, h: 220, svg: daisyFig() },
        glyph: '🌼'
      },
      concepts: ['symmetry', 'nim-sum'], tags: ['game', 'strategy']
    },
    {
      id: 'loyd-14-15', title: 'The 14–15 Puzzle', diff: 2, year: 1880,
      links: ['loyd-15-count', 'loyd-tan-hoax', 'loyd-get-off-earth'],
      source: 'Loyd\'s famous claim of the 1880s; the proof of impossibility is Johnson and Story (1879).',
      text: `Fifteen numbered blocks sit in a four-by-four tray with one empty space, and you may only slide a block into the empty space. In the starting position the blocks are in order **1 to 13, then 15 and 14** (the last two swapped), with the space in the corner. Loyd said he had offered **$1,000** to anyone who could slide the blocks into the right order, 14 before 15.\n\nCan it be done?`,
      hints: ['Try it on a real tray, or think about the two blocks that swap. The sliding puzzle is a game of exchanges.', 'Every slide of a block into the space is one exchange with the space. The space returns to the corner after an even number of moves.'],
      explain: `It **cannot** be done, however many moves you try. Each slide swaps a block with the empty space; when the space is back in the corner the number of slides must be even, so the blocks have been rearranged by an **even** permutation. Swapping just 14 and 15 is an odd permutation. William Johnson and William Story proved this in 1879, and exactly half of all arrangements of the blocks can never be reached from the ordered one. Loyd's prize was never claimed. Loyd also said all his life that he had invented the puzzle; historians (Jerry Slocum and Dic Sonneveld) have shown he did not, and the puzzle is usually credited to Noyes Chapman, a New York postmaster, in the 1870s.`,
      data: {
        answer: { choice: 2, choices: ['Yes, in about a hundred moves', 'Yes, but only if you take the blocks out of the tray for a moment', 'No: it is impossible, however you slide them', 'Yes, with the help of a clever sequence found in 1880'] },
        traps: [{ match: 0, msg: 'Nobody ever claimed the $1,000, in a hundred moves or a million. Think about the parity of the swaps.' }, { match: 1, msg: 'The rules only allow sliding. Can a sequence of slides ever swap just two blocks?' }],
        figure: { w: 400, h: 205, svg: trayFig() },
        glyph: '15'
      },
      concepts: ['parity', 'invariant'], tags: ['sliding puzzle', 'impossible']
    },
    {
      id: 'loyd-15-count', title: 'How Many Positions?', diff: 3, year: 1880,
      links: ['loyd-14-15'],
      source: 'The counting follows from the parity proof of Johnson and Story (1879).',
      text: `A four-by-four tray holds fifteen sliding blocks and one empty space. Starting from the ordered position, **how many different positions** (of the blocks and the space together) can you reach by sliding blocks?\n\nGive the exact number.`,
      hints: ['If any arrangement were possible, the 15 blocks and the space could be put in the 16 places in 16! ways.', 'But only half of the arrangements can be reached, the "even" ones: the answer is half of 16!.'],
      explain: `There are 16! = 20,922,789,888,000 ways to arrange the fifteen blocks and the space on the sixteen places, but the sliding rule (each slide is an exchange with the space) only ever reaches **half** of them, those with the same parity as the starting position. So the tray can be in **10,461,394,944,000** different positions. That is more than ten million million.`,
      data: { answer: { num: 10461394944000, tol: 0.5 }, traps: [{ match: 20922789888000, msg: 'That is every arrangement, but only half of them can be reached.' }], glyph: '16!' },
      concepts: ['parity', 'combinatorics'], tags: ['sliding puzzle', 'counting']
    },
    {
      id: 'loyd-get-off-earth', title: 'Get Off the Earth', diff: 2, year: 1896,
      links: ['loyd-tan-hoax', 'loyd-14-15', 'loyd-chessboard-paradox'],
      source: 'Sam Loyd\'s patented vanishing puzzle of 1896 (also listed in the Cyclopedia).',
      text: `Around the edge of a disc are drawn **thirteen swordsmen**. The disc is fixed on a card so that it can be turned like a dial. Turn it a little, and count again: only **twelve** swordsmen are left.\n\nWhere has the thirteenth gone?`,
      hints: ['Nobody left the picture and nothing was added. Look at how each figure is drawn.', 'Each figure is a little bit different before and after the turn.'],
      explain: `The picture is drawn so that **each swordsman is slightly different in the two positions**: after the turn, the pieces of the missing man (a bit of leg, a bit of sword, some of the body) have been shared out among the other twelve, each of whom is a little longer or bigger than before. Nothing has vanished, only been spread thinly, so the eye cannot tell. Loyd patented the trick in 1896, and cards of it were handed out in that year's presidential campaign.`,
      data: {
        answer: { choice: 0, choices: ['The pieces of the thirteenth man are shared among the other twelve: each becomes a little bigger', 'He hides behind the disc, under the card', 'The card is printed differently on its two sides', 'Nothing changed: the eye simply miscounted'] },
        traps: [{ match: 3, msg: 'Count carefully and it really is 13 before and 12 after. What changes in the drawing?' }],
        glyph: '13→12'
      },
      concepts: ['area', 'lateral'], tags: ['vanishing', 'illusion']
    },
    {
      id: 'loyd-tan-hoax', title: 'The Eighth Book of Tan', diff: 2, year: 1903,
      links: ['loyd-get-off-earth', 'loyd-14-15'],
      source: 'Loyd, *The Eighth Book of Tan* (1903).',
      text: `In 1903 Sam Loyd published *The Eighth Book of Tan*. It told how a wise man called **Tan** invented the seven-piece **tangram** puzzle in China some **four thousand years ago**, and how a series of "books of Tan" was written down after him.\n\nHow much of this story is true?`,
      hints: ['Ask where the ancient books of Tan are kept. Have historians ever found one?', 'The oldest tangram books that historians know of come from China in the early nineteenth century.'],
      explain: `The story is Loyd's own invention, a hoax. No "Book of Tan" has ever been found, and the tangram is **not known before the early 1800s**: the oldest Chinese tangram books that survive date from about 1813, and the puzzle reached Europe and America soon after. Loyd's tale, told with a straight face, fooled many writers for decades.`,
      data: {
        answer: { choice: 1, choices: ['All of it: Loyd translated ancient manuscripts', 'None of it: Loyd made the story up, and tangrams are not known before the early 1800s', 'Half of it: the puzzle is ancient, but Loyd invented the name Tan', 'The puzzle is four thousand years old, but the books of Tan were lost'] },
        traps: [{ match: 0, msg: 'Historians have looked for these manuscripts and found nothing. Check when the oldest tangram book appeared.' }],
        glyph: '▲'
      },
      concepts: ['dissection'], tags: ['hoax', 'tangram', 'history']
    },
    {
      id: 'loyd-chessboard-paradox', title: 'The Chessboard Paradox', diff: 3,
      links: ['loyd-get-off-earth', 'dud-friar-zigzag'],
      source: 'A dissection paradox associated with Sam Loyd (often called "the chessboard paradox").',
      text: `A chessboard is **8 squares by 8**, so it holds **64** squares. Cut it along straight lines into **four pieces** (two trapezoids and two triangles), and fit the same four pieces together again into a rectangle **5 squares by 13**, which holds **65** squares. Nothing has been added or removed.\n\nWhere does the extra square come from?`,
      hints: ['Area cannot be made from nothing. Something in the picture must be not quite what it seems. Look at where the four pieces meet in the middle.', 'The edges of the pieces that seem to lie along one straight line do not quite do so.'],
      explain: `The four pieces do **not** fit exactly along the long diagonal of the rectangle: they leave a very thin sliver of a gap (a long, thin parallelogram) which is exactly one square in area, too thin for the eye to see. The numbers 5, 8 and 13 are consecutive Fibonacci numbers, and 5 × 13 = 65 = 8 × 8 + 1: the neighbouring numbers of that sequence always give a product that differs from a square by exactly one, which is why the gap is so slender.`,
      data: {
        answer: { choice: 1, choices: ['One of the squares is counted twice in the rectangle', 'The pieces do not meet exactly along the long diagonal: a hair-thin gap hides an area of one whole square', 'The pieces bend slightly and grow when they are moved', 'Cutting a shape always adds a little area along the cut'] },
        traps: [{ match: 0, msg: 'Count the squares in each figure carefully: 64 and 65. Where in the picture is the extra area hiding?' }],
        glyph: '8×8'
      },
      concepts: ['area', 'dissection'], tags: ['paradox', 'Fibonacci']
    },
    {
      id: 'loyd-hanoi-13', title: 'The Tower with Thirteen Discs', diff: 2,
      links: ['loyd-corner-in-wheat', 'dud-reve-8'],
      source: 'After Loyd\'s Cyclopedia (1914), which includes the Tower of Hanoi with 13 discs.',
      text: `In the Tower of Hanoi puzzle **thirteen discs** of different sizes sit on one of three pegs, the biggest at the bottom. You move one disc at a time to another peg, and never put a bigger disc on a smaller one.\n\nWhat is the least number of moves that carries the whole tower to another peg?`,
      hints: ['To move n discs you must move n − 1 out of the way, move the biggest, and move the n − 1 back on top.', 'That gives the rule M(n) = 2 × M(n − 1) + 1. Start from M(1) = 1.'],
      explain: `To move n discs, move the top n − 1 to the spare peg, move the biggest disc, and move the n − 1 back on top: M(n) = 2M(n − 1) + 1, which gives M(n) = 2ⁿ − 1. For 13 discs that is 2¹³ − 1 = **8,191 moves**.`,
      data: { answer: { num: 8191 }, glyph: '2¹³' },
      concepts: ['recursion', 'binary'], tags: ['Hanoi']
    },
    {
      id: 'loyd-flying-bird', title: 'The Flying Bird', diff: 3,
      source: 'After Loyd\'s Cyclopedia (1914), "The Flying Bird".',
      text: `A bird sits on the floor of a **sealed glass box** with air inside, and the box stands on a very sensitive scale. The bird then takes off and flies round and round inside the box.\n\nWhile the bird is in the air, does the scale read **less** than when the bird was sitting on the floor?`,
      hints: ['The air in the box is part of what is being weighed. What must a flying bird do to the air to stay up?', 'To stay up the bird pushes air downwards with a force equal to its weight. Where does that air push?'],
      explain: `On average the scale reads **exactly the same**. To stay in the air the bird must push the air downwards with a force equal to its own weight, and that air pushes on the floor of the box, so the whole weight of the bird still reaches the scale, through the air. Only fleeting changes appear while the bird takes off, lands or dives. The box is sealed: nothing has left it.`,
      data: {
        answer: { choice: 1, choices: ['Yes: the flying bird\'s weight is off the floor, so the scale reads less', 'No: on average the reading does not change', 'Yes, but only if the bird hovers without moving', 'It reads more, because of the beating of its wings'] },
        traps: [{ match: 0, msg: 'Think about what the bird pushes on to stay up. The box is sealed, so the air pushes on the floor.' }],
        glyph: '🐦'
      },
      concepts: ['torque'], tags: ['physics']
    },
    {
      id: 'loyd-duck-shooting', title: 'Ten Ducks in Five Rows', diff: 3,
      links: ['loyd-scholar-six'],
      source: 'After Loyd\'s Cyclopedia (1914), "Duck Shooting at Buzzard\'s Bay" (ten points in five lines of four).',
      text: `Ten wooden ducks float on a pond, placed as in the picture. Loyd's puzzle: arrange ten ducks so that they make **five straight rows with four ducks in every row** (a duck may belong to two rows at once).\n\nIn the arrangement shown, what shape do the five straight rows make?`,
      hints: ['Five rows of four ducks make 20 places for only ten ducks: on average every duck sits in two rows. So the rows cross each other.', 'Five straight lines that all cross each other, each meeting the other four: what figure is that?'],
      explain: `The rows are the five straight strokes of a **five-pointed star**. The five outer ducks are the tips of the star, and the five inner ones lie where the strokes cross; every stroke passes through two tips and two crossings, so it holds four ducks. This is the neatest answer to the old "ten trees in five rows of four" puzzle.`,
      data: {
        answer: { choice: 1, choices: ['A pentagon, with the fifth row through the middle', 'A five-pointed star', 'Two crossed squares', 'A five-armed cross'] },
        traps: [{ match: 0, msg: 'A pentagon has five sides but only its corners can be ducks: two per side. Which figure has strokes that pass through four points each?' }],
        figure: { w: 400, h: 236, svg: starFig() },
        glyph: '★'
      },
      concepts: ['symmetry', 'combinatorics'], tags: ['points and lines', 'orchard']
    },
    {
      id: 'loyd-scholar-six', title: 'The Scholar\'s Puzzle', diff: 3,
      links: ['loyd-duck-shooting'],
      source: 'After Loyd\'s Cyclopedia (1914), "The Scholar\'s Puzzle" (six points in four lines of three).',
      text: `A scholar sets his pupils this puzzle: place **six** coins on the table so that they form as many **straight rows of three coins** as possible. (Three coins are in a row if a straight line passes through all three.)\n\nWhat is the largest number of rows of three that six coins can make?`,
      hints: ['A hexagon or a 2 × 3 block does not give many rows. Instead, think of lines first and coins second: a coin can sit where two lines cross.', 'Take four straight lines, no two parallel and no three through one point. Each pair meets in a point: how many points, and how many lines pass through each of the four lines\' points?'],
      explain: `The answer is **four**. Draw four straight lines, no two parallel and no three through one point: any two of them meet, which gives 6 points of crossing, and each line meets the other three in 3 of those points. Put a coin on each crossing and you have 6 coins in 4 rows of 3. (One way is to take the three sides of a triangle and one line cutting all three sides, extended if needed.) Five rows of three are impossible: two coins lie together in at most one row, a row of three uses up three of the 15 pairs that six coins make, and five rows would have to use every pair exactly once, which no six points can do.`,
      data: { answer: { num: 4 }, traps: [{ match: 3, msg: 'You can do better. Think about lines that cross each other, so that every coin belongs to two rows.' }, { match: 5, msg: 'Each row of three uses three of the 15 pairs of coins, and five rows would have to use every pair exactly once. That cannot be done with six points.' }], glyph: '4×3' },
      concepts: ['combinatorics'], tags: ['points and lines', 'orchard']
    },
    {
      id: 'loyd-watch-river', title: 'Why Is a Watch Like a River?', diff: 1,
      links: ['loyd-ship-lies', 'loyd-hens-peck'],
      source: SRC + ', a conundrum.',
      text: `A Victorian conundrum: **why is a watch like a river?**`,
      hints: ['Think of what a river does on its way to the sea, and of what you must do to a mechanical watch every day.', 'A river can wind. What does a watch need?'],
      explain: `Because a river **doesn't run long without winding**, and a watch doesn't either. The old joke rests on two meanings of "wind": to bend, and to tighten a spring.`,
      data: { answer: { text: ['winding', 'winds', 'wound', 'it needs winding', 'does not run long without winding'] }, glyph: '⌚' },
      concepts: ['lateral'], tags: ['pun', 'conundrum']
    },
    {
      id: 'loyd-ship-lies', title: 'The Honest Ship', diff: 1,
      links: ['loyd-watch-river', 'loyd-mother-barber'],
      source: SRC + ', a conundrum.',
      text: `A conundrum from the docks: **when does a ship tell a fib?**`,
      hints: ['The answer is a place and a verb. Where does a ship rest when it is not at sea?', 'A ship can lie in two senses.'],
      explain: `**When she lies at the wharf.** The verb "lie" can mean to rest and to tell an untruth, and a ship tied up at the dock lies in the first sense while sounding as if she does it in the second.`,
      data: { answer: { text: ['lies at the wharf', 'lies at the dock', 'lies at the quay', 'lies in port', 'at the wharf', 'lying at the wharf', 'lies'] }, glyph: '⚓' },
      concepts: ['lateral'], tags: ['pun', 'conundrum']
    },
    {
      id: 'loyd-mother-barber', title: 'The Mother and the Barber', diff: 2,
      links: ['loyd-hens-peck', 'loyd-washerwomen'],
      source: SRC + ', a conundrum.',
      text: `A conundrum: **what is the difference between a mother and a barber?**`,
      hints: ['Think about the tools of each trade, and about what each of them looks after.', 'A barber has razors to shave. What does a mother have to raise?'],
      explain: `The barber has **razors to shave**, while the mother has **shavers to raise**: a pun on "razors" and "raise", and on the word "shaver" for a small boy.`,
      data: { answer: { text: ['shavers', 'shavers to raise', 'she has shavers to raise', 'razors to shave and shavers to raise'] }, glyph: '✂' },
      concepts: ['lateral'], tags: ['pun', 'conundrum']
    },
    {
      id: 'loyd-hens-peck', title: 'The Economical Hen', diff: 2,
      links: ['loyd-mother-barber', 'loyd-candied-date'],
      source: SRC + ', a conundrum.',
      text: `A conundrum for the farmyard: **why are hens the most economical animals a farmer can keep?** (Think of what they eat and what they give.)`,
      hints: ['Think of what a hen does to grain, and of an old measure for grain that is two gallons.', 'For every grain they get, they give a...'],
      explain: `**For every grain they get, they give a peck**: "peck" is both an old measure of grain and what a hen does with her beak. So a hen seems to give back more than she is given.`,
      data: { answer: { text: ['a peck', 'peck', 'they give a peck', 'for every grain they give a peck'] }, glyph: '🐔' },
      concepts: ['lateral'], tags: ['pun', 'conundrum']
    },
    {
      id: 'loyd-washerwomen', title: 'The Great Travellers', diff: 2,
      links: ['loyd-candied-date', 'loyd-dublin'],
      source: SRC + ', a conundrum.',
      text: `A conundrum: **why are washerwomen such great travellers?** (Think of the washing on the line.)`,
      hints: ['Great travellers are said to cross something and to go from one place to another far away.', 'Washing hangs on a line, between two posts or poles.'],
      explain: `Because they are always **crossing the line** and going **from pole to pole**: a traveller crosses the equator and travels from the North Pole to the South Pole, while the washerwoman crosses her clothes-line and moves from post to post.`,
      data: { answer: { text: ['crossing the line', 'they cross the line', 'crossing the line and running from pole to pole', 'from pole to pole', 'pole to pole', 'the clothes line', 'clothes line'] }, glyph: '👚' },
      concepts: ['lateral'], tags: ['pun', 'conundrum']
    },
    {
      id: 'loyd-candied-date', title: 'A Sweetmeat for Office', diff: 2,
      links: ['loyd-washerwomen', 'loyd-back-seat'],
      source: SRC + ', a conundrum.',
      text: `A conundrum: **what sweet is like a man who is put forward for an office?**`,
      hints: ['It is a fruit that is covered with sugar. And what is a man put up for election called?', 'Say the name of the man put forward for election slowly, in two halves.'],
      explain: `**The candied date**: a sugared date, and the sound of "candidate".`,
      data: { answer: { text: ['candied date', 'a candied date', 'the candied date', 'candidate', 'candied fruit'] }, glyph: '🍬' },
      concepts: ['lateral'], tags: ['pun', 'conundrum']
    },
    {
      id: 'loyd-dublin', title: 'The Richest Country', diff: 2,
      links: ['loyd-back-seat', 'loyd-chimney'],
      source: SRC + ', a conundrum.',
      text: `A conundrum: **why is Ireland likely to become the richest country in the world?** (Hint: think of its capital.)`,
      hints: ['What is the capital of Ireland? What can money do that makes a person rich?', 'The capital city sounds like an action money can do over and over again.'],
      explain: `Because its **capital is always doubling**: the capital, Dublin, sounds like "doubling", and money that doubles makes its owner rich very fast.`,
      data: { answer: { text: ['doubling', 'dublin', 'its capital is always doubling', 'its capital is always doubling dublin', 'the capital is always doubling', 'capital doubling', 'capital is always doubling'] }, glyph: '☘' },
      concepts: ['lateral'], tags: ['pun', 'conundrum']
    },
    {
      id: 'loyd-back-seat', title: 'Never Tell a Man to Take a Back Seat', diff: 2,
      links: ['loyd-dublin', 'loyd-heir'],
      source: SRC + ', a conundrum.',
      text: `A conundrum about manners: **why should you never tell a man to take a back seat?**`,
      hints: ['The seat at the back is the opposite of the seat at the front, and the joke is about what he might do about it.', 'He may take a seat, or he may take something else, that sounds like "a front".'],
      explain: `Because he will be likely to **take affront**: "affront" is an insult, and it sounds like **a front** seat, the opposite of the back one you offered.`,
      data: { answer: { text: ['affront', 'take affront', 'a front', 'he will take affront', 'he will take a front seat', 'a front seat', 'take a front seat'] }, glyph: '💺' },
      concepts: ['lateral'], tags: ['pun', 'conundrum']
    },
    {
      id: 'loyd-chimney', title: 'The Agreeable Business', diff: 2,
      links: ['loyd-heir', 'loyd-roll-in-bed'],
      source: SRC + ', a conundrum.',
      text: `A conundrum: **why must chimney sweeping be a very agreeable business?**`,
      hints: ['The answer is about something every sweep has all over him, and about how the job fits a person.', 'A sweep gets covered in soot. What does a job that fits you well do, and how does it sound?'],
      explain: `Because **it suits everyone who tries it**: the sweep's trade "suits" everybody, and it also "soots" them, since sweeps end up covered in soot.`,
      data: { answer: { text: ['it suits everyone', 'suits everyone', 'it suits everyone who tries it', 'soots', 'it soots everyone', 'suits', 'it suits them'] }, glyph: '🧹' },
      concepts: ['lateral'], tags: ['pun', 'conundrum']
    },
    {
      id: 'loyd-heir', title: 'The Chocolate Cake', diff: 2,
      links: ['loyd-chimney', 'loyd-roll-in-bed'],
      source: SRC + ', a conundrum.',
      text: `A conundrum for a parent: **what becomes of the chocolate cake when your only son eats it?**`,
      hints: ['The answer is a place, and the place is where the cake goes: think of it disappearing.', 'A son who will inherit the family property is called by another word that sounds like this place.'],
      explain: `It **vanishes into thin air** (**heir**): an only son is the heir, and "heir" sounds like "air". The cake disappears into the air in the same way.`,
      data: { answer: { text: ['heir', 'air', 'thin air', 'into thin air', 'vanishes into thin air', 'into the air', 'empty air', 'into the empty air', 'it vanishes into thin air'] }, glyph: '🍰' },
      concepts: ['lateral'], tags: ['pun', 'conundrum']
    },
    {
      id: 'loyd-roll-in-bed', title: 'Breakfast Before Rising', diff: 2,
      links: ['loyd-heir', 'loyd-watch-river'],
      source: SRC + ', a conundrum.',
      text: `A conundrum: **when may a man be said to breakfast before he gets up?**`,
      hints: ['Breakfast is bread, of a certain kind. What do you take, or turn over, in bed?', 'A small round loaf is a kind of...'],
      explain: `**When he takes a roll in bed.** A roll is a small loaf, and to take a roll in bed is also to turn over.`,
      data: { answer: { text: ['takes a roll in bed', 'a roll in bed', 'roll in bed', 'when he takes a roll in bed', 'he takes a roll in bed'] }, glyph: '🥖' },
      concepts: ['lateral'], tags: ['pun', 'conundrum']
    }
  ].sort(function (a, b) { return a.diff - b.diff; })); // easiest first (the sort is stable)

  Cabinet.history([
    { year: 1896, title: 'Get Off the Earth', text: 'Sam Loyd patents a vanishing puzzle: thirteen swordsmen round a disc, and after a slight turn only twelve. Sold as a novelty and handed out as a campaign card in the presidential election of that year, it is among the best known of Loyd\'s novelties.', links: ['loyd-get-off-earth', 'loyd'] },
    { year: 1903, title: 'The Eighth Book of Tan', text: 'Sam Loyd publishes a tale of the wise Tan, who is said to have invented the tangram four thousand years ago. It is a hoax: no earlier tangram than the early 1800s is known.', links: ['loyd-tan-hoax', 'tangram'] }
  ]);
})();
