/* HYPER-ELECTRONICS · content/combinational.js — combinational logic: circuits whose
 * outputs depend only on the present inputs — multiplexers, decoders and encoders, adders. */
Hyper.add(

{
  id: 'multiplexers', parent: 'combinational', title: 'Multiplexers and demultiplexers', level: 2,
  short: 'A multiplexer is a selector switch worked by numbers: select lines choose which of several inputs reaches the one output. A demultiplexer sends one input to a chosen output.',
  keywords: ['multiplexer', 'mux', 'demultiplexer', 'demux', 'data selector', 'select lines', '74HC157', '74HC151', '74HC153', 'CD4051', '74HC4051', 'analogue multiplexer', 'look-up table', 'LUT', 'time-division multiplexing', 'settling time'],
  prereq: ['logic-gates', 'boolean-algebra', 'binary-numbers'],
  related: ['decoders-encoders', 'adc', 'cmos-logic', 'microcontrollers'],
  body: `
Think of a rotary switch whose position is set by a binary number. A **multiplexer** (mux) has $N$ data inputs, one output, and $\\log_2 N$ **select** lines: the number on the select lines picks which input is connected through. The smallest is the 2-to-1 mux,

$$Y = A\\,\\overline{S} + B\\,S$$

— with $S = 0$ the output follows A, with $S = 1$ it follows B. A 4-to-1 mux is four AND gates, each enabled by one combination of $S_1 S_0$, feeding an OR:

$$Y = D_0\\overline{S_1}\\,\\overline{S_0} + D_1\\overline{S_1}S_0 + D_2S_1\\overline{S_0} + D_3S_1S_0$$

Standard parts: the **74HC157** (four 2-to-1 muxes sharing one select, for switching a whole 4-bit bus), the **74HC153** (two 4-to-1) and the **74HC151** (one 8-to-1, with both true and inverted outputs). Most have an enable input that forces the output to a fixed level.

### A mux is a programmable function
Tie the data inputs of a $2^n$-to-1 mux to 0s and 1s and put the variables on the select lines: the mux now *is* the truth table, and any function of $n$ variables costs one chip and no design effort. With one variable fed to the data inputs (as 0, 1, $x$ or $\\overline{x}$) a $2^{n-1}$-to-1 mux is enough. This is not a curiosity: the **look-up tables** that make up an FPGA are exactly multiplexers whose data inputs are memory bits.

### Demultiplexers
A **demultiplexer** routes one input to one of $N$ outputs chosen by the select lines, and it is the same circuit as a [[decoders-encoders|decoder]] with the data applied to the enable input. The 74HC138 (1-to-8) and 74HC139 (two 1-to-4) serve both roles.

### Sharing a wire in time
Multiplexing is how a few pins serve many signals. A microcontroller's ADC has an internal analogue mux in front of one converter — 8 channels on an ATmega328P, up to 16 external channels on an STM32F103 — and converts them in turn. Four-digit LED displays light one digit at a time, faster than the eye can follow (above about 100 Hz for the whole display), so 8 segment lines and 4 digit lines replace 32 wires. Keyboard matrices are scanned the same way.

### Analogue multiplexers
The **CD4051** and **74HC4051** are 8-channel *analogue* multiplexers: each channel is a CMOS transmission gate ([[cmos-logic]]) that passes any voltage between its supply rails in either direction. They are not ideal switches:
- **On-resistance** of tens to hundreds of ohms (it varies with the signal voltage and falls with higher supply).
- **Capacitance** on every pin, and a burst of **charge injection** each time a channel switches.
- Signals must stay inside the supply rails (the 4051's separate negative supply allows bipolar signals).

The practical consequence is **settling time**. When the mux changes channel, the capacitance at its output — plus the ADC's sample-and-hold capacitor — still holds the previous channel's voltage and must recharge through the source resistance and the on-resistance. To get within half an LSB of an $n$-bit converter that takes $\\ln 2^{n+1}$ time constants, about 9 for 12 bits. Skimp on it and each channel reads a little of its neighbour. This is why datasheets ask for a low source impedance (10 kΩ or less for the ATmega328P's ADC), and why a buffer amplifier or a capacitor on each input helps.
`,
  ideas: [
    'A multiplexer connects one of N inputs to its output, chosen by log₂N select lines.',
    'A 2ⁿ-to-1 mux with constant data inputs implements any function of n variables — an FPGA look-up table is exactly this.',
    'A demultiplexer is a decoder with the data on its enable input.',
    'Multiplexing in time lets one ADC, one display driver or one bus serve many channels.',
    'Analogue muxes have on-resistance and capacitance: allow time for the output to settle after switching.'
  ],
  pitfalls: [
    'A logic multiplexer passes analogue signals — A 74HC151 regenerates logic levels; only analogue switches such as the 74HC4051 pass in-between voltages, and only within their supply rails.',
    'An analogue multiplexer is an ideal switch — It has tens to hundreds of ohms of on-resistance, some capacitance, and injects charge when it switches.',
    'You can convert the moment you switch channels — The sample capacitor needs several time constants to forget the previous channel.'
  ],
  formulas: [
    {
      name: 'Inputs of a multiplexer with s select lines',
      expr: 'N = 2^s', tex: 'N = 2^{s}',
      vars: {
        N: { name: 'number of data inputs', q: 'count' },
        s: { name: 'number of select lines', q: 'count', value: 3, int: true }
      },
      practice: { unknowns: ['N'] },
      stories: { N: 'A multiplexer has {s} select lines. How many inputs can it choose between?' }
    },
    {
      name: 'Settling time after switching an analogue mux',
      expr: 't = (Rs + Ron)*C*ln(2^(n + 1))', tex: 't_s = (R_s + R_{on})\\,C\\,\\ln 2^{\\,n+1}',
      vars: {
        t: { name: 'time to settle within ½ LSB', q: 'time', unit: 'ns', tex: 't_s' },
        Rs: { name: 'source resistance', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_s' },
        Ron: { name: 'switch on-resistance', q: 'resistance', unit: 'Ω', value: 100, tex: 'R_{on}' },
        C: { name: 'capacitance to charge (mux output + sample capacitor)', q: 'capacitance', unit: 'pF', value: 20 },
        n: { name: 'ADC resolution', q: 'count', value: 12, int: true }
      },
      note: 'A worst case: the previous channel was at the other end of the range. $\\ln 2^{n+1} = (n+1)\\ln 2$ is the number of time constants for the error to fall below half an LSB.',
      practice: { unknowns: ['t', 'Rs'] },
      stories: { t: 'An analogue mux ({Ron} on) switches a source of {Rs} onto {C}. How long before a {n}-bit reading is within half an LSB?' }
    }
  ],
  examples: [
    {
      title: 'Majority logic from one multiplexer',
      q: 'Implement the three-input majority function (1 when at least two of A, B, C are 1) with one 4-to-1 multiplexer (half a 74HC153) and no gates.',
      steps: [
        'Put A and B on the select lines and work out what the output must be in terms of C for each combination.',
        'AB = 00: the output is 0 whatever C is. AB = 01 or 10: one vote so far, so the output is C. AB = 11: the output is 1.',
        'Connect $D_0 = 0$, $D_1 = C$, $D_2 = C$, $D_3 = 1$.'
      ],
      a: 'S₁S₀ = AB, with data inputs 0, C, C, 1.'
    },
    {
      title: 'Scanning eight thermistors',
      q: 'Eight thermistor dividers (Thévenin resistance about 5 kΩ each) are scanned through a CD4051 (on-resistance about 200 Ω at this supply) into a 12-bit ADC with a 10 pF sample capacitor; the mux output adds 20 pF. How long must each channel settle?',
      steps: [
        'Time constant: $(5\\ \\mathrm{k\\Omega} + 0.2\\ \\mathrm{k\\Omega}) \\times 30\\ \\mathrm{pF} = 156\\ \\mathrm{ns}$.',
        'For 12 bits: $\\ln 2^{13} = 13 \\ln 2 = 9.0$ time constants, so $t_s = 9.0 \\times 156\\ \\mathrm{ns} = 1.4\\ \\mathrm{\\mu s}$.',
        'Set the ADC sampling time comfortably above that (an STM32 can stretch its sample time to many microseconds), or add 100 nF on each divider so the source looks stiff.'
      ],
      a: 'About 1.4 µs per channel; allow a few microseconds.'
    }
  ],
  quiz: [
    { q: 'How many select lines does a 16-to-1 multiplexer need?', choices: ['2', '4', '8', '16'], a: 1,
      why: 'Four bits give 2⁴ = 16 combinations, one per input.' },
    { q: 'On a 74HC157 (2-to-1 multiplexers), the select input is 1. Each output follows…', choices: ['its A input', 'its B input', 'the AND of A and B', 'nothing: it is disabled'], a: 1,
      why: 'Y = A·S′ + B·S: with S = 1 the B input is passed. S = 0 selects A.' },
    { q: 'Any Boolean function of three variables can be built from a single 8-to-1 multiplexer and no other gates.', a: true,
      why: 'Put the variables on the select lines and tie each data input to that row\'s output value: the mux reproduces the truth table.' },
    { q: 'An 8-channel analogue mux feeds an ADC. Each channel\'s reading is pulled towards the previous channel\'s value. The most likely cause is…', choices: ['a faulty ADC reference', 'too little time for the sample capacitor to recharge through the source and on-resistance', 'noise from the digital select lines', 'the wrong channel order'], a: 1,
      why: 'The capacitance still holds the last channel\'s voltage. Lengthen the sampling time, lower the source impedance, or buffer the inputs.' },
    { q: 'A demultiplexer is…', choices: ['a multiplexer run backwards with the same wiring', 'a decoder whose enable input carries the data', 'an encoder', 'a shift register'], a: 1,
      why: 'The select lines choose one output, and the data on the enable input appears there; the other outputs stay inactive.' }
  ],
  applications: ['Several analogue sensors sharing one ADC (the MCU\'s internal mux, or a CD4051 for more channels).', 'Multiplexed LED displays and keyboard matrices.', 'Bus switching and data selection in processors.', 'Look-up tables in FPGAs, which are multiplexers fed by memory bits.'],
  sim: [{ id: 'dig-gates', params: { circuit: 'mux' } }]
},

{
  id: 'decoders-encoders', parent: 'combinational', title: 'Decoders and encoders', level: 2,
  short: 'A decoder turns an n-bit code into one active line out of 2ⁿ — for selecting chips and driving displays — and an encoder turns one active line back into its number.',
  keywords: ['decoder', 'encoder', '74HC138', '74HC139', 'one-hot', 'address decoding', 'chip select', 'priority encoder', '74HC148', 'seven-segment', 'BCD', 'CD4511', 'Gray code', 'code converter'],
  prereq: ['logic-gates', 'binary-numbers', 'boolean-algebra'],
  related: ['multiplexers', 'karnaugh-maps', 'state-machines', 'microcontrollers'],
  body: `
A **decoder** reads an $n$-bit number and activates exactly one of its $2^n$ outputs — the one with that number. Every output is one minterm of the inputs: output 5 of a 3-to-8 decoder is $A_2\\overline{A_1}A_0$. The result is a **one-hot** code, one line active at a time, which is exactly what you need to select one thing out of many.

### The 74HC138 and address decoding
The workhorse is the **74HC138**, a 3-to-8 decoder with **active-low** outputs (the selected output goes low, the rest stay high) and three enable inputs, two active-low and one active-high, all of which must be asserted. Active-low outputs match the active-low chip-select inputs ($\\overline{CS}$, $\\overline{CE}$) of memories and peripherals, so a '138 can divide a processor's address space into eight blocks: with a 16-bit address, feeding $A_{15}A_{14}A_{13}$ to the decoder gives eight 8 KB regions, and each output enables one chip. The enables make decoders cascadable — two '138s with the fourth address bit steering their enables form a 4-to-16 decoder — and let a decoder serve as a **demultiplexer** ([[multiplexers]]). The 74HC139 holds two 2-to-4 decoders.

A decoder plus an OR gate implements any function (OR together the minterm outputs of the 1 rows), just as a multiplexer does.

### Display decoders
A **BCD-to-seven-segment** decoder turns a 4-bit digit into the seven segment lines a–g. The CD4511 (and 74HC4511) adds a latch and output drivers strong enough for LED segments, and blanks the display for codes above 9. Designing one yourself is a classic [[karnaugh-maps|Karnaugh map]] exercise, because codes 10–15 are don't cares. In microcontroller designs the "decoder" is usually a 10-byte table in firmware, and a driver chip such as the MAX7219 handles the multiplexing.

### Encoders
An **encoder** does the reverse: $2^n$ input lines, one of them active, in; its $n$-bit number out. A plain encoder is just OR gates, and if two inputs are active at once it outputs nonsense (their codes OR-ed). A **priority encoder** outputs the number of the highest-priority active input and a separate *valid* flag saying whether any input is active at all. The 74HC148 (8 inputs, active-low in and out) and the CD4532 are the parts; the function appears in interrupt controllers (which of several pending requests to serve first), in keypad scanners, and inside a flash ADC, where a row of comparators produces a "thermometer" code that an encoder turns into binary ([[adc]]).

### Code converters and Gray code
More generally, any circuit that translates one code into another is a decoder of sorts. One conversion is worth knowing by heart: binary to **Gray code**, $g = b \\oplus (b \\gg 1)$ — each Gray bit is the XOR of two neighbouring binary bits. In Gray code consecutive numbers differ in one bit only, so an absolute rotary encoder read mid-transition is wrong by at most one step, and a counter value passed between two clock domains cannot be caught half-changed.

### A caution about glitches
A decoder is combinational: while its inputs change, its outputs follow every intermediate combination. If the inputs come from a ripple counter, or arrive a few nanoseconds apart, an output that should stay inactive can pulse briefly. That is harmless for a display and dangerous for a chip-select or a clock. The usual cure is to gate the decoder's enable with a strobe that is asserted only after the inputs have settled.
`,
  ideas: [
    'A decoder activates one of 2ⁿ outputs — each output is one minterm of the inputs.',
    'Active-low outputs and enables make the 74HC138 a natural chip-select generator and a demultiplexer.',
    'An encoder turns a one-hot input into a binary number; a priority encoder picks the highest active input.',
    'Gray code changes one bit per step: g = b ⊕ (b >> 1).',
    'Decoder outputs can glitch while the inputs change; strobe the enable if that matters.'
  ],
  pitfalls: [
    'Decoder outputs are active-high — Many (74HC138, 74HC139, 74HC148) are active-low to match chip-select inputs; follow the bubbles.',
    'A plain encoder copes with two active inputs — It ORs their codes into a wrong number; only a priority encoder picks one.',
    'A decoder fed by a counter gives clean outputs — During each count change the outputs may spike, especially behind a ripple counter.'
  ],
  formulas: [
    {
      name: 'Outputs of an n-input decoder',
      expr: 'M = 2^n', tex: 'M = 2^{n}',
      vars: {
        M: { name: 'number of outputs', q: 'count' },
        n: { name: 'number of address inputs', q: 'count', value: 3, int: true }
      },
      practice: { unknowns: ['M'] },
      stories: { M: 'How many outputs does a decoder with {n} address inputs have?' }
    },
    {
      name: 'Block size in address decoding',
      expr: 'B = 2^(A - k)', tex: 'B = 2^{A - k}',
      vars: {
        B: { name: 'bytes in each decoded block', q: 'count' },
        A: { name: 'address bits of the processor', q: 'count', value: 16, int: true },
        k: { name: 'top address bits fed to the decoder', q: 'count', value: 3, int: true }
      },
      note: 'The decoder splits the $2^A$-byte space into $2^k$ equal blocks; the remaining $A - k$ bits address bytes within a block.',
      practice: { unknowns: ['B'] },
      stories: { B: 'A processor has {A} address bits; its top {k} bits drive a decoder. How big is each block?' }
    }
  ],
  examples: [
    {
      title: 'Chip selects from a 74HC138',
      q: 'A small 8-bit processor has a 16-bit address bus. A 74HC138 decodes $A_{15}A_{14}A_{13}$. Which addresses select the chip on output $\\overline{Y_5}$, and how big is each region?',
      steps: [
        'Each region is $2^{16-3} = 8192$ bytes = 8 KB = 0x2000.',
        '$\\overline{Y_5}$ goes low when $A_{15}A_{14}A_{13} = 101$.',
        'That is the range 101 0 0000 0000 0000 to 101 1 1111 1111 1111: 0xA000 to 0xBFFF.'
      ],
      a: '0xA000–0xBFFF, one of eight 8 KB regions.'
    },
    {
      title: 'A priority encoder for interrupts',
      q: 'Interrupt requests 3 and 5 are active at the same time on a 74HC148 (inputs and outputs active-low, input 7 highest priority). What appears on its outputs A2 A1 A0?',
      steps: [
        'The highest-numbered active input wins: 5 = 101.',
        'The outputs are active-low, so they carry the inverse: 010.',
        'The group-select output $\\overline{GS}$ is low too, flagging that some request is active.'
      ],
      a: 'A2 A1 A0 = 010, the inverted code of 5.'
    },
    {
      title: 'Binary to Gray code',
      q: 'Convert 6 (0110) and 7 (0111) to Gray code and check that they differ in one bit.',
      steps: [
        '$g = b \\oplus (b \\gg 1)$: for 6, $0110 \\oplus 0011 = 0101$.',
        'For 7, $0111 \\oplus 0011 = 0100$.',
        '0101 and 0100 differ only in the last bit — while in binary 0110 → 0111 also differs in one bit, 7 → 8 (0111 → 1000) changes all four, whereas the Gray codes 0100 → 1100 change one.'
      ],
      a: '6 → 0101, 7 → 0100.'
    }
  ],
  quiz: [
    { q: 'The inputs of an active-high 3-to-8 decoder are 101. Which output is active?', choices: ['Output 1', 'Output 3', 'Output 5', 'Outputs 0 and 2'], a: 2,
      why: '101 is 5 in binary; exactly that output is active.' },
    { q: 'How many 74HC138 (3-to-8) decoders make a 4-to-16 decoder, using their enable inputs and nothing else?', choices: ['1', '2', '4', '16'], a: 1,
      why: 'Feed the fourth bit to an active-low enable of one chip and an active-high enable of the other: one chip serves 0–7, the other 8–15.' },
    { q: 'A priority encoder has inputs 2 and 6 active. Its output code is…', choices: ['2', '6', '4', '8'], a: 1,
      why: 'It reports the highest-priority (here highest-numbered) active input. A plain encoder would output 2 OR 6 = 6 by luck here, but 3 and 4 would give 7.' },
    { q: 'A decoder followed by an OR gate can implement any Boolean function of the decoder\'s inputs.', a: true,
      why: 'Each decoder output is one minterm; OR-ing those of the 1 rows gives the canonical sum of products.' },
    { q: 'Why do absolute rotary encoders use Gray code?', choices: ['It needs fewer bits', 'Only one bit changes between neighbouring positions, so a reading taken mid-change is off by at most one step', 'It is easier to decode to decimal', 'It is immune to electrical noise'], a: 1,
      why: 'In binary several tracks change together (0111 → 1000) and can be read in any mixture; in Gray code only one can be caught changing.' }
  ],
  applications: ['Chip-select generation in memory-mapped systems.', 'Seven-segment and LED-matrix display drivers.', 'Interrupt priority and keypad encoding.', 'Absolute rotary encoders and clock-domain-crossing counters in Gray code.'],
  sim: [{ id: 'dig-gates', params: { circuit: 'decoder' } }]
},

{
  id: 'binary-adders', parent: 'combinational', title: 'Binary adders', level: 2,
  short: 'How gates add numbers: half and full adders, ripple-carry chains and fast carry-lookahead, and subtraction with the same hardware using two\'s complement.',
  keywords: ['half adder', 'full adder', 'ripple carry', 'carry lookahead', 'generate', 'propagate', '74HC283', 'subtraction', 'two\'s complement', 'overflow flag', 'carry flag', 'ALU', 'critical path', 'status register'],
  prereq: ['logic-gates', 'binary-numbers', 'boolean-algebra'],
  related: ['timing-clocks', 'microcontrollers', 'counters'],
  body: `
Binary addition works like the column addition learnt at school, only simpler: in each column add two bits and the carry from the column to the right, write down the sum bit, carry the rest. Hardware does exactly that, one small circuit per column.

### Half and full adders
Adding two bits gives a sum and a carry: $0 + 0 = 00$, $0 + 1 = 01$, $1 + 1 = 10$. So

$$S = A \\oplus B, \\qquad C = A \\cdot B$$

— an XOR and an AND, the **half adder**. A column in the middle of a number also receives a carry in, so it needs a **full adder**:

$$S = A \\oplus B \\oplus C_{in}, \\qquad C_{out} = AB + C_{in}(A \\oplus B)$$

The sum is 1 when an odd number of the three inputs are 1; the carry is 1 when at least two are (the majority function). Built as two half adders and an OR gate, it is five gates — the adder in the sim below.

### Ripple carry
Chain $n$ full adders, each carry-out feeding the next carry-in, and you can add $n$-bit numbers. This **ripple-carry adder** is simple but slow: in the worst case — adding 1 to 0111…1 — the carry has to travel through every stage, about two gate delays each. A 4-bit adder settles in about 8 gate delays; a 32-bit one would need about 64, over 500 ns with 74HC-speed gates. The carry chain is the **critical path**, and it sets how fast a processor can be clocked ([[timing-clocks]]). Watch the sim: the sum passes through wrong values before the carries arrive.

### Carry lookahead
The fix is to compute the carries directly instead of waiting. For each bit define **generate** $G_i = A_i B_i$ (this bit makes a carry by itself) and **propagate** $P_i = A_i \\oplus B_i$ (this bit passes an incoming carry on). Then $C_{i+1} = G_i + P_i C_i$, and expanding,

$$C_2 = G_1 + P_1 G_0 + P_1 P_0 C_0$$

— every carry is a two-level function of the inputs, available after a fixed few gate delays whatever the width (at the price of wider gates). The **74HC283** is a 4-bit adder with internal lookahead; processors use tree-shaped *prefix* adders whose delay grows only with $\\log_2 n$, and FPGAs contain dedicated fast carry chains.

### Subtraction for free
In [[binary-numbers|two's complement]], $-B = \\overline{B} + 1$. So $A - B = A + \\overline{B} + 1$: pass each bit of B through an XOR controlled by a SUB signal (the XOR inverts when SUB = 1) and feed SUB into the carry-in. One adder does both operations — this is the heart of every ALU.

### The flags
The same carries tell the processor what happened, stored as flags in its status register (C, Z, N, V on an ARM Cortex-M; the AVR's SREG has them too):
- **C**, carry out of the top bit: unsigned overflow on addition (and, inverted, a borrow on subtraction).
- **V**, signed overflow: $V = C_n \\oplus C_{n-1}$ — the carry into the sign bit differs from the carry out of it. 0111 + 0001 = 1000 sets V but not C.
- **N** is the sign bit of the result, **Z** is set when the result is zero.

This is also why an 8-bit AVR adds 16-bit numbers in two instructions, ADD for the low bytes and ADC ("add with carry") for the high bytes: the carry flag links them, just as a carry wire links two 74HC283s.
`,
  ideas: [
    'A half adder is S = A ⊕ B, C = AB; a full adder adds a carry in: S = A ⊕ B ⊕ Cin, Cout = majority.',
    'A ripple-carry adder is n full adders in a chain; its carry path takes about 2 gate delays per bit.',
    'Carry lookahead computes every carry from generate and propagate terms in a fixed depth.',
    'Subtraction is addition of the inverted operand with carry-in 1.',
    'Carry out flags unsigned overflow; V = Cₙ ⊕ Cₙ₋₁ flags signed overflow.'
  ],
  pitfalls: [
    'The carry flag signals signed overflow — Carry is unsigned overflow; signed overflow is V. 0111 + 0001 overflows as signed numbers without any carry out.',
    'A ripple adder costs one gate delay per bit — Each stage adds about two gate delays to the carry, so an n-bit adder takes about 2n.',
    'Subtraction needs a separate subtractor circuit — Invert B and set the carry-in to 1: the adder subtracts.'
  ],
  formulas: [
    {
      name: 'Worst-case delay of a ripple-carry adder',
      expr: 'T = n*tc + ts', tex: 'T = n\\,t_c + t_s',
      vars: {
        T: { name: 'time for the result to settle', q: 'time', unit: 'ns' },
        n: { name: 'number of bits', q: 'count', value: 16, int: true },
        tc: { name: 'carry delay per stage', q: 'time', unit: 'ns', value: 16, tex: 't_c' },
        ts: { name: 'delay from the last carry to the sum', q: 'time', unit: 'ns', value: 8, tex: 't_s' }
      },
      note: 'With about 8 ns per 74HC-class gate, a stage costs two gate delays of carry. The result must settle before the next clock edge.',
      practice: { unknowns: ['T', 'n'] },
      stories: { T: 'A {n}-bit ripple-carry adder has {tc} of carry delay per stage and {ts} from the last carry to the sum. How long does it take in the worst case?' }
    },
    {
      name: 'Largest sum of two n-bit numbers',
      expr: 'Smax = 2^(n + 1) - 2', tex: 'S_{\\text{max}} = 2^{n+1} - 2',
      vars: {
        Smax: { name: 'largest possible sum', q: 'count', tex: 'S_{\\text{max}}' },
        n: { name: 'bits in each operand', q: 'count', value: 8, int: true }
      },
      note: 'It needs $n + 1$ bits: the carry out is the extra bit. Two bytes add up to at most 510.',
      practice: { unknowns: ['Smax'] }
    }
  ],
  derivation: {
    title: 'The full adder from its truth table',
    steps: [
      { text: 'The sum is 1 for rows with one or three 1s among A, B, Cin — odd parity:', tex: 'S = A \\oplus B \\oplus C_{in}' },
      { text: 'The carry is 1 when at least two inputs are 1, the majority function:', tex: 'C_{out} = AB + AC_{in} + BC_{in} = AB + C_{in}(A + B)' },
      { text: 'When A and B are both 1 the term $AB$ already gives the carry, so $A + B$ may be replaced by $A \\oplus B$, which the sum circuit computes anyway:', tex: 'C_{out} = AB + C_{in}(A \\oplus B)' },
      { text: 'So a full adder is two half adders — one for $A \\oplus B$ and $AB$, one adding $C_{in}$ — and an OR of their carries.' }
    ]
  },
  examples: [
    {
      title: 'A 4-bit addition, column by column',
      q: 'Add 0111 + 0110 (7 + 6) in a 4-bit adder. What are the result, the carry and the overflow flag?',
      steps: [
        'Bit 0: 1 + 0 = 1, carry 0. Bit 1: 1 + 1 = 10, write 0, carry 1.',
        'Bit 2: 1 + 1 + 1 = 11, write 1, carry 1 (this is $C_3$). Bit 3: 0 + 0 + 1 = 1, carry out $C_4 = 0$.',
        'Result 1101 = 13, correct as an unsigned number (C = 0).',
        'As signed numbers 7 + 6 = 13 does not fit in −8…7: $V = C_4 \\oplus C_3 = 0 \\oplus 1 = 1$, and 1101 would be read as −3.'
      ],
      a: '1101: 13 unsigned (C = 0), signed overflow (V = 1).'
    },
    {
      title: 'Subtracting with the adder',
      q: 'Compute 5 − 7 in 4 bits with the add/subtract circuit.',
      steps: [
        'SUB = 1: B = 0111 is inverted to 1000 and the carry-in is 1.',
        '0101 + 1000 + 1 = 1110.',
        '1110 in two\'s complement is −8 + 4 + 2 = −2. Correct.',
        'The carry out is 0: for unsigned numbers that means a borrow occurred (5 < 7).'
      ],
      a: '1110 = −2, with carry out 0 (borrow).'
    }
  ],
  quiz: [
    { q: 'A half adder\'s carry output is…', choices: ['A ⊕ B', 'A · B', 'A + B', '(A · B)′'], a: 1,
      why: 'Only 1 + 1 produces a carry, so the carry is the AND of the inputs; the sum bit is their XOR.' },
    { q: 'The sum output of a full adder is 1 when…', choices: ['all three inputs are 1', 'at least two inputs are 1', 'an odd number of its three inputs are 1', 'the carry in is 1'], a: 2,
      why: 'S = A ⊕ B ⊕ Cin is odd parity. "At least two" is the carry out.' },
    { q: 'A 16-bit ripple-carry adder takes about 2 gate delays of carry per bit. Its worst case is roughly…', choices: ['2 gate delays', '16 gate delays', '32 gate delays', '256 gate delays'], a: 2,
      why: 'The carry may have to ripple through all 16 stages, 2 delays each. Lookahead brings this down to a handful.' },
    { q: 'The same adder circuit can subtract B from A if B is inverted and the carry-in is set to 1.', a: true,
      why: 'A − B = A + (B′ + 1) in two\'s complement: B′ comes from XOR gates, the +1 from the carry-in.' },
    { q: 'In a 4-bit adder, 0101 + 0100 = 1001. The signed overflow flag V is…', choices: ['0, because there is no carry out', '1, because 5 + 4 = 9 does not fit in −8…7', '1, because the carry out is 1', '0, because both operands are positive'], a: 1,
      why: 'The carry into bit 3 is 1 but the carry out is 0, so V = 1. Two positive numbers gave a "negative" result.' }
  ],
  applications: ['The arithmetic logic unit of every processor and microcontroller.', 'Address calculation, loop counters and pointer arithmetic.', 'Accumulators in digital filters and DSP.', 'Checksums, and the incrementers inside counters.'],
  history: 'George Stibitz built a binary adder from telephone relays on his kitchen table in 1937 — the "Model K". The carry-lookahead idea dates from the first electronic computers of the 1950s.',
  sim: 'dig-adder'
}

);
