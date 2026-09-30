/* The Puzzle Cabinet · data/number-riddles.js
 * The classics of arithmetic and counting: ages, ponds, snails, handshakes, clocks, tricks of the digits.
 * All statements are written afresh; the puzzles themselves are old, and where a source is known it is credited. */
(function () {
  const INK = '#3a3020', RED = '#b0472f', BLUE = '#3a6ea5', GREEN = '#5a8a3a';
  const FONT = 'font-family="Georgia,serif"';
  const list = [

    /* ---------- the first-answer traps ---------- */
    {
      id: 'num-fence-posts', title: 'Posts Along the Fence', diff: 1,
      text: 'A straight fence is **100 metres** long. There is a post every **10 metres**, and there are posts at both ends.\n\nHow many posts are there?',
      hints: ['Try a shorter fence first: 30 metres, with a post every 10 metres.', 'Count the posts, not the gaps between them.'],
      explain: 'The 100 metres are cut into **10 gaps**, but with a post at both ends there is one more post than gaps: **11 posts**. This is the “fence-post error”, the commonest mistake in counting: the number of *things* and the number of *gaps between them* differ by one.',
      data: { answer: { num: 11 }, traps: [{ match: 10, msg: 'That is the number of gaps. With a post at both ends there is one more post than gaps.' }], glyph: '11' },
      concepts: ['sequence'], links: ['num-clock-strikes']
    },
    {
      id: 'num-clock-strikes', title: 'The Slow Striking Clock', diff: 2,
      text: 'A clock strikes six o’clock, and it takes **5 seconds** from the first stroke to the last.\n\nHow long does it take to strike **twelve**?',
      hints: ['The time is measured between strokes: how many gaps are there in six strokes?', 'If 5 gaps take 5 seconds, each gap is 1 second.'],
      explain: 'Six strokes have 5 gaps, so each gap is 1 second. Twelve strokes have 11 gaps: **11 seconds**, not 10. Time is spent in the gaps, not on the strokes.',
      data: { answer: { num: 11, unit: 'seconds' }, traps: [{ match: 10, msg: 'That doubles the strokes, but the time is in the gaps: 11 gaps for 12 strokes.' }], glyph: '🕕' },
      concepts: ['sequence'], links: ['num-fence-posts']
    },
    {
      id: 'num-bat-ball', title: 'The Bat and the Ball', diff: 2,
      source: 'A modern classic; psychologists use it, with the lily pond and the widget machines, to see whether you stop to check your first answer.',
      text: 'A bat and a ball cost **$1.10** together. The bat costs **$1.00 more** than the ball.\n\nHow much does the ball cost?',
      ask: 'How many **cents** does the ball cost?',
      hints: ['If the ball cost 10 cents, how much would the bat cost, and what would the two cost together?', 'Let the ball cost b. Then the bat costs b + 100, and together b + b + 100 = 110.'],
      explain: 'If the ball is 5 cents, the bat is $1.05 and together they cost $1.10. The ball costs **5 cents**. The tempting 10 cents fails the test: then the bat would be $1.10 and the pair $1.20.',
      data: { answer: { num: 5, unit: 'cents' }, traps: [{ match: 10, msg: 'That is the famous trap. If the ball cost 10 cents, the bat would cost $1.10, and together they would cost $1.20.' }], glyph: '5¢' },
      concepts: ['working-backwards'], links: ['num-brick']
    },
    {
      id: 'num-brick', title: 'A Brick and Half a Brick', diff: 2,
      text: 'A brick weighs **1 kilogram plus half a brick**.\n\nHow many kilograms does a whole brick weigh?',
      hints: ['If a brick were 1½ kg, half of it would be ¾ kg, and 1 + ¾ is not 1½.', 'Half a brick plus 1 kg is a whole brick, so half a brick is 1 kg.'],
      explain: 'The brick equals 1 kg plus another half-brick, so the *other* half-brick is exactly the 1 kg: a whole brick is **2 kg**. The tempting 1½ kg treats “half a brick” as the extra half a kilogram.',
      data: { answer: { num: 2, unit: 'kg' }, traps: [{ match: 1.5, msg: 'Then half a brick would be ¾ kg, and 1 + ¾ is not 1½.' }], glyph: '🧱' },
      concepts: ['working-backwards'], links: ['num-bat-ball']
    },
    {
      id: 'num-machines', title: 'Five Machines, Five Widgets', diff: 2,
      source: 'A modern classic (a favourite of psychologists who study snap judgements).',
      text: 'Five machines make five widgets in five minutes.\n\nHow many minutes do **100 machines** take to make **100 widgets**?',
      hints: ['How long does one machine take to make one widget?', 'If 5 machines make 5 widgets in 5 minutes, each machine makes a widget in those 5 minutes.'],
      explain: 'Each machine makes one widget in 5 minutes. A hundred machines, working side by side, make 100 widgets in **5 minutes**. The tempting answer of 100 assumes that more widgets must mean more time, forgetting that there are more machines too.',
      data: { answer: { num: 5, unit: 'minutes' }, traps: [{ match: 100, msg: 'The 100 machines work at the same time. How long does each one need for its widget?' }], glyph: '⚙' },
      concepts: ['rates']
    },
    {
      id: 'num-lily', title: 'The Lily Pond', diff: 2,
      source: 'A modern classic of the “surprising doubling” type.',
      text: 'A patch of water lilies grows on a pond, and it **doubles** in size every day. On the **48th day** it covers the whole pond.\n\nOn which day does it cover **half** of the pond?',
      hints: ['If the patch doubles each day, what was it the day before the whole pond was covered?', 'Think backwards from day 48.'],
      explain: 'The day before a doubling patch fills the pond, it covers half of it: **day 47**. Halving is the same as going back one day, which is why growth that doubles is so deceptive: for most of its life the patch looks small, and then almost the whole pond is covered in a day or two.',
      data: {
        answer: { num: 47 }, traps: [{ match: 24, msg: 'That would be so if the patch grew by the same area each day. This one doubles.' }], glyph: '🪷',
        figure: {
          w: 400, h: 190,
          svg: (function () {
            let s = '';
            [70, 200, 330].forEach(function (cx, i) {
              s += '<ellipse cx="' + cx + '" cy="90" rx="56" ry="42" fill="#d5e3f0" stroke="' + BLUE + '" stroke-width="3"/>';
              if (i === 0) s += '<circle cx="' + (cx - 20) + '" cy="96" r="6" fill="#7fb05a" stroke="' + GREEN + '" stroke-width="2"/>';
              if (i === 1) s += '<path d="M' + cx + ' 48 A56 42 0 0 0 ' + cx + ' 132 Z" fill="#7fb05a" stroke="' + GREEN + '" stroke-width="2" opacity="0.85"/>';
              if (i === 2) s += '<ellipse cx="' + cx + '" cy="90" rx="56" ry="42" fill="#7fb05a" stroke="' + GREEN + '" stroke-width="2" opacity="0.85"/>';
            });
            s += '<text x="70" y="160" text-anchor="middle" font-size="15" ' + FONT + ' fill="' + INK + '">day 1</text><text x="200" y="160" text-anchor="middle" font-size="18" ' + FONT + ' fill="' + RED + '">day ?</text><text x="330" y="160" text-anchor="middle" font-size="15" ' + FONT + ' fill="' + INK + '">day 48</text>';
            return s;
          })()
        }
      },
      concepts: ['geometric-series', 'working-backwards'], links: ['num-penny-doubling', 'num-sissa-chess']
    },
    {
      id: 'num-snail', title: 'The Snail in the Well', diff: 2,
      text: 'A snail is at the bottom of a well **10 metres** deep. Each day it climbs **3 metres**, and each night it slips back **2 metres**.\n\nOn which **day** does the snail get out?',
      hints: ['After each full day and night it gains just 1 metre.', 'What happens on the last day: does it slip back after it reaches the top?'],
      explain: 'By the morning of day 8 the snail has climbed to 7 metres. During day 8 it climbs 3 more and reaches 10 metres, the top — and does not slip back, since it has already got out. So it emerges on **day 8**, not day 10. The trick is to stop counting when the snail reaches the edge, not at the end of the day.',
      data: {
        answer: { num: 8 }, traps: [{ match: 10, msg: 'It gains 1 metre net per day — but not on the last day, when it reaches the top before the night comes.' }], glyph: '🐌',
        figure: {
          w: 400, h: 226,
          svg: (function () {
            let s = '<rect x="150" y="26" width="100" height="180" fill="#e9dfc4" stroke="' + INK + '" stroke-width="4"/><line x1="100" y1="26" x2="150" y2="26" stroke="' + GREEN + '" stroke-width="6"/><line x1="250" y1="26" x2="300" y2="26" stroke="' + GREEN + '" stroke-width="6"/>';
            for (let k = 1; k < 10; k++) s += '<line x1="150" y1="' + (26 + k * 18) + '" x2="' + (k % 5 === 0 ? 162 : 156) + '" y2="' + (26 + k * 18) + '" stroke="' + INK + '" stroke-width="2"/>';
            s += '<text x="140" y="31" text-anchor="end" font-size="13" ' + FONT + ' fill="' + INK + '">10 m</text><text x="140" y="121" text-anchor="end" font-size="13" ' + FONT + ' fill="' + INK + '">5</text><text x="140" y="205" text-anchor="end" font-size="13" ' + FONT + ' fill="' + INK + '">0</text>';
            s += '<ellipse cx="205" cy="196" rx="16" ry="7" fill="#c9b48a" stroke="' + INK + '" stroke-width="2"/><circle cx="200" cy="184" r="9" fill="#d9a520" stroke="' + INK + '" stroke-width="2"/><path d="M220 192 L230 182" stroke="' + INK + '" stroke-width="2"/>';
            s += '<path d="M275 180 L275 100" stroke="' + GREEN + '" stroke-width="3"/><path d="M270 108 L275 98 L280 108" fill="' + GREEN + '"/><text x="285" y="145" font-size="13" ' + FONT + ' fill="' + GREEN + '">+3 by day</text><path d="M330 110 L330 156" stroke="' + RED + '" stroke-width="3"/><path d="M325 148 L330 158 L335 148" fill="' + RED + '"/><text x="290" y="176" font-size="13" ' + FONT + ' fill="' + RED + '">−2 by night</text>';
            return s;
          })()
        }
      },
      concepts: ['rates'], links: ['num-lily']
    },
    {
      id: 'num-handshakes', title: 'Ten People, One Handshake Each', diff: 2,
      text: 'Ten people meet at a party, and **everyone shakes hands once with everyone else**.\n\nHow many handshakes are there in all?',
      hints: ['Each person shakes hands with 9 others. But a handshake involves two people.', 'Count 10 × 9 and divide by 2.'],
      explain: 'Each of the 10 people shakes 9 hands, which gives 10 × 9 = 90 — but each handshake has been counted twice, once by each of the two people. So there are 90 ÷ 2 = **45** handshakes. The same count 1 + 2 + … + 9 = 45 turns up whenever things are paired: the diagonals of a polygon, matches in a league, roads between towns.',
      data: { answer: { num: 45 }, traps: [{ match: 90, msg: 'That counts every handshake twice, once from each side.' }, { match: 100, msg: 'Nobody shakes their own hand, and each handshake is counted twice in 10 × 10.' }], glyph: '🤝' },
      concepts: ['combinatorics'], links: ['num-diagonals', 'num-tennis']
    },
    {
      id: 'num-tennis', title: 'The Knockout Tournament', diff: 2,
      text: 'A hundred players enter a knockout tennis tournament: those who lose are out, and there are as many rounds as needed (some players may get a walkover when the numbers are odd).\n\nHow many **matches** must be played to find the winner?',
      hints: ['Don’t follow the rounds; follow the losers.', 'Each match sends exactly one player home.'],
      explain: 'The winner must be the only one left, so **99** players must lose — and each match produces exactly one loser. So there are 99 matches, whatever the draw looks like. It is the fastest way to solve it: count what disappears, not what happens.',
      data: { answer: { num: 99 }, traps: [{ match: 50, msg: 'That is the first round only. The winners still have to play each other.' }], glyph: '🎾' },
      concepts: ['invariant'], links: ['num-handshakes']
    },
    {
      id: 'num-nines', title: 'How Many Nines?', diff: 2,
      text: 'You write down all the whole numbers from **1 to 100**.\n\nHow many times do you write the digit **9**?',
      hints: ['Count the 9s in the units place, then those in the tens place.', 'Don’t count 99 only once.'],
      explain: 'The digit 9 is in the units place of 9, 19, 29, …, 99: **10** numbers. It is in the tens place of 90 to 99: another **10**. And 99 has both, so it counts twice: **20** in all. The usual answer is 19, from counting numbers that contain a 9 rather than the number of 9s.',
      data: { answer: { num: 20 }, traps: [{ match: 19, msg: 'Nearly: 99 contains two 9s, and you have counted it only once.' }, { match: 10, msg: 'That is the units place only. What about 90 to 99?' }], glyph: '9' },
      concepts: ['combinatorics'], links: ['num-ones-1000']
    },
    {
      id: 'num-book-digits', title: 'Numbering the Pages', diff: 2,
      text: 'A printer numbers the pages of a book from 1 to **100**, and has to set every digit in type.\n\nHow many digits does he have to set?',
      hints: ['Pages 1 to 9 need one digit each. Pages 10 to 99 need two.', 'Don’t forget page 100.'],
      explain: 'Pages 1–9: 9 digits. Pages 10–99: 90 pages × 2 = 180 digits. Page 100: 3 digits. In all 9 + 180 + 3 = **192** digits. The usual trap is to say 200, by thinking of all pages as two-digit numbers.',
      data: { answer: { num: 192 }, traps: [{ match: 200, msg: 'That treats every page as two digits. Pages 1–9 have one and page 100 has three.' }, { match: 189, msg: 'That stops at page 99. Page 100 needs its three digits too.' }], glyph: '📖' },
      concepts: ['combinatorics'], links: ['num-pages-1002']
    },
    {
      id: 'num-cyclist-fly', title: 'The Cyclists and the Fly', diff: 2,
      source: 'A classic that is often told of the mathematician John von Neumann, who is said to have answered at once and, asked whether he had noticed the trick, said he had summed the series.',
      text: 'Two cyclists start **30 km apart** and ride straight towards each other, each at **15 km/h**. At the same moment a fly leaves the handlebars of one of them and flies to the other cyclist at **40 km/h**, then back to the first, then back again, and so on until the cyclists meet.\n\nHow far, in kilometres, does the fly fly in total?',
      hints: ['Don’t follow the fly’s zigzag. How long do the cyclists ride before they meet?', 'Then ask how far a fly at 40 km/h flies in that time.'],
      explain: 'The cyclists close the gap at 15 + 15 = 30 km/h, so they meet after **1 hour**. In that hour the fly, at 40 km/h, flies **40 km**. You *can* add up the infinite series of shorter and shorter zigzags, and you will get 40, but the time trick is a great deal quicker.',
      data: { answer: { num: 40, unit: 'km' }, traps: [{ match: 30, msg: 'That is the distance between the cyclists, not the distance the fly flies.' }], glyph: '🪰' },
      concepts: ['rates', 'geometric-series'], links: ['num-two-trains']
    },
    {
      id: 'num-two-trains', title: 'Where the Trains Meet', diff: 1,
      text: 'A train leaves town A for town B at **60 km/h**. At the same moment another train leaves B for A at **40 km/h**, on the same line (there is a loop where they pass).\n\nWhen they pass each other, which train is **nearer to town A**?',
      hints: ['At the moment they meet, where are the two trains?', 'They are side by side.'],
      explain: 'They are at the same place: **both are equally near to A**. It is the “what did the question actually ask?” trap. The faster train has come further, but at the moment they pass each other they are at the very same point of the line.',
      data: {
        answer: { choice: 2, choices: ['The faster train', 'The slower train', 'Both are at the same distance: they are at the same place', 'It depends on how far apart the towns are'] },
        traps: [{ match: 0, msg: 'It has come further — but the question asks about the moment when they pass each other.' }],
        glyph: '🚆'
      },
      concepts: ['rates'], links: ['num-cyclist-fly']
    },
    {
      id: 'num-father-son', title: 'Four Times, Then Twice', diff: 2,
      text: 'A father is **four times** as old as his son. In **20 years** he will be only **twice** as old as his son.\n\nHow old is the son now?',
      hints: ['Call the son’s age s: the father is 4s. In 20 years they are s + 20 and 4s + 20.', 'The equation is 4s + 20 = 2(s + 20).'],
      explain: '4s + 20 = 2s + 40 gives 2s = 20 and s = **10**. The father is 40 now; in 20 years they will be 30 and 60. The ratio falls because the same 20 years is a big fraction of the son’s age and a smaller one of his father’s.',
      data: { answer: { num: 10, unit: 'years' }, traps: [{ match: 40, msg: 'That is the father’s age. How old is the son?' }], glyph: '10' },
      concepts: ['working-backwards'], links: ['num-ages-twice']
    },
    {
      id: 'num-percent-up-down', title: 'Up 20, Down 20', diff: 2,
      text: 'A price of **100** is raised by **20 %**. Then the new price is lowered by **20 %**.\n\nWhat is the final price?',
      hints: ['The second 20 % is taken from the new price, not the old.', '20 % of 120 is 24.'],
      explain: 'After the rise the price is 120; a fall of 20 % of 120 is 24, leaving **96**. A percentage fall does not undo the same percentage rise, because the second is a percentage of a bigger number. (To undo a rise of 20 % you need to cut by one sixth, 16⅔ %.)',
      data: { answer: { num: 96 }, traps: [{ match: 100, msg: 'The second 20 % is 20 % of 120, not of 100.' }], glyph: '%' },
      concepts: ['rates'], links: ['num-two-discounts']
    },
    {
      id: 'num-two-discounts', title: 'Two Discounts', diff: 2,
      text: 'A shop takes **25 %** off a shirt that cost **$80**, and then, at the till, takes another **20 %** off the reduced price.\n\nWhat do you pay?',
      hints: ['Do the discounts one at a time: the second is applied to the price after the first.', 'After 25 % off the shirt costs $60.'],
      explain: 'After 25 % off, the shirt is $60; 20 % off $60 is $12, so you pay **$48**. Two discounts of 25 % and 20 % do *not* make 45 % (that would give $44); they multiply: 0.75 × 0.80 = 0.60, a total discount of 40 %.',
      data: { answer: { num: 48 }, traps: [{ match: 44, msg: 'That takes 45 % off in one go. The second discount applies to the already reduced price.' }], glyph: '$48' },
      concepts: ['rates'], links: ['num-percent-up-down']
    },
    {
      id: 'num-penny-doubling', title: 'A Penny Doubled', diff: 2,
      text: 'On the first day you are given **1 cent**. On each following day you are given **twice** what you were given the day before.\n\nOn the **30th day**, roughly how many **millions of dollars** do you receive that day? (100 cents = 1 dollar.)',
      ask: 'Give the number of millions of dollars, to two decimals.',
      hints: ['On day 30 you receive 2²⁹ cents. Remember that 2¹⁰ = 1024, close to 1000.', '2²⁹ = 2⁹ × 2²⁰ = 512 × 1 048 576 cents.'],
      explain: 'On day 30 you get 2²⁹ = 536 870 912 cents, or **$5 368 709.12** — about 5.37 million dollars, from a starting gift of one cent. Doubling is quick, and the sums after the twentieth day begin to look like a national budget.',
      data: { answer: { num: 5.37, tol: 0.006, unit: 'million dollars' }, glyph: '¢' },
      concepts: ['geometric-series'], links: ['num-lily', 'num-sissa-chess']
    },
    {
      id: 'num-weekday', title: 'A Thousand Days from Thursday', diff: 2,
      text: 'Today is **Thursday**.\n\nWhat day of the week will it be **1000 days** from now?',
      hints: ['The days of the week repeat every 7 days. How many whole weeks are there in 1000 days?', '1000 = 7 × 142 + 6. Count 6 days on from Thursday.'],
      explain: '1000 = 142 × 7 + 6, so after 142 whole weeks there are 6 days left over, and 6 days after Thursday is **Wednesday** (one day before Thursday, since going on 6 is the same as going back 1). Clock arithmetic: only the remainder mod 7 matters.',
      data: {
        answer: { choice: 3, choices: ['Thursday', 'Friday', 'Tuesday', 'Wednesday'] },
        traps: [{ match: 0, msg: 'That would need a multiple of 7 days. 1000 is not one.' }],
        glyph: '1000'
      },
      concepts: ['modular'], links: ['num-last-digit']
    },
    {
      id: 'num-multiply-11', title: 'Times Eleven at a Glance', diff: 1,
      text: 'There is a trick for multiplying a two-digit number by 11: write the two digits with **their sum in the middle**. So 34 × 11 = 3 | 3 + 4 | 4 = 374. If the sum is 10 or more, carry the tens.\n\nUse the trick for **67 × 11**.',
      hints: ['6 | 6 + 7 | 7 = 6 | 13 | 7.', 'Carry the 1 of the 13 into the 6.'],
      explain: '6 | 13 | 7 becomes 6 + 1 = 7, then 3, then 7: **737**. Why it works: 67 × 11 = 67 × 10 + 67 = 670 + 67, and adding the digits column by column gives the digit sum in the middle.',
      data: { answer: { num: 737 }, glyph: '×11' }
    },
    {
      id: 'num-square-five', title: 'Squaring a Number Ending in 5', diff: 1,
      text: 'A number ending in 5 can be squared in a moment: take the digits before the 5, multiply them by the next whole number, and write 25 at the end. For example, 35² = (3 × 4) | 25 = 1225.\n\nUse it to find **85²**.',
      hints: ['The digits before the 5 are just 8.', '8 × 9 = 72, then write 25 after it.'],
      explain: '8 × 9 = 72, then 25: **7225**. It works because (10a + 5)² = 100a² + 100a + 25 = 100a(a + 1) + 25.',
      data: { answer: { num: 7225 }, glyph: '5²' }
    },
    {
      id: 'num-97-103', title: '97 Times 103', diff: 2,
      text: 'Calculate **97 × 103** in your head, without long multiplication. (Both numbers are close to 100.)',
      hints: ['97 = 100 − 3 and 103 = 100 + 3.', 'Use (a − b)(a + b) = a² − b².'],
      explain: '(100 − 3)(100 + 3) = 100² − 3² = 10 000 − 9 = **9991**. This “difference of two squares” pattern is one of the oldest tricks of mental arithmetic, and it turns up in Euclid’s geometry.',
      data: { answer: { num: 9991 }, glyph: '9991' },
      concepts: ['area']
    },
    {
      id: 'num-odd-sum', title: 'Adding the Odd Numbers', diff: 2,
      text: 'Add the first fifty odd numbers: **1 + 3 + 5 + 7 + … + 99**.\n\nWhat is the total?',
      hints: ['Try the first few: 1, 1 + 3, 1 + 3 + 5, 1 + 3 + 5 + 7.', 'The totals are square numbers.'],
      explain: '1, 4, 9, 16, … The sum of the first n odd numbers is n², and here n = 50, so the total is 50² = **2500**. A square of side n can be built by adding an L-shaped border of 2n − 1 blocks at a time, which is why each odd number appears.',
      data: { answer: { num: 2500 }, traps: [{ match: 4950, msg: 'That is the sum of *all* the numbers from 1 to 99, odd and even together.' }], glyph: '50²' },
      concepts: ['sequence'], links: ['num-consecutive']
    },
    {
      id: 'num-consecutive', title: 'Five in a Row', diff: 2,
      text: 'Five **consecutive whole numbers** add up to **2015**.\n\nWhat is the **largest** of the five?',
      hints: ['The middle of five consecutive numbers is their average.', '2015 ÷ 5 = 403.'],
      explain: 'The middle number is the average, 2015 ÷ 5 = 403, so the five numbers are 401, 402, 403, 404 and **405**. The average trick works for any odd number of consecutive numbers.',
      data: { answer: { num: 405 }, traps: [{ match: 403, msg: 'That is the middle number. Which is the largest?' }], glyph: '5' },
      concepts: ['sequence']
    },
    {
      id: 'num-squares-99', title: 'Squares 99 Apart', diff: 2,
      text: 'Two **consecutive** whole numbers have squares that differ by **99**.\n\nWhat are the two numbers?',
      ask: 'Write the two numbers separated by a comma.',
      hints: ['(n + 1)² − n² = 2n + 1.', 'So 2n + 1 = 99.'],
      explain: '(n + 1)² − n² = 2n + 1, and 2n + 1 = 99 gives n = 49: the numbers are **49 and 50**. Check: 2500 − 2401 = 99. Successive squares always differ by the successive odd numbers.',
      data: { answer: { nums: [49, 50] }, glyph: '49·50' },
      concepts: ['sequence'], links: ['num-odd-sum']
    },
    {
      id: 'num-product-sum', title: 'Product Equals Sum', diff: 2,
      text: 'Find three **different positive whole numbers** whose **product** is equal to their **sum**.',
      ask: 'Write the three numbers separated by commas.',
      hints: ['Start with the number 1: it does not change a product.', 'Try 1, 2 and something.'],
      explain: '**1, 2, 3**: 1 × 2 × 3 = 6 = 1 + 2 + 3. It is the only answer with three different positive whole numbers: if the smallest is 1 and the other two are a and b, then ab = a + b + 1, so (a − 1)(b − 1) = 2, which forces a = 2 and b = 3.',
      data: { answer: { nums: [1, 2, 3] }, glyph: '1·2·3' },
      concepts: ['diophantine']
    },
    {
      id: 'num-leap-years', title: 'How Many Leap Years?', diff: 2,
      text: 'The Gregorian calendar has a leap year every 4 years, **except** in years divisible by 100, which are only leap years if also divisible by 400. So 1900 was not a leap year, but 2000 was.\n\nHow many leap years are there from **1900 to 2000**, both included?',
      hints: ['Count the multiples of 4 from 1900 to 2000, then take away the exceptions.', '1900, 1904, …, 2000 are 26 multiples of 4.'],
      explain: 'From 1900 to 2000 there are 26 multiples of 4, but 1900 is not a leap year (divisible by 100, not by 400): so **25** leap years, and 2000 is one of them. Pope Gregory XIII’s reform of 1582 introduced this rule to stop the calendar drifting away from the seasons.',
      data: { answer: { num: 25 }, traps: [{ match: 26, msg: 'Remember that 1900 is not a leap year.' }], glyph: '366' },
      concepts: ['modular']
    },
    {
      id: 'num-1089', title: 'The 1089 Trick', diff: 2,
      text: 'Choose a three-digit number whose first and last digits differ by at least 2 (for example 832). Reverse it (238), and subtract the smaller from the larger (832 − 238 = 594). Now reverse **that** (495) and add the two: 594 + 495.\n\nWhatever number you started with, you always end up with the same result. What is it?',
      hints: ['Try it with a second number of your own, for example 521: 521 − 125 = 396, then 396 + 693.', 'The answer is a number between 1000 and 1100.'],
      explain: 'The answer is always **1089**. If the first and last digits differ by d (at least 2), the subtraction gives 99 × d, a number with 9 in the middle and outer digits that add up to 9 (like 594 or 396). Adding that to its own reversal gives 900 + 180 + 9 = 1089, whatever d was. It is a favourite magic trick because nobody suspects how tightly the numbers are being pulled together.',
      data: { answer: { num: 1089 }, glyph: '1089' },
      concepts: ['invariant']
    },

    /* ---------- counting ---------- */
    {
      id: 'num-ones-1000', title: 'Ones from One to a Thousand', diff: 3,
      text: 'You write out all the whole numbers from **1 to 1000**.\n\nHow many times do you write the digit **1**?',
      hints: ['Count separately how often 1 appears as the units digit, the tens digit and the hundreds digit.', 'Among the numbers 000 to 999, each digit position holds each digit equally often.'],
      explain: 'Among 000–999 each of the three places holds a 1 in exactly 100 numbers, so 3 × 100 = 300 ones. Then 1000 adds one more: **301**. The digit 1 is written 301 times, and the same is true for each of 2 to 9 up to 999 (300 times each).',
      data: { answer: { num: 301 }, traps: [{ match: 300, msg: 'Nearly — the number 1000 itself has a 1 in it.' }], glyph: '301' },
      concepts: ['combinatorics'], links: ['num-nines']
    },
    {
      id: 'num-digit-sum-100', title: 'The Sum of All the Digits', diff: 3,
      text: 'You write out the numbers from **1 to 100** and add up **every digit** you have written (so 10 counts as 1 + 0, and 100 as 1 + 0 + 0).\n\nWhat is the total?',
      hints: ['Think of 00, 01, 02, …, 99 as pairs of digits: how many times does each digit 0–9 appear in each place?', 'Each digit appears 10 times in each of the two places.'],
      explain: 'In 00–99, each digit 0–9 appears 10 times in the units place and 10 times in the tens place. The digits 0 to 9 add up to 45, so the total is 20 × 45 = 900. Then 100 adds 1: **901**. Gauss’s trick in another guise.',
      data: { answer: { num: 901 }, traps: [{ match: 900, msg: 'Nearly — you have forgotten the number 100.' }, { match: 5050, msg: 'That is the sum of the numbers themselves. We are adding the digits.' }], glyph: '901' },
      concepts: ['combinatorics', 'sequence'], links: ['num-nines', 'num-ones-1000']
    },
    {
      id: 'num-pages-1002', title: 'A Book of 1002 Digits', diff: 3,
      text: 'A printer sets the page numbers of a book, 1, 2, 3, … up to the last page, and finds that he has used exactly **1002 digits** in all.\n\nHow many pages does the book have?',
      hints: ['Pages 1–9 use 9 digits, pages 10–99 use 180 more.', 'That is 189 digits so far. The rest are used by three-digit pages.'],
      explain: 'Pages 1–99 need 9 + 180 = 189 digits. The other 1002 − 189 = 813 digits are three-digit pages, and 813 ÷ 3 = 271 of them: pages 100 to 370. So the book has **370 pages**.',
      data: { answer: { num: 370 }, glyph: '370' },
      concepts: ['combinatorics'], links: ['num-book-digits']
    },
    {
      id: 'num-sissa-chess', title: 'Rice on the Chessboard', diff: 3,
      source: 'The legend of the inventor of chess, told in Arabic and Persian books from the Middle Ages.',
      text: 'The legend says that the inventor of chess asked the king for a reward of rice: one grain on the first square of the board, two on the second, four on the third, and so on, **doubling** on each of the 64 squares.\n\nThe total number of grains is 2⁶⁴ − 1. How many **digits** does this number have?',
      hints: ['2¹⁰ = 1024 is close to 10³.', '2⁶⁴ = 2⁴ × (2¹⁰)⁶, and that is about 16 × 10¹⁸.'],
      explain: '2⁶⁴ − 1 = 18 446 744 073 709 551 615, a number with **20 digits** — about 1.8 × 10¹⁹ grains, which weigh several hundred billion tonnes: many hundreds of times the whole world’s yearly rice harvest. In the story the king, when he understood, either laughed or paid with his head, depending on the teller.',
      data: { answer: { num: 20 }, traps: [{ match: 19, msg: 'A number of the order of 10¹⁹ has 20 digits.' }], glyph: '2⁶⁴' },
      concepts: ['geometric-series'], links: ['num-lily', 'num-penny-doubling']
    },
    {
      id: 'num-pizza', title: 'Slicing the Pizza', diff: 3,
      text: 'You are allowed **5 straight cuts** through a round pizza, and you may place them anywhere you like.\n\nWhat is the **largest number of pieces** you can get?',
      hints: ['0 cuts give 1 piece, 1 cut gives 2, 2 cuts give 4, 3 cuts give 7. What does the fourth cut add?', 'A new cut crosses every earlier cut once, and each crossing splits one more piece: the nth cut adds n pieces.'],
      explain: 'The nth cut can cross all the n − 1 earlier cuts, and so it passes through n pieces and splits each of them: it adds n new pieces. So 1 + 1 + 2 + 3 + 4 + 5 = **16**. (The doubling answer of 32 is the classic mistake: it would need each cut to cut *every* piece.)',
      data: { answer: { num: 16 }, traps: [{ match: 32, msg: 'That would need every cut to slice every piece in two. A straight cut cannot do that.' }], glyph: '🍕' },
      concepts: ['sequence'], links: ['seq-lazy-caterer']
    },
    {
      id: 'num-round-table', title: 'Five at a Round Table', diff: 3,
      text: 'Five friends sit down at a **round table**. Two seatings count as the same if everyone has the same neighbours on the left and on the right (so turning everybody one seat round does not make a new arrangement).\n\nIn how many different ways can they be seated?',
      hints: ['Fix one person in one seat: he or she is the “anchor” that stops the rotation.', 'The other four can then sit in any order.'],
      explain: 'Fixing one friend in a seat removes the turning, and the other four can sit in 4 × 3 × 2 × 1 = **24** orders. The tempting 5! = 120 counts each seating five times, once for each rotation of the table.',
      data: { answer: { num: 24 }, traps: [{ match: 120, msg: 'That counts each arrangement five times, once for every way of turning the table.' }], glyph: '⭕' },
      concepts: ['combinatorics'], links: ['num-anagram']
    },
    {
      id: 'num-anagram', title: 'Shuffling PUZZLE', diff: 3,
      text: 'How many different “words” (meaningful or not) can be made by rearranging **all six letters** of the word **PUZZLE**?',
      hints: ['Six different letters could be arranged in 6! = 720 ways.', 'Two of the letters (the Z’s) are identical: swapping them changes nothing.'],
      explain: '6! = 720 orders of six letters, but the two Z’s can be swapped without any visible change, so each word has been counted twice: 720 ÷ 2 = **360**. In general, divide by the factorial of each repeated letter.',
      data: { answer: { num: 360 }, traps: [{ match: 720, msg: 'That treats the two Z’s as different. Swapping them changes nothing you can see.' }], glyph: 'ZZ' },
      concepts: ['combinatorics'], links: ['num-round-table']
    },
    {
      id: 'num-grid-paths', title: 'Across the City Grid', diff: 3,
      text: 'The streets of a city form a square grid, **4 blocks by 4 blocks**. You walk from the south-west corner to the north-east corner, and only ever go **north or east**.\n\nHow many different routes are there?',
      hints: ['Every route has 8 steps: 4 north and 4 east. The route is decided by which 4 of the 8 steps are north.', 'The number of ways to choose 4 out of 8 is 8 × 7 × 6 × 5 ÷ (4 × 3 × 2 × 1).'],
      explain: 'Choose which 4 of the 8 steps go north: 8!/(4! 4!) = **70** routes. On the grid, fill every corner with the number of routes to it (the sum of the numbers to its left and below) and you rebuild Pascal’s triangle, with 70 at the far corner.',
      data: { answer: { num: 70 }, glyph: '70' },
      concepts: ['combinatorics']
    },
    {
      id: 'num-diagonals', title: 'Diagonals of a Twelve-Sided Polygon', diff: 3,
      text: 'A polygon has **12 sides**. A *diagonal* joins two corners that are not neighbours.\n\nHow many diagonals does it have?',
      hints: ['From each corner you can draw a line to 11 other corners, but 2 of those are neighbours.', 'Every diagonal is counted twice, once from each end.'],
      explain: 'From each of the 12 corners there are 9 diagonals (to the 12 − 3 corners that are neither itself nor its two neighbours): 12 × 9 = 108, and each diagonal is counted twice: **54**. In general n(n − 3)/2, the handshake count with the neighbours taken out.',
      data: { answer: { num: 54 }, traps: [{ match: 108, msg: 'Each diagonal has been counted from both of its ends.' }, { match: 66, msg: 'That counts every pair of corners, including the sides of the polygon.' }], glyph: '⬡' },
      concepts: ['combinatorics'], links: ['num-handshakes']
    },
    {
      id: 'num-chess-squares', title: 'Squares on a Chessboard', diff: 3,
      text: 'How many **squares** of every size — 1 × 1, 2 × 2, up to 8 × 8 — can you find on an ordinary chessboard?',
      hints: ['There are 64 little ones. How many 2 × 2 squares are there?', 'A k × k square can be placed in (9 − k) × (9 − k) positions.'],
      explain: '1² + 2² + … + 8² = 64 + 49 + 36 + 25 + 16 + 9 + 4 + 1 = **204**. The 8 × 8 board has 64 unit squares, 49 squares of 2 × 2, and so on, down to the one big square.',
      data: { answer: { num: 204 }, traps: [{ match: 64, msg: 'That is just the little squares. Count the bigger ones too.' }], glyph: '♟' },
      concepts: ['combinatorics'], links: ['num-chess-rectangles']
    },
    {
      id: 'num-chess-rectangles', title: 'Rectangles on a Chessboard', diff: 4,
      text: 'How many **rectangles** of every shape and size (squares are rectangles too) are there on an ordinary 8 × 8 chessboard, whose edges follow the lines of the squares?',
      hints: ['A rectangle is decided by its two vertical sides and its two horizontal sides. The board has 9 vertical and 9 horizontal lines.', 'How many ways are there to choose 2 out of 9 lines?'],
      explain: 'Choose two of the 9 vertical lines (36 ways) and two of the 9 horizontal lines (36 ways): 36 × 36 = **1296** rectangles, of which 204 are squares. It is the same “choose two from nine” counting as the handshakes.',
      data: { answer: { num: 1296 }, traps: [{ match: 204, msg: 'That is the number of squares. Rectangles of every shape are more numerous.' }], glyph: '1296' },
      concepts: ['combinatorics'], links: ['num-chess-squares', 'num-handshakes']
    },
    {
      id: 'num-divisors-360', title: 'The Divisors of 360', diff: 3,
      text: 'How many whole numbers divide **360** exactly? Count 1 and 360 themselves.',
      hints: ['Break 360 into primes: 360 = 2³ × 3² × 5.', 'A divisor uses 0 to 3 twos, 0 to 2 threes and 0 or 1 five.'],
      explain: 'A divisor is made by choosing how many 2s (0–3: 4 ways), 3s (0–2: 3 ways) and 5s (0–1: 2 ways): 4 × 3 × 2 = **24** divisors. That is why 360 is a handy number: it has so many divisors that a circle of 360° can be divided into so many equal parts.',
      data: { answer: { num: 24 }, glyph: '360' },
      concepts: ['combinatorics', 'gcd']
    },
    {
      id: 'num-trailing-zeros', title: 'The Zeros of 100 Factorial', diff: 3,
      text: 'The number **100!** = 1 × 2 × 3 × … × 100 is huge. How many **zeros** does it end with?',
      hints: ['Each zero at the end comes from a factor 10 = 2 × 5. There are plenty of 2s, so count the 5s.', 'Multiples of 25 contain two 5s.'],
      explain: 'The multiples of 5 up to 100 are 20 in number, and 25, 50, 75 and 100 each contain a second 5: 20 + 4 = **24** fives, and more than enough 2s. So 100! ends in 24 zeros.',
      data: { answer: { num: 24 }, traps: [{ match: 20, msg: 'The multiples of 25 contribute a second factor 5 each. Count those as well.' }, { match: 10, msg: 'That counts only the multiples of 10; every multiple of 5 helps.' }], glyph: '100!' },
      concepts: ['combinatorics']
    },
    {
      id: 'num-last-digit', title: 'The Last Digit of 7 to the 2024', diff: 3,
      text: 'What is the **last digit** of **7²⁰²⁴**?',
      hints: ['Write down the last digits of the first powers of 7: 7, 9, 3, 1, 7 …', 'The pattern repeats every four powers. Which place in the cycle is 2024?'],
      explain: 'The last digits of 7¹, 7², 7³, 7⁴ are 7, 9, 3, 1, and then the cycle repeats. Since 2024 is a multiple of 4, the last digit of 7²⁰²⁴ is the fourth in the cycle: **1**. Only the last digit matters in the last digit — remainder arithmetic at its simplest.',
      data: { answer: { num: 1 }, glyph: '7ⁿ' },
      concepts: ['modular'], links: ['num-weekday']
    },
    {
      id: 'num-108', title: 'Twelve Times the Digit Sum', diff: 3,
      text: 'There is exactly one three-digit number that is **12 times the sum of its digits**.\n\nWhat is it?',
      hints: ['Write it as 100a + 10b + c and use the condition: 100a + 10b + c = 12(a + b + c).', 'That simplifies to 88a = 2b + 11c. What can a be?'],
      explain: '88a = 2b + 11c. The right-hand side is at most 2 × 9 + 11 × 9 = 117, so a = 1 and 2b + 11c = 88. Then c must be even, and c = 8 gives b = 0: the number is **108**, and 12 × (1 + 0 + 8) = 108.',
      data: { answer: { num: 108 }, glyph: '108' },
      concepts: ['diophantine']
    },
    {
      id: 'num-2520', title: 'A Number for Every Guest', diff: 3,
      text: 'What is the **smallest** whole number that can be divided exactly by each of the numbers **1, 2, 3, 4, 5, 6, 7, 8, 9 and 10**?',
      hints: ['Build it from primes: what is the highest power of each prime you need?', 'The highest powers up to 10 are 2³ = 8, 3² = 9, 5 and 7.'],
      explain: '8 × 9 × 5 × 7 = **2520**. This “least common multiple” is the smallest number of biscuits that can be shared equally among any party of up to 10 guests, with none left over.',
      data: { answer: { num: 2520 }, glyph: '2520' },
      concepts: ['gcd']
    },
    {
      id: 'num-stairs', title: 'One Step or Two', diff: 4,
      text: 'You climb a staircase of **10 steps**, taking either **1 step or 2 steps** at a time.\n\nIn how many different ways can you climb it?',
      hints: ['Count the ways for 1 step (1 way), 2 steps (2 ways), 3 steps (3 ways) …', 'To reach step n, your last move came from step n − 1 or from step n − 2.'],
      explain: 'The ways to reach step n are the ways to reach step n − 1 (then 1 more step) plus those to reach step n − 2 (then a double step): 1, 2, 3, 5, 8, 13, 21, 34, 55, **89**. They are the Fibonacci numbers again, hiding in a staircase.',
      data: { answer: { num: 89 }, traps: [{ match: 55, msg: 'That is the number of ways for 9 steps. One more.' }], glyph: '89' },
      concepts: ['recursion', 'sequence'], links: ['aar-fibonacci-rabbits', 'seq-fibonacci']
    },
    {
      id: 'num-coins-10p', title: 'Ten Pence in Coins', diff: 3,
      text: 'You have plenty of **1p, 2p and 5p** coins.\n\nIn how many different ways can you pay exactly **10p**? (The order of the coins does not matter.)',
      hints: ['Sort the ways by the number of 5p coins: 0, 1 or 2.', 'With no 5p, you pay 10p with 1p and 2p coins: the number of 2p coins can be 0 to 5.'],
      explain: 'With no 5p coin, the number of 2p coins can be 0, 1, 2, 3, 4 or 5: 6 ways. With one 5p, the other 5p is paid in 3 ways (0, 1 or 2 two-pence coins). With two 5p: 1 way. In all 6 + 3 + 1 = **10** ways.',
      data: { answer: { num: 10 }, glyph: '10p' },
      concepts: ['combinatorics', 'diophantine']
    },
    {
      id: 'num-stamps', title: 'The Stamp You Cannot Make', diff: 3,
      source: 'The “coin problem”, studied by J. J. Sylvester in 1884.',
      text: 'The post office sells only **3-cent** and **5-cent** stamps, and you may use as many as you like.\n\nWhat is the **largest** postage that you **cannot** make up exactly?',
      hints: ['List the amounts you can make: 3, 5, 6, 8, 9, 10 … and the ones you cannot: 1, 2, 4, 7 …', 'Once you can make three amounts in a row (8, 9, 10), you can make every larger amount by adding 3s.'],
      explain: 'Every amount from 8 upwards can be made (8 = 3 + 5, 9 = 3 × 3, 10 = 5 + 5, and then add 3s), and the largest failure is **7**. For two stamp values a and b without a common factor, the largest impossible amount is ab − a − b = 15 − 8 = 7.',
      data: { answer: { num: 7 }, glyph: '3 5' },
      concepts: ['diophantine', 'gcd'], links: ['num-sweets']
    },
    {
      id: 'num-sweets', title: 'Sweets in Boxes of 6, 9 and 20', diff: 4,
      text: 'A sweet shop sells boxes of **6**, **9** and **20** sweets, and you may buy as many boxes as you like.\n\nWhat is the **largest** number of sweets that you **cannot** buy exactly?',
      hints: ['Boxes of 6 and 9 alone make the multiples of 3 from 6 upwards: 6, 9, 12, 15 …', 'A number that leaves 2 when divided by 3 needs one box of 20; one that leaves 1 needs two boxes of 20 (that is, 40).'],
      explain: 'The multiples of 3 from 6 on need no 20-box. Numbers leaving 2 on division by 3 need one 20-box, so they work from 20 + 6 = 26 on. Numbers leaving 1 need two 20-boxes, and work from 40 + 6 = 46 on — but 43 = 40 + 3, and 3 sweets cannot be made. So the largest impossible number is **43**, and every number from 44 upwards can be bought. It is the “Chicken McNugget number”, famous from a real menu.',
      data: { answer: { num: 43 }, traps: [{ match: 46, msg: '46 is 40 + 6: it can be made. Look at what is just below it.' }], glyph: '43' },
      concepts: ['diophantine'], links: ['num-stamps']
    },
    {
      id: 'num-friday-13', title: 'Friday the Thirteenth', diff: 4,
      text: 'Some people fear **Friday the 13th**. In a single calendar year, what is the **greatest** number of Friday-the-13ths that can occur?',
      hints: ['A month has a Friday 13th if its first day is a Sunday.', 'Two months begin on the same weekday if the gap between their first days is a multiple of 7 days: February and March in an ordinary year (February has 28 days). Find other pairs.'],
      explain: 'A Friday 13th falls in a month that starts on a Sunday. In a year, the months always fall into groups with the same first weekday; a year can have **at most 3** (as in 2015: February, March and November) and always has at least one. Friday the 13th is as unlucky as any other day, but it does come around.',
      data: { answer: { num: 3 }, traps: [{ match: 2, msg: 'It can be more. Think of the months that begin on the same weekday: February, March and November in a non-leap year.' }], glyph: '13' },
      concepts: ['modular'], links: ['num-weekday']
    },

    /* ---------- ages, speeds, rates, clocks ---------- */
    {
      id: 'num-brothers-sisters', title: 'Brothers and Sisters', diff: 3,
      text: 'In one family, **every boy has as many brothers as sisters**, and **every girl has twice as many brothers as sisters**.\n\nHow many children are there in the family?',
      hints: ['Let b be the number of boys and g the number of girls. A boy has b − 1 brothers and g sisters.', 'A girl has b brothers and g − 1 sisters.'],
      explain: 'A boy has b − 1 brothers and g sisters, so b − 1 = g. A girl has b brothers and g − 1 sisters, so b = 2(g − 1). Then g + 1 = 2g − 2, so g = 3 and b = 4: **7 children**. Check: each of the 4 boys has 3 brothers and 3 sisters; each of the 3 girls has 4 brothers and 2 sisters.',
      data: { answer: { num: 7 }, traps: [{ match: 6, msg: 'Try 3 boys and 3 girls: does each girl have twice as many brothers as sisters?' }], glyph: '4+3' },
      concepts: ['diophantine']
    },
    {
      id: 'num-ages-twice', title: 'When I Was as Old as You Are', diff: 4,
      text: 'A woman says to her cousin: “I am **twice as old as you were when I was as old as you are now**.” Together their ages add up to **63**.\n\nHow old is the woman?',
      hints: ['Let her age be x, and the cousin’s y, so x > y. The gap between them is x − y years.', 'When she was y years old (x − y years ago), her cousin was y − (x − y) = 2y − x. That age, doubled, gives x.'],
      explain: 'The condition says x = 2 × (2y − x), so 3x = 4y: their ages are in the ratio 4 : 3. With a sum of 63, the woman is **36** and the cousin is 27. Check: when she was 27 (9 years ago) her cousin was 18, and 36 = 2 × 18. Never say this at a party.',
      data: { answer: { num: 36, unit: 'years' }, traps: [{ match: 27, msg: 'That is her cousin’s age. Who is older?' }], glyph: '36' },
      concepts: ['working-backwards'], links: ['num-father-son']
    },
    {
      id: 'num-three-ages', title: 'The Ages of the Three Children', diff: 4,
      text: 'A census-taker asks a woman the ages of her three children (all whole numbers of years). “The **product** of their ages is **36**,” she says, “and the **sum** is the number of that house across the road.” The census-taker looks at the number and says: “I still can’t tell.”\n\n“Well,” says the woman, “my **eldest** child plays the piano.” Then he knows.\n\nHow old are the three children?',
      ask: 'Give the three ages, separated by commas.',
      hints: ['List all the ways to make 36 from three whole numbers, and add each triple.', 'One sum occurs twice. That is why he could not tell. What does the last remark tell him?'],
      explain: 'The triples with product 36 have sums 1+1+36 = 38, 1+2+18 = 21, 1+3+12 = 16, 1+4+9 = 14, 1+6+6 = 13, 2+2+9 = 13, 2+3+6 = 11 and 3+3+4 = 10. Only **13** occurs twice, so the census-taker was stuck between 1, 6, 6 and 2, 2, 9. “The eldest” means there is a single oldest child, which rules out the twins of 6: the ages are **2, 2 and 9**.',
      data: { answer: { nums: [2, 2, 9] }, glyph: '36' },
      concepts: ['deduction']
    },
    {
      id: 'num-average-speed', title: 'Up the Hill and Down Again', diff: 3,
      text: 'A car climbs a hill at **30 km/h** and comes back down the same road at **60 km/h**.\n\nWhat is its average speed over the whole trip?',
      hints: ['Suppose the hill is 60 km long. How long does the climb take? And the descent?', 'Average speed is total distance divided by total time, not the average of the speeds.'],
      explain: 'Take a 60 km hill: the climb takes 2 hours and the descent 1 hour, so 120 km in 3 hours: **40 km/h**. The car spends longer at the lower speed, so the average is pulled down from 45. In general the answer is the *harmonic mean* of the speeds.',
      data: { answer: { num: 40, unit: 'km/h' }, traps: [{ match: 45, msg: 'That is the average of the two speeds. The car spends more time at the slow one.' }], glyph: '40' },
      concepts: ['rates'], links: ['num-impossible-average']
    },
    {
      id: 'num-impossible-average', title: 'Too Late to Catch Up', diff: 3,
      text: 'A race is **2 km** long, and you wish to average **60 km/h** over the whole distance. You drive the first kilometre at only **30 km/h**.\n\nHow fast must you drive the second kilometre to reach your average?',
      hints: ['How long would the whole 2 km take at an average of 60 km/h?', 'How long has the first kilometre already taken?'],
      explain: 'At 60 km/h, 2 km takes 2 minutes. But the first kilometre at 30 km/h has already taken **2 minutes**, and no time is left. So **no speed is fast enough**: even an instant second kilometre would only just make it. Averages of speed are taken over time, not over distance.',
      data: {
        answer: { choice: 3, choices: ['60 km/h', '90 km/h', '120 km/h', 'No speed is fast enough'] },
        traps: [{ match: 1, msg: '90 km/h would give the second kilometre 40 seconds. But the total is 2 minutes 40, not 2 minutes.' }, { match: 2, msg: 'At 120 km/h the second kilometre takes half a minute, and the whole thing 2½ minutes: too long.' }],
        glyph: '∞'
      },
      concepts: ['rates'], links: ['num-average-speed']
    },
    {
      id: 'num-pipes-tank', title: 'Two Taps and a Drain', diff: 3,
      text: 'A tank is filled by one tap in **6 hours** and by another in **3 hours**. A drain at the bottom would empty a full tank in **12 hours**.\n\nWith both taps and the drain open together, how many **hours** does the empty tank take to fill?',
      hints: ['Give every pipe a rate in tanks per hour: taps ⅙ and ⅓, drain −1/12.', 'Add the rates, then divide 1 by the total.'],
      explain: 'The rates add: ⅙ + ⅓ − 1/12 = 2/12 + 4/12 − 1/12 = 5/12 tank per hour. So it takes 12/5 = **2.4 hours** (2 h 24 min). The ancient Greek and Chinese pipe problems work in the same way: rates add, times don’t.',
      data: { answer: { num: 2.4, unit: 'hours' }, traps: [{ match: 2, msg: 'The taps alone would take 2 hours. But the drain is open.' }], glyph: '🚰' },
      concepts: ['rates'], links: ['aar-metrodorus-lion', 'aar-nine-pool']
    },
    {
      id: 'num-river-current', title: 'Upstream and Downstream', diff: 3,
      text: 'A boat takes **3 hours** to travel **30 km upstream**, and **2 hours** to come back the same 30 km downstream. The boat’s engine and the river’s current stay the same throughout.\n\nHow fast does the river flow, in km/h?',
      hints: ['Upstream speed is 30 ÷ 3 = 10 km/h and downstream speed is 30 ÷ 2 = 15 km/h.', 'Downstream is boat + current, upstream is boat − current.'],
      explain: 'Downstream: b + c = 15. Upstream: b − c = 10. Subtracting gives 2c = 5, so the current is **2.5 km/h** (and the boat does 12.5 km/h in still water). The river speeds you up on the way down by exactly as much as it slows you on the way up.',
      data: { answer: { num: 2.5, unit: 'km/h' }, traps: [{ match: 5, msg: 'That is the difference of the two speeds; the current accounts for half of it.' }], glyph: '〰' },
      concepts: ['rates']
    },
    {
      id: 'num-mixture', title: 'Watering the Brine', diff: 3,
      text: 'You have **10 litres** of a salt solution that is **20 % salt**. You want to make it **10 % salt** by adding pure water.\n\nHow many litres of water must you add?',
      hints: ['How much salt is there in 10 litres of a 20 % solution?', 'The salt stays the same. What total volume makes it 10 %?'],
      explain: 'There are 2 litres of salt. For the mixture to be 10 % salt, the total must be 20 litres, so you add **10 litres** of water. The salt is the invariant: the quantity that does not change while everything else does.',
      data: { answer: { num: 10, unit: 'litres' }, glyph: '20%' },
      concepts: ['invariant', 'rates']
    },
    {
      id: 'num-candles', title: 'Two Candles', diff: 3,
      text: 'Two candles of the same length are lit together. One would burn out in **6 hours**, the other in **4 hours**, both burning at a steady rate.\n\nAfter how many hours is the longer candle **exactly twice as long** as the shorter?',
      hints: ['After t hours the slow candle has 1 − t/6 of its length left, and the fast one 1 − t/4.', 'Set 1 − t/6 = 2 × (1 − t/4).'],
      explain: '1 − t/6 = 2 − t/2, so t/2 − t/6 = 1 and t/3 = 1: **3 hours**. At that moment the slow candle has half of its length left and the fast one a quarter. Notice that “twice as long” refers to what is left, not the burned part.',
      data: { answer: { num: 3, unit: 'hours' }, glyph: '🕯' },
      concepts: ['rates']
    },
    {
      id: 'num-cask', title: 'The Cask of Wine', diff: 3,
      source: 'A traditional puzzle of the merchants’ arithmetic books.',
      text: 'A cask holds **100 litres of wine**. A servant takes out **10 litres** and refills the cask with water. After stirring well, he does it **again**: takes out 10 litres of the mixture and refills with water.\n\nHow many litres of wine are left in the cask?',
      hints: ['After the first exchange, the cask is 90 % wine.', 'The second exchange removes 10 % of the wine that is there.'],
      explain: 'After the first exchange there are 90 litres of wine. The second removes a tenth of what is there, and again leaves 9/10 of it: 90 × 0.9 = **81 litres**. So 100 × 0.9² = 81, not 80. The wine is not removed in a fixed quantity but as a fixed *fraction*.',
      data: { answer: { num: 81, unit: 'litres' }, traps: [{ match: 80, msg: 'The second 10 litres are a mixture of wine and water, so they take out less than 10 litres of wine.' }], glyph: '🍷' },
      concepts: ['rates', 'geometric-series']
    },
    {
      id: 'num-wine-water', title: 'Wine in the Water, Water in the Wine', diff: 3,
      source: 'A traditional puzzle of the parlour and the classroom.',
      text: 'There is a glass of **wine** and a glass of **water**, each with the same amount. You take a spoonful of wine and stir it into the water. Then you take a spoonful of the mixture and put it back into the wine.\n\nNow: is there more **wine in the water glass** than **water in the wine glass**, or the other way round, or equally much?',
      hints: ['Each glass ends up with the same amount of liquid as at the start.', 'Whatever wine is missing from the wine glass must be in the water glass, and it is replaced there by water.'],
      explain: 'Both glasses end up with exactly what they began with. So the wine that is missing from the wine glass is now in the water glass, and it has been replaced by the same amount of water: the amounts are **exactly the same**. No arithmetic on concentrations is needed at all — one conservation law is enough.',
      data: {
        answer: { choice: 2, choices: ['There is more wine in the water than water in the wine', 'There is more water in the wine than wine in the water', 'Exactly as much of each', 'It depends on the size of the spoon'] },
        traps: [{ match: 0, msg: 'The second spoonful takes wine back, which makes it look as if the water glass has more — but count what is missing from each glass.' }, { match: 3, msg: 'The spoon can be any size: the argument does not use it.' }],
        glyph: '🥄'
      },
      concepts: ['invariant']
    },
    {
      id: 'num-train-tunnel', title: 'The Train and the Tunnel', diff: 3,
      text: 'A train **200 metres** long travels at a steady **60 km/h** through a tunnel **400 metres** long.\n\nHow many **seconds** pass between the moment the front of the train enters the tunnel and the moment the rear leaves it?',
      hints: ['How far does the front of the train move before the rear is out?', 'It is the length of the tunnel plus the length of the train. 60 km/h is 1000 m per minute.'],
      explain: 'The front must travel the tunnel’s 400 m plus the train’s own 200 m, so 600 m in all. At 60 km/h = 1000 m/min, that takes 0.6 minutes = **36 seconds**. Forgetting the length of the train (400 m → 24 s) is the classic slip.',
      data: { answer: { num: 36, unit: 'seconds' }, traps: [{ match: 24, msg: 'That is the time for the front to cross the tunnel. The rear still has to come out.' }], glyph: '🚂' },
      concepts: ['rates']
    },
    {
      id: 'num-rope-earth', title: 'A Rope Around the Earth', diff: 3,
      text: 'A rope is stretched tight round the **whole equator** of the Earth, about 40 000 km. Now the rope is cut, **1 metre** of extra rope is spliced in, and the rope is lifted so that it floats an equal distance above the ground all the way round.\n\nHow high above the ground is it?',
      ask: 'Give the height in **centimetres** (to one decimal).',
      hints: ['The circumference is 2π times the radius. What does an extra metre of circumference do to the radius?', 'The Earth’s radius does not appear in the answer at all.'],
      explain: 'The circumference grows by 1 m, so the radius grows by 1/(2π) m = **15.9 cm**: about the height of a mug. The size of the Earth is irrelevant: a basketball with a metre of extra string would lift the string by the same 15.9 cm. Circumference and radius are linked by 2π, whatever the circle.',
      data: { answer: { num: 15.9, tol: 0.1, unit: 'cm' }, traps: [{ match: 0.1, msg: 'The size of the Earth is irrelevant: the height depends only on the extra length, and it is much more than that.' }], glyph: '🌍' },
      concepts: ['area']
    },
    {
      id: 'num-hat-river', title: 'The Hat in the River', diff: 4,
      text: 'A rower passes under a bridge and loses his hat in the river; he does not notice. He keeps rowing **upstream** for **10 minutes**, then finds the hat is gone, turns round and rows back at the same effort. He reaches the hat **1 km downstream** of the bridge.\n\nHow fast does the river flow, in km/h?',
      hints: ['Forget the banks. In the frame of the water, the hat is at rest.', 'The rower moves away from the hat for 10 minutes at his own speed, and needs the same time to come back.'],
      explain: 'In the water’s own frame the hat does not move, and the rower goes away for 10 minutes and returns in 10 more, so the hat has been floating for **20 minutes**. It drifted 1 km in ⅓ hour: the river flows at **3 km/h**. The rower’s speed never enters the answer.',
      data: { answer: { num: 3, unit: 'km/h' }, traps: [{ match: 6, msg: 'The hat was in the water for 20 minutes, not 10.' }], glyph: '🎩' },
      concepts: ['rates']
    },
    {
      id: 'num-achilles', title: 'Achilles and the Tortoise', diff: 3, year: -450,
      source: 'Zeno of Elea (about 450 BC), as reported by Aristotle, *Physics* VI.9.',
      text: 'Achilles runs at **10 metres per second** and a tortoise crawls at **1 metre per second**. The tortoise is given a head start of **100 metres**. Zeno argued that Achilles can never catch it: by the time he reaches the tortoise’s starting point, it has moved on a little, and so on for ever.\n\nAfter how many **seconds** does Achilles actually catch the tortoise?',
      ask: 'Give the time in seconds (a fraction or a decimal is fine).',
      hints: ['Each second Achilles gains 10 − 1 = 9 metres on the tortoise.', 'The gap is 100 metres.'],
      explain: 'Achilles closes the gap at 9 metres per second, so he catches the tortoise after 100 ÷ 9 = **11⅑ seconds**. Zeno’s stages take 10 s, 1 s, 0.1 s, 0.01 s … and that infinite list of times adds up to 11.111… seconds: infinitely many steps, a finite total. Nobody was convinced that Achilles was really stuck, but it took two thousand years to say why.',
      data: { answer: { num: 100 / 9, show: '11 1/9', tol: 0.02, unit: 'seconds' }, glyph: '🐢' },
      concepts: ['geometric-series', 'rates']
    },
    {
      id: 'num-painted-cube', title: 'The Painted Cube', diff: 2,
      text: 'A wooden cube, **3 × 3 × 3**, is painted red on the outside and then sawn into **27 small cubes**.\n\nHow many of the small cubes have **exactly two red faces**?',
      hints: ['The cubes with two painted faces are on the edges of the big cube, but not at its corners.', 'A cube has 12 edges, and each edge of the 3 × 3 × 3 cube has one such small cube in the middle.'],
      explain: 'There are 12 edges, each with a single middle cube: **12**. The others: 8 corner cubes have three red faces, 6 face-centre cubes have one, and the single cube in the middle has none: 8 + 12 + 6 + 1 = 27.',
      data: { answer: { num: 12 }, traps: [{ match: 8, msg: 'Those are the corners, with three red faces each.' }], glyph: '🧊' },
      concepts: ['combinatorics']
    },
    {
      id: 'num-clock-overlap-day', title: 'When the Hands Overlap', diff: 3,
      text: 'The hour hand and the minute hand of a clock overlap at 12 o’clock.\n\nIn a full day of **24 hours**, how many times do the two hands overlap? (Count the overlap at midnight, but not again at the following midnight.)',
      hints: ['How many times does the minute hand pass the hour hand during 12 hours?', 'The minute hand goes round 12 times, the hour hand once.'],
      explain: 'In 12 hours the minute hand turns 12 times and the hour hand once, so the minute hand overtakes it **11** times (not 12: the twelfth is the start of the next cycle). In a day: 2 × 11 = **22**. The overlaps are 12/11 of an hour apart, about 65 minutes 27 seconds.',
      data: { answer: { num: 22 }, traps: [{ match: 24, msg: 'It happens a little less often than once an hour: the overlaps are about 65 minutes apart.' }, { match: 23, msg: 'Count midnight only once.' }], glyph: '🕛' },
      concepts: ['rates', 'modular'], links: ['num-clock-first-overlap', 'num-clock-right-angles']
    },
    {
      id: 'num-clock-first-overlap', title: 'The First Overlap After Noon', diff: 4,
      text: 'At noon both hands of a clock point straight up. After that they separate, and the minute hand catches up with the hour hand for the first time some time after 1 o’clock.\n\nHow many **minutes after 12:00** do the hands first overlap?',
      ask: 'Give the time in minutes, to two decimal places.',
      hints: ['The minute hand moves 6° a minute, the hour hand 0.5° a minute.', 'The minute hand gains 5.5° a minute, and must gain a whole circle: 360°.'],
      explain: '360 ÷ 5.5 = 65.4545… minutes, or **65 5⁄11 minutes** after 12: about 1:05:27. (The hands overlap exactly on a minute mark only at 12:00.)',
      data: {
        answer: { num: 720 / 11, show: '65.45', tol: 0.01, unit: 'minutes' }, glyph: '🕐',
        figure: {
          w: 400, h: 226,
          svg: (function () {
            let s = '<circle cx="200" cy="112" r="92" fill="#fbf8ef" stroke="' + INK + '" stroke-width="5"/>';
            for (let k = 0; k < 12; k++) {
              const a = k * Math.PI / 6, r1 = k % 3 === 0 ? 76 : 82;
              s += '<line x1="' + (200 + r1 * Math.sin(a)).toFixed(1) + '" y1="' + (112 - r1 * Math.cos(a)).toFixed(1) + '" x2="' + (200 + 88 * Math.sin(a)).toFixed(1) + '" y2="' + (112 - 88 * Math.cos(a)).toFixed(1) + '" stroke="' + INK + '" stroke-width="3"/>';
            }
            const a = 360 / 11 * Math.PI / 180;
            s += '<line x1="200" y1="112" x2="' + (200 + 76 * Math.sin(a)).toFixed(1) + '" y2="' + (112 - 76 * Math.cos(a)).toFixed(1) + '" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>';
            s += '<line x1="200" y1="112" x2="' + (200 + 50 * Math.sin(a)).toFixed(1) + '" y2="' + (112 - 50 * Math.cos(a)).toFixed(1) + '" stroke="' + RED + '" stroke-width="7" stroke-linecap="round"/>';
            s += '<circle cx="200" cy="112" r="5" fill="' + INK + '"/>';
            return s;
          })()
        }
      },
      concepts: ['rates', 'modular'], links: ['num-clock-overlap-day']
    },
    {
      id: 'num-clock-right-angles', title: 'Hands at Right Angles', diff: 4,
      text: 'The hands of a clock are at right angles (90° apart) at 3 o’clock and again at 9 o’clock. But it happens at other times too.\n\nHow many times in a **full day of 24 hours** are the hands at right angles?',
      hints: ['How many times in 12 hours does the minute hand gain 90° on the hour hand? And 270°?', 'The relative angle grows by 5.5° per minute; right angles occur at 90°, 270°, 450° and so on.'],
      explain: 'The relative angle of the hands passes 90° or 270° (mod 360°) twice for every relative turn. In 12 hours the minute hand gains 11 full turns, so there are 22 right angles: in a day, **44**. The right angle at 3 o’clock and 9 o’clock is only two of them.',
      data: { answer: { num: 44 }, traps: [{ match: 48, msg: 'It is not exactly twice an hour: the hands move at different speeds, so it happens a bit less often than that.' }, { match: 22, msg: 'That is the number in 12 hours.' }], glyph: '⌞' },
      concepts: ['rates', 'modular'], links: ['num-clock-overlap-day', 'num-clock-first-overlap']
    },

    /* ---------- the famous stories ---------- */
    {
      id: 'num-missing-dollar', title: 'The Missing Dollar', diff: 3,
      source: 'A well-known modern puzzle of uncertain origin.',
      text: 'Three friends take a hotel room for **$30**, and each pays **$10**. The manager remembers that the room is only **$25**, and sends the bellboy with **$5** in change. The bellboy, who cannot split $5 three ways, gives each friend **$1** back and keeps **$2** for himself.\n\nSo each friend has paid $9: three times 9 is $27. The bellboy has $2. That makes **$29**. Where did the other dollar go?',
      hints: ['Follow the money: where is the $30 now? In the till, the bellboy’s pocket and the friends’ pockets.', 'Is it right to *add* the bellboy’s $2 to the $27?'],
      explain: 'The $27 that the friends paid is $25 for the room **plus** the $2 in the bellboy’s pocket: the $2 is already inside the $27, so adding it again is a mistake. The right sums are 27 − 2 = 25 (the room), or 25 + 2 + 3 = 30 (room, bellboy and refunds). There is no missing dollar: only a story that draws a line in the wrong place.',
      data: {
        answer: { choice: 1, choices: ['The bellboy secretly pocketed one more dollar', 'The $27 already contains the bellboy’s $2, so adding them again makes no sense', 'The hotel’s till is one dollar short', 'It is a true paradox with no explanation'] },
        traps: [{ match: 0, msg: 'Nobody stole anything: if the bellboy had kept $3, the friends would have paid $27 for a $25 room, and that would still leave the $27 = 25 + 2 bookkeeping.' }, { match: 3, msg: 'It is only an apparent paradox, and the explanation is quite short.' }],
        glyph: '$1?'
      },
      concepts: ['lateral', 'invariant']
    },
    {
      id: 'num-birthday-date', title: 'The Date of the Birthday', diff: 3,
      text: 'Anna says: “**The day before yesterday I was 25. Next year I shall be 28.**”\n\nOn what date does she say it?',
      hints: ['To go from 25 to 28 in so short a time she must have a birthday just before yesterday, and another one this year.', 'Which date is both the end of one year and, next year, still to come?'],
      explain: 'Anna was born on **31 December**. Two days ago (30 December) she was 25; yesterday (31 December) she turned 26; on 31 December of *this* year she will turn 27; and next year she will be 28. So she is speaking on **1 January**. Only on the first day of a year can “next year” make her age jump by two.',
      data: {
        answer: { choice: 2, choices: ['30 December', '31 December', '1 January', '2 January'] },
        traps: [{ match: 1, msg: 'If it were her birthday today, she could not say that she was 25 the day before yesterday and 28 next year.' }],
        glyph: '🎂'
      },
      concepts: ['modular', 'deduction']
    },
    {
      id: 'num-widow', title: 'The Widow and the Twins', diff: 3, year: 130,
      source: 'A case in Roman inheritance law, discussed by the jurist Salvius Julianus (2nd century AD).',
      text: 'A rich Roman lies dying; his wife is expecting a baby. His will says: if a **son** is born, the son takes **two thirds** of the estate and the widow one third; if a **daughter**, the daughter takes **one third** and the widow two thirds.\n\nAfter his death the widow has **twins**, a boy and a girl. The judge decides to follow the spirit of the will: the son gets twice what the mother gets, and the mother twice what the daughter gets.\n\nThe estate is **7000 denarii**. How many does the daughter receive?',
      hints: ['Call the daughter’s share d. Then the mother’s is 2d and the son’s is 4d.', 'The three shares add up to 7d.'],
      explain: 'Daughter d, mother 2d, son 4d: together 7d = 7000, so the daughter gets **1000**, the mother 2000 and the son 4000. The lawyers’ puzzle was to be fair to a will that never imagined twins. The shares in the ratio 4 : 2 : 1 keep both of the testator’s ratios true at once.',
      data: { answer: { num: 1000, unit: 'denarii' }, traps: [{ match: 2000, msg: 'That is the widow’s share.' }, { match: 4000, msg: 'That is the son’s share.' }], glyph: '⚖' },
      concepts: ['working-backwards']
    },
    {
      id: 'num-counterfeit', title: 'The Bag of False Coins', diff: 3,
      text: 'Ten bags each contain many coins. Every true coin weighs **10 g**, but one bag contains only **false** coins, each weighing **11 g**. You have a precise spring scale that you may use **once**.\n\nYou take **1 coin from bag 1, 2 from bag 2, 3 from bag 3, and so on up to 10 from bag 10**, and weigh them all together. The scale reads **557 g**.\n\nWhich bag holds the false coins?',
      hints: ['If all 55 coins were true, what would they weigh?', 'Every false coin adds exactly 1 g. How many false coins did you weigh?'],
      explain: 'The 55 coins would weigh 550 g if they were all true. The reading is 7 g more, so exactly **7 false coins** were weighed, and only bag 7 gives 7 coins. The scale reads off the bag number directly, because the number of coins taken from each bag is different: an idea that turns a comparison into a *coding*.',
      data: { answer: { num: 7 }, glyph: '⚖7' },
      concepts: ['deduction', 'combinatorics']
    },
    {
      id: 'num-mule-donkey', title: 'The Mule and the Donkey', diff: 3,
      source: 'A traditional problem, told in arithmetic books since antiquity.',
      text: 'A mule and a donkey are walking side by side, both heavily loaded with sacks. The mule says: “If you give me **one** of your sacks, I shall carry **twice** as many as you.” The donkey answers: “If **you** give **me** one of yours, we shall carry **the same** number.”\n\nHow many sacks does the mule carry?',
      hints: ['Let the mule carry m sacks and the donkey d. The second sentence says d + 1 = m − 1.', 'The first says m + 1 = 2 × (d − 1).'],
      explain: 'From the donkey: m = d + 2. From the mule: m + 1 = 2(d − 1), so d + 3 = 2d − 2 and d = 5. The mule carries **7** sacks and the donkey 5. Check: if the donkey gave one, the mule would have 8 and the donkey 4; if the mule gave one, both would have 6.',
      data: { answer: { num: 7 }, traps: [{ match: 5, msg: 'That is the donkey’s load.' }], glyph: '🫏' },
      concepts: ['working-backwards']
    },
    {
      id: 'num-josephus-10', title: 'Every Second Soldier', diff: 3,
      text: 'Ten soldiers stand in a circle, numbered **1 to 10**. Counting starts at soldier 1: he is spared, soldier **2 is removed**, soldier 3 is spared, soldier 4 removed, and so on **round and round the circle**, always removing every second soldier who is still there, until one is left.\n\nWhich soldier survives?',
      hints: ['The first round removes 2, 4, 6, 8, 10. Then who is next to be counted?', 'After 10 is removed, counting continues with soldier 1, who is spared again: the circle is now 1, 3, 5, 7, 9.'],
      explain: 'The order of removal is 2, 4, 6, 8, 10, 3, 7, 1, 9, so the survivor is **5**. There is a shortcut for every second person: write the number of soldiers as 2ᵃ + L; the survivor is 2L + 1. Here 10 = 8 + 2, so 2 × 2 + 1 = 5.',
      data: { answer: { num: 5 }, glyph: '5' },
      concepts: ['modular', 'recursion'], links: ['num-josephus-41']
    },
    {
      id: 'num-josephus-41', title: 'Josephus and the Cave', diff: 4,
      source: 'Told of the historian Flavius Josephus at the siege of Yodfat (AD 67). Josephus himself says only that he survived “by luck or by divine providence”; the counting-out puzzle comes from later retellings.',
      text: 'Forty-one rebels, trapped in a cave by the Romans, prefer death to surrender. They stand in a circle, numbered **1 to 41**, and counting from number 1 they agree that **every third man** is killed, round and round the circle, until only one is left — and he must then kill himself.\n\nThe historian Josephus, one of the 41, does not wish to die. In which position (numbered from 1) must he stand to be the **last survivor**?',
      hints: ['The first man to go is number 3, then 6, 9, …; after 39 the count continues with 1 and 2 (spared) and 40 goes.', 'You can simulate it on paper, or work out the recursion: J(1) = 0, and J(n) = (J(n − 1) + 3) mod n, counting positions from 0.'],
      explain: 'Simulating the count gives **position 31** as the last survivor (and position 16 the second last). In the legend Josephus and one friend took those places and talked the friend into surrendering as well. The formula: with positions numbered from 0, J(n) = (J(n − 1) + 3) mod n; this gives 30 for n = 41 — position 31 when counting from 1.',
      data: { answer: { num: 31 }, traps: [{ match: 16, msg: 'That is the second-last survivor. Which place is the very last?' }], glyph: '31' },
      concepts: ['modular', 'recursion'], links: ['num-josephus-10']
    },
    {
      id: 'num-coconuts', title: 'Three Sailors and a Monkey', diff: 4,
      source: 'From a story by Ben Ames Williams (1926), popularised by Martin Gardner in *Scientific American*. The trick of the “borrowed coconuts” is often attributed to the physicist Paul Dirac.',
      text: 'Three sailors and a monkey are shipwrecked on an island and collect a pile of coconuts. In the night, the **first sailor** wakes, divides the pile into **three equal parts**, finds **one left over**, which he throws to the monkey, hides his third and mixes the rest. The **second sailor** does exactly the same, with one over for the monkey. So does the **third**.\n\nIn the morning the sailors divide what is left into three equal parts, with **none left over**. What is the **smallest** number of coconuts the pile could have been?',
      hints: ['Work backwards: the morning pile must be a multiple of 3, and before the third sailor’s division there were 3/2 of it plus 1.', 'A trick: suppose the pile had 2 extra coconuts. Then each sailor’s division is exact, and the pile after each is 2/3 of the pile before.'],
      explain: 'With 2 borrowed coconuts the pile N + 2 must be divisible by 3 three times over, because each night it is multiplied by 2/3: so N + 2 is a multiple of 3³ = 27. The smallest is 27, so N = **25**. Check: 25 → 24 (one to the monkey) → 8 hidden → 16 left; 16 → 15 → 5 hidden → 10 left; 10 → 9 → 3 hidden → 6 left; and in the morning 6 = 3 × 2. With five sailors the same trick gives 5⁵ − 4 = 3121.',
      data: { answer: { num: 25 }, traps: [{ match: 79, msg: 'That works if the monkey also gets one in the morning. In this version the morning division is exact.' }, { match: 7, msg: 'Try it: after the first sailor takes his third, does the pile still divide again?' }], glyph: '🥥' },
      concepts: ['modular', 'working-backwards']
    },
    {
      id: 'num-hostess', title: 'Handshakes at the Party', diff: 5,
      source: 'A classic of recreational logic (the “Mr and Mrs Smith” handshake puzzle).',
      text: 'At a party there are **five married couples**: the host, the hostess, and four other couples. Nobody shakes their own hand or their own partner’s hand, and nobody shakes anyone’s hand twice.\n\nThe host asks each of the **other nine** people how many hands they have shaken, and gets **nine different answers**.\n\nHow many hands did the **hostess** shake?',
      hints: ['The possible answers are 0 to 8. Nine different answers must therefore be exactly 0, 1, 2, …, 8.', 'Who is the partner of the person who shook 8 hands? Who could they have failed to shake hands with?'],
      explain: 'The person who shook 8 hands shook everyone except herself and her partner, so her partner is the one who shook 0. Remove that couple: everyone else’s count falls by 1, and the same argument pairs the people with 7 and 1, then 6 and 2, then 5 and 3. Four couples are accounted for; the only one left, whose count is 4, is the hostess: she shook **4** hands (and so did the host).',
      data: { answer: { num: 4 }, traps: [{ match: 8, msg: 'Nobody could have shaken all of the hands, except the person who shook 8. Who is that person’s partner?' }, { match: 0, msg: 'The 0 is a guest who shook nobody’s hand, not the hostess.' }], glyph: '4?' },
      concepts: ['deduction', 'pigeonhole']
    },
    {
      id: 'num-taxi', title: 'The Taxi-Cab Number', diff: 4, year: 1920,
      source: 'The story of G. H. Hardy and Srinivasa Ramanujan, told by Hardy after Ramanujan’s death (1920).',
      text: 'The mathematician G. H. Hardy visited Ramanujan in hospital and said that he had come in a taxi with the number **1729**, which seemed a dull number. “No,” said Ramanujan at once, “it is very interesting. It is the **smallest** number that can be written as the sum of **two positive cubes in two different ways**.”\n\nCan you find the number without knowing that it was 1729? Give the smallest positive whole number with this property.',
      hints: ['The cubes are 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728. Which pairs add to the same total?', 'One pair uses the biggest cube on the list, and the tiny cube 1.'],
      explain: '**1729** = 1³ + 12³ = 9³ + 10³. It is the smallest number that is the sum of two positive cubes in two ways. Numbers with this property are called taxicab numbers; the next one is 4104 = 2³ + 16³ = 9³ + 15³.',
      data: { answer: { num: 1729 }, glyph: '1729' },
      concepts: ['diophantine']
    },
    {
      id: 'num-casting-nines', title: 'Casting Out Nines', diff: 3,
      text: 'A shopkeeper calculated **4587 × 3296** and wrote down three possible results for his till roll. Only one of them is right.\n\n• (A) 15 118 752<br>• (B) 15 119 352<br>• (C) 15 118 742\n\nWithout doing the whole multiplication, use the “casting out nines” check: replace each number by the sum of its digits, repeated until a single digit remains, and multiply.\n\nWhich result is right?',
      hints: ['4587 → 4 + 5 + 8 + 7 = 24 → 2 + 4 = 6. And 3296 → 20 → 2.', '6 × 2 = 12 → 3. Now find the answer whose digits reduce to 3.'],
      explain: 'The digital roots: 4587 → 6, 3296 → 2, product 12 → 3. A: 1+5+1+1+8+7+5+2 = 30 → 3 ✓. B: 27 → 0 ✗. C: 29 → 2 ✗. So **A** is the one that passes the check. Casting out nines works because a number and its digit sum leave the same remainder when divided by 9; it catches most errors but not a swapping of two digits.',
      data: {
        answer: { choice: 0, choices: ['15 118 752', '15 119 352', '15 118 742'] },
        traps: [{ match: 1, msg: 'Its digits add to 27, which is 0 after casting out nines, but the product’s check digit is 3.' }, { match: 2, msg: 'Its digits add to 29, which is 2 after casting out nines, not 3.' }],
        glyph: '9'
      },
      concepts: ['modular', 'invariant']
    },
    {
      id: 'num-2178', title: 'The Number That Turns Round', diff: 4,
      text: 'Find the four-digit number which, when **multiplied by 4**, gives the same four digits **in reverse order**.\n\nWhat is the number?',
      hints: ['The product has only four digits, so the number is below 2500. What can its first digit be?', 'The last digit of the product is the first digit of the number, and the last digit of 4 times something is even.'],
      explain: 'The first digit must be 2 (an odd first digit would give an odd last digit for 4 × ..., which is impossible), and the last digit d satisfies 4d ending in 2, so d = 8. Filling in the middle gives **2178**: 2178 × 4 = 8712. (The same trick with 9 gives 1089 × 9 = 9801, and links to the famous 1089 trick.)',
      data: { answer: { num: 2178 }, glyph: '2178' },
      concepts: ['diophantine'], links: ['num-1089']
    },

  ];
  Cabinet.family({
    id: 'number-riddles', engine: 'question', cat: 'numbers', name: 'Number riddles', order: 11,
    blurb: 'Bat and ball, lily pads, handshakes, ages, clocks and the other classics that everyone should meet once — with the traps marked.',
    origin: { year: 1202, who: 'Fibonacci, Alcuin and the textbook writers', note: 'Word problems have been teaching arithmetic since the Rhind papyrus. The classics — ages, ponds, snails, handshakes — were fixed in the books of Fibonacci, Bachet and Dudeney, and most of them still catch people out.' },
    concepts: ['rates', 'working-backwards', 'combinatorics', 'modular']
  }, list.map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]));
})();
