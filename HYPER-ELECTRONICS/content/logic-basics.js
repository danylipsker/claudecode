/* HYPER-ELECTRONICS · content/logic-basics.js — logic: binary numbers, gates, Boolean
 * algebra, Karnaugh maps, logic families, how CMOS gates work, and pull resistors. */
Hyper.add(

{
  id: 'binary-numbers', parent: 'logic-basics', title: 'Binary, hexadecimal and two\'s complement', level: 1,
  short: 'How digital circuits write numbers with only 0 and 1: place values in base 2, hexadecimal as a compact shorthand, and two\'s complement for negative numbers.',
  keywords: ['binary', 'base 2', 'bit', 'byte', 'nibble', 'hexadecimal', 'hex', 'two\'s complement', 'signed', 'unsigned', 'overflow', 'MSB', 'LSB', 'sign extension', 'BCD', 'int8_t', 'uint16_t'],
  prereq: ['math:number-systems', 'math:exponents'],
  related: ['logic-gates', 'binary-adders', 'adc', 'microcontrollers'],
  body: `
A wire in a digital circuit is either high or low, so the natural way to write a number is with only two digits, 0 and 1 — **bits**. One bit tells two things apart; a group of $n$ bits can be in $2^n$ different patterns, and we agree on which number each pattern stands for.

### Place value in base 2
Exactly as in decimal, each position is worth a power of the base — here 2. The rightmost bit, the **least significant bit** (LSB), is worth 1; the next 2, then 4, 8, 16, and so on up to the **most significant bit** (MSB):

$$N = \\sum_{k=0}^{n-1} b_k\\, 2^k, \\qquad 1011\\,0110_2 = 128 + 32 + 16 + 4 + 2 = 182$$

Four bits make a **nibble**, eight a **byte**. Unsigned, $n$ bits count from 0 to $2^n - 1$: 255 for a byte, 1023 for a 10-bit ADC reading, 4095 for 12 bits, 65 535 for 16 bits. To go the other way, subtract the largest power of two that fits and repeat, or divide by 2 repeatedly and read the remainders from the bottom up.

### Hexadecimal: binary for humans
Long strings of bits are hard to read, so engineers group them in fours and write each group as one **hex** digit, 0–9 then A–F for 10–15. A byte is always exactly two hex digits: $1011\\,0110 = \\mathrm{B6}$, written \`0xB6\` in C. Datasheets give register addresses, bit masks and default values in hex, and I²C devices are known by hex addresses — an ADS1115 ADC answers at 0x48 when its ADDR pin is tied to ground. Converting is mechanical because 16 is a power of 2; no arithmetic is needed, only the sixteen patterns (8 = 1000, A = 1010, C = 1100, F = 1111).

### Negative numbers: two's complement
Almost every processor stores signed integers in **two's complement**: the MSB keeps its place value but with a **negative** sign. For a byte,

$$N = -128\\,b_7 + 64\\,b_6 + \\dots + 2\\,b_1 + b_0$$

so 0000 0001 is 1, 0111 1111 is 127, 1000 0000 is −128 and 1111 1111 is −1. An $n$-bit signed number runs from $-2^{n-1}$ to $2^{n-1} - 1$ (−128 to 127 for \`int8_t\`, −32 768 to 32 767 for \`int16_t\`). To negate a number, **invert every bit and add one**.

Why this odd scheme? Because the ordinary binary adder then works for signed numbers without change — subtracting is adding the negated number ([[binary-adders]]), there is only one zero, and the sign is simply the MSB. Widening a signed value copies the MSB into the new bits (**sign extension**): −10 is 0xF6 as a byte and 0xFFF6 as 16 bits.

> [!key] The bits do not know whether they are signed. 1111 0110 is 246 as a \`uint8_t\` and −10 as an \`int8_t\`: the interpretation is in the code that reads them. A 16-bit reading from an ADS1115 or a MEMS gyroscope is two's complement and must be read into a signed type.

### Overflow
A fixed number of bits wraps around. Unsigned, 255 + 1 gives 0 with a carry out; signed, 127 + 1 gives −128. The rule for signed overflow: adding two numbers of the same sign gives a result of the other sign. Counters wrap too, and that is a design parameter: a 16-bit timer clocked at 1 MHz rolls over every 65.5 ms, and a 32-bit millisecond counter (the Arduino \`millis()\`) after 49.7 days — code that compares times must subtract them as unsigned values so the wrap does no harm.

### Other codes you will meet
**BCD** (binary-coded decimal) stores each decimal digit in its own nibble: real-time-clock chips such as the DS3231 keep the time that way, and seven-segment decoders expect it ([[decoders-encoders]]). **Gray code** changes only one bit between neighbours, which is why rotary encoders and [[karnaugh-maps|Karnaugh maps]] use it.
`,
  ideas: [
    'n bits give 2ⁿ patterns; unsigned they count 0 to 2ⁿ − 1.',
    'Each hex digit is exactly four bits, so a byte is two hex digits.',
    'In two\'s complement the MSB has weight −2ⁿ⁻¹; negate by inverting all bits and adding 1.',
    'The same bits mean different numbers as signed or unsigned: the code decides.',
    'Fixed-width numbers wrap around; signed overflow is when two same-sign numbers give the other sign.'
  ],
  pitfalls: [
    'A byte with its top bit set is negative — Only if you read it as signed. The bits are identical; uint8_t and int8_t interpret them differently.',
    'To negate in two\'s complement, flip the sign bit — That is sign-magnitude. Invert every bit and add 1: −1 is 1111 1111, not 1000 0001.',
    'Hexadecimal is a different kind of number — It is the same binary value written four bits per digit, purely for readability.'
  ],
  formulas: [
    {
      name: 'Number of codes in an n-bit word',
      expr: 'M = 2^n', tex: 'M = 2^{n}',
      vars: {
        M: { name: 'number of distinct codes', q: 'count' },
        n: { name: 'number of bits', q: 'count', value: 8 }
      },
      note: 'Unsigned, the codes stand for 0 to $M - 1$. Solving for $n$ gives $\\log_2 M$: round up to the next whole number of bits.',
      stories: { M: 'How many different values can a {n} word hold?', n: 'A state machine must tell apart {M} different states. How many bits does its register need (round up)?' }
    },
    {
      name: 'Largest positive value in two\'s complement',
      expr: 'Smax = 2^(n - 1) - 1', tex: 'S_{\\text{max}} = 2^{n-1} - 1',
      vars: {
        Smax: { name: 'largest positive value', q: 'count', tex: 'S_{\\text{max}}' },
        n: { name: 'number of bits', q: 'count', value: 16, int: true }
      },
      note: 'The most negative value is $-2^{n-1}$: the range is lopsided by one because zero sits among the non-negative codes.',
      stories: { Smax: 'What is the largest positive number a signed {n}-bit integer can hold?' }
    },
    {
      name: 'Time before a free-running counter rolls over',
      expr: 'T = 2^n/f', tex: 'T = \\frac{2^{n}}{f}',
      vars: {
        T: { name: 'time to roll over', q: 'time', unit: 'day' },
        n: { name: 'counter width', q: 'count', value: 32, int: true },
        f: { name: 'count rate', q: 'frequency', unit: 'Hz', value: 1000 }
      },
      practice: { unknowns: ['T', 'f'] },
      stories: { T: 'A {n}-bit counter increments at {f}. How long before it wraps back to zero?', f: 'A {n}-bit counter must not roll over for {T}. What is the fastest it may count?' }
    }
  ],
  examples: [
    {
      title: 'Decimal to binary and hex',
      q: 'Write 182 in binary and in hexadecimal.',
      steps: [
        'Take out powers of two from the top: $182 - 128 = 54$, $54 - 32 = 22$, $22 - 16 = 6$, $6 - 4 = 2$, $2 - 2 = 0$.',
        'The bits set are 128, 32, 16, 4 and 2: $1011\\,0110_2$.',
        'Group in fours: $1011 = \\mathrm{B}$, $0110 = 6$, so 182 = 0xB6.'
      ],
      a: '182 = 1011 0110 = 0xB6.'
    },
    {
      title: 'A negative number in 8 bits',
      q: 'Write −75 as an 8-bit two\'s-complement number, and check it.',
      steps: [
        '+75 = 64 + 8 + 2 + 1 = 0100 1011.',
        'Invert every bit: 1011 0100. Add one: 1011 0101 = 0xB5.',
        'Check with the negative MSB weight: $-128 + 32 + 16 + 4 + 1 = -75$.'
      ],
      a: '−75 = 1011 0101 = 0xB5.'
    },
    {
      title: 'Signed overflow',
      q: 'A sensor filter adds two int8_t values, 100 and 50. What does it get?',
      steps: [
        '0110 0100 + 0011 0010 = 1001 0110 (no carry out of bit 7).',
        'Unsigned that is 150 — correct. Signed, the MSB is set: $-128 + 16 + 4 + 2 = -106$.',
        'Two positive numbers gave a negative result: signed overflow. The fix is a wider type (int16_t) for the sum, or saturating arithmetic.'
      ],
      a: 'It gets −106: the true sum 150 does not fit in −128…127.'
    }
  ],
  quiz: [
    { q: 'What is 0x3F in decimal?', answer: 63, why: '3 × 16 + 15 = 63, or in binary 0011 1111 = 32 + 16 + 8 + 4 + 2 + 1.' },
    { q: 'The byte 1111 0110 read as an 8-bit two\'s-complement number is…', choices: ['246', '−10', '−118', '−9'], a: 1,
      why: 'Unsigned it is 246; signed, subtract 256: −10. Check by negating: invert to 0000 1001, add 1 to get 0000 1010 = 10.' },
    { q: 'How many bits do you need to count from 0 to 1000?', choices: ['9', '10', '11', '1000'], a: 1,
      why: '9 bits reach only 511; 10 bits reach 1023. In general you need ⌈log₂(1001)⌉ = 10.' },
    { q: 'In two\'s complement, adding 1 to the largest positive number gives the most negative number.', a: true,
      why: '0111 1111 + 1 = 1000 0000, which is +127 + 1 → −128 for a byte. That wrap-around is signed overflow.' },
    { q: 'An unsigned 16-bit timer counts at 1 MHz. It rolls over every…', choices: ['16 ms', '65.5 ms', '1 s', '65.5 s'], a: 1,
      why: '2¹⁶ = 65 536 counts of 1 µs each is 65.5 ms. A prescaler of 8 would stretch that to 524 ms.' }
  ],
  applications: ['Reading register maps and bit fields in datasheets, written in hex.', 'ADC and DAC codes, timer counts and PWM compare values in a microcontroller.', 'Signed sensor data: accelerometers, gyroscopes and the ADS1115 return two\'s-complement words.', 'Masks, flags and checksums in communication protocols.'],
  history: 'Gottfried Leibniz published binary arithmetic in 1703. Two\'s complement became the standard for signed integers with the computers of the 1960s, because it lets one adder serve signed and unsigned numbers alike.',
  sim: 'dig-adder'
},

{
  id: 'logic-gates', parent: 'logic-basics', title: 'Logic gates', level: 1,
  short: 'The building blocks of digital circuits: small circuits whose output level is a fixed logical function — AND, OR, NOT and their relatives — of their inputs.',
  keywords: ['logic gate', 'AND', 'OR', 'NOT', 'inverter', 'NAND', 'NOR', 'XOR', 'XNOR', 'buffer', 'truth table', 'universal gate', '74HC00', '74HC04', 'bubble', 'active low'],
  prereq: ['binary-numbers', 'voltage'],
  related: ['boolean-algebra', 'cmos-logic', 'logic-families', 'multiplexers', 'binary-adders'],
  body: `
A **logic gate** is a circuit whose output is high or low according to a fixed rule applied to its inputs. The rule is written as a **truth table** listing the output for every combination of inputs: with $n$ inputs there are $2^n$ rows. Treat high as 1 and low as 0 and a gate computes a logical function; that is all digital electronics is built from.

### The basic gates
| Gate | Output is 1 when… | Expression | Part (74HC) |
|---|---|---|---|
| NOT (inverter) | the input is 0 | $\\overline{A}$ | 74HC04 (six) |
| AND | all inputs are 1 | $A \\cdot B$ | 74HC08 (four) |
| OR | any input is 1 | $A + B$ | 74HC32 |
| NAND | not all inputs are 1 | $\\overline{A \\cdot B}$ | 74HC00 |
| NOR | no input is 1 | $\\overline{A + B}$ | 74HC02 |
| XOR | the inputs differ | $A \\oplus B$ | 74HC86 |
| XNOR | the inputs are equal | $\\overline{A \\oplus B}$ | 74HC7266 |

The small circle on a symbol, the **bubble**, means inversion: a NAND is an AND with a bubble on its output. The same bubble on an input or a pin name with an overbar ($\\overline{CS}$, $\\overline{RESET}$) marks an **active-low** signal — one that does its job when it is 0. Europe's IEC symbols are rectangles marked &, ≥1, =1 or 1; they mean the same.

Gates come with more inputs — the 74HC20 has two 4-input NANDs, the 74HC30 one 8-input NAND. A multi-input XOR outputs 1 when an **odd** number of inputs are 1, which makes it a parity checker.

### NAND and NOR are universal
Every logical function can be built from NAND gates alone (or from NOR alone). Tie a NAND's inputs together and it is an inverter; follow a NAND with an inverter and you have AND; feed a NAND with inverted inputs and, by [[boolean-algebra|De Morgan's law]], it is an OR. In [[cmos-logic|CMOS]] the inverting gates are also the natural, fastest ones — an AND chip is internally a NAND followed by an inverter — so real logic is full of NANDs and NORs.

### Gates as controls
Thinking of one input as a control makes gates useful at once:
- **AND as a gate** in the literal sense: with EN = 1 the signal passes, with EN = 0 the output is held low (gating a clock or a PWM signal).
- **OR** holds the output high when the control is 1.
- **XOR as a controllable inverter**: $A \\oplus 0 = A$, $A \\oplus 1 = \\overline{A}$ — used to flip polarity and to [[binary-adders|subtract]].
- **Interlocks**: a spindle may start only if the guard is shut AND the start button is pressed AND the emergency stop is NOT pressed.

### In practice
A 74HC00 at 5 V switches in about 10 ns and draws essentially nothing at rest; single gates in five-pin packages (the 74LVC1G00 family) patch up a board without a 14-pin chip. Two rules save a lot of grief: **never leave a CMOS input unconnected** — tie unused inputs to a rail, even on unused gates, because a floating input drifts to mid-supply where the gate draws current and may oscillate ([[pull-resistors]]) — and remember a slow or noisy input edge wants a **Schmitt-trigger** gate such as the 74HC14. Inside an FPGA or a microcontroller there are no separate gates any more, but every \`if\` with \`&&\` and \`||\` is the same algebra.

Try every row of every gate in the bench below; then build the XOR from four NANDs and watch the intermediate signals.
`,
  ideas: [
    'A truth table lists the output for all 2ⁿ input combinations.',
    'AND needs all inputs high, OR needs any, XOR needs them to differ; a bubble means inversion.',
    'NAND alone (or NOR alone) can build every logical function.',
    'With one input as a control, AND gates a signal, OR forces it high and XOR inverts it.',
    'Never leave a CMOS input floating: tie unused inputs to a rail.'
  ],
  pitfalls: [
    'An unconnected CMOS input reads as 0 — It floats and picks up whatever is nearby; near mid-rail the gate draws current and can oscillate. Tie it high or low.',
    'A three-input XOR is 1 when exactly one input is 1 — It is 1 when an odd number of inputs are 1: one or three.',
    'AND and OR are the basic, fastest gates — In CMOS the inverting gates (NAND, NOR, NOT) are the natural ones; AND and OR add an inverter stage.'
  ],
  formulas: [
    {
      name: 'Rows in a truth table',
      expr: 'R = 2^n', tex: 'R = 2^{n}',
      vars: {
        R: { name: 'number of rows', q: 'count' },
        n: { name: 'number of inputs', q: 'count', value: 3, int: true }
      },
      stories: { R: 'How many rows does the truth table of a {n}-input function have?' }
    },
    {
      name: 'Number of different Boolean functions',
      expr: 'F = 2^(2^n)', tex: 'F = 2^{2^{n}}',
      vars: {
        F: { name: 'number of distinct functions', q: 'count' },
        n: { name: 'number of inputs', q: 'count', value: 2, int: true }
      },
      note: 'Each of the $2^n$ rows can independently be 0 or 1. Two inputs already allow 16 functions — AND, OR, XOR and their inverses among them — and three allow 256.',
      practice: { unknowns: ['F'] },
      stories: { F: 'How many different logic functions of {n} inputs are there?' }
    }
  ],
  examples: [
    {
      title: 'AND and OR from NAND gates',
      q: 'You have a spare 74HC00 (four NANDs) and need an AND and an OR of two signals. How?',
      steps: [
        'AND: $\\overline{\\overline{A B}} = AB$. One NAND gives $\\overline{AB}$; a second NAND with both inputs tied to that output inverts it. Two gates.',
        'OR: by De Morgan, $A + B = \\overline{\\overline{A}\\,\\overline{B}}$. Invert A and B with one NAND each (inputs tied), then NAND the two results. Three gates.',
        'That is five gates for both, one more than the chip has — so choose which function to build from the spare gates, or rethink the logic in NAND form.'
      ],
      a: 'AND takes two NANDs; OR takes three (two as inverters, one as the NAND of the inverted inputs).'
    },
    {
      title: 'A majority voter',
      q: 'Three redundant limit switches A, B, C: the machine should stop when at least two report "reached". Design the gate logic.',
      steps: [
        'The output is 1 when any two inputs are 1: $Y = AB + BC + AC$.',
        'In gates: three 2-input ANDs and a 3-input OR.',
        'In NAND form (by De Morgan): $Y = \\overline{\\overline{AB}\\cdot\\overline{BC}\\cdot\\overline{AC}}$ — three 2-input NANDs (a 74HC00) and one 3-input NAND (from a 74HC10).'
      ],
      a: 'Y = AB + BC + AC, built as three NANDs feeding a 3-input NAND.'
    }
  ],
  quiz: [
    { q: 'Which gate outputs 1 only when its two inputs differ?', choices: ['OR', 'XOR', 'NAND', 'XNOR'], a: 1,
      why: 'XOR is the "exclusive" OR: 01 and 10 give 1, while 00 and 11 give 0. XNOR is the opposite (an equality detector).' },
    { q: 'A NAND gate with both inputs tied together behaves as…', choices: ['a buffer', 'an inverter', 'an AND gate', 'a constant 1'], a: 1,
      why: 'With A = B the output is NOT(A·A) = NOT A.' },
    { q: 'An XOR gate can serve as a controllable inverter: with one input held at 1 it inverts the other.', a: true,
      why: 'A ⊕ 1 = A′ and A ⊕ 0 = A. Adders use exactly this to turn addition into subtraction.' },
    { q: 'How many different Boolean functions of three inputs exist?', choices: ['8', '64', '256', '65 536'], a: 2,
      why: 'A three-input truth table has 8 rows, each of which can be 0 or 1 independently: 2⁸ = 256.' },
    { q: 'One input of a gate on a 74HC00 is left unconnected. What is the risk?', choices: ['None: CMOS inputs default to 0', 'It floats; near mid-rail the gate draws current and may oscillate', 'The chip is damaged at once by the open circuit', 'The other gates in the package stop working'], a: 1,
      why: 'A CMOS input is a tiny capacitor with no defined level of its own. Tie unused inputs to VCC or GND — including those of unused gates.' }
  ],
  applications: ['Enabling or blocking a signal: an AND gate gating a clock or a PWM output.', 'Safety interlocks on machines: guard closed AND start pressed AND no emergency stop.', 'Parity generation and checking with XOR trees in memories and serial links.', 'Glue logic between chips: inverting a reset, combining chip-select lines.'],
  history: 'George Boole set out the algebra of logic in 1854. In his 1937 master\'s thesis Claude Shannon showed that relay switching circuits carry out exactly that algebra — the step that turned logic into engineering.',
  sim: 'dig-gates'
},

{
  id: 'boolean-algebra', parent: 'logic-basics', title: 'Boolean algebra and De Morgan\'s laws', level: 2,
  short: 'The algebra of 0 and 1: the rules that let you rewrite and simplify a logic expression, and De Morgan\'s laws that turn ANDs into ORs by inverting.',
  keywords: ['Boolean algebra', 'De Morgan', 'sum of products', 'product of sums', 'minterm', 'maxterm', 'absorption', 'consensus', 'simplification', 'duality', 'bubble pushing', 'canonical form'],
  prereq: ['logic-gates', 'binary-numbers'],
  related: ['karnaugh-maps', 'multiplexers', 'state-machines'],
  body: `
Boolean algebra is ordinary algebra restricted to two values. Variables are 0 or 1; there are three operations — **AND** ($A \\cdot B$ or $AB$), **OR** ($A + B$) and **NOT** ($\\overline{A}$) — and NOT binds tightest, then AND, then OR, so $A + \\overline{B}C$ means $A + ((\\overline{B})\\,C)$. Every logic circuit is an expression, and rewriting the expression rewrites the circuit: fewer terms means fewer gates, fewer packages and often a faster path.

### The rules
| Law | AND form | OR form |
|---|---|---|
| Identity | $A \\cdot 1 = A$ | $A + 0 = A$ |
| Null | $A \\cdot 0 = 0$ | $A + 1 = 1$ |
| Idempotent | $A \\cdot A = A$ | $A + A = A$ |
| Complement | $A \\cdot \\overline{A} = 0$ | $A + \\overline{A} = 1$ |
| Distributive | $A(B + C) = AB + AC$ | $A + BC = (A + B)(A + C)$ |
| Absorption | $A(A + B) = A$ | $A + AB = A$ |
| De Morgan | $\\overline{A \\cdot B} = \\overline{A} + \\overline{B}$ | $\\overline{A + B} = \\overline{A} \\cdot \\overline{B}$ |

Two are worth memorising beyond the table: $A + \\overline{A}B = A + B$, and the **consensus theorem** $AB + \\overline{A}C + BC = AB + \\overline{A}C$ (the $BC$ term is redundant). Notice the **duality**: swap AND with OR and 0 with 1 in any true identity and you get another true one — which is why the table has two columns. Several rules have no counterpart in ordinary arithmetic: $1 + 1 = 1$, and OR distributes over AND.

### De Morgan's laws
To invert an AND, invert each input and change the AND to an OR — and the other way round. In gates: a NAND is an OR with inverted inputs, a NOR is an AND with inverted inputs. Designers use this constantly to handle **active-low** signals, a technique called *bubble pushing*: "the output $\\overline{EN}$ is active when either request $\\overline{R_1}$ or $\\overline{R_2}$ is active" is $\\overline{EN} = \\overline{R_1} \\cdot \\overline{R_2}$ — an ordinary AND gate on the active-low lines. The same law rewrites firmware: \`!(a && b)\` is \`!a || !b\`.

### From a truth table to an expression
Every truth table gives an expression directly. Take each row where the output is 1, write the AND of the inputs (inverted where the input is 0) — a **minterm** — and OR the minterms together: the canonical **sum of products** (SOP). Numbering the rows by their binary value, the majority function of three inputs is $\\Sigma m(3, 5, 6, 7) = \\overline{A}BC + A\\overline{B}C + AB\\overline{C} + ABC$. Grouping the 0 rows instead gives the **product of sums** (POS). Canonical forms are correct but bloated; the rules above, or more systematically a [[karnaugh-maps|Karnaugh map]], shrink them — the majority function becomes $AB + BC + AC$.

### Checking your work
With only 0 and 1 there is a foolproof check: evaluate both sides for every input combination. Two expressions are equal if and only if their truth tables agree — for three variables that is eight rows, quick to do by hand, and the gate bench below does it for De Morgan's laws.
`,
  ideas: [
    'Variables are 0 or 1; NOT binds tightest, then AND, then OR.',
    'De Morgan: invert the inputs and swap AND with OR to invert the whole.',
    'Any truth table gives a sum of products directly: OR together the minterms of its 1 rows.',
    'Absorption and A + A′B = A + B remove redundant terms; the consensus term BC in AB + A′C + BC is redundant.',
    'Two expressions are equal exactly when their truth tables agree.'
  ],
  pitfalls: [
    'De Morgan only swaps AND and OR — You must also invert every input and the result: (A·B)′ = A′ + B′, not A′·B′.',
    'Boolean + is ordinary addition — 1 + 1 = 1 here. The arithmetic sum with a carry is the job of an adder.',
    'A + BC equals (A + B)·C — The correct distribution is A + BC = (A + B)(A + C); OR distributes over AND in Boolean algebra.'
  ],
  derivation: {
    title: 'Why the consensus term is redundant',
    steps: [
      { text: 'Start from the three-term expression and multiply the last term by $1 = A + \\overline{A}$:', tex: 'AB + \\overline{A}C + BC = AB + \\overline{A}C + BC(A + \\overline{A})' },
      { text: 'Distribute:', tex: '= AB + \\overline{A}C + ABC + \\overline{A}BC' },
      { text: 'Group each new term with the one it contains:', tex: '= AB(1 + C) + \\overline{A}C(1 + B)' },
      { text: 'Since $1 + X = 1$, the extra terms vanish:', tex: '= AB + \\overline{A}C' }
    ]
  },
  examples: [
    {
      title: 'Simplifying algebraically',
      q: 'Simplify $F = ABC + AB\\overline{C} + A\\overline{B}C$.',
      steps: [
        'The first two terms differ only in C: $ABC + AB\\overline{C} = AB(C + \\overline{C}) = AB$.',
        'So $F = AB + A\\overline{B}C = A(B + \\overline{B}C)$.',
        'Use $B + \\overline{B}C = B + C$: $F = A(B + C) = AB + AC$.',
        'Check: the original is 1 for rows 5, 6 and 7 (101, 110, 111) — exactly where A = 1 and B or C is 1.'
      ],
      a: 'F = A(B + C): one OR and one AND instead of three 3-input ANDs and an OR.'
    },
    {
      title: 'One NAND gate for a warning lamp',
      q: 'A warning LED must light (Y = 1) when the door is not closed (D = 0) or the key is not present (K = 0). Which single gate does it?',
      steps: [
        'Directly: $Y = \\overline{D} + \\overline{K}$ — an OR of two inverted signals.',
        'De Morgan: $\\overline{D} + \\overline{K} = \\overline{DK}$.',
        'That is a single NAND of D and K: one quarter of a 74HC00.'
      ],
      a: 'Y = (DK)′: one NAND gate.'
    }
  ],
  quiz: [
    { q: 'By De Morgan, $\\overline{A + B}$ equals…', choices: ['$\\overline{A}\\,\\overline{B}$', '$\\overline{A} + \\overline{B}$', '$AB$', '$\\overline{AB}$'], a: 0,
      why: 'Invert each input and swap OR for AND: (A + B)′ = A′B′. It is 1 only when both are 0 — the NOR truth table.' },
    { q: '$A + AB$ simplifies to…', choices: ['$AB$', '$A$', '$A + B$', '$B$'], a: 1,
      why: 'Absorption: A + AB = A(1 + B) = A. Whenever AB is 1, A is already 1.' },
    { q: '$A + \\overline{A}B$ simplifies to…', choices: ['$A$', '$B$', '$A + B$', '$AB$'], a: 2,
      why: 'Distribute OR over AND: (A + A′)(A + B) = 1·(A + B). If A is 0, the term A′B is just B.' },
    { q: '$\\overline{A \\cdot B} = \\overline{A} \\cdot \\overline{B}$ for all A and B.', a: false,
      why: 'Try A = 1, B = 0: the left side is 1, the right side is 0. The correct law is (AB)′ = A′ + B′.' },
    { q: 'An active-low enable $\\overline{EN}$ must be asserted (0) when either of two active-low requests $\\overline{R_1}$, $\\overline{R_2}$ is asserted. Which single gate?', choices: ['AND', 'OR', 'NAND', 'NOR'], a: 0,
      why: 'EN′ = R₁′·R₂′: the AND output goes low as soon as either input is low. In active-low terms, an AND gate performs an OR.' }
  ],
  applications: ['Reducing glue logic to fewer gates and packages.', 'Handling active-low chip selects, resets and interrupts by bubble pushing.', 'Simplifying conditions in firmware and PLC ladder logic.', 'Writing the next-state equations of state machines.'],
  history: 'Augustus De Morgan stated his laws in the 1840s, alongside Boole\'s work. The consensus theorem and systematic minimisation came a century later with switching theory.',
  sim: [{ id: 'dig-gates', params: { circuit: 'demorgan' } }]
},

{
  id: 'karnaugh-maps', parent: 'logic-basics', title: 'Karnaugh maps', level: 2,
  short: 'A truth table redrawn as a grid in Gray-code order, so that terms which simplify sit next to each other and minimising a function becomes drawing loops around groups of 1s.',
  keywords: ['Karnaugh map', 'K-map', 'minimisation', 'Gray code', 'prime implicant', 'essential prime implicant', 'don\'t care', 'sum of products', 'product of sums', 'hazard', 'Quine–McCluskey'],
  prereq: ['boolean-algebra', 'binary-numbers'],
  related: ['decoders-encoders', 'state-machines', 'logic-gates'],
  body: `
The workhorse of Boolean simplification is the identity $XY + X\\overline{Y} = X$: two terms that differ in one variable merge, and that variable disappears. A **Karnaugh map** lays the truth table out so that such pairs are always **neighbours** on paper. Then simplifying means spotting rectangles of 1s.

### Building the map
Split the variables between rows and columns and label both in **Gray code** — 00, 01, 11, 10 — so that moving one cell in any direction changes exactly one variable. For four variables A, B, C, D the rows are AB and the columns CD; each cell holds the output for that combination, and its minterm number is the binary value ABCD. Because 10 and 00 also differ in one bit, the map **wraps around**: the left edge touches the right, the top touches the bottom, and the four corners are mutual neighbours.

### Grouping
Circle the 1s in groups under four rules:
1. A group is a rectangle of 1, 2, 4, 8 or 16 cells — a power of two — possibly wrapping over the edges.
2. Make each group as **large** as possible: a group of $2^k$ cells eliminates $k$ variables.
3. Use as **few** groups as possible to cover every 1; groups may overlap.
4. Cells marked **X** (*don't care* — input combinations that never occur or whose output does not matter) may be included when they enlarge a group, and ignored otherwise.

Each group becomes one product term: keep the variables that stay constant over the group (inverted if they are 0), drop those that change. The OR of the terms is a **minimal sum of products**. Grouping the 0s instead, and writing each group as a sum with the literals inverted, gives the minimal **product of sums**.

### Prime and essential
A group that cannot be made any larger is a **prime implicant**. If some 1 is covered by only one prime implicant, that prime is **essential** and must be in the answer. The method — take the essential primes, then choose the fewest others to cover what is left — is exactly what the solver below does, and what the Quine–McCluskey algorithm does in software for more variables.

### Don't cares earn their keep
A BCD-to-seven-segment decoder receives codes 0–9 only, so codes 10–15 are don't cares. Segment *e* lights for 0, 2, 6 and 8. Without the don't cares the best answer is $\\overline{A}C\\overline{D} + \\overline{B}\\,\\overline{C}\\,\\overline{D}$ (six literals); letting the corners 0, 2, 8, 10 form a group gives $\\overline{B}\\,\\overline{D} + C\\overline{D}$ (four).

### In practice
Maps are handy up to four variables and bearable at five or six; beyond that, software (Espresso, or the synthesis tool of an FPGA) does the job, and inside an FPGA a look-up table implements any four- to six-input function at the same cost anyway. Karnaugh maps remain the fastest way to minimise small glue logic and the next-state equations of a [[state-machines|state machine]], and they show one subtle danger: where two groups touch without overlapping, a single input change passes from one term to the other and the output of real gates can **glitch** for a few nanoseconds — a *static hazard*. Adding the redundant group that bridges them (the consensus term) removes it, which matters when the output drives a latch or an asynchronous reset.
`,
  ideas: [
    'Gray-code labels make logically adjacent cells physically adjacent, including across the edges.',
    'Groups are rectangles of 2ᵏ cells; a group of 2ᵏ drops k variables from its term.',
    'Use the largest groups and the fewest of them; overlapping is allowed.',
    'Don\'t-care cells are free: include them only when they make a group bigger.',
    'Grouping the 0s gives the product-of-sums form.'
  ],
  pitfalls: [
    'Groups can be any shape of adjacent 1s — Only rectangles of 1, 2, 4, 8 or 16 cells make a valid term; an L-shape or three cells does not.',
    'The edges of the map are boundaries — The map wraps: the leftmost column is next to the rightmost, and the four corners form a group.',
    'Every don\'t care must be covered — Don\'t cares are optional; they matter only if they enlarge a group.'
  ],
  formulas: [
    {
      name: 'Literals in the term of one group',
      expr: 'L = n - log2(G)', tex: 'L = n - \\log_2 G',
      vars: {
        L: { name: 'literals in the product term', q: 'count' },
        n: { name: 'variables in the map', q: 'count', value: 4, int: true },
        G: { name: 'cells in the group (a power of two)', q: 'count', value: 4 }
      },
      note: 'A single cell gives a full minterm of $n$ literals; each doubling of the group removes one variable; the whole map is the constant 1.',
      practice: { unknowns: ['L'] },
      stories: { L: 'In a {n}-variable Karnaugh map you circle a group of {G} cells. How many literals does its term have?' }
    }
  ],
  examples: [
    {
      title: 'The majority function',
      q: 'Minimise the three-input majority function, $\\Sigma m(3, 5, 6, 7)$.',
      steps: [
        'Map with row A and columns BC in the order 00, 01, 11, 10. The 1s are at 011, 101, 111 and 110.',
        'Cell 111 has three neighbours that are 1: 011, 101 and 110. Pair it with each: groups {011, 111}, {101, 111}, {110, 111}.',
        'Each pair drops the variable that changes: $BC$, $AC$, $AB$. The cell 111 is covered three times — overlapping is fine.',
        'No larger groups exist, and each pair is essential (it alone covers one of the outer 1s).'
      ],
      a: 'F = AB + BC + AC.'
    },
    {
      title: 'Segment e of a seven-segment decoder',
      q: 'Segment *e* is lit for the BCD digits 0, 2, 6 and 8. Find the minimal logic, using the fact that codes 10–15 never occur.',
      steps: [
        'Minterms 0, 2, 6, 8; don\'t cares 10–15. Variables A (MSB) to D (LSB).',
        'The four corners 0, 2, 8, 10 form a group (10 is a don\'t care): B = 0 and D = 0 throughout, so the term is $\\overline{B}\\,\\overline{D}$.',
        'Cell 6 (0110) groups with 2, 10 and 14 down the column CD = 10: C = 1, D = 0, giving $C\\overline{D}$.',
        'Result: $e = \\overline{B}\\,\\overline{D} + C\\overline{D} = \\overline{D}(\\overline{B} + C)$ — two terms, four literals, against six literals without the don\'t cares.'
      ],
      a: 'e = B′D′ + CD′.'
    }
  ],
  quiz: [
    { q: 'Why are rows and columns labelled 00, 01, 11, 10 rather than 00, 01, 10, 11?', choices: ['It is a convention with no reason', 'So that neighbouring cells differ in exactly one variable', 'So that the minterm numbers increase', 'To make the map symmetric'], a: 1,
      why: 'Gray-code order puts every pair of terms that can merge (differing in one variable) next to each other — including across the edges, since 10 and 00 differ in one bit.' },
    { q: 'In a four-variable map, a group of eight cells gives a term with how many literals?', choices: ['8', '4', '3', '1'], a: 3,
      why: '8 = 2³ cells eliminate three variables, leaving 4 − 3 = 1 literal — for example the whole left half of the map might be just C′.' },
    { q: 'Groups of 1s may overlap.', a: true,
      why: 'A 1 may be covered by several groups. Overlapping lets each group be as large as possible, which is the whole point.' },
    { q: 'A cell marked X (don\'t care)…', choices: ['must be treated as 1', 'must be treated as 0', 'may be included in a group if it helps, or left out', 'must be covered by a group of its own'], a: 2,
      why: 'X marks input combinations whose output does not matter, so the designer picks whichever value gives the simpler circuit.' },
    { q: 'The four corner cells of a four-variable map (m0, m2, m8, m10) are all 1. They form…', choices: ['nothing: they are not adjacent', 'two separate pairs', 'one group of four, B′D′', 'one group of four, A′C′'], a: 2,
      why: 'The map wraps in both directions, so the corners are neighbours. Across them A and C change while B = 0 and D = 0 stay: the term is B′D′.' }
  ],
  applications: ['Minimising glue logic and PLD equations by hand.', 'Designing the next-state and output logic of small state machines.', 'Seven-segment and other code-conversion logic, where don\'t cares abound.', 'Spotting and removing static hazards in asynchronous logic.'],
  history: 'Maurice Karnaugh introduced the map at Bell Labs in 1953, refining a diagram published by Edward Veitch the year before.',
  sim: 'dig-kmap'
},

{
  id: 'logic-families', parent: 'logic-basics', title: 'Logic levels and families: TTL and CMOS', level: 2,
  short: 'What voltage counts as a 0 or a 1, how much noise a connection can tolerate, and the families of logic chips — TTL, 74HC, 74HCT, 74LVC — with their speeds, drive and supply voltages.',
  keywords: ['logic family', 'TTL', 'CMOS', '74HC', '74HCT', '74LVC', '74LS', 'VIH', 'VIL', 'VOH', 'VOL', 'noise margin', 'fan-out', 'propagation delay', 'level shifting', '5 V tolerant', 'LVTTL', 'dynamic power'],
  prereq: ['logic-gates', 'voltage', 'power-energy'],
  related: ['cmos-logic', 'pull-resistors', 'timing-clocks', 'microcontrollers'],
  body: `
Logic chips turn voltages into 0s and 1s, and to connect two of them you need to know exactly which voltages count. Every datasheet gives four numbers:

- $V_{OH}$ — the lowest voltage a driver guarantees for a 1, and $V_{OL}$ — the highest it guarantees for a 0 (each at a stated load current);
- $V_{IH}$ — the lowest voltage a receiver is guaranteed to read as 1, and $V_{IL}$ — the highest it is guaranteed to read as 0.

Between $V_{IL}$ and $V_{IH}$ lies no-man's-land: the input may read either way, or oscillate. A link works when the driver's guaranteed levels land inside the receiver's guaranteed ranges, and the gaps are the **noise margins**:

$$NM_H = V_{OH} - V_{IH}, \\qquad NM_L = V_{IL} - V_{OL}$$

A noise spike smaller than the margin cannot flip the bit. That tolerance is why digital circuits can be built by the billion and still work.

### The families
| Family | Supply | $V_{IL}$ max | $V_{IH}$ min | $V_{OL}$ max | $V_{OH}$ min | Delay (gate) |
|---|---|---|---|---|---|---|
| 74LS (TTL) | 5 V | 0.8 V | 2.0 V | 0.5 V | 2.7 V | ≈ 10 ns |
| 74HC (CMOS), at 4.5 V | 2–6 V | 1.35 V | 3.15 V | 0.1 V | 4.4 V | ≈ 10 ns |
| 74HCT (CMOS, TTL inputs) | 5 V | 0.8 V | 2.0 V | 0.1 V | 4.4 V | ≈ 12 ns |
| 3.3 V LVTTL / 74LVC | 1.65–3.6 V | 0.8 V | 2.0 V | 0.4 V | 2.4 V | ≈ 3 ns |

(The CMOS output levels are for light loads; they move away from the rails as current is drawn — a 74HC output at 4.5 V still guarantees 3.98 V while sourcing 4 mA.)

**TTL** (bipolar, 1960s–80s) set the 0.8 V / 2.0 V thresholds that survive to this day. **74HC** is CMOS: rail-to-rail outputs, thresholds at 30 % and 70 % of the supply, almost no static current and a wide 2–6 V supply. **74HCT** is the same silicon with inputs tuned to TTL thresholds. The **4000 series** (CD4011, CD4017, CD4060) runs from 3 to 18 V but is slow — around 100 ns at 5 V. **74LVC**, **74AHC** and **74AUC** serve 3.3 V, 2.5 V and 1.8 V systems; 74LVC inputs are **5 V tolerant**.

### Mixing voltages
The commonest trap today is a 3.3 V microcontroller talking to 5 V logic. Its output high (about 2.9–3.3 V) misses a 74HC's $V_{IH}$ of 3.5 V at 5 V — negative noise margin, unreliable. The standard fix is a **74HCT** or **74AHCT** part powered at 5 V: its 2.0 V threshold is met with room to spare (the classic way to drive WS2812 LED strips from a 3.3 V board). In the other direction, a 5 V output into a 3.3 V input pushes current through the input's protection diode into the 3.3 V rail unless the pin is marked 5 V tolerant (74LVC, the "FT" pins of an STM32); otherwise use a resistor divider for slow signals or a level-shifter chip.

### Drive and fan-out
A TTL input sinks real current when low (0.4 mA for 74LS), so one output can drive only so many inputs — its **fan-out**, 20 for 74LS. A CMOS input draws only leakage (at most 1 µA), so the DC fan-out is huge; what limits it is capacitance — about 3.5 pF per 74HC input plus the track — because every picofarad slows the edges.

### Speed and power
Faster families have sharper edges, which ring on long tracks and radiate: use the slowest family that meets the timing. CMOS power is almost all **dynamic**, spent charging capacitance: each full cycle costs $C V^2$, so

$$P = (C_{pd} + C_L)\\,V_{CC}^2\\,f$$

where $C_{pd}$ is the chip's internal power-dissipation capacitance from the datasheet. Power rises with frequency and with the **square** of the supply — the main reason logic moved from 5 V to 3.3 V and processor cores to about 1 V.
`,
  ideas: [
    'V_OH and V_OL are what a driver guarantees; V_IH and V_IL are what a receiver needs.',
    'Noise margins NM_H = V_OH − V_IH and NM_L = V_IL − V_OL must both be positive.',
    '74HC has CMOS thresholds (30 % / 70 % of supply); 74HCT has TTL thresholds (0.8 V / 2.0 V) on a 5 V supply.',
    'A 3.3 V output driving 5 V CMOS needs an HCT-type input; a 5 V output into 3.3 V needs a 5 V-tolerant input.',
    'CMOS power is dynamic: P = C V² f, so it scales with frequency and the square of the supply.'
  ],
  pitfalls: [
    'Anything above half the supply is a 1 — Only voltages above V_IH are guaranteed to read as 1; the band between V_IL and V_IH is undefined.',
    '3.3 V and 5 V logic can be wired together directly — A 3.3 V high may not reach a 5 V CMOS V_IH, and a 5 V output can back-power a 3.3 V chip through its protection diode.',
    'Faster logic is always better — Sharp edges ring and radiate on long tracks; the slowest family that meets the timing is the most robust choice.'
  ],
  formulas: [
    {
      name: 'Noise margin, high level',
      expr: 'NMH = VOH - VIH', tex: '\\mathrm{NM}_H = V_{OH} - V_{IH}',
      vars: {
        NMH: { name: 'high-level noise margin', q: 'voltage', unit: 'V', tex: '\\mathrm{NM}_H', signed: true },
        VOH: { name: 'driver\'s guaranteed high output', q: 'voltage', unit: 'V', value: 4.4, tex: 'V_{OH}' },
        VIH: { name: 'receiver\'s required high input', q: 'voltage', unit: 'V', value: 3.15, tex: 'V_{IH}' }
      },
      note: 'A negative result means the connection is not guaranteed to work.',
      stories: { NMH: 'A driver guarantees {VOH} for a 1; the receiver needs at least {VIH}. What is the high-level noise margin?' }
    },
    {
      name: 'Noise margin, low level',
      expr: 'NML = VIL - VOL', tex: '\\mathrm{NM}_L = V_{IL} - V_{OL}',
      vars: {
        NML: { name: 'low-level noise margin', q: 'voltage', unit: 'V', tex: '\\mathrm{NM}_L', signed: true },
        VIL: { name: 'receiver\'s highest input read as 0', q: 'voltage', unit: 'V', value: 0.8, tex: 'V_{IL}' },
        VOL: { name: 'driver\'s guaranteed low output', q: 'voltage', unit: 'V', value: 0.5, tex: 'V_{OL}' }
      },
      stories: { NML: 'A 74LS output guarantees at most {VOL} for a 0 into an input that reads up to {VIL} as 0. What is the low-level noise margin?' }
    },
    {
      name: 'Dynamic power of a CMOS output',
      expr: 'P = (Cpd + CL)*V^2*f', tex: 'P = (C_{pd} + C_L)\\,V_{CC}^2\\,f',
      vars: {
        P: { name: 'power', q: 'power', unit: 'mW' },
        Cpd: { name: 'power-dissipation capacitance (datasheet)', q: 'capacitance', unit: 'pF', value: 20, tex: 'C_{pd}' },
        CL: { name: 'load capacitance', q: 'capacitance', unit: 'pF', value: 50, tex: 'C_L' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{CC}' },
        f: { name: 'switching frequency (full cycles)', q: 'frequency', unit: 'MHz', value: 10 }
      },
      note: 'Per switching output. Static current adds only microamps for CMOS; this term dominates as soon as anything toggles.',
      stories: { P: 'A 74HC04 (C_pd = {Cpd}) drives {CL} at {f} from {V}. How much power does that output cost?', f: 'How fast can an output with C_pd = {Cpd} and {CL} of load toggle from {V} before it costs {P}?' }
    },
    {
      name: 'Fan-out of a TTL output',
      expr: 'N = IOL/IIL', tex: 'N = \\frac{I_{OL}}{I_{IL}}',
      vars: {
        N: { name: 'number of inputs one output can drive', q: 'count' },
        IOL: { name: 'output\'s rated sink current at V_OL', q: 'current', unit: 'mA', value: 8, tex: 'I_{OL}' },
        IIL: { name: 'current out of each input when low', q: 'current', unit: 'mA', value: 0.4, tex: 'I_{IL}' }
      },
      note: 'For CMOS inputs the DC fan-out is in the thousands; capacitance and edge speed limit it instead.',
      practice: { unknowns: ['N', 'IOL'] }
    }
  ],
  examples: [
    {
      title: 'A 3.3 V microcontroller driving 5 V logic',
      q: 'An STM32 output (V_OH ≥ 2.9 V at 3.3 V supply) must drive a counter chip powered at 5 V. Compare a 74HC part (V_IH = 3.5 V at 5 V) with a 74HCT part.',
      steps: [
        '74HC: $NM_H = 2.9 - 3.5 = -0.6\\ \\mathrm{V}$. Negative: the 1 is not guaranteed to be read. It might work on the bench and fail when warm or on another batch.',
        '74HCT: $V_{IH} = 2.0\\ \\mathrm{V}$, so $NM_H = 2.9 - 2.0 = 0.9\\ \\mathrm{V}$. Low side: $NM_L = 0.8 - 0.4 = 0.4\\ \\mathrm{V}$ (MCU $V_{OL}$ ≤ 0.4 V).',
        'The HCT output still swings the full 0–5 V, so it also works as a 3.3 V → 5 V level shifter.'
      ],
      a: '74HC is out of specification; 74HCT gives 0.9 V and 0.4 V margins.'
    },
    {
      title: 'Power in a clock buffer',
      q: 'A 74HC04 inverter (C_pd = 20 pF) distributes a 16 MHz clock to 30 pF of load at 5 V. What does it dissipate? What at 3.3 V?',
      steps: [
        '$P = (20 + 30)\\times10^{-12} \\times 5^2 \\times 16\\times10^{6} = 20\\ \\mathrm{mW}$.',
        'At 3.3 V: $P = 50\\times10^{-12} \\times 3.3^2 \\times 16\\times10^6 = 8.7\\ \\mathrm{mW}$.',
        'The supply fell by a third and the power by more than half — the square law.'
      ],
      a: '20 mW at 5 V; 8.7 mW at 3.3 V.'
    }
  ],
  quiz: [
    { q: 'A 74LS output (V_OH ≥ 2.7 V) drives a 74HC input powered at 5 V (V_IH = 3.5 V). The high level is…', choices: ['guaranteed to be read as 1', 'not guaranteed to be read as 1', 'read as 0', 'damaging to the input'], a: 1,
      why: 'The noise margin is 2.7 − 3.5 = −0.8 V. TTL-to-CMOS links are what 74HCT parts were made for.' },
    { q: 'What mainly limits how many 74HC inputs one 74HC output can drive?', choices: ['The DC input current', 'The total input capacitance, which slows the edges', 'The supply voltage', 'Nothing: it is unlimited'], a: 1,
      why: 'CMOS inputs draw at most about 1 µA, but each adds a few picofarads; enough of them make the edges too slow for the timing.' },
    { q: 'A CMOS circuit\'s power consumption rises in proportion to its switching frequency.', a: true,
      why: 'Each cycle charges and discharges the load capacitance, costing C V²; at rest only leakage flows.' },
    { q: 'Keeping the clock the same, you lower a CMOS circuit\'s supply from 5 V to 2.5 V. The dynamic power…', choices: ['halves', 'falls to a quarter', 'stays the same', 'doubles'], a: 1,
      why: 'P ∝ V²: halving the voltage divides the power by four (though the gates also get slower).' },
    { q: 'A 3.3 V LVTTL driver guarantees V_OH = 2.4 V into an input with V_IH = 2.0 V. What is the high-level noise margin?', answer: 0.4, unit: 'V',
      why: 'NM_H = V_OH − V_IH = 2.4 − 2.0 = 0.4 V.' }
  ],
  applications: ['Interfacing 3.3 V microcontrollers with 5 V peripherals and LED strips (74AHCT125, 74HCT245).', 'Choosing glue logic for a board: 74HC for general use, 74LVC for 3.3 V systems, CD4000 for 12 V circuits.', 'Estimating the power of clock trees and buses.', 'Checking that a sensor\'s digital output meets a controller\'s input thresholds.'],
  history: 'Texas Instruments\' 7400 TTL series appeared in the mid-1960s and set the pin-outs and part numbers still used today. Frank Wanlass invented CMOS at Fairchild in 1963; RCA\'s CD4000 series followed in 1968, and the pin-compatible 74HC family made CMOS the default in the 1980s.',
  sim: [{ id: 'dig-cmos', params: { family: 'hct' } }]
},

{
  id: 'cmos-logic', parent: 'logic-basics', title: 'How CMOS gates work', level: 2,
  short: 'A CMOS gate pairs P- and N-channel MOSFETs so that one network pulls the output up and the other pulls it down, never both at rest — rail-to-rail outputs and almost no static power.',
  keywords: ['CMOS', 'complementary MOS', 'inverter', 'PMOS', 'NMOS', 'transfer characteristic', 'switching threshold', 'shoot-through', 'NAND structure', 'dynamic power', 'latch-up', 'transmission gate', 'ESD protection'],
  prereq: ['logic-gates', 'mosfet-operation', 'mosfet-switch'],
  related: ['logic-families', 'pull-resistors', 'multiplexers'],
  body: `
Inside nearly every digital chip made today, each gate is a pair of complementary networks of MOSFETs. The idea is simplest in the **inverter**: a P-channel MOSFET from the supply to the output, an N-channel MOSFET from the output to ground, both gates driven by the input.

- Input low: the NMOS is off (no gate–source voltage), the PMOS is on (its gate is far below its source). The output is connected to $V_{DD}$ — a 1.
- Input high: the NMOS is on, the PMOS off. The output is connected to ground — a 0.

At rest one transistor is always off, so **no current flows from supply to ground** apart from leakage, and the output reaches the rails exactly. Those two properties — zero static power and full-swing outputs — are why CMOS displaced every other logic technology.

### The transfer curve
Sweep the input slowly and the output stays high until the NMOS begins to conduct, then drops steeply to 0 once the PMOS lets go. In the middle both transistors are on and the gain is huge; the **switching threshold** $V_M$, where output equals input, sits near $V_{DD}/2$ when the two transistors are equally strong. Holes are about two to three times less mobile than electrons, so the PMOS is drawn two to three times wider to balance them. Making it deliberately weak moves $V_M$ down — the principle behind TTL-compatible 74HCT inputs. The sim below solves the real pair of transistors and draws this curve and its supply current.

### Shoot-through and slow inputs
While the input passes through the middle, both transistors conduct and a **shoot-through** current flows — about a milliamp for a small 74HC gate. A clean edge crosses in nanoseconds and costs little; a slowly changing or noisy input lingers there, wasting power and, with a bit of noise, making the output chatter. Datasheets therefore limit the input rise time (for 74HC, about 500 ns at 4.5 V). Slow signals — an RC-filtered button, a sensor output — belong on a **Schmitt-trigger** input such as the 74HC14. A floating input is the extreme case: it drifts to mid-rail and sits there.

### More inputs: NAND and NOR
For a NAND, put the NMOS transistors in **series** (the output is pulled low only if every input is high) and the PMOS transistors in **parallel** (any low input pulls it high). A NOR is the dual: NMOS in parallel, PMOS in series. A 2-input NAND is four transistors, a 3-input one six. Because a series stack of slow PMOS devices is sluggish, NAND is the preferred CMOS gate, and non-inverting gates — AND, OR, buffers — are an inverting gate followed by an inverter, one stage slower.

### Where the power goes
Every output drives a capacitance: the next inputs, the track, the internal nodes. Charging it to $V_{DD}$ draws $C V_{DD}^2$ of energy from the supply — half is stored in the capacitor, half burned in the PMOS — and discharging burns the stored half in the NMOS. A gate switching $f$ times per second therefore dissipates $C V_{DD}^2 f$, whatever its transistors' resistance. For a whole chip, with a fraction $\\alpha$ of its capacitance switching each cycle, $P = \\alpha C V^2 f$ — which is why lowering the supply is the most powerful way to save energy.

### Practical consequences
- The output behaves like a switch with some tens of ohms of resistance (roughly 50–130 Ω for 74HC at 4.5 V); with a load capacitance it gives an RC edge, $t \\approx 0.69\\,R_{on} C_L$ to the midpoint.
- Every pin has **protection diodes** to both rails against electrostatic discharge. Drive an input above $V_{DD}$ and the diode conducts: the chip can be powered through its input ("phantom powering"), and a large enough injected current can trigger **latch-up**, a parasitic thyristor that shorts the supply until power is removed. Keep inputs within the rails, or limit the current with a series resistor.
- Put an NMOS and a PMOS in parallel, driven by opposite signals, and you have a **transmission gate** — a switch that passes analogue signals both ways, the heart of the CD4066 and 74HC4051 ([[multiplexers]]).
`,
  ideas: [
    'A PMOS pulls the output up, an NMOS pulls it down; at rest one is always off, so no static current flows.',
    'The switching threshold depends on the relative strength of the two transistors.',
    'Both transistors conduct briefly during a transition: slow input edges waste power and cause chatter.',
    'NAND puts NMOS in series and PMOS in parallel; NOR the reverse. NAND is the faster, preferred gate.',
    'Each charge and discharge of a capacitance costs C V²: P = α C V² f.'
  ],
  pitfalls: [
    'CMOS gates use no power — Only when idle. Every transition costs C V², so power grows with frequency.',
    'An input above the supply is harmless because the input has high impedance — Its protection diode conducts; the chip can be powered through the input, or latch up.',
    'The switching threshold is always half the supply — It is set by transistor sizing; HCT inputs deliberately switch near 1.4 V.'
  ],
  formulas: [
    {
      name: 'Switching threshold of a CMOS inverter (square-law model)',
      expr: 'VM = (VDD - Vt + Vt/sqrt(kr))/(1 + 1/sqrt(kr))', tex: 'V_M = \\frac{V_{DD} - V_T + V_T/\\sqrt{k_r}}{1 + 1/\\sqrt{k_r}}',
      vars: {
        VM: { name: 'switching threshold (output = input)', q: 'voltage', unit: 'V', tex: 'V_M' },
        VDD: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{DD}' },
        Vt: { name: 'threshold voltage of each transistor', q: 'voltage', unit: 'V', value: 0.8, tex: 'V_T' },
        kr: { name: 'PMOS-to-NMOS strength ratio k_p/k_n', q: 'ratio', value: 0.4, tex: 'k_r' }
      },
      note: 'Both transistors are saturated at $V_M$ and carry the same current. The default 0.4 is two transistors of equal size, the PMOS weaker by the lower mobility of holes. With equal strengths ($k_r = 1$) $V_T$ cancels and the threshold is exactly $V_{DD}/2$.',
      stories: { VM: 'An inverter on {VDD} has |V_T| = {Vt} and a PMOS-to-NMOS strength ratio of {kr}. Where does it switch?', kr: 'You want an inverter on {VDD} with |V_T| = {Vt} to switch at {VM}. What PMOS-to-NMOS strength ratio does that need?' }
    },
    {
      name: 'Dynamic power of a CMOS chip',
      expr: 'P = alpha*C*V^2*f', tex: 'P = \\alpha\\,C\\,V^2 f',
      vars: {
        P: { name: 'dynamic power', q: 'power', unit: 'mW' },
        alpha: { name: 'activity factor (fraction switching each cycle)', q: 'ratio', value: 0.1, tex: '\\alpha' },
        C: { name: 'total switched capacitance', q: 'capacitance', unit: 'nF', value: 1 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 1.2 },
        f: { name: 'clock frequency', q: 'frequency', unit: 'MHz', value: 100 }
      },
      stories: { P: 'A logic core has {C} of switched capacitance, an activity factor of {alpha}, and runs at {f} from {V}. What is its dynamic power?' }
    },
    {
      name: 'Output edge delay into a capacitive load',
      expr: 'tpd = 0.69*Ron*CL', tex: 't_{pd} = 0.69\\,R_{on} C_L',
      vars: {
        tpd: { name: 'delay to the 50 % point', q: 'time', unit: 'ns', tex: 't_{pd}' },
        Ron: { name: 'output on-resistance', q: 'resistance', unit: 'Ω', value: 50, tex: 'R_{on}' },
        CL: { name: 'load capacitance', q: 'capacitance', unit: 'pF', value: 50, tex: 'C_L' }
      },
      note: 'The 0.69 is ln 2: the time for an RC step to reach half-way. This is the load-dependent part of the delay; the gate\'s internal delay comes on top.'
    }
  ],
  derivation: {
    title: 'The switching threshold',
    steps: [
      { text: 'At $V_{in} = V_{out} = V_M$ both transistors are saturated (each has $V_{DS} > V_{GS} - V_T$) and carry the same current:', tex: '\\frac{k_n}{2}(V_M - V_T)^2 = \\frac{k_p}{2}(V_{DD} - V_M - V_T)^2' },
      { text: 'Take the square root of both sides and write $k_r = k_p/k_n$:', tex: 'V_M - V_T = \\sqrt{k_r}\\,(V_{DD} - V_M - V_T)' },
      { text: 'Collect $V_M$:', tex: 'V_M\\left(1 + \\sqrt{k_r}\\right) = \\sqrt{k_r}\\,(V_{DD} - V_T) + V_T' },
      { text: 'Divide through by $\\sqrt{k_r}$ to get the form of the calculator:', tex: 'V_M = \\frac{V_{DD} - V_T + V_T/\\sqrt{k_r}}{1 + 1/\\sqrt{k_r}}' }
    ]
  },
  examples: [
    {
      title: 'A weak PMOS for TTL-level inputs',
      q: 'With $V_{DD} = 5\\ \\mathrm{V}$ and $V_T = 0.8\\ \\mathrm{V}$, how much weaker than the NMOS must the PMOS be for the inverter to switch at 1.4 V (the middle of the TTL window)?',
      steps: [
        'Let $x = 1/\\sqrt{k_r}$. The threshold formula becomes $1.4 = \\dfrac{4.2 + 0.8x}{1 + x}$.',
        '$1.4 + 1.4x = 4.2 + 0.8x$, so $0.6x = 2.8$ and $x = 4.67$.',
        '$k_r = 1/x^2 = 0.046$: in this simple model the PMOS must be about 22 times weaker than the NMOS.',
        'Set the ratio to about 0.05 in the sim and the transfer curve drops to switch near 1.4 V — inside the 0.8 V to 2.0 V TTL window.'
      ],
      a: 'k_p/k_n ≈ 0.05.'
    },
    {
      title: 'The energy of a toggling output',
      q: 'A 3.3 V output drives a 20 pF track and input, toggling at 1 MHz. What power does it dissipate, and where?',
      steps: [
        'Each cycle draws $C V^2 = 20\\times10^{-12} \\times 3.3^2 = 218\\ \\mathrm{pJ}$ from the supply.',
        'At 1 MHz: $P = 218\\ \\mathrm{pJ} \\times 10^6 = 218\\ \\mathrm{\\mu W}$.',
        'Half of it heats the PMOS during each rising edge, half the NMOS during each falling edge — the resistance of the transistors does not change the total.'
      ],
      a: '218 µW, shared equally between the two transistors.'
    }
  ],
  quiz: [
    { q: 'In a CMOS NAND gate the NMOS transistors are connected…', choices: ['in series, with the PMOS in parallel', 'in parallel, with the PMOS in series', 'all in series', 'all in parallel'], a: 0,
      why: 'The output must be pulled low only when every input is high (series NMOS), and pulled high when any input is low (parallel PMOS).' },
    { q: 'Why does a CMOS gate at rest draw almost no current?', choices: ['MOSFET gates are insulated', 'In either steady state one transistor of the pair is off', 'The supply is switched off between transitions', 'The output capacitance blocks DC'], a: 1,
      why: 'There is never a conducting path from supply to ground when the input sits at a rail; only leakage flows.' },
    { q: 'A slowly rising input edge increases a CMOS gate\'s supply current.', a: true,
      why: 'While the input is near mid-supply both transistors conduct, and a shoot-through current flows for as long as the input lingers there.' },
    { q: 'A CMOS output charges and discharges a load capacitor once per cycle. The energy lost per cycle…', choices: ['depends on the transistors\' on-resistance', 'is C V², whatever the resistance', 'is ½ C V²', 'is zero, because the capacitor returns its energy'], a: 1,
      why: 'Charging through any resistance wastes ½ C V² and stores ½ C V², which is then wasted on discharge. The resistance sets how fast, not how much.' },
    { q: 'Why is an AND gate slower than a NAND gate in CMOS?', choices: ['AND needs more inputs', 'An AND gate is a NAND followed by an inverter', 'AND gates use bipolar transistors', 'It is not: they are identical'], a: 1,
      why: 'A single CMOS stage always inverts, so a non-inverting function needs a second stage.' }
  ],
  applications: ['Every microcontroller, processor and memory is built from CMOS gates.', 'Choosing Schmitt-trigger inputs (74HC14) for slow or noisy signals.', 'Analogue switches and multiplexers built from transmission gates (CD4066, 74HC4051).', 'Low-power design: lowering supply voltage and clock, and stopping clocks to idle blocks.'],
  sim: 'dig-cmos'
},

{
  id: 'pull-resistors', parent: 'logic-basics', title: 'Pull-up and pull-down resistors', level: 1,
  short: 'A resistor that holds a logic line at a defined level when nothing else drives it: needed for buttons, open-drain outputs and I²C, and sized between too much current and too slow an edge.',
  keywords: ['pull-up', 'pull-down', 'floating input', 'open drain', 'open collector', 'wired-AND', 'push-button', 'internal pull-up', 'I²C pull-up', 'rise time', 'bus capacitance', 'MOSFET gate pull-down'],
  prereq: ['logic-gates', 'resistance-ohms-law', 'rc-transient'],
  related: ['serial-buses', 'switches', 'cmos-logic', 'logic-families'],
  body: `
A CMOS input has almost infinite resistance: connected to nothing, it has no defined voltage at all. It **floats** — picking up charge from fingers, neighbouring tracks and mains hum — and reads 0 or 1 at random. A switch only helps half the time: when it is open, the input is floating again. The cure is a resistor to one rail that sets the level whenever nothing stronger is driving the line.

### Pull-up with a switch to ground
The most common arrangement puts a **pull-up** resistor from the input to $V_{CC}$ and the button from the input to ground. Released, the resistor holds the input high; pressed, the switch pulls it hard to 0 and a small current $V_{CC}/R$ flows through the resistor. The logic is *active-low* (pressed = 0) — a small price for being able to use the pull-up resistors built into nearly every microcontroller: 20–50 kΩ on an ATmega328P, about 40 kΩ on an STM32, enabled by one register bit (\`INPUT_PULLUP\` in Arduino code).

A **pull-down** to ground does the opposite and suits signals that must default to 0. The textbook example is the gate of a power MOSFET driven from a microcontroller pin: while the MCU is in reset its pins float, and without a 10–100 kΩ gate-to-source pull-down the MOSFET can switch a motor or heater on for a moment at power-up.

### Choosing the value
Two pressures pull in opposite directions:
- **Small enough** to hold the level against leakage and noise, and to charge the line's stray capacitance quickly. The line rises exponentially; from 10 % to 90 % takes $t_r = 2.2\\,RC$. With 100 kΩ and 20 pF that is 4.4 µs — fine for a button, useless for a fast bus.
- **Large enough** not to waste current when the line is low, and not to exceed what the device pulling low may sink.

For buttons and enable pins, 4.7–10 kΩ is the usual choice (330 µA at 3.3 V with 10 kΩ); for signals that only need to be defined at power-up, 100 kΩ is fine.

### Open-drain outputs and the wired-AND
An **open-drain** (or open-collector) output has only the bottom transistor: it can pull the line low or let go, but never drive it high. A pull-up supplies the high level. This allows several outputs on one wire — any of them can pull it low, and it is high only when all let go, a *wired-AND*. Shared interrupt lines, reset lines and the I²C bus work this way, and because the pull-up can go to any voltage, an open-drain output is also the simplest level shifter.

### I²C: the pull-up sets the speed
On an I²C bus ([[serial-buses]]) both lines are open-drain, so every rising edge is the pull-up charging the bus capacitance — all the pins and tracks, up to 400 pF. The specification limits the rise time between 30 % and 70 % of the supply, which for an RC edge is $0.847\\,R_pC_b$: 1000 ns in standard mode (100 kHz) and 300 ns in fast mode (400 kHz). That sets a **maximum** pull-up. The **minimum** comes from the sink current: every device must pull the line below 0.4 V while sinking 3 mA, so $R_p \\ge (V_{DD} - 0.4\\ \\mathrm{V})/3\\ \\mathrm{mA}$ — 967 Ω at 3.3 V. (Fast-mode devices must also sink 6 mA at 0.6 V, which allows about 450 Ω.) At 100 kHz with 200 pF, anything from 1 kΩ to 5.9 kΩ works and 4.7 kΩ is the classic choice; at 400 kHz the upper limit drops to 1.8 kΩ. The 20–50 kΩ internal pull-ups of a microcontroller are far too weak for either.

> [!warn] Breakout boards usually carry their own pull-ups. Plug five sensor modules with 10 kΩ each onto one I²C bus and the combined pull-up is 2 kΩ — still fine — but with 4.7 kΩ on each it is 940 Ω, below the 3 mA limit.
`,
  ideas: [
    'A floating CMOS input has no defined level; a pull resistor gives it one.',
    'Pull-up plus switch to ground gives active-low inputs and can use the MCU\'s internal pull-ups.',
    'Smaller resistors give faster edges and better noise immunity but waste more current.',
    'Open-drain outputs need a pull-up; several can share one wire as a wired-AND.',
    'For I²C the rise time sets the largest pull-up and the 3 mA sink rule the smallest.'
  ],
  pitfalls: [
    'A smaller pull-up is always safer — It wastes current whenever the line is low and may exceed what an open-drain driver can sink (3 mA for I²C).',
    'The microcontroller\'s internal pull-up will do for any bus — At 20–50 kΩ it is fine for buttons but far too slow for I²C.',
    'A floating input simply reads 0 — It reads whatever it last picked up, and a CMOS input near mid-rail draws current and may oscillate.'
  ],
  formulas: [
    {
      name: 'Current through a pull-up when the line is low',
      expr: 'I = V/R', tex: 'I = \\frac{V_{CC}}{R}',
      vars: {
        I: { name: 'current', q: 'current', unit: 'mA' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{CC}' },
        R: { name: 'pull-up resistance', q: 'resistance', unit: 'kΩ', value: 10 }
      },
      stories: { I: 'A button pulls an input low against a {R} pull-up to {V}. How much current flows while it is pressed?' }
    },
    {
      name: 'Rise time of a pulled-up line (10 % to 90 %)',
      expr: 'tr = 2.2*R*C', tex: 't_r = 2.2\\,R C',
      vars: {
        tr: { name: 'rise time', q: 'time', unit: 'µs', tex: 't_r' },
        R: { name: 'pull-up resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'line capacitance', q: 'capacitance', unit: 'pF', value: 50 }
      },
      note: '2.2 is ln 9: the time between 10 % and 90 % of an exponential charge, in units of RC.',
      stories: { tr: 'A {R} pull-up charges {C} of wiring. What is the 10–90 % rise time?' }
    },
    {
      name: 'Largest I²C pull-up',
      expr: 'Rmax = tr/(0.8473*Cb)', tex: 'R_{\\text{max}} = \\frac{t_r}{0.8473\\,C_b}',
      vars: {
        Rmax: { name: 'largest pull-up that meets the rise time', q: 'resistance', unit: 'kΩ', tex: 'R_{\\text{max}}' },
        tr: { name: 'allowed rise time, 30 % to 70 %', q: 'time', unit: 'ns', value: 1000, tex: 't_r' },
        Cb: { name: 'bus capacitance', q: 'capacitance', unit: 'pF', value: 200, tex: 'C_b' }
      },
      note: '0.8473 = ln(0.7/0.3). The limit is 1000 ns in standard mode (100 kHz) and 300 ns in fast mode (400 kHz).',
      stories: { Rmax: 'An I²C bus has {Cb} of capacitance and must rise within {tr}. What is the largest pull-up you can use?' }
    },
    {
      name: 'Smallest I²C pull-up',
      expr: 'Rmin = (VDD - VOL)/IOL', tex: 'R_{\\text{min}} = \\frac{V_{DD} - V_{OL}}{I_{OL}}',
      vars: {
        Rmin: { name: 'smallest pull-up the drivers can overcome', q: 'resistance', unit: 'Ω', tex: 'R_{\\text{min}}' },
        VDD: { name: 'bus supply', q: 'voltage', unit: 'V', value: 3.3, tex: 'V_{DD}' },
        VOL: { name: 'guaranteed low level', q: 'voltage', unit: 'V', value: 0.4, tex: 'V_{OL}' },
        IOL: { name: 'sink current at that level', q: 'current', unit: 'mA', value: 3, tex: 'I_{OL}' }
      },
      stories: { Rmin: 'I²C devices on a {VDD} bus must pull below {VOL} while sinking {IOL}. What is the smallest allowed pull-up?' }
    }
  ],
  examples: [
    {
      title: 'Pull-ups for a fast-mode I²C bus',
      q: 'A 3.3 V I²C bus with an estimated 150 pF must run at 400 kHz. Choose the pull-ups.',
      steps: [
        'Maximum: $R_{\\text{max}} = 300\\ \\mathrm{ns} / (0.8473 \\times 150\\ \\mathrm{pF}) = 2.36\\ \\mathrm{k\\Omega}$.',
        'Minimum (3 mA rule): $(3.3 - 0.4)/3\\ \\mathrm{mA} = 967\\ \\mathrm{\\Omega}$.',
        'Pick near the middle, erring low for margin: 1.5 kΩ. Rise time $0.8473 \\times 1.5\\ \\mathrm{k\\Omega} \\times 150\\ \\mathrm{pF} = 191\\ \\mathrm{ns}$; low-level current $3.3/1500 = 2.2\\ \\mathrm{mA}$.',
        'Remove the pull-ups fitted on any breakout boards, or account for them in parallel.'
      ],
      a: '1.5 kΩ: 191 ns rise time, 2.2 mA when low.'
    },
    {
      title: 'Keeping a MOSFET off during reset',
      q: 'A logic-level MOSFET switches a 24 V solenoid from an STM32 pin. At power-up the solenoid clicks. Why, and what value of gate resistor fixes it?',
      steps: [
        'During reset and boot the STM32 pins are inputs, so the gate floats; its few nanofarads can charge from leakage or coupling above the threshold.',
        'A pull-down from gate to source holds it at 0 V. It must not load the pin much when driven high: 100 kΩ draws 33 µA at 3.3 V.',
        'The gate charges through the pin, not the resistor, so switching speed is unchanged. 10–100 kΩ is the usual range.'
      ],
      a: 'The gate floats while the MCU boots; a 100 kΩ gate-to-source pull-down keeps it off.'
    }
  ],
  quiz: [
    { q: 'A push-button connects an MCU input to ground when pressed, with a pull-up to 3.3 V. The input reads…', choices: ['1 when released, 0 when pressed', '0 when released, 1 when pressed', '1 always', 'it depends on the resistor value'], a: 0,
      why: 'Released, the pull-up holds the line high; pressed, the switch connects it to ground. The input is active-low.' },
    { q: 'Why can an open-drain output not drive a line high on its own?', choices: ['It is too slow', 'It has only a transistor to ground', 'It works only at 5 V', 'It needs a clock'], a: 1,
      why: 'The output stage has no transistor to the supply: it can pull low or let go. The pull-up resistor provides the high level.' },
    { q: 'What is the 10–90 % rise time of a line pulled up by 4.7 kΩ with 100 pF of capacitance?', answer: 1.03, unit: 'µs',
      why: 't_r = 2.2 × 4.7 kΩ × 100 pF = 1.03 µs.' },
    { q: 'Five I²C modules, each with its own 4.7 kΩ pull-ups, are connected to one 3.3 V bus. Which is true?', choices: ['The pull-ups are too weak', 'The combined 940 Ω is below the 967 Ω allowed by the 3 mA sink limit', 'Nothing changes: only one pull-up is active', 'The bus capacitance falls'], a: 1,
      why: 'Resistors in parallel: 4.7 kΩ / 5 = 940 Ω. Edges get faster, but a driver must now sink 3.1 mA to reach 0.4 V.' },
    { q: 'A power MOSFET driven from a microcontroller pin turns on briefly at power-up. What is the usual fix?', choices: ['A larger gate resistor in series', 'A 10–100 kΩ pull-down from gate to source', 'A pull-up from gate to the supply', 'A capacitor from drain to gate'], a: 1,
      why: 'During reset the pin floats; the pull-down holds the gate at 0 V until the firmware drives it.' }
  ],
  applications: ['Buttons, DIP switches and jumpers read by microcontrollers.', 'I²C and SMBus lines, shared interrupt and reset lines.', 'Keeping MOSFET gates and enable pins in a safe state during power-up.', 'Simple level shifting with open-drain outputs.'],
  sim: [{ id: 'dig-bus', params: { bus: 'i2c' } }]
}

);
