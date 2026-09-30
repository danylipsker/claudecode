/* The Puzzle Cabinet · data/sequences.js
 * What comes next? Numbers, letters and words in a row, each with one intended rule. */
(function () {
  const list = [

    /* ---------- easy: counting, squares, calendars ---------- */
    {
      id: 'seq-count-fives', title: 'Counting by Fives', diff: 1,
      text: 'What number comes next?\n\n**5, 10, 15, 20, …**',
      hints: ['How much bigger is each number than the one before?'],
      explain: 'Each number is 5 more than the one before, so the next is **25**. An arithmetic sequence adds the same amount every time; it is the simplest kind, and the first one you ever learned.',
      data: { answer: { num: 25 }, glyph: '+5' }
    },
    {
      id: 'seq-odd', title: 'The Odd Numbers', diff: 1,
      text: 'What number comes next?\n\n**1, 3, 5, 7, 9, …**',
      hints: ['What is the step from each number to the next?'],
      explain: 'Add 2 each time: the next is **11**. The odd numbers hide a secret: the sum of the first n of them is n². One, one plus three, one plus three plus five: 1, 4, 9 — the squares.',
      data: { answer: { num: 11 }, glyph: '+2' },
      links: ['seq-squares']
    },
    {
      id: 'seq-doubling', title: 'Doubling', diff: 1,
      text: 'What number comes next?\n\n**1, 2, 4, 8, 16, …**',
      hints: ['Compare each number with the one before, by dividing rather than subtracting.'],
      explain: 'Each number is double the one before, so the next is **32**. A geometric sequence multiplies by the same number every time, and grows very quickly: 2⁶⁴ grains of rice on a chessboard is more than the world could ever grow.',
      data: { answer: { num: 32 }, glyph: '×2' },
      concepts: ['geometric-series'], links: ['seq-moser', 'seq-two-power-down']
    },
    {
      id: 'seq-two-power-down', title: 'Powers of Two, Backwards', diff: 1,
      text: 'What number comes next?\n\n**1024, 512, 256, 128, 64, …**',
      hints: ['Each number is half of the one before.'],
      explain: 'Each number is half of the last, so the next is **32**. These are the powers of two counting down: 2¹⁰, 2⁹, 2⁸, 2⁷, 2⁶, and now 2⁵. (1024 is the number of bytes in a kilobyte, if you ever wondered why.)',
      data: { answer: { num: 32 }, glyph: '÷2' },
      concepts: ['geometric-series', 'binary'], links: ['seq-doubling']
    },
    {
      id: 'seq-squares', title: 'The Square Numbers', diff: 1,
      text: 'What number comes next?\n\n**1, 4, 9, 16, 25, …**',
      hints: ['These are all products of a number by itself: 1 × 1, 2 × 2 …'],
      explain: 'The next square is 6 × 6 = **36**. The gaps between squares are the odd numbers, 3, 5, 7, 9, 11, so each square is the one before plus the next odd number.',
      data: { answer: { num: 36 }, glyph: 'n²' },
      links: ['seq-odd', 'seq-cubes']
    },
    {
      id: 'seq-triangular', title: 'Triangular Numbers', diff: 1,
      text: 'What number comes next?\n\n**1, 3, 6, 10, 15, …**',
      hints: ['Look at the differences between neighbours: 2, 3, 4, 5.', 'Imagine bowling pins: one in front, then rows of 2, 3, 4 behind it.'],
      explain: 'Add 6 to get **21**: each number is the one before plus the next whole number. These are the triangular numbers, the number of pins in a triangle of rows — and, by Gauss’s old trick, 1 + 2 + … + n = n(n + 1)/2. The doves on Alcuin’s ladder are also this sequence.',
      data: { answer: { num: 21 }, traps: [{ match: 20, msg: 'The gaps grow by one each time: 2, 3, 4, 5 … so the next gap is 6, not 5.' }], glyph: '△' },
      concepts: ['sequence'], links: ['aar-alcuin-ladder', 'seq-lazy-caterer']
    },
    {
      id: 'seq-fibonacci', title: 'The Rabbits’ Numbers', diff: 1, year: 1202,
      source: 'Leonardo of Pisa (Fibonacci), *Liber Abaci* (1202). The sequence was known earlier in Indian writings on verse metre.',
      text: 'What number comes next?\n\n**1, 1, 2, 3, 5, 8, …**',
      hints: ['Add two neighbours: what do you get?', '1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5 …'],
      explain: 'Each number is the sum of the two before it, so the next is 5 + 8 = **13**. These are the Fibonacci numbers, from Leonardo of Pisa’s problem of the breeding rabbits; they turn up in the spirals of sunflowers, the family tree of bees and the steps of a staircase.',
      data: { answer: { num: 13 }, glyph: 'φ' },
      concepts: ['sequence', 'recursion'], links: ['aar-fibonacci-rabbits', 'num-stairs', 'seq-lucas']
    },
    {
      id: 'seq-pascal-row', title: 'A Row of the Triangle', diff: 1,
      source: 'Yang Hui’s triangle (China, 1261), also known as Pascal’s triangle.',
      text: 'What number comes next?\n\n**1, 6, 15, 20, 15, 6, …**',
      hints: ['Look at the whole row: it reads the same forwards and backwards.', 'It is a row of a famous triangle in which every number is the sum of the two above it.'],
      explain: 'The row is symmetrical, so it ends with **1**. This is the row for n = 6 of Pascal’s triangle (Yang Hui’s in China, four centuries earlier): 1, 6, 15, 20, 15, 6, 1, whose sum is 2⁶ = 64. It gives the coefficients in (a + b)⁶.',
      data: { answer: { num: 1 }, glyph: '🔺' },
      concepts: ['combinatorics', 'symmetry']
    },
    {
      id: 'seq-months', title: 'The Months in Letters', diff: 1,
      text: 'Which letter comes next?\n\n**J, F, M, A, M, J, J, A, S, O, N, …**',
      ask: 'Which letter comes next?',
      hints: ['These are the first letters of things that come in a year.', 'January, February, March …'],
      explain: 'They are the first letters of the months of the year, and the last one is December: **D**. It looks like nonsense until you notice it is a calendar in disguise.',
      data: { answer: { text: ['D', 'December'] }, glyph: 'JFM' }
    },
    {
      id: 'seq-week', title: 'The Week in Letters', diff: 1,
      text: 'Which letter comes next?\n\n**M, T, W, T, F, S, …**',
      ask: 'Which letter comes next?',
      hints: ['They are the initials of the days of the week, starting on Monday.'],
      explain: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday — and **S** for Sunday completes the week.',
      data: { answer: { text: ['S', 'Sunday'] }, glyph: 'MTW' }
    },
    {
      id: 'seq-number-letters', title: 'One, Two, Three in Letters', diff: 1,
      text: 'Which letter comes next?\n\n**O, T, T, F, F, S, S, E, …**',
      ask: 'Which letter comes next?',
      hints: ['They are the initials of a very well-known list of words.', 'One, two, three, four …'],
      explain: 'O, T, T, F, F, S, S, E are the first letters of one, two, three, four, five, six, seven, eight. The next is **N** for nine (and then T for ten).',
      data: { answer: { text: ['N', 'nine'] }, glyph: 'OTT' }
    },
    {
      id: 'seq-days-in-months', title: 'The Length of the Months', diff: 1,
      text: 'What number comes next?\n\n**31, 28, 31, 30, 31, 30, 31, 31, …**',
      hints: ['There is a rhyme that lists the same numbers in words: “Thirty days hath …”', 'Which month has this number of days after August?'],
      explain: 'These are the days of January, February, March, April, May, June, July and August. September has **30**. (In leap years, February’s 28 becomes 29.)',
      data: { answer: { num: 30 }, glyph: '31' }
    },
    {
      id: 'seq-planets', title: 'Out from the Sun', diff: 1,
      text: 'Which word comes next?\n\n**Mercury, Venus, Earth, Mars, …**',
      ask: 'Which planet comes next?',
      hints: ['They are in order of distance from the Sun.'],
      explain: 'After Mars, the next planet from the Sun is **Jupiter**, the giant. The four rocky planets of the inner solar system come first, then the gas giants.',
      data: { answer: { text: ['Jupiter'] }, glyph: '♃' }
    },
    {
      id: 'seq-rainbow', title: 'The Colours of the Rainbow', diff: 1,
      text: 'Which word comes next?\n\n**Red, Orange, Yellow, Green, Blue, Indigo, …**',
      ask: 'Which colour comes next?',
      hints: ['It is the order of the colours in a rainbow, from the outside to the inside.'],
      explain: 'The last colour of the spectrum, as Newton named the seven, is **violet**. (Newton chose seven, some say, because of the seven notes in a musical scale.)',
      data: { answer: { text: ['Violet', 'purple'] }, glyph: '🌈' }
    },
    {
      id: 'seq-zodiac', title: 'The Signs of the Zodiac', diff: 1,
      text: 'Which sign comes next?\n\n**Aries, Taurus, Gemini, Cancer, Leo, …**',
      ask: 'Which sign comes next?',
      hints: ['They are the twelve signs of the zodiac, in the order of the year.'],
      explain: 'After Leo comes **Virgo**, then Libra, Scorpio, Sagittarius, Capricorn, Aquarius and Pisces.',
      data: { answer: { text: ['Virgo'] }, glyph: '♈' }
    },
    {
      id: 'seq-compass', title: 'Round the Compass', diff: 1,
      text: 'Which direction comes next?\n\n**N, NE, E, SE, S, …**',
      ask: 'Which direction comes next?',
      hints: ['It is a turn clockwise round the compass, one eighth of a turn at a time.'],
      explain: 'The next point clockwise is **SW** (south-west), then W, NW, and back to N.',
      data: { answer: { text: ['SW', 'south west', 'southwest', 'south-west'] }, glyph: '🧭' }
    },
    {
      id: 'seq-keyboard', title: 'The Top Row', diff: 1,
      text: 'Which letter comes next?\n\n**Q, W, E, R, T, …**',
      ask: 'Which letter comes next?',
      hints: ['It is not the alphabet. Look at your keyboard.'],
      explain: 'They are the letters on the top row of a standard keyboard, and the next is **Y**. This “QWERTY” layout dates from the typewriters of the 1870s (the usual story is that it was arranged to keep the typebars from jamming).',
      data: { answer: { text: ['Y'] }, glyph: 'QWE' }
    },
    {
      id: 'seq-notes', title: 'The Scale', diff: 1,
      text: 'Which letter comes next?\n\n**C, D, E, F, G, A, …**',
      ask: 'Which letter comes next?',
      hints: ['They are the names of the notes of the C major scale.'],
      explain: 'The scale of C major runs C, D, E, F, G, A, **B**, and then C again an octave higher. The note names A to G, in the alphabet’s order, repeat after seven.',
      data: { answer: { text: ['B'] }, glyph: '♪' }
    },
    {
      id: 'seq-backwards', title: 'Every Other Letter Backwards', diff: 1,
      text: 'Which letter comes next?\n\n**Z, X, V, T, R, …**',
      ask: 'Which letter comes next?',
      hints: ['Count the steps from one letter to the next in the alphabet.'],
      explain: 'Each letter is two places before the last in the alphabet, so after R comes **P**. Going the other way, the same pattern would be A, C, E, G …',
      data: { answer: { text: ['P'] }, glyph: 'ZXV' }
    },
    {
      id: 'seq-plus-nine', title: 'Digits That Add to Ten', diff: 1,
      text: 'What number comes next?\n\n**19, 28, 37, 46, 55, …**',
      hints: ['Look at the difference between neighbours, and at the digit sums.', 'Each number’s two digits add up to 10.'],
      explain: 'Each is 9 more than the one before, and the digits always add up to 10; the next is **64**. Adding 9 lowers the units digit by 1 and raises the tens digit by 1 — which is why the digit sum stays the same. It is the seed of the nine-times table finger trick.',
      data: { answer: { num: 64 }, glyph: '+9' }
    },
    {
      id: 'seq-greek', title: 'The Greek Alphabet', diff: 1,
      text: 'Which letter comes next?\n\n**alpha, beta, gamma, delta, …**',
      ask: 'Which Greek letter comes next?',
      hints: ['The word “alphabet” is made of the first two.'],
      explain: 'The fifth Greek letter is **epsilon**, followed by zeta, eta and theta. Mathematicians borrowed the whole alphabet; ε is the traditional symbol for a very small quantity.',
      data: { answer: { text: ['epsilon'] }, glyph: 'αβγ' }
    },

    /* ---------- fair: well-known families ---------- */
    {
      id: 'seq-primes', title: 'The Primes', diff: 2,
      text: 'What number comes next?\n\n**2, 3, 5, 7, 11, 13, …**',
      hints: ['These are numbers with a special property: nothing divides them but 1 and themselves.', 'Check 15 (3 × 5), then 16, then 17.'],
      explain: 'These are the prime numbers: 2, 3, 5, 7, 11, 13 and next **17**. There is no rule that gives the next prime directly; Euclid proved 2,300 years ago that the list never ends.',
      data: { answer: { num: 17 }, traps: [{ match: 15, msg: '15 = 3 × 5, so it is not prime.' }, { match: 14, msg: '14 = 2 × 7, so it is not prime.' }], glyph: 'P' },
      concepts: ['sequence'], links: ['seq-sylvester']
    },
    {
      id: 'seq-cubes', title: 'The Cube Numbers', diff: 2,
      text: 'What number comes next?\n\n**1, 8, 27, 64, …**',
      hints: ['1 = 1 × 1 × 1, 8 = 2 × 2 × 2 …'],
      explain: 'These are the cubes: n × n × n. The next is 5³ = **125**. Nicomachus noticed that if you add up consecutive cubes you always get a square: 1³ + 2³ + 3³ = 36 = 6².',
      data: { answer: { num: 125 }, glyph: 'n³' },
      links: ['seq-squares', 'seq-sum-cubes']
    },
    {
      id: 'seq-factorials', title: 'Factorials', diff: 2,
      text: 'What number comes next?\n\n**1, 2, 6, 24, 120, …**',
      hints: ['Each number is a multiple of the one before: by what?', '2 = 1 × 2, 6 = 2 × 3, 24 = 6 × 4 …'],
      explain: 'Multiply by 2, then 3, then 4, then 5, so the next is 120 × 6 = **720**. These are the factorials, n! = 1 × 2 × … × n, the number of ways to arrange n different things in a row.',
      data: { answer: { num: 720 }, glyph: 'n!' },
      concepts: ['combinatorics']
    },
    {
      id: 'seq-differences', title: 'Growing Steps', diff: 2,
      text: 'What number comes next?\n\n**3, 4, 6, 9, 13, 18, …**',
      hints: ['Write the differences between neighbours.', 'The differences are 1, 2, 3, 4, 5 …'],
      explain: 'The steps between neighbours are 1, 2, 3, 4, 5, so the next step is 6 and the next number is 18 + 6 = **24**. When the first differences are not constant, try the differences of the differences.',
      data: { answer: { num: 24 }, glyph: '+n' },
      concepts: ['sequence'], links: ['seq-lazy-caterer']
    },
    {
      id: 'seq-pronic', title: 'Numbers Made of Neighbours', diff: 2,
      text: 'What number comes next?\n\n**2, 6, 12, 20, 30, …**',
      hints: ['Try splitting each number into two factors that are next to each other.', '2 = 1 × 2, 6 = 2 × 3, 12 = 3 × 4 …'],
      explain: 'Each is the product of two consecutive numbers: 1 × 2, 2 × 3, 3 × 4, 4 × 5, 5 × 6 and next 6 × 7 = **42**. They are twice the triangular numbers, and the “oblong” numbers of the ancient Greeks.',
      data: { answer: { num: 42 }, glyph: '1·2' },
      links: ['seq-triangular']
    },
    {
      id: 'seq-n2-plus-1', title: 'A Square and One', diff: 2,
      text: 'What number comes next?\n\n**2, 5, 10, 17, 26, …**',
      hints: ['Compare with the squares: 1, 4, 9, 16, 25.'],
      explain: 'Each is a square plus one: 1 + 1, 4 + 1, 9 + 1, 16 + 1, 25 + 1 and next 36 + 1 = **37**.',
      data: { answer: { num: 37 }, glyph: 'n²+1' },
      links: ['seq-squares', 'seq-n2-minus-1']
    },
    {
      id: 'seq-mersenne', title: 'One Less than a Power', diff: 2,
      text: 'What number comes next?\n\n**1, 3, 7, 15, 31, …**',
      hints: ['Compare with the powers of two: 2, 4, 8, 16, 32.'],
      explain: 'Each is one less than a power of two: 2¹ − 1, 2² − 1, … and the next is 2⁶ − 1 = **63**. They are also “double the last and add one”, the number of moves that the Tower of Hanoi needs for n discs.',
      data: { answer: { num: 63 }, glyph: '2ⁿ−1' },
      concepts: ['binary', 'recursion'], links: ['seq-doubling']
    },
    {
      id: 'seq-pi-digits', title: 'The Digits of π', diff: 2,
      text: 'What number comes next?\n\n**3, 1, 4, 1, 5, 9, 2, …**',
      hints: ['Think of a very famous number, about 22/7, and its decimal expansion.', 'It is the ratio of the circumference of a circle to its diameter.'],
      explain: 'They are the digits of π = 3.14159265…, and the next is **6**. Nobody has found a rule for the digits of π; they have been computed to over a hundred trillion places, and no pattern has ever been found.',
      data: { answer: { num: 6 }, glyph: 'π' },
      concepts: ['sequence'], links: ['seq-pi-words', 'aar-zu-pi']
    },
    {
      id: 'seq-pi-words', title: 'A Sentence for π', diff: 2,
      text: 'A well-known way to remember π is a sentence in which each word has as many letters as the digit it stands for:\n\n**May I have a large container of coffee …**\n\nThe words have 3, 1, 4, 1, 5, 9, 2, 6 letters. How many letters must the **next** word have?',
      ask: 'How many letters has the next word?',
      hints: ['3, 1, 4, 1, 5, 9, 2, 6 are the digits of a famous number.', 'π = 3.14159265358979…'],
      explain: 'π = 3.14159265358…, so after 3, 1, 4, 1, 5, 9, 2, 6 comes **5** (as in “strong” or “tasty”). Such memory sentences are called *piems* or *pilish*, and people have written poems and even whole books in this style.',
      data: { answer: { num: 5 }, glyph: '3.14' },
      links: ['seq-pi-digits']
    },
    {
      id: 'seq-letters-in-numbers', title: 'The Length of the Number Names', diff: 2,
      text: 'What number comes next?\n\n**3, 3, 5, 4, 4, 3, 5, 5, 4, …**',
      hints: ['Think of words, not numbers: what could the numbers be counting?', 'The first is 3: the word “one” has three letters.'],
      explain: 'Each number is the number of letters in the English name of 1, 2, 3, …: one (3), two (3), three (5), four (4), five (4), six (3), seven (5), eight (5), nine (4), and ten has **3**.',
      data: { answer: { num: 3 }, glyph: 'one' }
    },
    {
      id: 'seq-two-last-digit', title: 'Last Digits of the Powers of Two', diff: 2,
      text: 'What number comes next?\n\n**2, 4, 8, 6, 2, 4, 8, …**',
      hints: ['Think of the powers of two: 2, 4, 8, 16, 32, 64, 128.', 'Look only at the last digit of each.'],
      explain: 'These are the last digits of 2, 4, 8, 16, 32, 64, 128: the cycle 2, 4, 8, 6 repeats, and the next is 256 → **6**. Cycles like this make the last digit of enormous powers easy to find.',
      data: { answer: { num: 6 }, glyph: '2ⁿ' },
      concepts: ['modular'], links: ['num-last-digit']
    },
    {
      id: 'seq-roman', title: 'The Roman Letters', diff: 2,
      text: 'Which letter comes next?\n\n**I, V, X, L, C, …**',
      ask: 'Which letter comes next?',
      hints: ['They are not in the alphabet’s order. They are all numerals.', 'I is 1, V is 5, X is 10 …'],
      explain: 'They are the Roman numerals in order of size: I = 1, V = 5, X = 10, L = 50, C = 100 and **D** = 500, then M = 1000.',
      data: { answer: { text: ['D'] }, glyph: 'IVX' }
    },
    {
      id: 'seq-elements', title: 'The First Ten Elements', diff: 2,
      text: 'What comes next?\n\n**H, He, Li, Be, B, C, N, O, F, …**',
      ask: 'Which symbol comes next?',
      hints: ['These are symbols from a famous chart on the wall of every chemistry lab.', 'Hydrogen, helium, lithium, beryllium …'],
      explain: 'They are the symbols of the chemical elements in order of atomic number, from hydrogen (1) to fluorine (9). The tenth is **Ne**, neon.',
      data: { answer: { text: ['Ne', 'neon'] }, glyph: 'H He' }
    },
    {
      id: 'seq-az-by', title: 'Ends and Middles', diff: 2,
      text: 'What comes next?\n\n**AZ, BY, CX, DW, …**',
      ask: 'Which pair of letters comes next?',
      hints: ['Look at the first letters alone, then the second letters alone.', 'One goes forwards through the alphabet, the other backwards.'],
      explain: 'The first letters run A, B, C, D, **E** forwards; the second run Z, Y, X, W, **V** backwards. So the next pair is **EV**.',
      data: { answer: { text: ['EV'] }, glyph: 'AZ' }
    },
    {
      id: 'seq-zeno', title: 'Half of What Is Left', diff: 2, year: -450,
      source: 'Zeno of Elea (about 450 BC): the “dichotomy” paradox, reported by Aristotle.',
      text: 'A runner covers half of a path, then half of what is left, then half of what is left again, and so on. After each stage, the fraction of the path he has covered is:\n\n**½, ¾, ⅞, 15/16, …**\n\nWhat number do these fractions get closer and closer to?',
      hints: ['What fraction of the path is still to go after each stage?', 'The remaining part is ½, ¼, ⅛, 1/16 … and shrinks towards zero.'],
      explain: 'What is left after n stages is 1/2ⁿ, which shrinks to nothing, so the fractions approach **1**: the whole path. Zeno claimed the runner could never finish, since there are infinitely many stages; the answer is that infinitely many pieces can add up to a finite total, ½ + ¼ + ⅛ + … = 1.',
      data: { answer: { num: 1 }, glyph: '½¾⅞' },
      concepts: ['geometric-series'], links: ['num-achilles']
    },
    {
      id: 'seq-a2c4', title: 'Letters and Numbers, Alternately', diff: 2,
      text: 'What comes next?\n\n**A, 2, C, 4, E, 6, G, 8, …**',
      ask: 'What comes next?',
      hints: ['Two sequences are woven together: take every second entry.', 'The letters are A, C, E, G; the numbers are 2, 4, 6, 8.'],
      explain: 'The letters go A, C, E, G — every other letter — and the next is **I**. (The numbers, in their turn, go 2, 4, 6, 8, and the next would be 10.) Two rules take turns; every second term follows one.',
      data: { answer: { text: ['I'] }, glyph: 'A2C' }
    },

    {
      id: 'seq-planets-letters', title: 'The Planets in Letters', diff: 2,
      text: 'Which letter comes next?\n\n**M, V, E, M, J, S, U, …**',
      ask: 'Which letter comes next?',
      hints: ['They are initials of the planets in order from the Sun.', 'Mercury, Venus, Earth, Mars …'],
      explain: 'The initials of Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus — and the eighth planet, Neptune: **N**. (“My Very Educated Mother Just Served Us Nachos” is one of many sentences to remember them by.)',
      data: { answer: { text: ['N', 'Neptune'] }, glyph: 'MVE' }
    },

    /* ---------- tricky: the sequences with a name ---------- */
    {
      id: 'seq-pentagonal', title: 'Pentagon Numbers', diff: 3,
      text: 'What number comes next?\n\n**1, 5, 12, 22, 35, …**',
      hints: ['Look at the differences: 4, 7, 10, 13 …', 'The differences grow by 3 each time.'],
      explain: 'The steps are 4, 7, 10, 13, so the next step is 16 and the next number is 35 + 16 = **51**. These are the pentagonal numbers n(3n − 1)/2: the number of dots in nested pentagons. Euler used them in a famous theorem about counting partitions.',
      data: { answer: { num: 51 }, glyph: '⬠' },
      concepts: ['sequence'], links: ['seq-hexagonal', 'seq-triangular']
    },
    {
      id: 'seq-hexagonal', title: 'Hexagon Numbers', diff: 3,
      text: 'What number comes next?\n\n**1, 6, 15, 28, 45, …**',
      hints: ['The differences are 5, 9, 13, 17.', 'The step grows by 4 each time.'],
      explain: 'The steps 5, 9, 13, 17 grow by 4, so the next step is 21 and the next number is 45 + 21 = **66**. These are the hexagonal numbers n(2n − 1), and they are every second triangular number: 1, 3, 6, 10, 15, 21, 28 …',
      data: { answer: { num: 66 }, glyph: '⬡' },
      concepts: ['sequence'], links: ['seq-pentagonal', 'seq-triangular']
    },
    {
      id: 'seq-honeycomb', title: 'Honeycomb Numbers', diff: 3,
      text: 'What number comes next?\n\n**1, 7, 19, 37, 61, …**',
      hints: ['Differences: 6, 12, 18, 24.', 'The step grows by 6 each time. Picture a hexagon of cells surrounded by ring after ring of more cells.'],
      explain: 'The steps 6, 12, 18, 24 grow by 6, so the next step is 30 and the next number is 61 + 30 = **91**. These are the centred hexagonal numbers 3n(n − 1) + 1: the number of cells in a honeycomb with n rings around the first cell. Bees know them.',
      data: { answer: { num: 91 }, glyph: '🐝' },
      concepts: ['sequence'], links: ['seq-hexagonal']
    },
    {
      id: 'seq-tetrahedral', title: 'A Pyramid of Cannonballs', diff: 3,
      text: 'What number comes next?\n\n**1, 4, 10, 20, 35, …**',
      hints: ['Differences: 3, 6, 10, 15 — do you know them?', 'The differences are the triangular numbers. Picture a triangle of balls on top of the layer below.'],
      explain: 'The steps 3, 6, 10, 15 are triangular numbers, so the next step is 21 and the next number is 35 + 21 = **56**. These are the tetrahedral numbers, the number of cannonballs in a pyramid with a triangle for its base.',
      data: { answer: { num: 56 }, glyph: '▲' },
      concepts: ['sequence'], links: ['seq-triangular']
    },
    {
      id: 'seq-semiprimes', title: 'Made of Two Primes', diff: 3,
      text: 'What number comes next?\n\n**4, 6, 9, 10, 14, 15, …**',
      hints: ['Break each number into prime factors: 4 = 2 × 2, 6 = 2 × 3 …', 'Each has exactly two prime factors.'],
      explain: 'Each number is a product of exactly two primes: 4 = 2 × 2, 6 = 2 × 3, 9 = 3 × 3, 10 = 2 × 5, 14 = 2 × 7, 15 = 3 × 5, and the next is 3 × 7 = **21**. The numbers between (like 12 = 2 × 2 × 3, or 8) have three prime factors, and the primes themselves only one.',
      data: { answer: { num: 21 }, traps: [{ match: 16, msg: '16 = 2 × 2 × 2 × 2 has four prime factors.' }, { match: 18, msg: '18 = 2 × 3 × 3 has three prime factors.' }], glyph: 'p·q' },
      concepts: ['sequence']
    },
    {
      id: 'seq-prime-squares', title: 'Squares of Primes', diff: 3,
      text: 'What number comes next?\n\n**4, 9, 25, 49, 121, …**',
      hints: ['They are all square numbers, but some are missing.', '2², 3², 5², 7², 11² — what is missing from the list of all squares, and why?'],
      explain: 'These are the squares of the primes 2, 3, 5, 7, 11, so the next is 13² = **169**. The squares of 4, 6, 8, 9, 10 are missing because 4, 6, 8, 9, 10 are not primes.',
      data: { answer: { num: 169 }, glyph: 'p²' },
      links: ['seq-primes', 'seq-squares']
    },
    {
      id: 'seq-times-three-plus-one', title: 'Three Times and One', diff: 3,
      text: 'What number comes next?\n\n**1, 4, 13, 40, 121, …**',
      hints: ['Compare 4 with 1, and 13 with 4.', 'Try multiplying by 3 and adding something.'],
      explain: 'Each number is three times the one before, plus 1: 1 × 3 + 1 = 4, 4 × 3 + 1 = 13, …, and 121 × 3 + 1 = **364**. These are (3ⁿ − 1)/2, the sums 1 + 3 + 9 + 27 + 81 + … of the powers of three.',
      data: { answer: { num: 364 }, glyph: '×3+1' },
      concepts: ['geometric-series']
    },
    {
      id: 'seq-plus-one-double', title: 'One More, Then Double', diff: 3,
      text: 'What number comes next?\n\n**1, 2, 4, 5, 10, 11, 22, 23, …**',
      hints: ['Look at the way the terms change: some steps are small, some are big.', 'Two operations take it in turns.'],
      explain: 'The rule alternates: add 1, double, add 1, double, … 1 → 2 → 4 → 5 → 10 → 11 → 22 → 23 → **46**. When a sequence seems to jump about, look for two operations taking turns.',
      data: { answer: { num: 46 }, glyph: '+1×2' }
    },
    {
      id: 'seq-doubling-steps', title: 'Steps That Double', diff: 3,
      text: 'What number comes next?\n\n**5, 6, 8, 12, 20, …**',
      hints: ['Look at the differences, not the numbers.', 'The differences are 1, 2, 4, 8.'],
      explain: 'The steps between the numbers are 1, 2, 4, 8, and they double every time: the next step is 16 and the next number is 20 + 16 = **36**. Each number is a power of two plus 4: 4 + 1, 4 + 2, 4 + 4, 4 + 8, 4 + 16, 4 + 32.',
      data: { answer: { num: 36 }, glyph: '+2ⁿ' },
      concepts: ['geometric-series']
    },
    {
      id: 'seq-times3-minus1', title: 'Times Three, Take One', diff: 3,
      text: 'What number comes next?\n\n**1, 3, 2, 6, 5, 15, 14, …**',
      hints: ['Compare each number with the one before: is it bigger or smaller?', 'Two operations take turns: one multiplies, one subtracts.'],
      explain: 'The rule alternates: multiply by 3, subtract 1, multiply by 3, subtract 1 …: 1 → 3 → 2 → 6 → 5 → 15 → 14 → **42**.',
      data: { answer: { num: 42 }, glyph: '×3−1' }
    },
    {
      id: 'seq-times2-minus1', title: 'Doubling and Dipping', diff: 3,
      text: 'What number comes next?\n\n**2, 4, 3, 6, 5, 10, 9, …**',
      hints: ['Some steps go up, and some go down.', 'Try to describe the up-steps and the down-steps separately.'],
      explain: 'The rule alternates: double, subtract 1, double, subtract 1 …: 2 → 4 → 3 → 6 → 5 → 10 → 9 → **18**.',
      data: { answer: { num: 18 }, glyph: '×2−1' }
    },
    {
      id: 'seq-plus3-times2', title: 'Three More, Then Double', diff: 3,
      text: 'What number comes next?\n\n**1, 4, 8, 11, 22, 25, 50, …**',
      hints: ['Compare each pair of neighbours: some pairs differ by 3, others are doubles.', 'Two operations take turns.'],
      explain: 'The rule alternates: add 3, double, add 3, double …: 1 → 4 → 8 → 11 → 22 → 25 → 50 → **53**.',
      data: { answer: { num: 53 }, glyph: '+3×2' }
    },
    {
      id: 'seq-interleave-power', title: 'Two Sequences Woven Together', diff: 3,
      text: 'What number comes next?\n\n**1, 2, 2, 4, 3, 8, 4, 16, 5, …**',
      hints: ['Take every second term: the odd positions and the even positions each form a simple sequence.', 'Odd places: 1, 2, 3, 4, 5. Even places: 2, 4, 8, 16.'],
      explain: 'The terms in odd places count 1, 2, 3, 4, 5; those in even places double: 2, 4, 8, 16, **32**. Whenever a sequence seems to zigzag, try reading it as two sequences woven together.',
      data: { answer: { num: 32 }, glyph: '1,2,2' },
      links: ['seq-interleave-two']
    },
    {
      id: 'seq-n-times', title: 'Each Number Its Own Number of Times', diff: 3,
      text: 'What number comes next?\n\n**1, 2, 2, 3, 3, 3, 4, 4, 4, 4, …**',
      hints: ['How many times does each number appear?', 'One 1, two 2s, three 3s, four 4s …'],
      explain: 'Each number n appears exactly n times, so after four 4s the next term is **5**, and it appears five times. This is a “self-describing” sequence: the terms count how often they occur.',
      data: { answer: { num: 5 }, glyph: '1223' }
    },
    {
      id: 'seq-two-to-n-plus-one', title: 'One More than a Power', diff: 3,
      text: 'What number comes next?\n\n**2, 3, 5, 9, 17, 33, …**',
      hints: ['Compare with the powers of two.', 'The differences are 1, 2, 4, 8, 16.'],
      explain: 'Each is one more than a power of two: 1 + 1, 2 + 1, 4 + 1, 8 + 1, 16 + 1, 32 + 1 and next 64 + 1 = **65**. The differences double: 1, 2, 4, 8, 16, 32.',
      data: { answer: { num: 65 }, glyph: '2ⁿ+1' },
      concepts: ['geometric-series'], links: ['seq-mersenne']
    },
    {
      id: 'seq-n2-minus-1', title: 'One Less than a Square', diff: 3,
      text: 'What number comes next?\n\n**0, 3, 8, 15, 24, …**',
      hints: ['Compare with the squares 1, 4, 9, 16, 25.'],
      explain: 'Each is a square minus 1: 1 − 1, 4 − 1, 9 − 1, 16 − 1, 25 − 1 and next 36 − 1 = **35**. It also factors: n² − 1 = (n − 1)(n + 1), so each is a product of two numbers 2 apart: 0 × 2, 1 × 3, 2 × 4, 3 × 5, 4 × 6, 5 × 7.',
      data: { answer: { num: 35 }, glyph: 'n²−1' },
      links: ['seq-n2-plus-1']
    },
    {
      id: 'seq-tribonacci', title: 'Adding Three', diff: 3,
      text: 'What number comes next?\n\n**0, 1, 1, 2, 4, 7, 13, 24, …**',
      hints: ['It looks like Fibonacci, but the numbers grow faster.', 'Try adding three neighbours instead of two.'],
      explain: 'Each is the sum of the **three** before it: 2 + 4 + 7 = 13, 4 + 7 + 13 = 24, and 7 + 13 + 24 = **44**. It is called the tribonacci sequence.',
      data: { answer: { num: 44 }, traps: [{ match: 37, msg: '37 = 13 + 24: the sum of only two neighbours. Try three.' }], glyph: '0,1,1' },
      concepts: ['sequence', 'recursion'], links: ['seq-fibonacci', 'seq-tribonacci-123']
    },
    {
      id: 'seq-lucas', title: 'The Cousins of the Rabbits', diff: 3, year: 1878,
      source: 'Named after Édouard Lucas (1842–1891), who studied these numbers in 1878.',
      text: 'What number comes next?\n\n**1, 3, 4, 7, 11, 18, …**',
      hints: ['Add neighbours, as in Fibonacci’s rabbits.', '1 + 3 = 4, 3 + 4 = 7, 4 + 7 = 11 …'],
      explain: 'Each number is the sum of the two before, so the next is 11 + 18 = **29**. These are the Lucas numbers, the “cousins” of the Fibonacci numbers: the same rule, a different start. Edouard Lucas also invented the Tower of Hanoi.',
      data: { answer: { num: 29 }, glyph: '1,3' },
      concepts: ['sequence', 'recursion'], links: ['seq-fibonacci']
    },
    {
      id: 'seq-collatz', title: 'The Hailstone Numbers', diff: 3, year: 1937,
      source: 'The Collatz conjecture, posed by Lothar Collatz in 1937.',
      text: 'What number comes next?\n\n**6, 3, 10, 5, 16, 8, 4, …**',
      hints: ['When the number is even, the next is smaller; when it is odd, bigger. Compare 3 → 10 with 6 → 3.', 'If even, halve it; if odd, multiply by 3 and add 1.'],
      explain: 'The rule: **halve** if the number is even, **triple and add 1** if it is odd. From 4 the next is **2**, then 1, then 4, 2, 1 for ever. Every starting number ever tried ends up in that loop, but nobody has been able to prove that they all do: it is one of the most famous unsolved problems of mathematics.',
      data: { answer: { num: 2 }, glyph: '3n+1' },
      concepts: ['sequence']
    },
    {
      id: 'seq-digital-roots', title: 'Powers of Two, Digit by Digit', diff: 3,
      text: 'What number comes next?\n\n**1, 2, 4, 8, 7, 5, …**',
      hints: ['It starts like the doubling numbers, but then breaks. Add up the digits of each power of two: 16 → 1 + 6 = 7.', 'The numbers are the digit sums, repeated until one digit remains, of 1, 2, 4, 8, 16, 32, 64 …'],
      explain: 'They are the “digital roots” of the powers of two: 1, 2, 4, 8, 16 → 7, 32 → 5, 64 → 10 → 1, and so **1** comes next, and the cycle 1, 2, 4, 8, 7, 5 repeats for ever. The digital root is the remainder after dividing by 9 (with 9 instead of 0).',
      data: { answer: { num: 1 }, glyph: '1247' },
      concepts: ['modular']
    },
    {
      id: 'seq-seven-segment', title: 'Segments of a Digital Display', diff: 3,
      text: 'A digital clock draws each digit with lit bars. On the ordinary seven-bar display, the digits 0, 1, 2, 3, … use these numbers of bars:\n\n**6, 2, 5, 5, 4, 5, 6, 3, 7, …**\n\nHow many bars does the digit 9 use? (On this display, 6 and 9 have a little tail, and 7 has three bars.)',
      hints: ['Imagine the digit 8 with all seven bars lit.', 'The 9 is an 8 with only the bottom-left bar missing.'],
      explain: 'The digit 8 uses all 7 bars; 9 is 8 without the bottom-left bar, and so uses **6**. The sequence is a list of the digits of a clock, not a mathematical rule, but every sequence riddle asks you to see what the numbers are counting.',
      data: { answer: { num: 6 }, glyph: '🔢' }
    },
    {
      id: 'seq-lazy-caterer', title: 'Pieces of a Pancake', diff: 3,
      text: 'What is the next number in the list of the largest numbers of pieces you can cut a round pancake into with 0, 1, 2, 3, … straight cuts?\n\n**1, 2, 4, 7, 11, 16, …**',
      hints: ['Look at the differences: 1, 2, 3, 4, 5.', 'The nth cut can cross all the earlier cuts, and add n new pieces.'],
      explain: 'The steps are 1, 2, 3, 4, 5, so the next step is 6 and the next number is 16 + 6 = **22**. This is the “lazy caterer’s sequence”, n(n + 1)/2 + 1: each new cut crosses all the earlier ones and cuts one more piece than the number of cuts before it.',
      data: { answer: { num: 22 }, glyph: '🥞' },
      concepts: ['sequence', 'combinatorics'], links: ['num-pizza', 'seq-triangular']
    },
    {
      id: 'seq-perfect', title: 'The Perfect Numbers', diff: 3, year: 100,
      source: 'Nicomachus of Gerasa, *Introduction to Arithmetic* (about AD 100), who lists the first four perfect numbers.',
      text: 'What number comes next?\n\n**6, 28, 496, …**',
      hints: ['Add the proper divisors of each (all divisors except the number itself): 6 = 1 + 2 + 3.', 'The next such number is between 8000 and 9000. It equals 64 × 127.'],
      explain: 'Each is the sum of its proper divisors: 6 = 1 + 2 + 3, 28 = 1 + 2 + 4 + 7 + 14, 496 = … The next perfect number is **8128** = 64 × 127. Euclid showed that 2ⁿ⁻¹(2ⁿ − 1) is perfect whenever 2ⁿ − 1 is prime; nobody has yet found an odd perfect number, nor proved that there is none.',
      data: { answer: { num: 8128 }, glyph: '6·28' },
      concepts: ['sequence']
    },
    {
      id: 'seq-n-to-n', title: 'Each to Its Own Power', diff: 3,
      text: 'What number comes next?\n\n**1, 4, 27, 256, …**',
      hints: ['1, 4 and 27 are 1¹, 2² and 3³ …', 'What is 4⁴? Then 5⁵.'],
      explain: 'Each is a number raised to its own power: 1¹, 2², 3³, 4⁴ = 256 and next 5⁵ = **3125**. They grow far faster than the doubling numbers; 10¹⁰ is already ten billion.',
      data: { answer: { num: 3125 }, glyph: 'nⁿ' },
      concepts: ['sequence']
    },
    {
      id: 'seq-sum-squares', title: 'Adding Up the Squares', diff: 3,
      text: 'What number comes next?\n\n**1, 5, 14, 30, 55, …**',
      hints: ['Look at the differences: 4, 9, 16, 25 …', 'The differences are the squares themselves.'],
      explain: 'Each is the previous plus the next square: 1, 1 + 4, 1 + 4 + 9, 1 + 4 + 9 + 16, … and the next is 55 + 36 = **91**. These are the square pyramidal numbers n(n + 1)(2n + 1)/6, the number of balls in a pyramid with a square base. Archimedes knew the formula.',
      data: { answer: { num: 91 }, glyph: '1+4+9' },
      links: ['seq-squares', 'seq-sum-cubes']
    },
    {
      id: 'seq-sum-cubes', title: 'Adding Up the Cubes', diff: 3,
      text: 'What number comes next?\n\n**1, 9, 36, 100, 225, …**',
      hints: ['Look at the differences: 8, 27, 64, 125 …', 'The differences are the cubes.'],
      explain: 'Each is the previous plus the next cube: 1, 1 + 8, 1 + 8 + 27, … and the next is 225 + 216 = **441** = 21². The totals are square numbers: (1 + 2 + … + n)², the square of the triangular numbers, a fact known to Nicomachus.',
      data: { answer: { num: 441 }, glyph: '1+8' },
      links: ['seq-cubes', 'seq-sum-squares', 'seq-triangular']
    },
    {
      id: 'seq-e-digits', title: 'The Digits of e', diff: 3,
      text: 'What number comes next?\n\n**2, 7, 1, 8, 2, 8, 1, 8, 2, 8, …**',
      hints: ['It looks as though 1, 8, 2, 8 is repeating. Or does it?', 'They are the digits of a famous number, e = 2.71828…'],
      explain: 'They are the digits of e = 2.718281828**4**59045…, and the next is **4**. The repeating “1828” at the start is a famous coincidence: the digits do not go on repeating, and there is no pattern in e’s digits at all.',
      data: { answer: { num: 4 }, traps: [{ match: 1, msg: 'It seems to repeat the pattern 1, 8, 2, 8 — but it does not. The true digits of e go on differently.' }], glyph: 'e' },
      concepts: ['sequence'], links: ['seq-pi-digits']
    },
    {
      id: 'seq-straight-letters', title: 'Letters Made of Straight Lines', diff: 3,
      text: 'Which letter comes next?\n\n**A, E, F, H, I, K, L, M, N, …**',
      ask: 'Which letter comes next?',
      hints: ['It is not about the alphabet’s order. Look at how the capital letters are drawn.', 'What is special about the letters that are left out: B, C, D, G, J …?'],
      explain: 'These are the capital letters made only of straight strokes, with no curve at all: A, E, F, H, I, K, L, M, N and next **T** (O, P, Q, R and S all have curves), then V, W, X, Y and Z.',
      data: { answer: { text: ['T'] }, glyph: 'AEF' }
    },
    {
      id: 'seq-abc-gaps', title: 'Widening Gaps in the Alphabet', diff: 3,
      text: 'Which letter comes next?\n\n**A, B, D, G, K, …**',
      ask: 'Which letter comes next?',
      hints: ['Count how many places each letter is after the one before.', 'The steps in the alphabet are 1, 2, 3, 4.'],
      explain: 'A → B is 1 place, B → D is 2, D → G is 3, G → K is 4, and so K → **P** is 5. The letters are at places 1, 2, 4, 7, 11 and 16 of the alphabet — the “lazy caterer” numbers in disguise.',
      data: { answer: { text: ['P'] }, glyph: 'ABD' },
      links: ['seq-lazy-caterer']
    },
    {
      id: 'seq-letters-triangular', title: 'Triangular Letters', diff: 3,
      text: 'Which letter comes next?\n\n**A, C, F, J, O, …**',
      ask: 'Which letter comes next?',
      hints: ['Count the places of the letters in the alphabet: A = 1, C = 3, F = 6 …', '1, 3, 6, 10, 15: you have seen these numbers.'],
      explain: 'The places are 1, 3, 6, 10, 15: the triangular numbers, and the next is 21, the 21st letter: **U**.',
      data: { answer: { text: ['U'] }, glyph: 'ACF' },
      links: ['seq-triangular']
    },
    {
      id: 'seq-alphabetical-numbers', title: 'Numbers in Dictionary Order', diff: 3,
      text: 'What number comes next?\n\n**8, 5, 4, 9, 1, 7, 6, 10, 3, …**',
      hints: ['Forget arithmetic: the numbers are not in numerical order. Spell them out.', 'Eight, five, four, nine, one, seven, six, ten, three …'],
      explain: 'The numbers 1 to 10 are listed in the alphabetical order of their English names: **eight**, five, four, nine, one, seven, six, ten, three, **two**. The next is **2**.',
      data: { answer: { num: 2 }, glyph: '8 5 4' }
    },
    {
      id: 'seq-look-and-say', title: 'Say What You See', diff: 3, year: 1986,
      source: 'The look-and-say sequence, made famous by John Conway (1986).',
      text: 'What number comes next?\n\n**1, 11, 21, 1211, 111221, …**',
      hints: ['Read each term aloud, as a description of the term before it.', '“One 1” makes 11; “two 1s” makes 21; “one 2, one 1” makes 1211 …'],
      explain: 'Each term describes the one before: 1 is “one 1” → 11; 11 is “two 1s” → 21; 21 is “one 2, one 1” → 1211; 1211 is “one 1, one 2, two 1s” → 111221; and 111221 is “three 1s, two 2s, one 1” → **312211**. John Conway proved that the sequence never contains a digit above 3, and that the length grows by about 30 % per step.',
      data: { answer: { num: 312211 }, glyph: '1 11' },
      concepts: ['sequence', 'recursion']
    },

    /* ---------- hard: the names behind the numbers ---------- */
    {
      id: 'seq-fib-last-digit', title: 'Fibonacci’s Last Digits', diff: 4,
      text: 'What number comes next?\n\n**1, 1, 2, 3, 5, 8, 3, 1, 4, 5, …**',
      hints: ['It starts like the rabbits’ sequence and then goes strange. Look at the size of the numbers.', 'Take only the **last digit** of each Fibonacci number: 13 → 3, 21 → 1, 34 → 4, 55 → 5 …'],
      explain: 'These are the last digits of the Fibonacci numbers 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, and the next is 89 → **9**. The last digits repeat with a period of 60, the Pisano period for 10.',
      data: { answer: { num: 9 }, glyph: 'φ%10' },
      concepts: ['modular', 'sequence'], links: ['seq-fibonacci']
    },
    {
      id: 'seq-cube-square-alternating', title: 'Cubes and Squares Taking Turns', diff: 4,
      text: 'What number comes next?\n\n**1, 4, 27, 16, 125, 36, 343, …**',
      hints: ['Some of these are cubes, some squares. Look at the positions.', 'Odd places: 1, 27, 125, 343 = 1³, 3³, 5³, 7³. Even places: 4, 16, 36.'],
      explain: 'The terms in the odd places are the cubes of the odd numbers (1³, 3³, 5³, 7³) and those in the even places are the squares of the even numbers (2², 4², 6²). The next place is even: 8² = **64**.',
      data: { answer: { num: 64 }, glyph: 'n³ n²' },
      links: ['seq-interleave-two']
    },
    {
      id: 'seq-n3-n2', title: 'A Cube and a Square', diff: 4,
      text: 'What number comes next?\n\n**2, 12, 36, 80, 150, …**',
      hints: ['The differences are 10, 24, 44, 70. Take the differences of those: 14, 20, 26.', 'The second differences grow by a constant 6: the sequence is a cubic. Or try n³ + n².'],
      explain: 'These are n³ + n² = n²(n + 1): 1 + 1, 8 + 4, 27 + 9, 64 + 16, 125 + 25, and next 216 + 36 = **252**. The differences of the differences of the differences (the third differences) are all 6, which is how you can tell that the rule is a cubic.',
      data: { answer: { num: 252 }, glyph: 'n³+n²' },
      concepts: ['sequence']
    },
    {
      id: 'seq-interleave-two', title: 'Two Staircases', diff: 4,
      text: 'What number comes next?\n\n**5, 7, 9, 12, 13, 17, 17, 22, …**',
      hints: ['Read every other term: are the two halves regular?', 'Odd places: 5, 9, 13, 17. Even places: 7, 12, 17, 22.'],
      explain: 'The odd places go 5, 9, 13, 17, adding 4 each time, and the even places go 7, 12, 17, 22, adding 5. The next term is in an odd place: 17 + 4 = **21**.',
      data: { answer: { num: 21 }, glyph: '5,7,9' },
      links: ['seq-interleave-power']
    },
    {
      id: 'seq-tribonacci-123', title: 'Three Before', diff: 4,
      text: 'What number comes next?\n\n**1, 2, 3, 6, 11, 20, 37, …**',
      hints: ['6 = 1 + 2 + 3. Does the same work for the terms after?', 'Add the three terms before: 2 + 3 + 6 = 11.'],
      explain: 'Each term is the sum of the three before: 1 + 2 + 3 = 6, 2 + 3 + 6 = 11, 3 + 6 + 11 = 20, 6 + 11 + 20 = 37, and 11 + 20 + 37 = **68**.',
      data: { answer: { num: 68 }, glyph: '1,2,3' },
      concepts: ['recursion'], links: ['seq-tribonacci']
    },
    {
      id: 'seq-sum-factorials', title: 'Factorials Added Up', diff: 4,
      text: 'What number comes next?\n\n**1, 3, 9, 33, 153, …**',
      hints: ['The differences are 2, 6, 24, 120: you have seen these.', 'They are the factorials 2!, 3!, 4!, 5!.'],
      explain: 'Each term adds the next factorial: 1! = 1, 1! + 2! = 3, + 3! = 9, + 4! = 33, + 5! = 153, and so + 6! = 153 + 720 = **873**.',
      data: { answer: { num: 873 }, glyph: '1!+2!' },
      concepts: ['combinatorics'], links: ['seq-factorials']
    },
    {
      id: 'seq-central-binomial', title: 'The Middle of Pascal’s Triangle', diff: 4,
      text: 'What number comes next?\n\n**1, 2, 6, 20, 70, …**',
      hints: ['Look at Pascal’s triangle: 1; 1 1; 1 2 1; 1 3 3 1; 1 4 6 4 1 …', 'Take the middle number of every second row.'],
      explain: 'These are the numbers in the middle of the rows 0, 2, 4, 6, 8 of Pascal’s triangle: 1, 2, 6, 20, 70 and next the middle of row 10, **252**. They count the paths on a grid: 70 is the number of routes across a 4 × 4 grid, and 252 across a 5 × 5.',
      data: { answer: { num: 252 }, glyph: '70' },
      concepts: ['combinatorics'], links: ['seq-pascal-row', 'num-grid-paths']
    },
    {
      id: 'seq-catalan', title: 'The Catalan Numbers', diff: 4,
      source: 'Named after Eugène Catalan, who studied them in 1838; Euler had counted the ways to cut a polygon into triangles in 1751.',
      text: 'What number comes next?\n\n**1, 2, 5, 14, 42, …**',
      hints: ['The ratios of neighbours are 2, 2.5, 2.8, 3: they grow towards 4.', 'They count the ways to cut a polygon with n + 2 sides into triangles: 1 for a triangle, 2 for a square, 5 for a pentagon.'],
      explain: 'The next Catalan number is **132**. They count many things: the ways to cut a hexagon into triangles (14), the ways to close n pairs of brackets correctly ((()) or ()() gives 2), the ways to climb a staircase without crossing the diagonal.',
      data: { answer: { num: 132 }, glyph: 'C₅' },
      concepts: ['combinatorics', 'sequence']
    },
    {
      id: 'seq-double-factorial', title: 'Odd Factors', diff: 4,
      text: 'What number comes next?\n\n**1, 3, 15, 105, …**',
      hints: ['Divide each term by the one before it.', 'The ratios are 3, 5, 7.'],
      explain: 'The ratios are 3, 5, 7, so the next is 9: 105 × 9 = **945**. These are the products of the odd numbers, 1 × 3 × 5 × 7 × 9, called the odd double factorials; they count the ways of pairing off 2n people into couples.',
      data: { answer: { num: 945 }, glyph: '3·5·7' },
      concepts: ['combinatorics']
    },
    {
      id: 'seq-pell', title: 'Twice the Last, Plus the One Before', diff: 4,
      source: 'The Pell numbers, named (by a mistake of Euler’s) after John Pell.',
      text: 'What number comes next?\n\n**1, 2, 5, 12, 29, …**',
      hints: ['It grows a little faster than Fibonacci: 12 = 2 × 5 + 2, 29 = 2 × 12 + 5.', 'Double the last term and add the one before it.'],
      explain: 'Each term is twice the last plus the one before: 2 × 2 + 1 = 5, 2 × 5 + 2 = 12, 2 × 12 + 5 = 29, so the next is 2 × 29 + 12 = **70**. The ratios of neighbours approach 1 + √2, and the fractions 1/1, 3/2, 7/5, 17/12, 41/29, 99/70 built from the numbers approximate √2.',
      data: { answer: { num: 70 }, glyph: 'Pell' },
      concepts: ['sequence', 'recursion'], links: ['seq-fibonacci']
    },
    {
      id: 'seq-jacobsthal', title: 'The Slow Doubling', diff: 4,
      text: 'What number comes next?\n\n**0, 1, 1, 3, 5, 11, 21, …**',
      hints: ['Each term is close to double the one before, but not exactly.', 'Double the last term, and then add or subtract 1: it depends on the term’s position.'],
      explain: 'Each term is the previous plus twice the one before that: 11 + 2 × 5 = 21, and 21 + 2 × 11 = **43**. These are the Jacobsthal numbers; each one is also double the last, alternately plus and minus one.',
      data: { answer: { num: 43 }, glyph: '0,1,1' },
      concepts: ['sequence', 'recursion'], links: ['seq-fibonacci', 'seq-mersenne']
    },
    {
      id: 'seq-divisor-count', title: 'How Many Divisors?', diff: 4,
      text: 'What number comes next?\n\n**1, 2, 2, 3, 2, 4, 2, 4, 3, 4, 2, …**',
      hints: ['Think of the numbers 1, 2, 3, 4 … one after the other. What might be counted about each?', 'The first is 1 (which has one divisor), the second is 2 (divisors 1 and 2).'],
      explain: 'The nth term is the number of divisors of n: 1 has one, primes have two (the 2s at places 2, 3, 5, 7, 11), 4 has three (1, 2, 4), 6 has four. So the 12th term is the number of divisors of 12, that is 1, 2, 3, 4, 6 and 12: **6**.',
      data: { answer: { num: 6 }, glyph: 'd(n)' },
      concepts: ['combinatorics', 'gcd'], links: ['num-divisors-360']
    },
    {
      id: 'seq-divisor-sum', title: 'Sums of Divisors', diff: 4,
      text: 'What number comes next?\n\n**1, 3, 4, 7, 6, 12, 8, …**',
      hints: ['It goes up and down. Think about the numbers 1, 2, 3, 4 … and their divisors.', 'The third term is 4 = 1 + 3, the divisors of 3; the fourth is 7 = 1 + 2 + 4.'],
      explain: 'The nth term is the sum of all the divisors of n, including 1 and n. For 8 the divisors are 1, 2, 4, 8: **15**. The primes p give p + 1 (the low points 3, 4, 6, 8 …), and a number is “perfect” when its sum is double itself, as for 6 (12) and 28 (56).',
      data: { answer: { num: 15 }, glyph: 'σ(n)' },
      concepts: ['gcd'], links: ['seq-perfect', 'seq-divisor-count']
    },
    {
      id: 'seq-totient', title: 'Numbers That Do Not Share', diff: 5,
      source: 'Euler’s totient function (Euler, 1763).',
      text: 'What number comes next?\n\n**1, 1, 2, 2, 4, 2, 6, 4, 6, …**',
      hints: ['The 2s are at places 3, 4 and 6; the 4s at places 5 and 8. What do the places have in common? Look at 5: how many of 1, 2, 3, 4, 5 have no factor in common with it?', 'The nth term counts the numbers from 1 to n that share no factor (other than 1) with n.'],
      explain: 'The nth term counts the numbers up to n that are **coprime** to n. For 10 these are 1, 3, 7, 9: so the next term is **4**. This is Euler’s totient function φ(n), and it is at the heart of RSA encryption and of the remainder arithmetic used to secure the web.',
      data: { answer: { num: 4 }, glyph: 'φ(n)' },
      concepts: ['gcd', 'modular']
    },
    {
      id: 'seq-partitions', title: 'Ways to Add Up', diff: 5,
      source: 'The partition numbers, studied by Leonhard Euler in the 1740s.',
      text: 'What number comes next?\n\n**1, 2, 3, 5, 7, 11, 15, 22, …**',
      hints: ['The first six terms are the primes and then it breaks: 15 and 22 are not prime.', 'Count the ways of writing n as a sum of positive whole numbers, disregarding the order: for 4 there are 5 ways (4, 3+1, 2+2, 2+1+1, 1+1+1+1).'],
      explain: 'The nth term is the number of **partitions** of n, the number of ways to write it as a sum, in which the order is ignored. For 9 there are **30**. The numbers grow astonishingly fast: there are more than 190 million partitions of 100. Ramanujan and Hardy found a formula for them.',
      data: { answer: { num: 30 }, traps: [{ match: 19, msg: 'That would follow the primes, but the primes stop matching after 11.' }], glyph: 'p(n)' },
      concepts: ['combinatorics', 'sequence']
    },
    {
      id: 'seq-bell', title: 'Ways to Split a Party', diff: 5,
      source: 'The Bell numbers, named after Eric Temple Bell, who studied them in 1934.',
      text: 'What number comes next?\n\n**1, 2, 5, 15, 52, …**',
      hints: ['Think of n friends who split up into groups (any sizes, in no order). For 3 friends there are 5 ways: {ABC}, {AB}{C}, {AC}{B}, {BC}{A}, {A}{B}{C}.', 'Bell numbers can be built with a triangle like Pascal’s, in which each new row starts with the last number of the row before.'],
      explain: 'The nth term is the number of ways to split a set of n things into groups: 1 way for 1 thing, 2 for 2 things, 5 for 3, 15 for 4, 52 for 5, and **203** for 6. The Bell numbers count, for instance, the ways to rhyme a poem of n lines.',
      data: { answer: { num: 203 }, glyph: 'B(n)' },
      concepts: ['combinatorics']
    },
    {
      id: 'seq-moser', title: 'Cutting a Round Cake with Chords', diff: 5,
      source: 'Moser’s circle problem (a favourite example of a pattern that breaks).',
      text: 'Put **n points** on a circle and join every pair by a straight chord, making sure that no three chords meet at a point inside. The chords cut the disc into regions. For n = 1, 2, 3, 4, 5, 6 points the number of regions is\n\n**1, 2, 4, 8, 16, 31**\n\nHow many regions do 7 points give?',
      hints: ['It looks like doubling, but the last term is 31, not 32. The pattern breaks.', 'The number of regions is 1 + (ways to choose 2 points) + (ways to choose 4 points): C(n,2) + C(n,4) + 1.'],
      explain: 'The regions number C(n,4) + C(n,2) + 1, where C is “choose”: for 6 points 15 + 15 + 1 = 31, and for 7 points 35 + 21 + 1 = **57**. Every crossing of two chords inside adds a region, and every crossing is decided by four points. The doubling is a coincidence that lasts five terms — a warning that “what comes next” never has only one answer unless the rule is given.',
      data: { answer: { num: 57 }, traps: [{ match: 32, msg: 'That is what doubling would give, but the pattern breaks at 31.' }, { match: 63, msg: 'Nearly doubling again, but the actual growth is slower.' }], glyph: '31' },
      concepts: ['combinatorics', 'sequence'], links: ['seq-doubling']
    },
    {
      id: 'seq-recaman', title: 'A Sequence That Jumps Back', diff: 5, year: 1991,
      source: 'The Recamán sequence, named by Neil Sloane (1991) after the Colombian mathematician Bernardo Recamán Santos.',
      text: 'What number comes next?\n\n**0, 1, 3, 6, 2, 7, 13, 20, 12, 21, 11, …**',
      hints: ['At step n, you either go back n places or forward n places. The steps are 1, 2, 3, 4, 5 …', 'You go back if you can — if the result is not already in the list and not below zero — and otherwise you go forward.'],
      explain: 'Step n takes the previous term a and goes to a − n if that is positive and new, and to a + n otherwise. Here: 0, 1 (+1), 3 (+2), 6 (+3), 2 (−4), 7 (+5), 13 (+6), 20 (+7), 12 (−8), 21 (+9), 11 (−10), and now 11 − 11 = 0 has been used, so we go forward: 11 + 11 = **22**.',
      data: { answer: { num: 22 }, glyph: '↶↷' },
      concepts: ['sequence', 'recursion']
    },
    {
      id: 'seq-sylvester', title: 'Euclid’s Product Plus One', diff: 5, year: 1880,
      source: 'Sylvester’s sequence (James Joseph Sylvester, 1880), based on Euclid’s proof that there are infinitely many primes (about 300 BC).',
      text: 'What number comes next?\n\n**2, 3, 7, 43, 1807, …**',
      hints: ['Multiply the first two terms: 2 × 3 = 6, and 6 + 1 = 7. Does this work for the next?', 'Each term is the product of **all** the earlier terms, plus 1.'],
      explain: '3 = 2 + 1, 7 = 2 × 3 + 1, 43 = 2 × 3 × 7 + 1, 1807 = 2 × 3 × 7 × 43 + 1, and the next is 2 × 3 × 7 × 43 × 1807 + 1 = **3 263 443**. This is Euclid’s trick for proving that there are infinitely many primes: the product plus one leaves remainder 1 on division by each of the earlier numbers, so it must have a new prime factor.',
      data: { answer: { num: 3263443, tol: 0 }, glyph: 'Πk+1' },
      concepts: ['sequence', 'recursion'], links: ['seq-primes']
    },

  ];
  Cabinet.family({
    id: 'sequences', engine: 'question', cat: 'numbers', name: 'What comes next?', order: 12,
    blurb: 'Numbers, letters and words in a row, with one hidden rule: find it, and say what comes next.',
    origin: { year: 1202, who: 'Fibonacci and the number-sequence riddle', note: 'Fibonacci’s breeding rabbits gave Europe its first famous sequence puzzle. “What comes next?” has been the favourite question of puzzle columns and intelligence tests ever since, and the online catalogue of integer sequences, started by Neil Sloane in the 1960s, now holds hundreds of thousands of them.' },
    concepts: ['sequence', 'recursion']
  }, list.map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]));
})();
