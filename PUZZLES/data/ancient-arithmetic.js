/* The Puzzle Cabinet · data/ancient-arithmetic.js
 * Problems of the ancients: Egypt, Babylon, Greece, China, India, the Arabs and medieval Europe.
 * Every statement is retold in our own words; the numbers are the ancient ones unless a note says otherwise. */
(function () {
  const INK = '#3a3020', RED = '#b0472f', BLUE = '#3a6ea5', GREEN = '#5a8a3a';
  const FONT = 'font-family="Georgia,serif"';
  const list = [

    /* ---------- Egypt ---------- */
    {
      id: 'aar-egypt-doubling', title: 'Multiplying by Doubling', diff: 1, year: -1650,
      source: 'Rhind Mathematical Papyrus (copied by the scribe Ahmes about 1650 BC), which opens with tables of doubling.',
      text: 'An Egyptian scribe never learned a times-table. To multiply 13 by 23 he wrote 13 in a column and doubled it line by line, while writing 1, 2, 4, 8 … beside it:\n\n1 → 13, 2 → 26, 4 → 52, 8 → 104, 16 → 208\n\nThen he **ticked** the lines whose left-hand numbers add up to 23, and added the right-hand numbers of the ticked lines.\n\nWhich left-hand numbers does he tick?',
      goal: 'Choose every line that is ticked.',
      hints: ['Start from the biggest: 16 fits into 23, and leaves 7.', '7 = 4 + 2 + 1. Each line may be used once.'],
      explain: '23 = 16 + 4 + 2 + 1, so he ticks 1, 2, 4 and 16, and adds 13 + 26 + 52 + 208 = **299**, which is 13 × 23. This is binary arithmetic, more than three thousand years before anyone gave it a name: every number is a sum of different powers of two.',
      data: { answer: { multi: [0, 1, 2, 4], choices: ['1', '2', '4', '8', '16'] }, glyph: '×2' },
      concepts: ['binary']
    },
    {
      id: 'aar-rmp-26', title: 'A Heap and Its Quarter', diff: 1, year: -1650,
      source: 'Rhind Mathematical Papyrus, problem 26 (about 1650 BC). Problems 24–27 are the “aha” (heap) problems.',
      text: 'The scribe Ahmes poses problems about an unknown heap, which he calls *aha*:\n\n*A heap and its quarter added together become 15. What is the heap?*',
      hints: ['If the heap has 4 parts, its quarter is 1 part.', 'Then 5 parts make 15.'],
      explain: 'Ahmes used **false position**: guess 4, so 4 + 1 = 5. But we need 15, which is 3 times 5, so the heap is 3 × 4 = **12**. A wrong guess, scaled, gives the right answer — it works because the problem is proportional.',
      data: { answer: { num: 12 }, glyph: '12' },
      concepts: ['working-backwards'], links: ['aar-rmp-27', 'aar-rmp-25', 'aar-rmp-24']
    },
    {
      id: 'aar-rmp-27', title: 'A Heap and Its Fifth', diff: 2, year: -1650,
      source: 'Rhind Mathematical Papyrus, problem 27 (about 1650 BC).',
      text: '*A heap and its fifth added together become 21. What is the heap?*',
      hints: ['Guess 5: then its fifth is 1, and the total is 6.', 'How many times does 6 go into 21?'],
      explain: 'Guess 5 (so that the fifth is a whole number): 5 + 1 = 6. Now 21 ÷ 6 = 3½, so the heap is 3½ × 5 = **17½**. Ahmes writes the answer as 17 + ½.',
      data: { answer: { num: 17.5, show: '17 1/2' }, glyph: '17½' },
      concepts: ['working-backwards'], links: ['aar-rmp-26', 'aar-rmp-25', 'aar-rmp-24']
    },
    {
      id: 'aar-rmp-25', title: 'A Heap and Its Half', diff: 2, year: -1650,
      source: 'Rhind Mathematical Papyrus, problem 25 (about 1650 BC).',
      text: '*A heap and its half added together become 16. What is the heap?*',
      hints: ['Guess 2: its half is 1, so the total is 3.', 'You need 16, which is 16 ÷ 3 times as much as 3.'],
      explain: 'Guess 2: 2 + 1 = 3. Then 16 ÷ 3 = 5⅓, and the heap is 5⅓ × 2 = **10⅔**. In Egyptian notation that is 10 + ⅔; ⅔ was the one fraction, besides the unit fractions, that had a sign of its own.',
      data: { answer: { num: 32 / 3, show: '10 2/3', tol: 0.01 }, glyph: '10⅔' },
      concepts: ['working-backwards'], links: ['aar-rmp-26', 'aar-rmp-27', 'aar-rmp-24']
    },
    {
      id: 'aar-rmp-24', title: 'A Heap and Its Seventh', diff: 2, year: -1650,
      source: 'Rhind Mathematical Papyrus, problem 24 (about 1650 BC).',
      text: '*A heap and its seventh added together become 19. What is the heap?*',
      hints: ['Guess 7: its seventh is 1, so the total is 8.', '19 ÷ 8 is a little over 2.'],
      explain: 'Guess 7: 7 + 1 = 8. Now 19 ÷ 8 = 2¼ + ⅛, and multiplying by 7 gives 16 + ½ + ⅛ = **16⅝**. Ahmes did it all in unit fractions, without ever writing 5/8.',
      data: { answer: { num: 16.625, show: '16 5/8' }, glyph: '16⅝' },
      concepts: ['working-backwards'], links: ['aar-rmp-26', 'aar-rmp-27', 'aar-rmp-25']
    },
    {
      id: 'aar-rmp-28', title: 'Think of a Number', diff: 3, year: -1650,
      source: 'Rhind Mathematical Papyrus, problem 28 (about 1650 BC).',
      text: 'A quantity is chosen; **two thirds** of it are added; then **a third of the sum** is taken away, and 10 remains.\n\nWhat was the quantity?',
      hints: ['Call the quantity 1 unit. After adding two thirds you have 1⅔.', 'Taking away a third of that leaves two thirds of 1⅔.'],
      explain: 'Start with 1: adding ⅔ gives 1⅔ = 5/3; taking away a third of it leaves ⅔ × 5/3 = 10/9. To end at 10 you must start with 10 ÷ (10/9) = **9**. Notice that the scribe does not care what the answer looks like: he simply works forward with the rule and scales.',
      data: { answer: { num: 9 }, traps: [{ match: 10, msg: 'That is what is left at the end. What did we start with?' }], glyph: '⅔' },
      concepts: ['working-backwards'], links: ['aar-rmp-26']
    },
    {
      id: 'aar-rmp-2-over-7', title: 'Two Loaves for Seven Men', diff: 2, year: -1650,
      source: 'Rhind Mathematical Papyrus, the table of “2 divided by an odd number” at its start (about 1650 BC).',
      text: 'Egyptians used only **unit fractions** (fractions with 1 on top: ½, ⅓, ¼ …), never two different pieces of the same size. So how can two loaves be shared among seven men?\n\nEach man’s share, 2/7 of a loaf, was written as *one quarter plus one small piece*: ¼ + 1/□.\n\nWhat are the two bottom numbers, 4 and □?',
      ask: 'Write the two denominators, for example 4, 5.',
      hints: ['Cut each of the two loaves into four quarters: that makes eight quarters. Seven of them go to the men.', 'The eighth quarter is cut into seven equal pieces, one piece for each man.'],
      explain: 'The eighth quarter is split into 7 pieces, each 1/28 of a loaf, so every man gets **¼ + 1/28**. Check: 7 × (¼ + 1/28) = 7/4 + ¼ = 2. Ahmes’s table gives one such split for every odd number up to 101.',
      data: { answer: { nums: [4, 28] }, glyph: '2/7' },
      concepts: ['diophantine']
    },
    {
      id: 'aar-rmp-40', title: 'Five Men, a Hundred Loaves', diff: 3, year: -1650,
      source: 'Rhind Mathematical Papyrus, problem 40 (about 1650 BC).',
      text: '100 loaves are shared among five men, and each man gets the **same amount more** than the man before. The three largest shares together are **seven times** the two smallest shares together.\n\nHow many loaves does the man with the largest share get?',
      hints: ['The middle man gets exactly the average: 100 ÷ 5 = 20 loaves.', 'Call the step d. The shares are 20 − 2d, 20 − d, 20, 20 + d, 20 + 2d.'],
      explain: 'The three largest add up to 60 + 3d and the two smallest to 40 − 3d. So 60 + 3d = 7 × (40 − 3d), which gives 24d = 220 and d = 9⅙. The shares are 1⅔, 10⅚, 20, 29⅙ and 38⅓; the largest is **38⅓** loaves. Ahmes found the same by false position.',
      data: { answer: { num: 115 / 3, show: '38 1/3', tol: 0.01 }, traps: [{ match: 20, msg: 'That is the middle share, the average. Who gets the most?' }], glyph: '100' },
      concepts: ['sequence', 'working-backwards'], links: ['aar-rmp-64']
    },
    {
      id: 'aar-rmp-64', title: 'Ten Men, Ten Measures', diff: 3, year: -1650,
      source: 'Rhind Mathematical Papyrus, problem 64 (about 1650 BC).',
      text: 'Ten hekat of barley are shared among ten men so that each man gets **⅛ of a hekat more** than the man before him.\n\nHow much does the tenth man get?',
      hints: ['If everyone got the same, it would be 1 hekat each.', 'The average share is 1, and the middle of ten men lies between the fifth and sixth.'],
      explain: 'The average of the shares is 1 hekat, which is also the average of the first and last: so the ten shares run symmetrically about 1. The step between the first and last is 9 × ⅛ = 1⅛; so the last man gets 1 + 9/16 = **1 9/16 hekat** and the first 7/16. Ahmes solves it by exactly this symmetry.',
      data: { answer: { num: 1.5625, show: '1 9/16' }, glyph: '10' },
      concepts: ['sequence'], links: ['aar-rmp-40']
    },
    {
      id: 'aar-rmp-50', title: 'The Round Field', diff: 2, year: -1650,
      source: 'Rhind Mathematical Papyrus, problem 50 (about 1650 BC).',
      text: 'A round field has a diameter of **9** khet. Ahmes’s rule for its area is: *take away one ninth of the diameter, and multiply what is left by itself.*\n\nWhat area, in setat, does the rule give?',
      hints: ['One ninth of 9 is 1.', 'Multiply the remainder by itself.'],
      explain: 'Take away 1 from 9 leaves 8, and 8 × 8 = **64**. The rule says that a circle has nearly the same area as a square whose side is 8/9 of its diameter — the dashed square in the picture. The result is within about 0.6 % of the true value.',
      data: {
        answer: { num: 64 }, glyph: '⌀9',
        figure: {
          w: 400, h: 220,
          svg: '<rect x="146" y="46" width="108" height="108" fill="none" stroke="' + INK + '" stroke-width="2.5"/><circle cx="200" cy="100" r="54" fill="#d5e3f0" stroke="' + BLUE + '" stroke-width="3"/><rect x="152" y="52" width="96" height="96" fill="none" stroke="' + RED + '" stroke-width="2.5" stroke-dasharray="6 4"/><text x="200" y="176" text-anchor="middle" font-size="15" ' + FONT + ' fill="' + INK + '">diameter 9: the square on eight ninths of it</text>'
        }
      },
      concepts: ['area'], links: ['aar-rmp-50-pi']
    },
    {
      id: 'aar-rmp-50-pi', title: 'The Egyptian π', diff: 3, year: -1650,
      source: 'Rhind Mathematical Papyrus, problem 50 (about 1650 BC).',
      text: 'Ahmes’s rule says that a circle of diameter *d* has the area (8/9 of *d*)². We know that a circle’s area is π × *d*² ÷ 4.\n\nSo which value of π did the Egyptians use, to two decimal places?',
      hints: ['Set π d²/4 equal to (8d/9)² and divide by d².', 'π = 4 × 64/81.'],
      explain: '(8/9)² = 64/81, so π/4 = 64/81 and π = 256/81 = **3.16**. The Babylonians of the same time used 3⅛, and the Chinese and Indians later 3.14 and better. Egypt’s value was within 0.6 % of the true one.',
      data: { answer: { num: 3.16, tol: 0.006 }, traps: [{ match: 3.14, msg: 'That is our π, or nearly. The Egyptians’ rule is a little bit off — work it out.' }], glyph: 'π' },
      concepts: ['area'], links: ['aar-rmp-50', 'aar-zu-pi']
    },
    {
      id: 'aar-rmp-56', title: 'How Steep Is a Pyramid?', diff: 3, year: -1650,
      source: 'Rhind Mathematical Papyrus, problem 56 (about 1650 BC).',
      text: 'A pyramid has a square base of **360 cubits** on a side and a height of **250 cubits**. Egyptian builders measured slope by the *seked*: how many **palms** the face moves in horizontally for every 1 cubit it rises. (One cubit is 7 palms.)\n\nWhat is the seked of this pyramid?',
      hints: ['The face moves in by half the base, 180 cubits, over the whole height, 250.', 'Divide, then turn cubits into palms with a factor of 7.'],
      explain: 'Half the base is 180 cubits; 180 ÷ 250 = 18/25 cubit for each cubit of height; 18/25 × 7 = 126/25 = **5 1/25 palms**. Ahmes’s answer is exactly “5 and 1/25”. The seked of the Great Pyramid is about 5½, a slope of just under 52°.',
      data: { answer: { num: 5.04, show: '5 1/25', tol: 0.005 }, glyph: '⛰' },
      concepts: ['rates']
    },
    {
      id: 'aar-moscow-14', title: 'The Pyramid with Its Top Cut Off', diff: 3, year: -1850,
      source: 'Moscow Mathematical Papyrus, problem 14 (about 1850 BC).',
      text: 'A truncated pyramid (a pyramid whose top has been sliced off flat) is **6 cubits high**, with a **square base of side 4** and a **square top of side 2**.\n\nWhat is its volume in cubic cubits?',
      hints: ['Complete the pyramid: if the top has side 2 and the base 4, how tall was the whole pyramid?', 'The whole pyramid is 12 high; subtract the small one that was cut off.'],
      explain: 'A whole pyramid with base 4 and height 12 has volume ⅓ × 16 × 12 = 64; the little one that was cut off (base 2, height 6) has volume ⅓ × 4 × 6 = 8; so the frustum has 64 − 8 = **56**. The scribe used the rule ⅓ × height × (a² + ab + b²) = 2 × (16 + 8 + 4) = 56 — a formula that is exactly right, and that nobody knows how the Egyptians found.',
      data: {
        answer: { num: 56 }, glyph: '56',
        figure: {
          w: 400, h: 220,
          svg: '<polygon points="110,190 270,190 240,72 160,72" fill="#f3e7c9" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><polygon points="270,190 310,162 260,57 240,72" fill="#e0cf9f" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><polygon points="160,72 240,72 260,57 180,57" fill="#fbf4dc" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><text x="190" y="212" text-anchor="middle" font-size="16" ' + FONT + ' fill="' + INK + '">4</text><text x="200" y="50" text-anchor="middle" font-size="16" ' + FONT + ' fill="' + INK + '">2</text><text x="66" y="136" font-size="16" ' + FONT + ' fill="' + RED + '">height 6</text>'
        }
      },
      concepts: ['dissection']
    },
    {
      id: 'aar-berlin-squares', title: 'The Two Small Squares', diff: 2, year: -1800,
      source: 'Berlin Papyrus 6619 (about 1800 BC).',
      text: 'An Egyptian problem about fields: a square field of area **100** has the same area as two smaller square fields together. The side of one small field is **three quarters** of the side of the other.\n\nHow long is the side of the larger of the two small fields?',
      hints: ['If the larger side is 4 parts, the smaller one is 3 parts.', 'The two areas are 16 and 9 parts of some square; 25 parts make 100.'],
      explain: 'If the sides are 4s and 3s, the areas are 16s² and 9s², which add up to 25s² = 100, so s = 2 and the larger side is **8** (the smaller 6). It is the 3–4–5 right triangle in disguise: 6² + 8² = 10².',
      data: {
        answer: { num: 8 }, glyph: '6²+8²',
        figure: {
          w: 400, h: 200,
          svg: '<rect x="20" y="60" width="110" height="110" fill="#f3d9cf" stroke="' + RED + '" stroke-width="3"/><text x="75" y="122" text-anchor="middle" font-size="18" ' + FONT + ' fill="' + INK + '">100</text><text x="153" y="122" text-anchor="middle" font-size="26" ' + FONT + ' fill="' + INK + '">=</text><rect x="178" y="90" width="88" height="80" fill="#d5e3f0" stroke="' + BLUE + '" stroke-width="3"/><text x="222" y="136" text-anchor="middle" font-size="22" ' + FONT + ' fill="' + INK + '">?</text><text x="277" y="130" text-anchor="middle" font-size="26" ' + FONT + ' fill="' + INK + '">+</text><rect x="290" y="122" width="66" height="48" fill="#dcebd0" stroke="' + GREEN + '" stroke-width="3"/>'
        }
      },
      concepts: ['area'], links: ['aar-plimpton']
    },

    /* ---------- Babylon ---------- */
    {
      id: 'aar-babylon-interest', title: 'A Shekel per Mina per Month', diff: 1, year: -1800,
      source: 'Old Babylonian loan tablets (about 1800 BC): the usual rate on silver was one shekel per mina per month.',
      text: 'A **mina** is 60 shekels. In Old Babylonian loan contracts the usual interest on silver was **one shekel per mina every month**, and it was simple interest: the interest never earned interest.\n\nHow many **years** does it take for a loan to double?',
      hints: ['One shekel on 60 is 1/60 of the loan each month.', 'Doubling means paying back the whole loan again in interest.'],
      explain: 'The loan earns 1/60 of itself every month, so it takes 60 months = **5 years** to double. That is 20 % a year, which is why Babylonian debts were sometimes cancelled by a new king.',
      data: { answer: { num: 5, unit: 'years' }, traps: [{ match: 60, msg: '60 months — and how many years is that?' }], glyph: '5y' }
    },
    {
      id: 'aar-babylon-seven', title: 'The Number That Will Not Divide', diff: 2, year: -1800,
      source: 'Babylonian school tablets with tables of reciprocals (about 1800 BC).',
      text: 'The Babylonians counted in base 60. To divide by a number, they multiplied by its **reciprocal**, which they looked up in a table. A number has a neat finite reciprocal in base 60 (like ⅛ = 0;7,30) only if its only prime factors are 2, 3 and 5, the prime factors of 60.\n\nExactly one number from 2 to 10 has **no** finite reciprocal in base 60 and is missing from the tables. Which one?',
      hints: ['Break each number into primes: 8 = 2·2·2, 9 = 3·3, 10 = 2·5.', 'Which one contains a prime other than 2, 3 or 5?'],
      explain: '**7**. The tables give reciprocals for 2, 3, 4, 5, 6, 8, 9 and 10, but 7 ends every division in a never-ending fraction, so the scribes wrote that 7 “does not divide”. It is the same reason that ⅓ has no finite decimal: 3 does not divide any power of 10, and 7 does not divide any power of 60.',
      data: { answer: { num: 7 }, glyph: '⅐' },
      concepts: ['gcd']
    },
    {
      id: 'aar-babylon-ladder', title: 'The Beam Against the Wall', diff: 2, year: -1800,
      source: 'Babylonian tablet VAT 6598 (about 1800 BC), a problem of a beam sliding down a wall.',
      text: 'A beam **30** units long stands upright against a wall. Its top slips down the wall by **6** units, and its foot slides out along the floor.\n\nHow far has the foot moved from the wall?',
      hints: ['After the slip the top is 24 units up the wall. The beam is the hypotenuse of a right triangle.', 'Remember 3–4–5: this is 18–24–30.'],
      explain: '24² + x² = 30² gives x² = 900 − 576 = 324, so x = **18**. The Babylonians knew the Pythagorean rule (and its triples) about 1,200 years before Pythagoras.',
      data: {
        answer: { num: 18 }, glyph: '18',
        figure: {
          w: 400, h: 220,
          svg: '<line x1="80" y1="20" x2="80" y2="200" stroke="' + INK + '" stroke-width="7"/><line x1="70" y1="200" x2="360" y2="200" stroke="' + INK + '" stroke-width="4"/><line x1="92" y1="50" x2="92" y2="200" stroke="' + BLUE + '" stroke-width="3" stroke-dasharray="6 5"/><line x1="84" y1="80" x2="170" y2="200" stroke="' + RED + '" stroke-width="6" stroke-linecap="round"/><path d="M60 50 L60 80 M54 50 L66 50 M54 80 L66 80" stroke="' + INK + '" stroke-width="2" fill="none"/><text x="46" y="70" text-anchor="end" font-size="16" ' + FONT + ' fill="' + INK + '">6</text><text x="132" y="118" font-size="16" ' + FONT + ' fill="' + INK + '">30</text><text x="128" y="196" text-anchor="middle" font-size="18" ' + FONT + ' fill="' + INK + '">?</text><text x="100" y="42" font-size="14" ' + FONT + ' fill="' + BLUE + '">30 at first</text>'
        }
      },
      links: ['aar-plimpton']
    },
    {
      id: 'aar-ybc7289', title: 'The Square Root of Two on Clay', diff: 3, year: -1800,
      source: 'Yale Babylonian Collection, tablet YBC 7289 (about 1800–1600 BC).',
      text: 'A small clay tablet shows a square with its two diagonals. On the top side is the number 30; along the diagonal is 1;24,51,10 — the Babylonian value of √2, written in base 60:\n\n1;24,51,10 means 1 + 24/60 + 51/3600 + 10/216000\n\nWrite it as a decimal, to four decimal places.',
      ask: 'Give the value to four decimal places.',
      hints: ['24/60 = 0.4.', '51/3600 = 0.014166…, and the last term is only 0.00005.'],
      explain: '1 + 0.4 + 0.014167 + 0.000046 = **1.41421 296…**, while √2 = 1.41421 356…: correct to six figures. Under it, the scribe wrote 42;25,35 = 30 × 1;24,51,10 for the length of the diagonal of the square of side 30.',
      data: { answer: { num: 1.4142, tol: 0.00006 }, glyph: '√2' },
      concepts: ['area']
    },
    {
      id: 'aar-plimpton', title: 'A Row of Plimpton 322', diff: 3, year: -1800,
      source: 'Plimpton 322, an Old Babylonian tablet in Columbia University (about 1800 BC).',
      text: 'Plimpton 322 is a table of right triangles in which each row gives a short side and the **hypotenuse**. Its first row is 119 and 169.\n\nWhat is the length of the other short side?',
      hints: ['Use a² + b² = c² with c = 169 and a = 119.', 'The difference of two squares factors: 169² − 119² = (169 − 119) × (169 + 119).'],
      explain: '169² − 119² = 50 × 288 = 14 400, and √14 400 = **120**. So the triangle is 119, 120, 169: two sides that differ by only 1 — a very special triple, and the tablet lists fifteen of them.',
      data: { answer: { num: 120 }, glyph: '119' },
      links: ['aar-babylon-ladder', 'aar-berlin-squares']
    },
    {
      id: 'aar-bm13901-a', title: 'The Area and the Side', diff: 3, year: -1800,
      source: 'Babylonian tablet BM 13901, problem 1 (about 1800–1600 BC).',
      text: 'The tablet begins: *I added the area and the side of my square: three quarters. What is the side?*\n\nIn today’s language: x² + x = ¾.',
      hints: ['The trick is to make the left side a perfect square: half the coefficient of x is ½.', 'Add ¼ to both sides.'],
      explain: 'Half of 1 is ½, whose square is ¼. Adding it to both sides: x² + x + ¼ = 1, so (x + ½)² = 1, x + ½ = 1 and x = **½**. This is exactly the method the scribe describes in words — completing the square — 3,000 years before al-Khwarizmi named it.',
      data: { answer: { num: 0.5, show: '1/2' }, glyph: 'x²+x' },
      concepts: ['area'], links: ['aar-bm13901-b', 'aar-khwarizmi']
    },
    {
      id: 'aar-bm13901-b', title: 'The Side Taken from the Area', diff: 3, year: -1800,
      source: 'Babylonian tablet BM 13901, problem 2 (about 1800–1600 BC).',
      text: 'The next problem on the tablet: *I took the side of my square away from the area: 870. What is the side?*\n\n(The scribe writes the number as 14,30 in base 60, which is 14 × 60 + 30.)',
      hints: ['x² − x = 870. Half of 1 is ½, and its square is ¼.', 'Then (x − ½)² = 870¼, and 870¼ is a perfect square.'],
      explain: '(x − ½)² = 870 + ¼ = 870.25 = 29.5², so x − ½ = 29.5 and x = **30**. Check: 30² − 30 = 900 − 30 = 870. The Babylonians solved a whole family of quadratics like this, always turning the problem into a square.',
      data: { answer: { num: 30 }, glyph: 'x²−x' },
      concepts: ['area'], links: ['aar-bm13901-a', 'aar-khwarizmi']
    },
    {
      id: 'aar-babylon-brothers', title: 'Ten Brothers Share the Silver', diff: 4, year: -1800,
      source: 'A problem of the “ten brothers” type from the Old Babylonian period (about 1800 BC).',
      text: 'Ten brothers share **1⅔ minas** of silver (100 shekels). Each brother gets the **same amount less** than the one before him, and the **eighth** brother gets **6 shekels**.\n\nBy how many shekels does each share differ from the one before?',
      hints: ['In a falling row the first share is a and the eighth is a − 7d, so a = 6 + 7d.', 'The total is ten times the average, and the average is the mean of the first and last shares.'],
      explain: 'Let the shares fall by d each time; the eighth is 6, so the first is 6 + 7d and the tenth is 6 − 2d. The average of the first and last is 6 + 2.5d, and ten times it is 100: 60 + 25d = 100, d = **1⅗** (1;36 in the Babylonian base 60). The shares run 17.2, 15.6, … down to 2.8 shekels.',
      data: { answer: { num: 1.6, show: '1.6', tol: 0.001 }, glyph: '10' },
      concepts: ['sequence'], links: ['aar-rmp-40', 'aar-rmp-64']
    },

    /* ---------- Greece ---------- */
    {
      id: 'aar-diophantus-epitaph', title: 'The Grave of Diophantus', diff: 2, year: 250,
      source: 'Greek Anthology, book 14, no. 126 (the epitaph of Diophantus of Alexandria, who lived about AD 250; the collection of arithmetical epigrams is credited to Metrodorus, about AD 500).',
      text: 'A riddle in verse, which the Greek Anthology says was carved on the tomb of the mathematician Diophantus:\n\n*Here lies Diophantus. A sixth of his life he was a boy. After a twelfth more, a beard covered his cheeks. After a seventh more he married, and five years after that a son was born. But the poor child died at half the age that his father reached at his own death, and Diophantus, in grief, lived on for four more years, and then he also died.*\n\nHow old was Diophantus when he died?',
      hints: ['Call his age x. The fractions of x are boyhood (x/6), youth (x/12), bachelor years (x/7) and the son’s life (x/2).', 'The remaining years are 5 and 4. Add the fractions, and see what part of x is left over.'],
      explain: '1/6 + 1/12 + 1/7 + 1/2 = 75/84, leaving 9/84 of his life for the 5 + 4 = 9 years: so x = **84**. He was a boy till 14, bearded at 21, married at 33, father at 38; the son died at 42 when Diophantus was 80, and he followed four years later. Whether the epitaph is true or a joke of the Anthology’s editor we cannot tell.',
      data: { answer: { num: 84, unit: 'years' }, traps: [{ match: 42, msg: 'That is the age of his son. How old was Diophantus?' }], glyph: '84' },
      concepts: ['diophantine', 'working-backwards'], links: ['aar-lilavati-necklace', 'aar-mahavira-lotus']
    },
    {
      id: 'aar-diophantus-i1', title: 'Split a Hundred', diff: 1, year: 250,
      source: 'Diophantus of Alexandria, *Arithmetica*, book I, problem 1 (about AD 250).',
      text: 'Diophantus opens his *Arithmetica* with: *divide a given number into two numbers whose difference is given.* His example: divide **100** into two numbers that differ by **40**.\n\nWhat are the two numbers?',
      ask: 'Write the two numbers separated by a comma.',
      hints: ['Call the smaller number x. Then the larger is x + 40.', 'The two together make 100: 2x + 40 = 100.'],
      explain: 'The smaller number is x, the larger x + 40, so 2x + 40 = 100, x = 30. The numbers are **30 and 70**. Diophantus calls his unknown the *arithmos*, “the number”, and works with it in exactly this way.',
      data: { answer: { nums: [30, 70] }, glyph: '30·70' },
      concepts: ['diophantine'], links: ['aar-diophantus-i27']
    },
    {
      id: 'aar-diophantus-i27', title: 'The Sum and the Product', diff: 2, year: 250,
      source: 'Diophantus of Alexandria, *Arithmetica*, book I, problem 27 (about AD 250).',
      text: 'Diophantus asks: *find two numbers such that their sum and their product are both given.* The example he chooses has sum **20** and product **96**.\n\nWhat are the two numbers?',
      ask: 'Write the two numbers separated by a comma.',
      hints: ['Their average is 10, so the numbers are 10 + x and 10 − x.', 'Multiply them: (10 + x)(10 − x) = 100 − x².'],
      explain: 'If the numbers are 10 + x and 10 − x, the product is 100 − x² = 96, so x² = 4 and x = 2: the numbers are **8 and 12**. Setting them “equally far from the average” is the trick every algebra book has used since.',
      data: { answer: { nums: [8, 12] }, glyph: '8·12' },
      concepts: ['diophantine'], links: ['aar-diophantus-i1']
    },
    {
      id: 'aar-metrodorus-lion', title: 'The Fountain Lion', diff: 3, year: 500,
      source: 'Greek Anthology, book 14, no. 130 (the arithmetical epigrams collected by Metrodorus, about AD 500).',
      text: 'A bronze lion stands on a fountain. Water flows from its **two eyes**, its **mouth** and the **sole of its right foot**. The right eye alone fills a tank in **2 days**, the left eye alone in **3 days**, the foot alone in **4 days**, and the mouth alone in only **6 hours**. (A day is 24 hours.)\n\nHow many hours does it take to fill the tank if all four run together?',
      hints: ['Measure each rate in tanks per day: ½, ⅓, ¼ … and the mouth: 4 tanks a day.', 'Add the rates, then turn them into a time: time = 1 ÷ rate.'],
      explain: 'In tanks per day the rates are ½ + ⅓ + ¼ + 4 = 61/12. So the tank fills in 12/61 of a day = 288/61 hours = about **4.72 hours** (4 h 43 min). Notice how the mouth dominates: the three slow spouts together add only about a quarter of its flow.',
      data: { answer: { num: 288 / 61, unit: 'hours', tol: 0.01 }, traps: [{ match: 6, msg: 'That is the mouth alone. The other spouts help.' }], glyph: '🦁' },
      concepts: ['rates'], links: ['aar-nine-pool']
    },
    {
      id: 'aar-archimedes-crown', title: 'Is the Crown Pure?', diff: 3, year: -250,
      source: 'The story is told by Vitruvius, *On Architecture* IX (about 20 BC); the numbers here are rounded for arithmetic.',
      text: 'King Hiero has had a crown made from **1000 g** of gold, and suspects the goldsmith of mixing in silver. He gives Archimedes the crown to test without damaging it. Archimedes finds the answer in his bath: he dips the crown in water and measures the volume it displaces: **60 cm³**.\n\nSuppose 1 cm³ of gold weighs 20 g, and 1 cm³ of silver weighs 10 g (rounded numbers). How many grams of silver did the goldsmith mix in?',
      hints: ['1000 g of pure gold would take up 50 cm³. The crown takes up 10 more.', 'Every gram of gold replaced by a gram of silver adds 1/10 − 1/20 = 1/20 cm³ of volume.'],
      explain: 'If x grams are silver, the volume is (1000 − x)/20 + x/10 = 50 + x/20. Setting it to 60 gives x = **200 g**: a fifth of the crown was silver. The idea is the discovery attributed to Archimedes: the same mass of a lighter metal takes up more room, and **volume** can be measured with water.',
      data: { answer: { num: 200, unit: 'grams' }, traps: [{ match: 100, msg: 'Pure silver would displace 100 cm³; this crown is a mixture.' }], glyph: '👑' },
      concepts: ['rates']
    },
    {
      id: 'aar-archimedes-cattle', title: 'The Cattle of the Sun', diff: 4, year: -250,
      source: 'Archimedes, the *Cattle Problem* (a poem sent in a letter to Eratosthenes, about 250 BC; found in a Wolfenbüttel manuscript by Lessing in 1773).',
      text: 'Archimedes challenged the mathematicians of Alexandria to count the herd of the Sun god, which has white, black, spotted and yellow bulls and cows. For the **bulls** alone, the poem gives:\n\n• the white bulls = (½ + ⅓) of the black bulls + the yellow bulls<br>• the black bulls = (¼ + ⅕) of the spotted bulls + the yellow bulls<br>• the spotted bulls = (⅙ + ⅐) of the white bulls + the yellow bulls\n\nSuppose there are **891 yellow bulls**. How many white bulls are there?',
      hints: ['½ + ⅓ = 5/6, ¼ + ⅕ = 9/20, ⅙ + ⅐ = 13/42. Write W, B, S for the white, black and spotted bulls.', 'Substitute S into B, and then B into W. You get one equation in W and Y (the yellow): 99/112 W = 53/24 Y.'],
      explain: 'W = 5/6 B + Y, B = 9/20 S + Y, S = 13/42 W + Y. Substituting gives W = 742/297 × Y, and with Y = 891 = 3 × 297, W = 3 × 742 = **2226**, B = 1602 and S = 1580. Archimedes’s full problem adds the cows and two more conditions (the white and black bulls together must make a square, and the spotted and yellow a triangular number); the smallest herd has more than 200,000 digits.',
      data: { answer: { num: 2226 }, glyph: '🐂' },
      concepts: ['diophantine']
    },
    {
      id: 'aar-euclid-gcd', title: 'Euclid’s Common Measure', diff: 2, year: -300,
      source: 'Euclid, *Elements*, book VII, propositions 1 and 2 (about 300 BC): the “antenaresis”, now called the Euclidean algorithm.',
      text: 'Euclid’s method for finding the greatest common measure of two numbers is to subtract the smaller from the larger again and again — or, quicker, to divide and keep the remainder — until the numbers are equal.\n\nWhat is the greatest common divisor of **1071** and **462**?',
      hints: ['Divide 1071 by 462: the remainder is 147.', 'Now divide 462 by 147, then 147 by the new remainder, and continue until the remainder is 0.'],
      explain: '1071 = 2 × 462 + 147; 462 = 3 × 147 + 21; 147 = 7 × 21 + 0. The last non-zero remainder is **21**. Euclid’s procedure is possibly the oldest algorithm in regular use: the computer in your pocket still uses it.',
      data: { answer: { num: 21 }, traps: [{ match: 3, msg: 'That is a common divisor, but not the greatest.' }, { match: 7, msg: 'That is a common divisor, but not the greatest.' }], glyph: '21' },
      concepts: ['gcd']
    },
    {
      id: 'aar-eratosthenes', title: 'Measuring the Earth', diff: 2, year: -240,
      source: 'Cleomedes, *On the Circular Motion of the Heavens* (about AD 200), describing the measurement of Eratosthenes of Cyrene (about 240 BC).',
      text: 'Eratosthenes, librarian of Alexandria, heard that at noon on midsummer’s day the sun shines straight down a well at Syene (Aswan), so that a stick there casts no shadow. On the same day at Alexandria, **5000 stadia** to the north, a stick does cast a shadow: the sun is **one fiftieth of a circle** (7.2°) away from overhead.\n\nHow many stadia round is the Earth?',
      hints: ['The angle at the centre of the Earth is the same 7.2° as the angle of the sun’s rays to the stick.', '7.2° is one fiftieth of 360°.'],
      explain: 'If 5000 stadia is a fiftieth of the circumference, the whole circle is 50 × 5000 = **250 000 stadia**. (Eratosthenes made it 252 000 so that it divided by 60.) How good the answer was depends on the length of the stade, which we do not know exactly: somewhere between 1 % and 16 % off.',
      data: {
        answer: { num: 250000, unit: 'stadia' }, glyph: '🌍',
        figure: {
          w: 400, h: 240,
          svg: '<circle cx="200" cy="120" r="80" fill="#d5e3f0" stroke="' + BLUE + '" stroke-width="3"/><line x1="392" y1="120" x2="280" y2="120" stroke="#d9a520" stroke-width="3"/><line x1="392" y1="80" x2="269.3" y2="80" stroke="#d9a520" stroke-width="3"/><line x1="200" y1="120" x2="280" y2="120" stroke="' + INK + '" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="200" y1="120" x2="269.3" y2="80" stroke="' + INK + '" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="269.3" y1="80" x2="286.6" y2="70" stroke="' + RED + '" stroke-width="4"/><line x1="280" y1="120" x2="300" y2="120" stroke="' + RED + '" stroke-width="4"/><path d="M238 120 A38 38 0 0 0 233 101" fill="none" stroke="' + INK + '" stroke-width="2"/><text x="246" y="112" font-size="13" ' + FONT + ' fill="' + INK + '">7.2°</text><text x="306" y="126" font-size="14" ' + FONT + ' fill="' + INK + '">Syene</text><text x="294" y="66" font-size="14" ' + FONT + ' fill="' + INK + '">Alexandria</text><text x="330" y="106" font-size="13" ' + FONT + ' fill="#a07800">sun</text><text x="200" y="228" text-anchor="middle" font-size="14" ' + FONT + ' fill="' + INK + '">the angle is exaggerated in the picture</text>'
        }
      },
      concepts: ['area']
    },
    {
      id: 'aar-thales-pyramid', title: 'Thales and the Pyramid', diff: 2, year: 100,
      source: 'Plutarch, *Banquet of the Seven Sages* 147a, and Diogenes Laertius 1.27 (the story of Thales of Miletus measuring the Great Pyramid, about 600 BC).',
      text: 'The Greeks said that Thales measured the height of the Great Pyramid by waiting for the hour of the day when a stick’s shadow is exactly as long as the stick. At that hour the pyramid’s shadow, measured from the middle of its base, is as long as the pyramid is high.\n\nThe base is **230 m** on a side. Thales cannot measure from the middle of the base, only from its edge: at that moment the tip of the shadow is **32 m beyond the edge**. How high is the pyramid?',
      hints: ['At that hour the height equals the length of the shadow measured from the centre of the base.', 'The centre is half a side, 115 m, back from the edge.'],
      explain: 'Height = shadow from the centre = 115 + 32 = **147 m**. The Great Pyramid was originally about 146.6 m high, so this is very close to the truth (the numbers here were chosen to match). The idea is the first use of similar triangles: the sun makes the stick and the pyramid two copies of the same triangle.',
      data: {
        answer: { num: 147, unit: 'metres' }, glyph: '🔺',
        figure: {
          w: 400, h: 230,
          svg: '<circle cx="40" cy="34" r="14" fill="#f2c94c" stroke="#b58900" stroke-width="2"/><polygon points="60,190 244,190 152,72" fill="#f3e7c9" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><line x1="152" y1="72" x2="270" y2="190" stroke="#d9a520" stroke-width="2.5" stroke-dasharray="6 4"/><line x1="40" y1="190" x2="380" y2="190" stroke="' + INK + '" stroke-width="3"/><line x1="310" y1="190" x2="310" y2="150" stroke="' + INK + '" stroke-width="5"/><line x1="310" y1="150" x2="350" y2="190" stroke="#d9a520" stroke-width="2.5" stroke-dasharray="6 4"/><path d="M60 205 L244 205 M60 199 L60 211 M244 199 L244 211" stroke="' + INK + '" stroke-width="1.5" fill="none"/><text x="152" y="222" text-anchor="middle" font-size="14" ' + FONT + ' fill="' + INK + '">230 m</text><text x="258" y="182" text-anchor="middle" font-size="12" ' + FONT + ' fill="' + RED + '">32 m</text><text x="320" y="140" font-size="12" ' + FONT + ' fill="' + INK + '">stick = its shadow</text>'
        }
      },
      concepts: ['area']
    },
    {
      id: 'aar-heron-triangle', title: 'Hero’s Triangle', diff: 3, year: 60,
      source: 'Hero of Alexandria, *Metrica* I.8 (about AD 60); the formula is also credited to Archimedes.',
      text: 'Hero of Alexandria gave a rule for the area of a triangle from its three sides *a*, *b*, *c* alone, without needing its height: let *s* be half the sum of the sides; the area is the square root of *s* × (*s* − *a*) × (*s* − *b*) × (*s* − *c*).\n\nWhat is the area of the triangle with sides **13, 14 and 15**?',
      hints: ['s = (13 + 14 + 15) ÷ 2 = 21.', 'The four factors are 21, 8, 7 and 6. Multiply them: 7056.'],
      explain: 's = 21, and the area is √(21 × 8 × 7 × 6) = √7056 = **84**. After 3–4–5, it is the smallest triangle whose sides are consecutive whole numbers and whose area is also a whole number. Check: drop a height of 12 onto the side 14, and ½ × 14 × 12 = 84.',
      data: { answer: { num: 84 }, glyph: '△' },
      concepts: ['area']
    },

    /* ---------- China ---------- */
    {
      id: 'aar-sunzi-pheasants', title: 'Pheasants and Rabbits', diff: 2, year: 400,
      source: 'Sunzi Suanjing (*Master Sun’s Mathematical Manual*), China, about AD 400.',
      text: 'There are pheasants and rabbits shut in one cage. Looking down from above, we count **35 heads**. Looking from below, we count **94 feet**.\n\nHow many **rabbits** are there?',
      hints: ['Pheasants have 2 feet and rabbits 4. Suppose all 35 animals were pheasants: how many feet would that be?', 'Every rabbit adds 2 feet more than a pheasant.'],
      explain: 'If all 35 were pheasants there would be 70 feet; the extra 24 feet come from rabbits, each adding 2: 24 ÷ 2 = **12 rabbits**, and 23 pheasants. Sunzi’s own trick: halve the feet (47) and subtract the heads (35) to get the rabbits directly — “order every animal to raise two feet, and count those left standing”.',
      data: { answer: { num: 12 }, traps: [{ match: 23, msg: 'That is the number of pheasants. How many rabbits?' }], glyph: '🐇' },
      concepts: ['diophantine']
    },
    {
      id: 'aar-sunzi-remainders', title: 'Things of Unknown Number', diff: 3, year: 400,
      source: 'Sunzi Suanjing (*Master Sun’s Mathematical Manual*), China, about AD 400.',
      text: 'We have a number of things, but we do not know exactly how many. Counted by threes, two are left over; counted by fives, three are left over; counted by sevens, two are left over.\n\nHow many things are there? (Give the smallest possible number.)',
      hints: ['The number is 3 more than a multiple of 5: try 3, 8, 13, 18, 23 …', 'Check each for the other two conditions: it must leave 2 on division by 3 and by 7.'],
      explain: '**23** leaves 2 on division by 3, 3 on division by 5 and 2 on division by 7. Sunzi’s rule: take 2 × 70 + 3 × 21 + 2 × 15 = 233 (70, 21 and 15 each leave remainder 1 for one divisor and 0 for the other two) and remove 105s (3 × 5 × 7) until under 105: 233 − 210 = 23. This is the ancestor of the Chinese remainder theorem.',
      data: { answer: { num: 23 }, traps: [{ match: 128, msg: 'That is also a solution, but it is not the smallest: the solutions repeat every 105.' }], glyph: '23' },
      concepts: ['modular'], links: ['aar-eggs-301']
    },
    {
      id: 'aar-hundred-fowls', title: 'A Hundred Fowls for a Hundred Coins', diff: 3, year: 470,
      source: 'Zhang Qiujian, *Zhang Qiujian Suanjing* (China, about AD 470).',
      text: 'A **cock** costs **5** coins, a **hen** **3** coins, and **three chicks** together cost **1** coin. With exactly **100 coins** we must buy exactly **100 birds**, and we want at least one bird of each kind.\n\nHow many different purchases are possible?',
      hints: ['Chicks come in threes: the number of chicks must be a multiple of 3.', 'Write the cocks as c and hens as h; the two equations reduce to 7c + 4h = 100.'],
      explain: 'The answer is **3**: 4 cocks, 18 hens, 78 chicks; or 8, 11, 81; or 12, 4, 84. Try 4 + 18 + 78 = 100 birds and 20 + 54 + 26 = 100 coins. (Allowing no cocks gives a fourth, 0, 25, 75.) Zhang gave all three solutions in his book — one of the very first indeterminate problems with more than one answer.',
      data: { answer: { num: 3 }, traps: [{ match: 4, msg: 'That counts a purchase with no cocks at all — we asked for at least one bird of each kind.' }], glyph: '100' },
      concepts: ['diophantine'], links: ['aar-alcuin-bushels', 'aar-alcuin-pigs']
    },
    {
      id: 'aar-nine-excess', title: 'The Shared Purchase', diff: 2, year: 50,
      source: 'The Nine Chapters on the Mathematical Art (China, compiled between about 200 BC and AD 100), chapter 7 (“Excess and deficit”), problem 1.',
      text: 'Some people club together to buy something. If each pays **8** coins, there are **3** coins too many; if each pays **7** coins, there are **4** too few.\n\nHow many people are there, and how much does the thing cost?',
      ask: 'Give the number of people and the price, separated by a comma.',
      hints: ['Paying one coin more each changes the surplus 3 into the deficit 4: a change of 7.', 'So the number of people is the size of that change divided by the 1 coin.'],
      explain: 'Raising the payment by 1 coin per person swings the balance from +3 to −4, a change of 7 coins, so there are **7 people**. The price is 8 × 7 − 3 = **53** (and 7 × 7 + 4 = 53). The Chinese called this the rule of “excess and deficit”; Europeans later called it the *rule of double false position*.',
      data: { answer: { nums: [7, 53] }, glyph: '7·53' },
      concepts: ['working-backwards'], links: ['aar-nine-rice']
    },
    {
      id: 'aar-nine-deer', title: 'Five Officials, Five Deer', diff: 2, year: 50,
      source: 'The Nine Chapters on the Mathematical Art (China, compiled between about 200 BC and AD 100), chapter 3 (“Proportional distribution”), problem 1.',
      text: 'Five officials of five different ranks are to share **5 deer** in proportion to their ranks: the highest gets 5 parts, the next 4, then 3, 2 and 1.\n\nHow many deer does the highest-ranking official get?',
      hints: ['The parts add up to 5 + 4 + 3 + 2 + 1 = 15.', 'One part is 5 deer divided by 15 parts.'],
      explain: 'One part is 5/15 = ⅓ deer, so the highest gets 5 × ⅓ = **1⅔ deer**; the others 1⅓, 1, ⅔ and ⅓. The Nine Chapters give such a rule for sharing taxes, wages and grain according to ranks or distances.',
      data: { answer: { num: 5 / 3, show: '1 2/3', tol: 0.005 }, glyph: '🦌' },
      concepts: ['rates']
    },
    {
      id: 'aar-nine-horses', title: 'The Good Horse and the Poor Horse', diff: 3, year: 50,
      source: 'The Nine Chapters on the Mathematical Art (China, compiled between about 200 BC and AD 100), chapter 6 (“Fair taxes”).',
      text: 'A good horse travels **240 li** a day and a poor horse **150 li** a day. The poor horse sets off **12 days earlier**.\n\nAfter how many days (from the good horse’s start) does the good horse catch the poor one?',
      hints: ['On the day the good horse starts, how far ahead is the poor horse?', 'Each day the good horse gains 240 − 150 li.'],
      explain: 'The poor horse leads by 12 × 150 = 1800 li. The good horse gains 90 li a day, so it catches up after 1800 ÷ 90 = **20 days**. Nearly every chase problem in every textbook since is this one in a different dress.',
      data: { answer: { num: 20, unit: 'days' }, traps: [{ match: 12, msg: 'That is the head start in days. How long to close the gap?' }], glyph: '🐎' },
      concepts: ['rates'], links: ['aar-alcuin-hound']
    },
    {
      id: 'aar-nine-oxen-sheep', title: 'Oxen and Sheep', diff: 3, year: 50,
      source: 'The Nine Chapters on the Mathematical Art (China, compiled between about 200 BC and AD 100), chapter 8 (“Rectangular arrays”).',
      text: 'Five oxen and two sheep together cost **10 taels** of gold; two oxen and five sheep cost **8 taels**.\n\nHow much does one sheep cost?',
      ask: 'Give the price in taels (a fraction is fine).',
      hints: ['Write the two sums as equations: 5x + 2y = 10 and 2x + 5y = 8.', 'Multiply the first by 2 and the second by 5, then subtract to remove x.'],
      explain: '10x + 4y = 20 and 10x + 25y = 40; subtracting gives 21y = 20, so a sheep is **20/21 tael** (and an ox is 34/21). The Nine Chapters solve such problems by laying the numbers out in rows on a counting board and subtracting — Gaussian elimination, some 1,800 years before Gauss.',
      data: { answer: { num: 20 / 21, show: '20/21', tol: 0.005 }, glyph: '🐑' },
      concepts: ['diophantine'], links: ['aar-nine-rice']
    },
    {
      id: 'aar-nine-rice', title: 'Three Grades of Grain', diff: 4, year: 50,
      source: 'The Nine Chapters on the Mathematical Art (China, compiled between about 200 BC and AD 100), chapter 8 (“Rectangular arrays”), problem 1.',
      text: 'Three grades of rice grow in the fields: top, medium and low. The harvest is counted in bundles:\n\n• 3 top + 2 medium + 1 low bundle give **39** dou of grain<br>• 2 top + 3 medium + 1 low give **34** dou<br>• 1 top + 2 medium + 3 low give **26** dou\n\nHow many dou does one bundle of **top** grade give?',
      hints: ['Subtract the second line from the first: how much more does a top bundle give than a medium one?', 'Use that difference to remove “top” from the other two lines, and you are left with two lines in “medium” and “low”.'],
      explain: 'Subtracting the equations pairwise leads to top = 9¼, medium = 4¼ and low = 2¾ dou: check 3 × 9¼ + 2 × 4¼ + 2¾ = 39. The Nine Chapters do this with counting rods laid out in a grid, subtracting columns from each other: what we now call **Gaussian elimination**, first recorded here.',
      data: { answer: { num: 9.25, show: '9 1/4' }, glyph: '3·2·1' },
      concepts: ['diophantine'], links: ['aar-nine-oxen-sheep', 'aar-nine-excess']
    },
    {
      id: 'aar-nine-pool', title: 'The Pool and Its Five Channels', diff: 4, year: 50,
      source: 'The Nine Chapters on the Mathematical Art (China, compiled between about 200 BC and AD 100), chapter 6 (“Fair taxes”).',
      text: 'A pool is fed by five channels. Open by itself, the first fills the pool in **⅓ of a day**, the second in **1 day**, the third in **2½ days**, the fourth in **3 days** and the fifth in **5 days**.\n\nIf all five are opened at once, in what fraction of a day is the pool full?',
      ask: 'Give the fraction of a day (a fraction like 3/8 is fine).',
      hints: ['Turn each time into a rate: pools per day. The first channel fills 3 pools a day, the second 1 …', 'Add the five rates, and the time is the reciprocal of the sum.'],
      explain: 'The rates are 3 + 1 + ⅖ + ⅓ + ⅕ = 74/15 pools per day, so the pool fills in **15/74** of a day (about 4 h 52 min). The scribes did it by the same rule as a fraction sum: add the reciprocals, then turn the answer upside down.',
      data: { answer: { num: 15 / 74, show: '15/74', tol: 0.0005 }, glyph: '15/74' },
      concepts: ['rates'], links: ['aar-metrodorus-lion']
    },
    {
      id: 'aar-nine-bamboo', title: 'The Broken Bamboo', diff: 3, year: 50,
      source: 'The Nine Chapters on the Mathematical Art (China, compiled between about 200 BC and AD 100), chapter 9 (“The right-angled triangle”).',
      text: 'A bamboo is **10 chi** high. A storm breaks it, and its tip, still attached, touches the ground **3 chi** from the foot of the stem.\n\nHow far up the stem (in chi) is the break?',
      ask: 'Give the height of the break in chi (decimals are fine).',
      hints: ['The stem below the break, the ground and the fallen part make a right triangle.', 'If the break is at height x, the fallen part is 10 − x long: x² + 3² = (10 − x)².'],
      explain: 'x² + 9 = 100 − 20x + x², so 20x = 91 and x = **4.55 chi** (4 11/20). The bamboo breaks about 4½ chi up, and the tip falls 5.45 chi. This is the Nine Chapters’ Pythagorean theorem at work, called there the *gou-gu* (“hook-leg”) rule.',
      data: {
        answer: { num: 4.55, show: '4.55', tol: 0.005, unit: 'chi' }, glyph: '🎋',
        figure: {
          w: 400, h: 226,
          svg: '<line x1="40" y1="200" x2="380" y2="200" stroke="' + INK + '" stroke-width="3"/><line x1="110" y1="200" x2="110" y2="136" stroke="' + GREEN + '" stroke-width="8" stroke-linecap="round"/><line x1="110" y1="136" x2="152" y2="200" stroke="' + GREEN + '" stroke-width="8" stroke-linecap="round"/><line x1="110" y1="136" x2="110" y2="60" stroke="' + GREEN + '" stroke-width="3" stroke-dasharray="6 5"/><path d="M110 213 L152 213 M110 207 L110 219 M152 207 L152 219" stroke="' + INK + '" stroke-width="1.5" fill="none"/><text x="131" y="226" text-anchor="middle" font-size="14" ' + FONT + ' fill="' + INK + '">3</text><text x="122" y="104" font-size="14" ' + FONT + ' fill="' + GREEN + '">10 in all</text><text x="92" y="172" text-anchor="end" font-size="16" ' + FONT + ' fill="' + RED + '">?</text>'
        }
      },
      concepts: ['area'], links: ['aar-nine-reed', 'aar-lilavati-lotus']
    },
    {
      id: 'aar-nine-reed', title: 'The Reed in the Pond', diff: 3, year: 50,
      source: 'The Nine Chapters on the Mathematical Art (China, compiled between about 200 BC and AD 100), chapter 9 (“The right-angled triangle”).',
      text: 'A square pond is **10 chi** on a side. A reed grows in the middle of it and stands **1 chi** above the water. If the reed is pulled sideways to the middle of one bank, its tip just touches the water’s edge there.\n\nHow deep is the water (in chi)?',
      hints: ['The reed’s length is the depth plus 1.', 'The reed pulled over is the hypotenuse of a right triangle with legs 5 (half the pond) and the depth.'],
      explain: 'If the depth is d, the reed is d + 1 long, and 5² + d² = (d + 1)², so 25 = 2d + 1 and d = **12 chi**. The reed is 13 chi long: (5, 12, 13) is a Pythagorean triple. The same problem was solved in India as the “lotus”, and by Bhaskara in the *Lilavati*.',
      data: {
        answer: { num: 12, unit: 'chi' }, glyph: '⚘',
        figure: {
          w: 400, h: 226,
          svg: '<rect x="150" y="80" width="100" height="120" fill="#d5e3f0" stroke="' + BLUE + '" stroke-width="3"/><line x1="200" y1="200" x2="200" y2="70" stroke="' + GREEN + '" stroke-width="5" stroke-linecap="round"/><line x1="200" y1="200" x2="250" y2="80" stroke="' + GREEN + '" stroke-width="3" stroke-dasharray="7 5"/><line x1="130" y1="80" x2="270" y2="80" stroke="' + BLUE + '" stroke-width="2"/><text x="214" y="68" font-size="14" ' + FONT + ' fill="' + INK + '">1</text><text x="200" y="102" font-size="14" ' + FONT + ' fill="' + INK + '" text-anchor="end">5</text><text x="176" y="150" font-size="20" ' + FONT + ' fill="' + RED + '">?</text><path d="M150 214 L250 214 M150 208 L150 220 M250 208 L250 220" stroke="' + INK + '" stroke-width="1.5" fill="none"/><text x="200" y="226" text-anchor="middle" font-size="14" ' + FONT + ' fill="' + INK + '">10</text>'
        }
      },
      concepts: ['area'], links: ['aar-nine-bamboo', 'aar-lilavati-lotus']
    },
    {
      id: 'aar-yanghui-field', title: 'A Field of 864 Paces', diff: 3, year: 1261,
      source: 'Yang Hui, *Detailed Analysis of the Rules in the Nine Chapters* (China, 1261).',
      text: 'A rectangular field has an area of **864 square paces**, and its breadth is **12 paces less** than its length.\n\nWhat are its length and breadth?',
      ask: 'Give the breadth and the length, separated by a comma.',
      hints: ['If the breadth is b, the length is b + 12, and b(b + 12) = 864.', 'Look for two numbers 12 apart whose product is 864: 864 = 2⁵ × 3³.'],
      explain: 'b² + 12b − 864 = 0 gives b = **24** and the length is **36**. Yang Hui solved such equations by a method of successive approximation that Europe rediscovered as *Horner’s method* in 1819, and he arranged the coefficients in the triangle that carries his name in China (Pascal’s in the West).',
      data: { answer: { nums: [24, 36] }, glyph: '864' },
      concepts: ['area', 'diophantine'], links: ['aar-bm13901-b']
    },
    {
      id: 'aar-zu-pi', title: 'Zu Chongzhi’s 355/113', diff: 2, year: 480,
      source: 'The Book of Sui (China, 7th century), on the work of Zu Chongzhi (AD 429–500).',
      text: 'Zu Chongzhi found that π lies between 3.1415926 and 3.1415927, and that the simple fraction **355/113** is a wonderfully good approximation of it. Work out 355 ÷ 113 and compare it with π = 3.14159265…\n\nHow many **decimal places** does 355/113 get right?',
      hints: ['355 ÷ 113 = 3.14159292…', 'Compare the digits after the decimal point, one by one, with 3.14159265…'],
      explain: '355/113 = 3.1415929…, and π = 3.1415926…; the two agree in the digits 3.141592, i.e. **6 decimal places**. No fraction with a denominator below 33,000 comes closer. Zu got his bounds by Liu Hui’s method of polygons with 12 288 sides; his fraction was not beaten in accuracy for nearly a thousand years.',
      data: { answer: { num: 6 }, traps: [{ match: 7, msg: 'Look at the seventh digit: 355/113 gives 9, and π gives 6.' }, { match: 5, msg: 'It is a little better than that.' }], glyph: '355' },
      concepts: ['area'], links: ['aar-rmp-50-pi']
    },

    /* ---------- India, and the Arabs ---------- */
    {
      id: 'aar-brahmagupta-debts', title: 'Debts and Fortunes', diff: 1, year: 628,
      source: 'Brahmagupta, *Brahmasphutasiddhanta* (India, AD 628), the first rules for calculating with negative numbers.',
      text: 'In AD 628 the Indian mathematician Brahmagupta wrote down rules for calculating with **fortunes** (positive numbers) and **debts** (negative numbers). One of his rules: *a debt taken away is a fortune*, and *the product of two debts is a fortune*.\n\nSomeone kindly takes away **four debts of three coins each**. By how many coins are you better off?',
      hints: ['Four debts of three coins would have cost you 12 coins.', 'Taking away the debts puts those coins back in your pocket.'],
      explain: 'You are **12 coins** better off: (−3) × (−4) = +12. Brahmagupta’s rules — debt × debt = fortune, debt × fortune = debt, and zero neither one nor the other — are the same rules taught in every school today, yet European mathematicians were still arguing about whether numbers below nothing were real a thousand years later.',
      data: { answer: { num: 12 }, glyph: '−×−' }
    },
    {
      id: 'aar-lilavati-necklace', title: 'The Broken Necklace', diff: 2, year: 1150,
      source: 'Bhaskara II, *Lilavati* (India, about 1150). By tradition the book is named after his daughter.',
      text: 'In the *Lilavati* the Indian mathematician Bhaskara puts his problems in verse and addresses his reader as a “bright-eyed girl”. One of them, in our words:\n\n*In a lovers’ quarrel a necklace of pearls was broken. A sixth of the pearls fell on the floor, a fifth landed on the bed, a third were saved by the girl, and a tenth were caught by her lover. Six pearls remained on the string.*\n\nHow many pearls were in the necklace?',
      hints: ['Add the fractions: ⅙ + ⅕ + ⅓ + 1⁄10, using thirtieths.', 'The fractions come to 24/30, so the six pearls that are left are the remaining 6/30 of the necklace.'],
      explain: 'The fractions add to 5/30 + 6/30 + 10/30 + 3/30 = 24/30, so the six pearls remaining are 6/30 = ⅕ of the necklace: there were **30 pearls**. This is “working backwards” made simple: the leftover tells you what fraction it is.',
      data: { answer: { num: 30 }, traps: [{ match: 36, msg: 'That is six times six. What fraction of the necklace do the six pearls make?' }], glyph: '30' },
      concepts: ['working-backwards'], links: ['aar-mahavira-lotus', 'aar-diophantus-epitaph']
    },
    {
      id: 'aar-mahavira-lotus', title: 'Lotus Flowers for the Gods', diff: 3, year: 850,
      source: 'Mahavira, *Ganita Sara Sangraha* (India, about AD 850).',
      text: 'The Jain mathematician Mahavira, who lived in the south of India, poses this problem in verse:\n\n*From a bunch of lotus flowers a third were offered to Shiva, a fifth to Vishnu, a sixth to the Sun, and a quarter to the goddess Bhavani. The last six were given to the teacher.*\n\nHow many flowers were in the bunch?',
      hints: ['Add ⅓ + ⅕ + ⅙ + ¼ using sixtieths.', 'The fractions come to 57/60; what fraction is left for the teacher’s six flowers?'],
      explain: '⅓ + ⅕ + ⅙ + ¼ = 20/60 + 12/60 + 10/60 + 15/60 = 57/60, leaving 3/60 = 1/20 for the teacher. So six flowers is a twentieth of the bunch: **120 flowers**. The same shape of problem appears again and again through Indian arithmetic, for pearls, bees, coins and grain.',
      data: { answer: { num: 120 }, glyph: '🪷' },
      concepts: ['working-backwards'], links: ['aar-lilavati-necklace', 'aar-diophantus-epitaph']
    },
    {
      id: 'aar-lilavati-peacock', title: 'The Peacock and the Snake', diff: 3, year: 1150,
      source: 'Bhaskara II, *Lilavati* (India, about 1150).',
      text: 'A pillar **9 cubits** high has a peacock on top of it. At the foot of the pillar is a snake’s hole. The snake is gliding towards its hole from a spot **27 cubits** from the pillar. The peacock sees it and pounces along a slanting line. The bird and the snake move at the same speed, and meet.\n\nHow many cubits from the hole do they meet?',
      hints: ['Call the meeting distance x from the hole. The snake covers 27 − x on the ground.', 'The peacock’s path is the hypotenuse of a right triangle with legs 9 and x. It has to equal 27 − x.'],
      explain: 'Both cover the same distance: √(9² + x²) = 27 − x. Squaring: 81 + x² = 729 − 54x + x², so 54x = 648 and x = **12 cubits**. Check: the peacock flies √(81 + 144) = 15, and the snake glides 27 − 12 = 15. Notice the 9–12–15 right triangle: it is a 3–4–5 triangle magnified three times.',
      data: {
        answer: { num: 12, unit: 'cubits' }, glyph: '🦚',
        figure: {
          w: 400, h: 230,
          svg: '<line x1="30" y1="200" x2="380" y2="200" stroke="' + INK + '" stroke-width="3"/><rect x="84" y="110" width="12" height="90" fill="#e9dfc4" stroke="' + INK + '" stroke-width="3"/><circle cx="90" cy="102" r="7" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="2"/><path d="M90 102 L210 200" stroke="' + BLUE + '" stroke-width="3" stroke-dasharray="7 5"/><path d="M360 198 C345 186 335 210 320 196 C305 184 295 208 280 196 C265 186 255 206 240 198 L212 198" fill="none" stroke="' + GREEN + '" stroke-width="5" stroke-linecap="round"/><path d="M90 216 L360 216 M90 210 L90 222 M360 210 L360 222" stroke="' + INK + '" stroke-width="1.5" fill="none"/><text x="225" y="228" text-anchor="middle" font-size="14" ' + FONT + ' fill="' + INK + '">27</text><text x="72" y="160" text-anchor="end" font-size="14" ' + FONT + ' fill="' + INK + '">9</text><text x="150" y="192" text-anchor="middle" font-size="18" ' + FONT + ' fill="' + RED + '">?</text>'
        }
      },
      concepts: ['area'], links: ['aar-lilavati-lotus', 'aar-nine-reed']
    },
    {
      id: 'aar-lilavati-lotus', title: 'The Lotus in the Lake', diff: 3, year: 1150,
      source: 'Bhaskara II, *Lilavati* (India, about 1150).',
      text: 'In a still lake a lotus flower stands **half a cubit** above the water. A gust of wind bends it sideways, and it disappears under the surface at a distance of **2 cubits** from where it stood.\n\nHow deep is the water, in cubits?',
      hints: ['The stem was as long as the depth plus ½. The bent stem is the hypotenuse of a right triangle.', 'Legs: the depth d and the 2 cubits sideways. Hypotenuse: d + ½.'],
      explain: 'd² + 2² = (d + ½)² = d² + d + ¼, so d = 4 − ¼ = **3¾ cubits**. The stem is 4¼ long: check 3.75² + 2² = 14.0625 + 4 = 18.0625 = 4.25². It is exactly the Chinese “reed in the pond” problem of a thousand years earlier — did it travel along the Silk Road?',
      data: {
        answer: { num: 3.75, show: '3.75', unit: 'cubits' }, glyph: '🪷',
        figure: {
          w: 400, h: 226,
          svg: '<rect x="60" y="120" width="280" height="76" fill="#d5e3f0" stroke="' + BLUE + '" stroke-width="3"/><line x1="130" y1="196" x2="130" y2="110" stroke="' + GREEN + '" stroke-width="5" stroke-linecap="round"/><circle cx="130" cy="104" r="8" fill="#f3b6c8" stroke="#a04060" stroke-width="2"/><line x1="130" y1="196" x2="170" y2="122" stroke="' + GREEN + '" stroke-width="3" stroke-dasharray="7 5"/><path d="M130 210 L170 210 M130 204 L130 216 M170 204 L170 216" stroke="' + INK + '" stroke-width="1.5" fill="none"/><text x="150" y="224" text-anchor="middle" font-size="14" ' + FONT + ' fill="' + INK + '">2</text><text x="144" y="112" font-size="13" ' + FONT + ' fill="' + INK + '">½</text><text x="112" y="165" text-anchor="end" font-size="20" ' + FONT + ' fill="' + RED + '">?</text>'
        }
      },
      concepts: ['area'], links: ['aar-lilavati-peacock', 'aar-nine-reed', 'aar-nine-bamboo']
    },
    {
      id: 'aar-lilavati-bees', title: 'The Swarm of Bees', diff: 4, year: 1150,
      source: 'Bhaskara II, *Lilavati* (India, about 1150).',
      text: 'A swarm of bees: the **square root of half** of all the bees went to a jasmine bush. **Eight ninths** of the whole swarm stayed at home. And two more bees — a male trapped inside a lotus flower, drawn by its scent, and a female buzzing outside — made up the rest.\n\nHow many bees were in the swarm?',
      hints: ['Let m be the number of bees in the jasmine bush: half the swarm is m², so the swarm is 2m².', 'Then 2m² = m + (8/9) × 2m² + 2. The 1/9 that is left over gives you a quadratic equation in m.'],
      explain: 'With N = 2m², the equation N = m + 8N/9 + 2 reduces to N/9 = m + 2, so 2m² = 9m + 18. Then m = 6 (the other root is negative): the bush had 6 bees, the swarm N = **72**. Check: √(72/2) = 6, 8/9 of 72 = 64, and 6 + 64 + 2 = 72.',
      data: { answer: { num: 72 }, traps: [{ match: 36, msg: 'That is half the swarm. What is the whole swarm?' }], glyph: '🐝' },
      concepts: ['working-backwards', 'diophantine']
    },
    {
      id: 'aar-eggs-301', title: 'The Basket of Eggs', diff: 3, year: 1000,
      source: 'A remainder problem of Ibn al-Haytham (Alhazen, about AD 1000), also in Fibonacci’s *Liber Abaci* (1202).',
      text: 'A market woman has a basket of eggs. Counting them out **two** at a time leaves one over. So does counting them **three**, **four**, **five** and **six** at a time. Counting them **seven** at a time leaves none over.\n\nWhat is the smallest number of eggs?',
      hints: ['The number is 1 more than a common multiple of 2, 3, 4, 5 and 6: that is, 1 more than a multiple of 60.', 'Try 61, 121, 181, 241, 301 … and test each for divisibility by 7.'],
      explain: 'The number is 60k + 1 for some k. Divisible by 7: 60k + 1 ≡ 4k + 1 (mod 7), which is 0 when k = 5. So the smallest is 60 × 5 + 1 = **301** = 7 × 43. The next is 301 + 420 = 721. The problem has been a favourite ever since Ibn al-Haytham’s day, and the story has different women and different eggs in different books.',
      data: { answer: { num: 301 }, traps: [{ match: 721, msg: 'That works, but it is not the smallest.' }, { match: 61, msg: 'It leaves 1 when counted by twos to sixes, but is 61 divisible by 7?' }], glyph: '🥚' },
      concepts: ['modular'], links: ['aar-sunzi-remainders']
    },
    {
      id: 'aar-khwarizmi', title: 'A Square and Ten Roots', diff: 3, year: 820,
      source: 'Muhammad ibn Musa al-Khwarizmi, *The Compendious Book on Calculation by Completion and Balancing* (Baghdad, about AD 820).',
      text: 'The first worked example of the book that gave us the word “algebra”: *one square and ten roots of the same are equal to thirty-nine dirhams.*\n\nIn modern symbols, x² + 10x = 39. What is the root x?',
      hints: ['Draw the square of side x, and attach a strip of width 2½ (a quarter of ten) to each of its four sides.', 'The four corners are missing: 4 squares of 2½ × 2½ make 25. Add 25 to both sides.'],
      explain: 'Add the four corner squares (4 × 6¼ = 25) to both sides: the left is now a big square of side x + 5, with area 39 + 25 = 64, so x + 5 = 8 and x = **3**. al-Khwarizmi says “halve the roots (5), multiply by itself (25), add it to 39 (64), take the root (8), subtract half the roots: 3”, and shows the geometry of the completed square.',
      data: {
        answer: { num: 3 }, glyph: 'x²',
        figure: {
          w: 400, h: 200,
          svg: '<rect x="170" y="70" width="60" height="60" fill="#d5e3f0" stroke="' + BLUE + '" stroke-width="2.5"/><rect x="170" y="20" width="60" height="50" fill="#dcebd0" stroke="' + GREEN + '" stroke-width="2.5"/><rect x="170" y="130" width="60" height="50" fill="#dcebd0" stroke="' + GREEN + '" stroke-width="2.5"/><rect x="120" y="70" width="50" height="60" fill="#dcebd0" stroke="' + GREEN + '" stroke-width="2.5"/><rect x="230" y="70" width="50" height="60" fill="#dcebd0" stroke="' + GREEN + '" stroke-width="2.5"/><g fill="#f3d9cf" stroke="' + RED + '" stroke-width="2" stroke-dasharray="5 3"><rect x="120" y="20" width="50" height="50"/><rect x="230" y="20" width="50" height="50"/><rect x="120" y="130" width="50" height="50"/><rect x="230" y="130" width="50" height="50"/></g><text x="200" y="106" text-anchor="middle" font-size="18" ' + FONT + ' fill="' + INK + '">x²</text><text x="200" y="50" text-anchor="middle" font-size="12" ' + FONT + ' fill="' + INK + '">2½x</text><text x="200" y="160" text-anchor="middle" font-size="12" ' + FONT + ' fill="' + INK + '">2½x</text><text x="145" y="104" text-anchor="middle" font-size="12" ' + FONT + ' fill="' + INK + '">2½x</text><text x="255" y="104" text-anchor="middle" font-size="12" ' + FONT + ' fill="' + INK + '">2½x</text>'
        }
      },
      concepts: ['area'], links: ['aar-bm13901-a', 'aar-bm13901-b']
    },

    /* ---------- Alcuin ---------- */
    {
      id: 'aar-alcuin-ladder', title: 'Doves on the Ladder', diff: 1, year: 800,
      source: 'Attributed to Alcuin of York (about 735–804), *Propositiones ad acuendos juvenes* (“Problems to sharpen the young”), the oldest collection of mathematical puzzles in Latin, about AD 800.',
      text: 'Alcuin, the scholar who taught at the court of Charlemagne, asks:\n\n*There is a ladder with 100 steps. On the first step sits 1 dove, on the second 2 doves, on the third 3, and so on, each step with one more dove than the one below, up to 100 doves on the hundredth step.*\n\nHow many doves are there altogether?',
      hints: ['Pair the first step with the last: 1 + 100.', 'The second step with the second-last: 2 + 99. How many such pairs are there?'],
      explain: 'The steps pair up into 50 pairs, each summing to 101: 50 × 101 = **5050**. It is the sum of the numbers from 1 to 100 that the schoolboy Gauss is said to have found in seconds around 1785; Alcuin’s book has it a thousand years earlier.',
      data: {
        answer: { num: 5050 }, glyph: '5050',
        figure: {
          w: 400, h: 226,
          svg: (function () {
            let s = '<line x1="150" y1="216" x2="150" y2="20" stroke="' + INK + '" stroke-width="5"/><line x1="270" y1="216" x2="270" y2="20" stroke="' + INK + '" stroke-width="5"/>';
            const ys = [196, 160, 124, 88, 52];
            ys.forEach(function (y, i) {
              s += '<line x1="150" y1="' + y + '" x2="270" y2="' + y + '" stroke="' + INK + '" stroke-width="3"/>';
              s += '<text x="132" y="' + (y + 5) + '" text-anchor="end" font-size="14" ' + FONT + ' fill="' + INK + '">' + (i + 1) + '</text>';
              for (let k = 0; k <= i; k++) {
                const x = 168 + k * 20;
                s += '<ellipse cx="' + x + '" cy="' + (y - 9) + '" rx="8" ry="5.5" fill="#fbf8ef" stroke="' + BLUE + '" stroke-width="2"/><circle cx="' + (x + 7) + '" cy="' + (y - 14) + '" r="3.2" fill="#fbf8ef" stroke="' + BLUE + '" stroke-width="1.6"/>';
              }
            });
            s += '<text x="210" y="30" text-anchor="middle" font-size="18" ' + FONT + ' fill="' + INK + '">⋮</text><text x="290" y="34" font-size="13" ' + FONT + ' fill="' + RED + '">…to the 100th step</text>';
            return s;
          })()
        }
      },
      concepts: ['sequence'], links: ['seq-triangular']
    },
    {
      id: 'aar-alcuin-cabbage', title: 'The Wolf, the Goat and the Cabbage', diff: 1, year: 800,
      source: 'Attributed to Alcuin of York, *Propositiones ad acuendos juvenes* (about AD 800): the oldest known form of the river-crossing puzzle.',
      text: 'A man must ferry a **wolf**, a **goat** and a **cabbage** across a river. His boat carries himself and only one of them at a time. He may not leave the wolf alone with the goat (it would be eaten), nor the goat alone with the cabbage.\n\nWhat must he carry across **first**?',
      hints: ['After the first crossing, the two he leaves behind must be safe together.', 'Only one pair is safe when he is away.'],
      explain: 'The **goat**: wolf and cabbage may be left alone together. Then: back empty; take the wolf (or the cabbage) across; bring the goat back; take the cabbage (or the wolf) across; go back empty; and take the goat over: **7 crossings**. Alcuin’s book has this puzzle and a version with three brothers and their sisters (in another riddle here).',
      data: {
        answer: { choice: 1, choices: ['The wolf', 'The goat', 'The cabbage', 'Nothing: cross empty-handed first'] },
        traps: [{ match: 0, msg: 'Then the goat and the cabbage are left alone, and the goat has dinner.' }, { match: 2, msg: 'Then the wolf and the goat are left alone, and the wolf has dinner.' }, { match: 3, msg: 'It will not hurt, but it does not help either.' }],
        glyph: '🐺'
      },
      concepts: ['state-space'], links: ['aar-alcuin-crossing']
    },
    {
      id: 'aar-alcuin-snail', title: 'The Snail Invited to Dinner', diff: 2, year: 800,
      source: 'Attributed to Alcuin of York, *Propositiones ad acuendos juvenes* (about AD 800).',
      text: 'A swallow invites a snail to dinner at a place **one league** away. The snail can crawl **one inch a day**. Alcuin counts a league as 1500 paces, a pace as 5 feet and a foot as 12 inches.\n\nHow many **days** will the snail take to get to dinner?',
      hints: ['How many inches are there in 1500 paces?', '1500 × 5 × 12.'],
      explain: 'One league is 1500 × 5 × 12 = 90 000 inches, so the snail needs **90 000 days**: “246 years and 210 days”, Alcuin says, forgetting leap years. The swallow, one imagines, would have finished the dessert long before.',
      data: { answer: { num: 90000, unit: 'days' }, traps: [{ match: 7500, msg: 'That is the number of feet. The snail moves an inch a day.' }], glyph: '🐌' },
      concepts: ['rates']
    },
    {
      id: 'aar-alcuin-hound', title: 'The Hound and the Hare', diff: 2, year: 800,
      source: 'Attributed to Alcuin of York, *Propositiones ad acuendos juvenes* (about AD 800).',
      text: 'A hare is **150 feet** ahead of a hound. The hare bounds **7 feet** at each leap, and the hound **9 feet**; they leap at the same moments.\n\nAfter how many leaps of the hound will the hound catch the hare?',
      hints: ['At each leap the hound gains a little on the hare. How much?', 'The gap starts at 150 feet.'],
      explain: 'The hound gains 9 − 7 = 2 feet at each leap, so it closes a 150-foot gap in 150 ÷ 2 = **75 leaps**. Check: the hound has run 75 × 9 = 675 feet and the hare 75 × 7 = 525: exactly 150 less.',
      data: { answer: { num: 75 }, traps: [{ match: 150, msg: 'That would be if the hound gained a foot at a time. How much does it gain per leap?' }], glyph: '🐕' },
      concepts: ['rates'], links: ['aar-nine-horses']
    },
    {
      id: 'aar-alcuin-oil', title: 'The Dying Man’s Flasks', diff: 3, year: 800,
      source: 'Attributed to Alcuin of York, *Propositiones ad acuendos juvenes* (about AD 800).',
      text: 'A dying man leaves **30 flasks** to his three sons: **10 full of oil**, **10 half full** and **10 empty**. The sons are to share both the **flasks** and the **oil** equally, and nothing may be poured from flask to flask.\n\nIn Alcuin’s solution one son gets only the ten half-full flasks. How many **full** flasks does each of the other two sons get?',
      hints: ['Each son must have 10 flasks and the equivalent of 5 full flasks of oil.', 'The first son gets ten halves: 5 full flasks’ worth. The other two must share the 10 full and 10 empty.'],
      explain: 'The first son takes the ten half-full flasks (10 flasks, 5 flasks of oil). The other two share the full and the empty ones equally: each gets **5 full and 5 empty** flasks (10 flasks, 5 of oil). There is a second, more even solution: two sons each get 4 full, 2 half and 4 empty; the third gets 2 full, 6 half and 2 empty.',
      data: { answer: { num: 5 }, glyph: '🏺' },
      concepts: ['diophantine']
    },
    {
      id: 'aar-alcuin-pigs', title: 'A Hundred Pigs for a Hundred Pence', diff: 3, year: 800,
      source: 'A problem in the manner of Alcuin of York, *Propositiones ad acuendos juvenes* (about AD 800).',
      text: 'A merchant wants to buy exactly **100 pigs for exactly 100 pence**. A boar costs **10 pence**, a sow **5 pence**, and **two piglets cost 1 penny**. He must buy at least one of each kind.\n\nHow many piglets does he buy?',
      hints: ['If b boars, s sows and p piglets: b + s + p = 100, and 10b + 5s + p/2 = 100.', 'Double the second: 20b + 10s + p = 200. Subtract the first: 19b + 9s = 100.'],
      explain: '19b + 9s = 100 has only one solution with b and s at least 1: b = 1 and s = 9. That leaves 100 − 1 − 9 = **90 piglets**. Check: 10 + 45 + 45 = 100 pence. Whole-number equations like this one, with several unknowns and fewer equations, are called *Diophantine* after Diophantus.',
      data: { answer: { num: 90 }, glyph: '🐖' },
      concepts: ['diophantine'], links: ['aar-hundred-fowls', 'aar-alcuin-bushels']
    },
    {
      id: 'aar-alcuin-bushels', title: 'A Hundred Bushels for a Hundred People', diff: 4, year: 800,
      source: 'A problem in the manner of Alcuin of York, *Propositiones ad acuendos juvenes* (about AD 800).',
      text: '**100 bushels** of grain are to be shared among **100 people**: each **man** gets **3** bushels, each **woman** gets **2**, and each **child** gets **½**. There is at least one man, one woman and one child.\n\nIn how many different ways can the 100 people be made up?',
      hints: ['Let m, w and c be the numbers: m + w + c = 100 and 3m + 2w + c/2 = 100. Double the second and subtract the first.', 'You get 5m + 3w = 100. The number of women must be a multiple of 5.'],
      explain: '5m + 3w = 100 forces w to be a multiple of 5: w = 5, 10, 15, 20, 25, 30, and then m = 17, 14, 11, 8, 5, 2 and c = 78, 76, 74, 72, 70, 68. That is **6 ways** (one of them is 11 men, 15 women and 74 children). Alcuin’s book is happy with one answer; more than one is the mark of a true Diophantine problem.',
      data: { answer: { num: 6 }, traps: [{ match: 7, msg: 'A seventh would need no women at all (20 men, 80 children) — but we asked for at least one woman.' }], glyph: '100' },
      concepts: ['diophantine'], links: ['aar-hundred-fowls', 'aar-alcuin-pigs']
    },
    {
      id: 'aar-alcuin-crossing', title: 'Three Brothers and Their Sisters', diff: 4, year: 800,
      source: 'Attributed to Alcuin of York, *Propositiones ad acuendos juvenes* (about AD 800): the problem of the three brothers, each with a sister.',
      text: 'Three brothers, each with one sister, come to a river. The boat carries **two people** at a time. Each brother is very protective: **no sister may ever be left in the company of another brother unless her own brother is there too** (on either bank, or in the boat).\n\nWhat is the **smallest number of crossings** (each trip in either direction counts as one) that gets all six across?',
      hints: ['Try it with pencil and paper: label the brothers A, B, C and the sisters a, b, c.', 'It helps to send the sisters across together at some point, and to bring one sister back.'],
      explain: 'The fewest possible is **11**. One way: A+a over, A back; b+c over, a back; B+C over, B+b back; A+B over, c back; a+b over, C back; C+c over. (Alcuin’s puzzle is the oldest known relative of the “jealous husbands” puzzles; with four couples in a two-person boat it cannot be done at all.)',
      data: { answer: { num: 11 }, traps: [{ match: 9, msg: 'Nine trips are not enough — someone is always left in a bad company.' }, { match: 7, msg: 'Seven is what the wolf, goat and cabbage need. This one takes longer.' }], glyph: '3+3' },
      concepts: ['state-space'], links: ['aar-alcuin-cabbage']
    },

    /* ---------- Fibonacci, Chuquet, Tartaglia ---------- */
    {
      id: 'aar-fibonacci-women', title: 'Seven Old Women on the Road to Rome', diff: 3, year: 1202,
      source: 'Leonardo of Pisa (Fibonacci), *Liber Abaci* (1202), chapter 12.',
      text: 'Fibonacci asks: *Seven old women are on the road to Rome. Each has seven mules; each mule carries seven sacks; each sack holds seven loaves; each loaf has seven knives; and each knife has seven sheaths.*\n\nHow many things are on the road altogether: women, mules, sacks, loaves, knives and sheaths?',
      hints: ['Each level is seven times the one before: 7, 49, 343 …', 'Add up six levels.'],
      explain: '7 + 49 + 343 + 2401 + 16 807 + 117 649 = **137 256**. Fibonacci gives the same answer as the quick rule for a geometric sum: 7 × (7⁶ − 1) ÷ 6. It is the Egyptian “seven houses” problem, 2,850 years on — and the ancestor of the nursery rhyme about the man going to St Ives.',
      data: { answer: { num: 137256 }, traps: [{ match: 117649, msg: 'That is just the sheaths. Count every level.' }], glyph: '7⁶' },
      concepts: ['geometric-series'], links: ['riddle-rhind-79']
    },
    {
      id: 'aar-fibonacci-birds', title: 'Thirty Birds for Thirty Pence', diff: 3, year: 1202,
      source: 'Leonardo of Pisa (Fibonacci), *Liber Abaci* (1202), the problems on buying birds.',
      text: 'A man buys **30 birds** — partridges, pigeons and sparrows — for exactly **30 pence**. A partridge costs **3 pence**, a pigeon **2 pence**, and **two sparrows cost 1 penny**. He buys at least one of each kind.\n\nHow many **sparrows** does he buy?',
      hints: ['Let p, q and s be the birds: p + q + s = 30 and 3p + 2q + s/2 = 30. Double the second and subtract the first.', 'You get 5p + 3q = 30. The only solution with p and q at least 1 is p = 3, q = 5.'],
      explain: '5p + 3q = 30 has just one solution in positive whole numbers, p = 3 and q = 5, leaving 30 − 3 − 5 = **22 sparrows**. Check: 9 + 10 + 11 = 30 pence. This is the same family as the Chinese hundred fowls and Alcuin’s pigs.',
      data: { answer: { num: 22 }, glyph: '🐦' },
      concepts: ['diophantine'], links: ['aar-hundred-fowls', 'aar-alcuin-pigs']
    },
    {
      id: 'aar-fibonacci-towers', title: 'The Two Towers and the Birds', diff: 3, year: 1202,
      source: 'Leonardo of Pisa (Fibonacci), *Liber Abaci* (1202).',
      text: 'Two towers stand **50 paces** apart, one **30 paces** high and the other **40 paces**. Between them is a fountain. A bird flies from the top of each tower straight to the fountain; the two birds fly at the same speed and arrive at exactly the same moment.\n\nHow far is the fountain from the lower (30-pace) tower?',
      hints: ['Equal speeds and equal times mean equal distances flown.', 'Call the distance x. Each flight is the hypotenuse of a right triangle: 30² + x² = 40² + (50 − x)².'],
      explain: '900 + x² = 1600 + 2500 − 100x + x², so 100x = 3200 and x = **32 paces** (the fountain is 18 from the taller tower). Each bird flies √1924, about 43.9 paces. Notice that the x² terms cancel, so you never have to solve a quadratic.',
      data: {
        answer: { num: 32, unit: 'paces' }, glyph: '🗼',
        figure: {
          w: 400, h: 226,
          svg: '<line x1="40" y1="200" x2="370" y2="200" stroke="' + INK + '" stroke-width="3"/><rect x="82" y="80" width="16" height="120" fill="#e9dfc4" stroke="' + INK + '" stroke-width="3"/><rect x="282" y="40" width="16" height="160" fill="#e9dfc4" stroke="' + INK + '" stroke-width="3"/><path d="M90 80 L218 200 M290 40 L218 200" stroke="' + BLUE + '" stroke-width="2.5" stroke-dasharray="7 5"/><circle cx="90" cy="76" r="5" fill="' + BLUE + '"/><circle cx="290" cy="36" r="5" fill="' + BLUE + '"/><path d="M204 200 Q218 178 232 200 Z" fill="#a8c8e8" stroke="' + BLUE + '" stroke-width="2"/><text x="72" y="145" text-anchor="end" font-size="14" ' + FONT + ' fill="' + INK + '">30</text><text x="310" y="125" font-size="14" ' + FONT + ' fill="' + INK + '">40</text><path d="M90 214 L290 214 M90 208 L90 220 M290 208 L290 220" stroke="' + INK + '" stroke-width="1.5" fill="none"/><text x="190" y="226" text-anchor="middle" font-size="14" ' + FONT + ' fill="' + INK + '">50</text><text x="150" y="192" text-anchor="middle" font-size="18" ' + FONT + ' fill="' + RED + '">?</text>'
        }
      },
      concepts: ['area'], links: ['aar-lilavati-peacock']
    },
    {
      id: 'aar-fibonacci-rabbits', title: 'The Rabbits of Pisa', diff: 3, year: 1202,
      source: 'Leonardo of Pisa (Fibonacci), *Liber Abaci* (1202), chapter 12.',
      text: 'Fibonacci asks: *A man puts a pair of newborn rabbits in a walled garden. How many pairs will there be at the end of a year, if every pair produces a new pair every month from its second month of life on, and no rabbit dies?*\n\nCount the original pair as well.',
      hints: ['After month 1 there are 2 pairs (the original one has bred once). After month 2 there are 3, since only the original pair breeds again.', 'Each month’s total is the sum of the two months before: 2, 3, 5, 8, 13 …'],
      explain: 'Month by month: 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, **377**. Every month’s number is the sum of the previous two, because the newly born are the number that were alive two months before. The numbers 1, 1, 2, 3, 5, 8 … are called Fibonacci numbers, though they were known earlier in India.',
      data: { answer: { num: 377 }, traps: [{ match: 233, msg: 'That is the number after eleven months. Go one more.' }, { match: 144, msg: 'That is the number after ten months. Keep going.' }, { match: 376, msg: 'Almost: don’t forget to count the original pair.' }], glyph: '🐇' },
      concepts: ['sequence', 'recursion'], links: ['seq-fibonacci']
    },
    {
      id: 'aar-chuquet-tryllion', title: 'Chuquet’s Names for Big Numbers', diff: 2, year: 1484,
      source: 'Nicolas Chuquet, *Triparty en la science des nombres* (Lyon, 1484).',
      text: 'The French mathematician Nicolas Chuquet was the first to name the huge numbers. A **million** is a thousand thousand. A **byllion** is a million millions (10¹²), and a **tryllion** is a million million millions. The pattern continues: quadrillion, quintillion and so on.\n\n10 to what power is a **tryllion**?',
      ask: 'The exponent: 10 to the power of …',
      hints: ['A million is 10⁶ and a byllion is 10¹². What is the pattern for the exponent?', 'Each new name multiplies by another million: 10⁶ more.'],
      explain: 'A tryllion is a million × a million × a million = 10⁶ × 10⁶ × 10⁶ = **10¹⁸**. Chuquet’s “long scale” is still used in much of Europe: the modern American billion (10⁹) is smaller than his byllion (10¹²). He also wrote powers as raised numbers and used zero and negative exponents.',
      data: { answer: { num: 18 }, traps: [{ match: 12, msg: 'That is a byllion. One more step.' }, { match: 9, msg: 'A thousand million is the American billion. In Chuquet’s scheme, a byllion is bigger.' }], glyph: '10¹⁸' },
      concepts: ['geometric-series']
    },
    {
      id: 'aar-tartaglia-sapphire', title: 'The Sapphire Merchant', diff: 4, year: 1535,
      source: 'In the manner of the thirty problems that Antonio Fior set Niccolò Tartaglia in their algebra contest of 1535 (Tartaglia, *Quesiti et inventioni diverse*, 1546).',
      text: 'Fior challenged Tartaglia with problems that could only be solved by cubic equations, then the frontier of mathematics. In their style:\n\n*A merchant sells a sapphire for 500 ducats. His profit equals the cube root of his capital.*\n\nWhat did the sapphire cost him — his capital — in ducats, to the nearest ducat?',
      ask: 'Give the capital in ducats (to the nearest ducat).',
      hints: ['Let the profit be p: capital = p³, and selling price = capital + profit = p³ + p = 500.', 'Try p = 7 (350) and p = 8 (520), then home in between: about 7.9.'],
      explain: 'We need p³ + p = 500. The solution is p ≈ 7.895, so the capital is p³ ≈ **492.1 ducats** and the profit about 7.9. Cubics like this were the great challenge: Tartaglia found the formula for “cube plus unknown equals number” on the night of 12 February 1535 and won the contest, thirty to nothing.',
      data: { answer: { num: 492.1, tol: 0.6, show: '492' }, glyph: '∛' },
      concepts: ['diophantine']
    },

    {
      id: 'aar-fibonacci-purse', title: 'Three Men Find a Purse', diff: 5, year: 1202,
      source: 'Leonardo of Pisa (Fibonacci), *Liber Abaci* (1202), chapter 12: problems of men who find a purse.',
      text: 'Three men each have some money, and together they find a purse of coins. The first man says: “If I take the purse, I shall have **twice** as much as you two together.” The second: “If I take it, I shall have **three times** as much as you two.” The third: “If I take it, I shall have **four times** as much as you two.”\n\nWhat is the smallest number of coins the purse can hold?',
      hints: ['Call the three men’s money a, b, c and the purse p, and let s = a + b + c. Then a + p = 2(s − a), b + p = 3(s − b), c + p = 4(s − c).', 'Solve for a, b, c in terms of s and p: a = (2s − p)/3, b = (3s − p)/4, c = (4s − p)/5. Then add: a + b + c = s.'],
      explain: 'Adding the three expressions gives 133s − 47p = 60s, so 73s = 47p. The smallest whole-number solution is s = 47 and p = **73**, and then the men have 7, 17 and 23 coins. Check: 7 + 73 = 80 = 2 × 40; 17 + 73 = 90 = 3 × 30; 23 + 73 = 96 = 4 × 24. Fibonacci gives a whole family of such problems in the *Liber Abaci*; today we would call each a system of linear equations.',
      data: { answer: { num: 73 }, traps: [{ match: 47, msg: 'That is what the three men have together. How many coins in the purse?' }], glyph: '73' },
      concepts: ['diophantine'], links: ['aar-nine-rice']
    },

  ];
  Cabinet.family({
    id: 'ancient-arithmetic', engine: 'question', cat: 'numbers', name: 'Problems of the ancients', order: 10,
    blurb: 'Clay tablets, papyri and the first arithmetic books: Ahmes, Diophantus, Sunzi, Bhaskara, Alcuin and Fibonacci.',
    origin: { year: -1800, who: 'Scribes of Babylon and Egypt', note: 'The oldest problems we have were written on clay and papyrus to train young scribes. They come with worked answers, so we know how the ancients thought — and that they enjoyed a good puzzle.' },
    concepts: ['diophantine', 'rates', 'geometric-series', 'modular']
  }, list.map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]));
})();
