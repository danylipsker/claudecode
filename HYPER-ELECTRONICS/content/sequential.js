/* HYPER-ELECTRONICS · content/sequential.js — sequential logic: memory and time —
 * latches, flip-flops, counters, shift registers, state machines, and clock timing. */
Hyper.add(

{
  id: 'latches', parent: 'sequential', title: 'Latches', level: 1,
  short: 'The simplest memory: two gates feeding each other hold a bit. The SR latch is set and reset by pulses; the D latch copies its input while enabled and holds it when the enable closes.',
  keywords: ['latch', 'SR latch', 'set-reset', 'bistable', 'cross-coupled', 'D latch', 'transparent latch', 'enable', '74HC573', '74HC279', 'debouncing', 'forbidden state', 'SRAM cell'],
  prereq: ['logic-gates', 'boolean-algebra'],
  related: ['flip-flops', 'switches', 'timing-clocks'],
  body: `
Everything so far has been **combinational**: the outputs depend only on the inputs present now. To remember anything a circuit needs **feedback**. Connect two inverters in a ring and the pair has two stable states — the first output high and the second low, or the reverse — and it stays in whichever it is put in for as long as power lasts. That *bistable* is one bit of memory; six transistors of it, with two more to reach it, are one bit of the SRAM inside every microcontroller.

### The SR latch
To write into the ring, replace the inverters by NOR gates and use their spare inputs. In the **SR latch**, $Q = \\overline{R + \\overline{Q}}$ and $\\overline{Q} = \\overline{S + Q}$:

| S | R | Q next | |
|---|---|---|---|
| 0 | 0 | Q | hold |
| 1 | 0 | 1 | set |
| 0 | 1 | 0 | reset |
| 1 | 1 | 0 (and $\\overline{Q} = 0$) | forbidden |

A pulse on S sets the output and it stays set after S returns to 0; a pulse on R clears it. S = R = 1 is **forbidden**: both outputs go to 0, no longer complementary, and if S and R then return to 0 together both gates start to switch at once and the latch settles in either state — or hesitates in between — depending on nanoseconds of mismatch. The simulation lets you try it.

Built from NAND gates the latch has **active-low** inputs $\\overline{S}$ and $\\overline{R}$ (the 74HC279 contains four); its forbidden combination is both inputs low.

### Debouncing with a latch
A mechanical contact bounces for a millisecond or so, and a counter would see every bounce ([[switches]]). With a **changeover** (SPDT) switch driving the $\\overline{S}$ and $\\overline{R}$ inputs of a NAND latch, the first touch of the new contact sets or resets the latch, and the bounces that follow only repeat the same command, while the other input is inactive. The output changes once, cleanly — the classic hardware debouncer.

### The D latch
Add an **enable** so that S and R are only heard while EN = 1, and drive them from one data input D and its inverse. The result is the **D latch**:
- EN = 1: the latch is **transparent** — Q follows D.
- EN = 0: Q holds the value D had at the moment EN fell.

The forbidden state has gone. Eight D latches with a shared enable make an octal latch such as the **74HC573**, the classic partner of processors that put the low address byte and the data on the same pins: while ALE (address latch enable) is high the latch passes the address; when ALE falls it holds it, and the pins are free for data.

### Why transparency is a problem
A latch is **level-sensitive**. Put one in a loop — say a counter whose next value is computed from its present output — and while the enable is high the new output races back through the logic and changes the input again, several times within one enable pulse. The count becomes unpredictable. The cure is to make sure the output can change only at an instant, not during an interval: the edge-triggered [[flip-flops|flip-flop]], built from two latches that are never open at the same time.

Like any storage element, a latch also needs its data to be stable for a short time around the moment the enable closes; violate that and it can be left *metastable* ([[timing-clocks]]).
`,
  ideas: [
    'Feedback makes memory: two cross-coupled gates have two stable states.',
    'The SR latch sets with S, resets with R and holds with both at 0; S = R = 1 is forbidden.',
    'A NAND latch driven by a changeover switch removes contact bounce.',
    'A D latch is transparent while enabled and holds when the enable closes.',
    'Latches are level-sensitive, so they misbehave in loops; flip-flops fix that.'
  ],
  pitfalls: [
    'A latch and a flip-flop are the same thing — A latch is transparent for as long as it is enabled; a flip-flop samples only at a clock edge.',
    'Only the NOR latch has a forbidden input — The NAND latch forbids S′ = R′ = 0, which drives both outputs high.',
    'A D latch cannot suffer timing problems — Data changing just as the enable closes can leave it metastable.'
  ],
  examples: [
    {
      title: 'A bounce-free start button',
      q: 'A changeover push-button connects $\\overline{S}$ to ground when pressed and $\\overline{R}$ to ground when released (each input has a 10 kΩ pull-up). The contacts bounce for 2 ms. What does the NAND latch output do?',
      steps: [
        'Released: $\\overline{R} = 0$, so Q = 0.',
        'On pressing, the moving contact leaves R (both inputs now high: hold, Q stays 0) and first touches S: $\\overline{S} = 0$ sets Q = 1.',
        'It bounces off S (both high again: hold, Q stays 1) and back on S (set again, already 1). No bounce ever reaches R, so Q never returns to 0.',
        'The output makes one clean transition, within nanoseconds of the first touch.'
      ],
      a: 'One clean change per press, however the contacts bounce.'
    },
    {
      title: 'Latching an address',
      q: 'A processor puts an address on its data pins, raises ALE for 50 ns, then lowers ALE and uses the pins for data. What does a 74HC573 wired to those pins, with ALE on its enable, deliver to the memory?',
      steps: [
        'While ALE is high the latch is transparent: its outputs follow the address on the pins.',
        'When ALE falls the latch holds that address. The data that follows on the same pins does not get through.',
        'The address must be stable for the latch\'s set-up time before ALE falls and its hold time after (a few nanoseconds each).'
      ],
      a: 'A stable address for the whole data phase, from pins shared with the data.'
    }
  ],
  quiz: [
    { q: 'In a NOR SR latch, S = 0 and R = 0. The output Q…', choices: ['goes to 0', 'goes to 1', 'keeps its previous value', 'oscillates'], a: 2,
      why: 'With both inputs inactive each NOR simply inverts the other\'s output, and the loop holds whichever state it was in.' },
    { q: 'Why is S = R = 1 avoided in a NOR SR latch?', choices: ['It damages the gates', 'Both outputs go to 0, and releasing S and R together leaves the final state to chance', 'It sets the latch twice', 'It resets the latch too slowly'], a: 1,
      why: 'Q and Q′ stop being complementary, and on a simultaneous release both gates race to switch; the winner depends on tiny mismatches.' },
    { q: 'A D latch is transparent: while its enable is active, the output follows D.', a: true,
      why: 'That is what distinguishes it from an edge-triggered flip-flop, which ignores D except at the clock edge.' },
    { q: 'A changeover switch drives the S′ and R′ inputs of a NAND latch. Contact bounce…', choices: ['appears at the output as several pulses', 'is removed: the output changes once', 'makes the latch oscillate', 'is only removed if a capacitor is added'], a: 1,
      why: 'During a bounce the moving contact touches nothing, both inputs are inactive and the latch holds; bounces on the same contact repeat the same command.' },
    { q: 'Why is a transparent latch unsuitable as the register of a counter that computes its next value from its present output?', choices: ['Latches are too slow', 'While enabled, the new output feeds back and changes the input again, so the count races through several values', 'Latches cannot store more than one bit', 'Counters need JK inputs'], a: 1,
      why: 'Transparency plus feedback means the loop keeps going for as long as the enable is open. An edge-triggered flip-flop updates exactly once per clock.' }
  ],
  applications: ['Debouncing changeover switches (74HC279).', 'Holding a multiplexed address (74HC573 with ALE).', 'SRAM cells: every bit of a microcontroller\'s RAM is a latch.', 'Alarm and fault flags that must stay set until acknowledged.'],
  sim: [{ id: 'dig-flipflops', params: { mode: 'sr' } }, { id: 'dig-flipflops', params: { mode: 'dlatch' }, title: 'The D latch: transparent while enabled' }]
},

{
  id: 'flip-flops', parent: 'sequential', title: 'Flip-flops', level: 2,
  short: 'Edge-triggered memory: a flip-flop samples its input only at the rising (or falling) edge of the clock and holds it until the next — the building block of every register, counter and processor.',
  keywords: ['flip-flop', 'D flip-flop', 'edge-triggered', 'master-slave', 'JK flip-flop', 'T flip-flop', 'toggle', '74HC74', '74HC574', 'register', 'clock-to-Q', 'setup time', 'hold time', 'asynchronous preset', 'clear', 'divide by two'],
  prereq: ['latches', 'logic-gates'],
  related: ['counters', 'shift-registers', 'state-machines', 'timing-clocks'],
  body: `
A **flip-flop** stores one bit and changes it only at an instant: the **edge** of a clock. For the everyday **D flip-flop**, at each rising edge of CLK the value on D is copied to Q, and at all other times Q holds, whatever D does. The output changes a short **clock-to-Q** delay after the edge. That single property — the new state cannot leak back to the input within the same clock cycle — is what makes synchronous digital design possible.

### How it is built: master and slave
Put two [[latches|D latches]] in series with opposite enables. The **master** is transparent while CLK = 0, the **slave** while CLK = 1.
- CLK low: the master follows D; the slave is closed and holds the old Q.
- CLK rises: the master closes, holding the value D had just before the edge; the slave opens and passes that value to Q.
- CLK high: D can change freely — the master is closed.

At no moment is there a transparent path from D to Q. The simulation shows the master stage following D while the clock is low; watch Q change only at rising edges. On schematics the clock input carries a small **triangle**; a bubble in front of it means the flip-flop acts on the falling edge.

### The family
| Type | Next state $Q^+$ | Use |
|---|---|---|
| D | $D$ | registers, pipelines — the universal type |
| T (toggle) | $T \\oplus Q$ | counters, frequency division |
| JK | $J\\overline{Q} + \\overline{K}Q$ | older counters; J = K = 1 toggles |

The JK was popular when gates were expensive, because one part could hold, set, reset or toggle. Today almost everything — FPGAs, microcontrollers, ASICs — uses D flip-flops plus logic: a T flip-flop is a D flip-flop with an XOR in front ($D = T \\oplus Q$).

A D flip-flop with $\\overline{Q}$ wired back to D toggles on every edge: it **divides the clock by two**, and its output has an exact 50 % duty cycle whatever the input's. Chains of them are ripple [[counters]].

### Real parts
The **74HC74** holds two D flip-flops, each with **asynchronous** set and reset inputs ($\\overline{S_D}$, $\\overline{R_D}$) that act at once, overriding the clock — used for power-on reset and for forcing a known state, never for normal logic, because a glitch on them corrupts the state instantly. Eight flip-flops sharing a clock make a **register** such as the 74HC574 (with tri-state outputs) or the 74HC273 (with a clear).

### Timing
Three numbers from the datasheet govern every flip-flop:
- **Set-up time** $t_{su}$ — how long before the edge D must be stable;
- **Hold time** $t_h$ — how long after the edge it must stay stable;
- **Clock-to-Q delay** $t_{cq}$ — how long after the edge Q changes.

For a 74HC74 at 4.5 V the worst-case figures are roughly 15 ns set-up, 3 ns hold and 20–45 ns clock-to-Q. If D changes inside the set-up/hold window the flip-flop may capture either value — or go **metastable**, hovering between 0 and 1 for an unpredictable time. Designing around these limits is the subject of [[timing-clocks]]; the fastest a lone toggle flip-flop can run is $1/(t_{cq} + t_{su})$.
`,
  ideas: [
    'A flip-flop copies D to Q only at the active clock edge and holds otherwise.',
    'Master–slave: two latches with opposite enables, never both open, so there is no transparent path.',
    'D is the universal type; T toggles; JK can hold, set, reset or toggle.',
    'Q̄ fed back to D divides the clock by two with a 50 % duty cycle.',
    'Set-up, hold and clock-to-Q times bound how fast and how safely flip-flops can be used.'
  ],
  pitfalls: [
    'The output changes exactly at the clock edge — It changes a clock-to-Q delay later; that delay is what lets one flip-flop feed the next safely.',
    'Asynchronous set and clear are just extra data inputs — They act immediately, ignoring the clock; a glitch on them corrupts the state.',
    'Counters need JK flip-flops — Any sequential function can be built from D flip-flops plus logic, as FPGAs and processors do.'
  ],
  formulas: [
    {
      name: 'Fastest toggle rate of a flip-flop',
      expr: 'fmax = 1/(tcq + tsu)', tex: 'f_{\\text{max}} = \\frac{1}{t_{cq} + t_{su}}',
      vars: {
        fmax: { name: 'maximum clock frequency', q: 'frequency', unit: 'MHz', tex: 'f_{\\text{max}}' },
        tcq: { name: 'clock-to-Q delay', q: 'time', unit: 'ns', value: 20, tex: 't_{cq}' },
        tsu: { name: 'set-up time', q: 'time', unit: 'ns', value: 15, tex: 't_{su}' }
      },
      note: 'For a D flip-flop whose Q̄ drives its own D: the new value must travel out and back in before the next edge. Any logic in the loop adds its delay.',
      stories: { fmax: 'A flip-flop has a clock-to-Q delay of {tcq} and needs {tsu} of set-up. How fast can it toggle?' }
    }
  ],
  examples: [
    {
      title: 'A clean half-frequency clock',
      q: 'A 16 MHz oscillator has a duty cycle anywhere between 40 % and 60 %. A peripheral needs 8 MHz with an exact 50 % duty cycle. How do you make it with a 74HC74, and is the part fast enough?',
      steps: [
        'Connect $\\overline{Q}$ to D and the oscillator to CLK; hold $\\overline{S_D}$ and $\\overline{R_D}$ high.',
        'Each rising edge flips Q, so Q completes one cycle every two input cycles: 8 MHz. Because both edges of Q are set by rising edges of the input, one full input period apart, the duty cycle is exactly 50 %.',
        'Loop timing: $1/(20 + 15)\\ \\mathrm{ns} = 28.6\\ \\mathrm{MHz} > 16\\ \\mathrm{MHz}$, so it works with margin.'
      ],
      a: 'Q̄ to D gives 8 MHz at exactly 50 % duty; the 74HC74 is fast enough.'
    },
    {
      title: 'A set-up violation',
      q: 'Data from one flip-flop reaches the D input of the next 12 ns before the clock edge, and the receiving flip-flop needs 15 ns of set-up. What happens, and what are the fixes?',
      steps: [
        'The data changes 3 ns inside the set-up window: the flip-flop may capture the old value, the new one, or go metastable.',
        'Fix 1: slow the clock, so the data arrives earlier relative to the next edge.',
        'Fix 2: shorten the path — fewer gates between the flip-flops, or a faster logic family.'
      ],
      a: '3 ns of set-up violation: the capture is unreliable; slow the clock or shorten the path.'
    }
  ],
  quiz: [
    { q: 'A rising-edge D flip-flop captured D = 1. While the clock is still high, D changes to 0. Q…', choices: ['follows D to 0 at once', 'stays 1 until the next rising edge', 'goes to 0 when the clock falls', 'becomes undefined'], a: 1,
      why: 'Between edges the master is closed, so D is ignored. Q will take whatever D is at the next rising edge.' },
    { q: 'A D flip-flop has Q̄ connected back to D. Its Q output is…', choices: ['stuck at 0', 'a copy of the clock', 'a square wave at half the clock frequency', 'a square wave at twice the clock frequency'], a: 2,
      why: 'Each edge loads the inverse of the present state, so Q toggles once per clock cycle: one output cycle per two input cycles.' },
    { q: 'On a JK flip-flop with J = K = 1, each active clock edge…', choices: ['sets Q', 'resets Q', 'toggles Q', 'leaves Q unchanged'], a: 2,
      why: 'Q⁺ = JQ′ + K′Q = Q′ when J = K = 1.' },
    { q: 'The asynchronous clear input of a 74HC74 waits for the next clock edge before clearing Q.', a: false,
      why: 'Asynchronous means independent of the clock: Q clears as soon as the clear input is asserted.' },
    { q: 'Set-up time is…', choices: ['the time D must be stable before the clock edge', 'the time D must stay stable after the edge', 'the delay from the clock edge to Q', 'the minimum clock period'], a: 0,
      why: 'Set-up comes before the edge, hold after it; clock-to-Q is the output delay.' }
  ],
  applications: ['Registers inside every processor and peripheral.', 'Frequency division by two with an exact 50 % duty cycle.', 'Synchronising and pipelining signals in FPGAs.', 'Power-on reset and fault latches using asynchronous set and clear.'],
  sim: [{ id: 'dig-flipflops', params: { mode: 'dff' } }, { id: 'dig-flipflops', params: { mode: 'jk' }, title: 'The JK flip-flop' }]
},

{
  id: 'counters', parent: 'sequential', title: 'Counters', level: 2,
  short: 'Flip-flops that step through a sequence on every clock: ripple counters that divide frequencies, synchronous counters whose bits change together, modulo-N and decade counters, and the timers inside microcontrollers.',
  keywords: ['counter', 'ripple counter', 'asynchronous counter', 'synchronous counter', 'frequency divider', 'modulo-N', 'decade counter', 'BCD counter', 'Johnson counter', 'CD4017', 'CD4040', 'CD4060', '74HC161', '74HC163', '74HC393', '32.768 kHz', 'prescaler'],
  prereq: ['flip-flops', 'binary-numbers'],
  related: ['shift-registers', 'state-machines', 'timing-clocks', 'microcontrollers', 'crystal-oscillators'],
  body: `
A **counter** is a register that moves to the next value of a fixed sequence at every clock edge. A binary counter counts 0, 1, 2 … $2^n - 1$ and wraps to 0. Look at the bits of a count: bit 0 toggles every step, bit 1 every second step, bit 2 every fourth — each bit is the one before divided by two. That observation gives two ways to build one.

### Ripple counters
Chain toggle flip-flops so that each is clocked by the previous stage's output, changing when that output falls from 1 to 0. Each stage halves the frequency, so the last of $n$ stages runs at $f_{in}/2^n$. This **ripple** (asynchronous) counter is the simplest possible — the 74HC393 holds two 4-bit ones, the CD4040 has 12 stages, the CD4060 has 14 plus an oscillator — and ideal as a **frequency divider**.

The price is that the bits do **not** change together. After a clock edge the change ripples down the chain, one stage delay at a time. Going from 7 to 8 (0111 → 1000) the outputs pass through 0110, 0100 and 0000 on the way. Anything that decodes the outputs sees those false values as short spikes — a decoder watching for 0 fires briefly between 7 and 8. The simulation's *ripple* option exaggerates the delays so you can watch this.

### Synchronous counters
Clock every flip-flop from the same clock and let logic decide which bits toggle: bit $i$ toggles when all lower bits are 1, $T_i = Q_0 Q_1 \\cdots Q_{i-1}$. All bits change together, one clock-to-Q delay after the edge, and the outputs can be decoded safely once they settle. The 74HC161 and 74HC163 are 4-bit synchronous binary counters with parallel load and count enables; the 74HC160/162 count in decimal; the 74HC191 and 74HC193 count up or down. A **terminal-count** output lets several be chained into wider counters.

### Counting modulo N
Many jobs need a count other than a power of two: 10 for a decimal digit, 6 for the tens of minutes, 60 for seconds. With a synchronous clear or load (74HC163), detect the last state, $N - 1$, and clear on the next edge — clean and reliable. The tempting shortcut with an asynchronous reset — detect N and reset at once — produces a brief false state N and a reset pulse that may be too short to clear every stage reliably. Set the modulus to 10 in the sim with the ripple option on and look for the spike of 10.

### Other sequences
A **Johnson counter** is a shift register with its inverted output fed back: $n$ flip-flops give $2n$ states, each decoded by a single 2-input gate. The **CD4017** is a five-stage Johnson counter with ten decoded outputs, one high at a time — the heart of countless LED chasers and sequencers.

### Where counters live now
Every microcontroller timer is a counter: a 16-bit counter (for example) fed through a **prescaler** (a divider by 1, 8, 64…), with compare registers that toggle pins for PWM and capture registers that timestamp input edges ([[microcontrollers]]). And every quartz watch is a 15-stage divider: its 32.768 kHz crystal is chosen because $32\\,768 = 2^{15}$, so fifteen halvings give exactly one pulse per second.
`,
  ideas: [
    'Each bit of a binary count is the previous bit divided by two.',
    'Ripple counters chain stages clock-to-output: simple dividers, but their outputs change one after another.',
    'Synchronous counters clock every bit together; logic chooses which bits toggle.',
    'For modulo-N use a synchronous clear or load at N − 1, not an asynchronous reset at N.',
    'Microcontroller timers are counters with prescalers, compare and capture registers.'
  ],
  pitfalls: [
    'All outputs of a counter change at the same instant — Only in a synchronous counter; a ripple counter\'s stages change one after another.',
    'An asynchronous reset at the terminal count makes a clean modulo-N counter — It shows the unwanted state briefly and its reset pulse may not clear every stage; use a synchronous clear.',
    'Decoding a ripple counter\'s outputs is safe once the clock edge has passed — The decode is only valid after the whole chain has settled, n stage delays later.'
  ],
  formulas: [
    {
      name: 'Output of an n-stage binary divider',
      expr: 'fout = fin/2^n', tex: 'f_{\\text{out}} = \\frac{f_{\\text{in}}}{2^{n}}',
      vars: {
        fout: { name: 'output frequency', q: 'frequency', unit: 'Hz', tex: 'f_{\\text{out}}' },
        fin: { name: 'input frequency', q: 'frequency', unit: 'kHz', value: 32.768, tex: 'f_{\\text{in}}' },
        n: { name: 'number of stages', q: 'count', value: 15, int: true }
      },
      practice: { unknowns: ['fout', 'fin'] },
      stories: { fout: 'A {fin} signal passes through a {n}-stage binary divider. What comes out?', fin: 'The last of {n} divider stages outputs {fout}. What is the input frequency?' }
    },
    {
      name: 'Settling time of a ripple counter',
      expr: 'T = n*tpd', tex: 'T = n\\,t_{pd}',
      vars: {
        T: { name: 'time until the last output is valid', q: 'time', unit: 'ns' },
        n: { name: 'number of stages', q: 'count', value: 12, int: true },
        tpd: { name: 'delay per stage', q: 'time', unit: 'ns', value: 20, tex: 't_{pd}' }
      },
      note: 'Decode the outputs only after this time. It also limits how fast the full count can be read out.',
      stories: { T: 'A {n}-stage ripple counter has {tpd} per stage. How long after a clock edge is the full count valid?' }
    }
  ],
  examples: [
    {
      title: 'One pulse per second from a watch crystal',
      q: 'A CD4060 runs a 32.768 kHz crystal oscillator and divides it; its last output is Q14 (÷16 384). How do you get 1 Hz?',
      steps: [
        '$32\\,768\\ \\mathrm{Hz} / 2^{14} = 2\\ \\mathrm{Hz}$ at Q14.',
        'One more halving is needed: a D flip-flop with $\\overline{Q}$ to D (half a 74HC74) clocked from Q14.',
        '$2\\ \\mathrm{Hz} / 2 = 1\\ \\mathrm{Hz}$, with a clean 50 % duty cycle — and the accuracy of the crystal, typically ±20 ppm (under 2 s a day).'
      ],
      a: 'Q14 gives 2 Hz; one toggle flip-flop halves it to 1 Hz.'
    },
    {
      title: 'A modulo-6 counter for the tens of minutes',
      q: 'Make a 74HC163 (synchronous clear, active low) count 0 to 5 and repeat.',
      steps: [
        'The last state is 5 = 0101. With a synchronous clear, assert $\\overline{CLR}$ during state 5: the next edge loads 0 instead of 6.',
        'Only states 0–5 occur, so it is enough to detect $Q_2 = 1$ and $Q_0 = 1$ (5 is the only such state below 6).',
        '$\\overline{CLR} = \\overline{Q_2 Q_0}$: one NAND gate. The sequence is 0, 1, 2, 3, 4, 5, 0 … with no false states.'
      ],
      a: 'Clear on the edge after state 5, detected by a NAND of Q₂ and Q₀.'
    }
  ],
  quiz: [
    { q: 'A 12-stage binary ripple counter (CD4040) is clocked at 1 MHz. The frequency at its last output is about…', choices: ['83 kHz', '4.1 kHz', '244 Hz', '12 Hz'], a: 2,
      why: '1 MHz / 2¹² = 1 000 000 / 4096 ≈ 244 Hz.' },
    { q: 'Why can decoding the outputs of a ripple counter produce spikes?', choices: ['The flip-flops are too slow', 'The outputs change one after another, passing through false values', 'The clock has too much jitter', 'Decoders cannot handle binary codes'], a: 1,
      why: 'Between 0111 and 1000 the outputs pass 0110, 0100 and 0000 for a few nanoseconds each; a decoder sees them all.' },
    { q: 'In a synchronous binary counter, bit i toggles at a clock edge when all lower bits are 1.', a: true,
      why: 'That is the carry of adding 1: e.g. 0111 + 1 flips bits 0–3 because bits 0–2 are all 1.' },
    { q: 'A 74HC163 must count 0–9 using its synchronous clear. The clear must be asserted while the count is…', choices: ['8', '9', '10', '15'], a: 1,
      why: 'A synchronous clear acts at the next edge, so assert it in the last wanted state, 9. An asynchronous clear would need 10 — and would flash it briefly.' },
    { q: 'How many flip-flops does a Johnson counter with ten states (like the CD4017) use?', choices: ['4', '5', '10', '20'], a: 1,
      why: 'A Johnson counter of n flip-flops has 2n states: five give ten.' }
  ],
  applications: ['Frequency division: 1 Hz from a watch crystal, baud-rate clocks from a system clock.', 'Microcontroller timers for PWM, delays and input capture.', 'Event counting: parts on a conveyor, encoder pulses, Geiger counts.', 'Sequencers and LED chasers (CD4017).'],
  sim: [{ id: 'dig-flipflops', params: { mode: 'counter' } }, { id: 'dig-flipflops', params: { mode: 'counter', ripple: true, mod: 10 }, title: 'A ripple decade counter, delays exaggerated' }]
},

{
  id: 'shift-registers', parent: 'sequential', title: 'Shift registers', level: 2,
  short: 'A chain of flip-flops that passes bits along one place per clock: the standard way to turn serial data into parallel and back, to add outputs and inputs to a microcontroller, and to make pseudo-random sequences.',
  keywords: ['shift register', 'SIPO', 'PISO', 'serial to parallel', '74HC595', '74HC165', '74HC164', 'daisy chain', 'storage register', 'LFSR', 'pseudo-random', 'PRBS', 'CRC', 'Johnson counter', 'ring counter'],
  prereq: ['flip-flops', 'binary-numbers'],
  related: ['serial-buses', 'counters', 'microcontrollers'],
  body: `
Connect D flip-flops in a line, each output feeding the next input, and clock them together. At every edge each flip-flop takes its neighbour's bit: the whole pattern moves one place along, and a new bit enters at the start. That is a **shift register**, and it is how digital systems convert between one wire carrying bits one after another (**serial**) and many wires carrying them at once (**parallel**).

### The four kinds
- **Serial in, parallel out (SIPO):** clock in $n$ bits, read them all on $n$ outputs. The 74HC164 and 74HC595.
- **Parallel in, serial out (PISO):** load $n$ inputs at once, then clock them out one by one. The 74HC165.
- **Serial in, serial out:** a delay line of $n$ clock periods.
- **Universal:** shifts either way and loads in parallel (74HC194).

### More outputs: the 74HC595
The **74HC595** is the most-used shift register in hobby and industrial boards alike. It has two stages: an 8-bit shift register clocked by SRCLK, and an 8-bit **storage register** (a latch) clocked by RCLK that drives the outputs. You shift in eight bits — the outputs do not flicker meanwhile — and then one pulse on RCLK updates all eight outputs together. A ninth output, QH′, passes the bits on to the next chip, so any number of '595s can be **daisy-chained** on the same three wires: data, shift clock and latch clock. Three microcontroller pins can drive 8, 16 or 64 LEDs, relays (through drivers) or a seven-segment display. The SPI peripheral of a microcontroller clocks the bits out in hardware at several MHz ([[serial-buses]]). Mind the current: the whole chip may pass only about 70 mA through its supply pins, so eight LEDs lit together get under 9 mA each.

### More inputs: the 74HC165
The mirror image reads inputs: a pulse on $\\overline{PL}$ copies eight input pins into the register at once (a snapshot), then eight clocks shift them out to one microcontroller pin. Chained '165s read dozens of buttons, limit switches or DIP switches with three pins.

### Shift registers inside everything
SPI itself is two shift registers, one in the master and one in the slave, joined in a ring: each clock moves a bit out of each and into the other, so after eight clocks they have exchanged bytes. A UART is a PISO on the transmit side and a SIPO on the receive side.

### Feedback: counters and pseudo-random bits
Feed the output back to the input and the register cycles. Directly, a single 1 circulates — a **ring counter**; inverted, it is a **Johnson counter** ([[counters]]). Feed back the XOR of chosen stages (the *taps*) and you have a **linear-feedback shift register** (LFSR). With the right taps an $n$-bit LFSR steps through all $2^n - 1$ non-zero states before repeating, producing a bit stream that looks random but is exactly reproducible — a *pseudo-random binary sequence* (PRBS). LFSRs test serial links (PRBS-7 and PRBS-31 patterns), scramble data so it has no long runs, generate white noise, and compute **CRC** checksums, which are an LFSR fed with the data.
`,
  ideas: [
    'Each clock moves every bit one place along the chain.',
    'SIPO turns serial into parallel (74HC595 for outputs); PISO does the reverse (74HC165 for inputs).',
    'The 74HC595\'s storage register updates all outputs at once after the shifting is done.',
    'SPI is two shift registers joined in a ring, exchanging bytes.',
    'With XOR feedback from the right taps an n-bit LFSR cycles through 2ⁿ − 1 states.'
  ],
  pitfalls: [
    'A 74HC595\'s outputs flicker while data shifts in — Not while RCLK is kept separate: the storage register holds the old pattern until it is pulsed.',
    'Any feedback taps make a long LFSR sequence — Only taps from a primitive polynomial give the full 2ⁿ − 1 states; others give short cycles.',
    'A shift register can drive each LED as hard as a microcontroller pin — The whole chip shares one supply-current limit (about 70 mA for a 74HC595).'
  ],
  formulas: [
    {
      name: 'Time to shift a word',
      expr: 't = N/f', tex: 't = \\frac{N}{f_{\\text{clk}}}',
      vars: {
        t: { name: 'transfer time', q: 'time', unit: 'µs' },
        N: { name: 'number of bits', q: 'count', value: 32 },
        f: { name: 'shift clock', q: 'frequency', unit: 'MHz', value: 8, tex: 'f_{\\text{clk}}' }
      },
      stories: { t: 'Four chained 74HC595s ({N} bits) are loaded over SPI at {f}. How long does one update take (ignoring the latch pulse)?' }
    },
    {
      name: 'Longest sequence of an LFSR',
      expr: 'L = 2^n - 1', tex: 'L = 2^{n} - 1',
      vars: {
        L: { name: 'sequence length before repeating', q: 'count' },
        n: { name: 'register length', q: 'count', value: 7, int: true }
      },
      note: 'The all-zero state is excluded: with XOR feedback it would stay zero forever. PRBS-7, used to test serial links, has 127 bits.',
      practice: { unknowns: ['L'] },
      stories: { L: 'A maximal-length LFSR has {n} stages. How many bits does its sequence contain before it repeats?' }
    }
  ],
  examples: [
    {
      title: 'Sixteen LEDs from three pins',
      q: 'Two 74HC595s drive 16 LEDs from an MCU over SPI at 4 MHz. Describe the update and its duration.',
      steps: [
        'Wire MOSI to SER of the first chip, its QH′ to SER of the second, SCK to both SRCLK, and a GPIO to both RCLK.',
        'Send two bytes (the second chip\'s byte first, since it has to travel furthest): 16 clocks at 4 MHz = 4 µs.',
        'Pulse RCLK: all 16 outputs change at once.',
        'With all LEDs on, keep each below $70/8 \\approx 9\\ \\mathrm{mA}$; for more current use a driver such as the TPIC6B595.'
      ],
      a: 'Two bytes in 4 µs, then one latch pulse updates all 16 outputs together.'
    },
    {
      title: 'Reading eight limit switches',
      q: 'A CNC controller must read 8 limit and home switches with only three free pins. How?',
      steps: [
        'Connect the switches (with pull-ups) to the eight inputs of a 74HC165.',
        'Pulse $\\overline{PL}$ low: the register takes a snapshot of all eight inputs at the same instant.',
        'Clock eight times and read the serial output after each clock (or use the SPI peripheral to read one byte).'
      ],
      a: 'A 74HC165: one load pulse, then eight clocks.'
    }
  ],
  quiz: [
    { q: 'The outputs of a 74HC595 change…', choices: ['with every shift clock', 'when the storage-register clock (RCLK) is pulsed', 'only after power-up', 'when the serial input changes'], a: 1,
      why: 'Shifting happens in the internal register; the outputs come from the storage register, which updates on RCLK.' },
    { q: 'How many shift-clock pulses load 24 bits into three chained 74HC595s?', choices: ['3', '8', '24', '72'], a: 2,
      why: 'One clock per bit, and every bit passes through the chain: 24 clocks, then one latch pulse.' },
    { q: 'A maximal-length 8-bit LFSR cycles through all 256 states.', a: false,
      why: 'It cycles through 255: the all-zero state maps to itself under XOR feedback and is never entered.' },
    { q: 'To read 16 push-buttons with three microcontroller pins you would use…', choices: ['two 74HC595s', 'two 74HC165s', 'a 74HC138', 'a CD4017'], a: 1,
      why: 'The 74HC165 is parallel-in, serial-out; two in a chain present 16 inputs on one data line.' },
    { q: 'A serial-in, serial-out shift register of 8 stages clocked at 1 MHz delays a signal by…', choices: ['1 µs', '8 µs', '125 ns', '8 ms'], a: 1,
      why: 'Each bit takes one clock period (1 µs) per stage: 8 µs, sampled at the clock rate.' }
  ],
  applications: ['Driving LED arrays, seven-segment displays and relay banks from a few pins (74HC595).', 'Reading button arrays and limit switches (74HC165).', 'The transmit and receive registers of UARTs and SPI.', 'PRBS test patterns, scramblers and CRC checksums (LFSRs).'],
  sim: [{ id: 'dig-flipflops', params: { mode: 'shift' } }]
},

{
  id: 'state-machines', parent: 'sequential', title: 'Finite state machines', level: 2,
  short: 'A way to design any sequential controller: a register holds the present state, logic computes the next state from it and the inputs, and the outputs follow from the state — drawn as circles and arrows before it is built.',
  keywords: ['finite state machine', 'FSM', 'state diagram', 'state table', 'Moore machine', 'Mealy machine', 'state encoding', 'one-hot', 'Gray encoding', 'next-state logic', 'sequence detector', 'traffic light', 'controller', 'illegal state'],
  prereq: ['flip-flops', 'boolean-algebra', 'karnaugh-maps'],
  related: ['counters', 'timing-clocks', 'microcontrollers', 'serial-buses'],
  body: `
Most controllers — a traffic light, a vending machine, a washing-machine programme, the homing cycle of a CNC axis, a serial-protocol parser — do the same thing: remember where they are in a procedure, look at their inputs, and decide what to do next. A **finite state machine** (FSM) captures that in three parts:

1. a **state register** of flip-flops holding the present state;
2. **next-state logic** computing, from the present state and the inputs, the state to load at the next clock edge;
3. **output logic** computing the outputs.

Counters are FSMs whose next state is just "one more"; everything sequential is an FSM of some size.

### Moore and Mealy
In a **Moore** machine the outputs depend on the state alone. They change only at clock edges, cleanly, but react to an input one clock later. In a **Mealy** machine the outputs depend on the state *and* the inputs: they react at once and often need fewer states, but an input glitch passes straight to the output. Designers choose Moore when the outputs drive things that must not glitch — lamps, motors, chip selects.

### The design procedure
1. **Describe** the behaviour in words, including what happens after reset and on every input in every situation.
2. **Draw the state diagram**: a circle per state (with its outputs, for Moore), an arrow per transition labelled with its condition. Check that from every state the conditions on the outgoing arrows cover every input combination exactly once.
3. **Write the state table**: present state and inputs in, next state and outputs out.
4. **Encode the states** in flip-flops. *Binary* uses the fewest, $\\lceil \\log_2 S \\rceil$ for $S$ states. *Gray* encoding changes one bit per transition where it can. *One-hot* uses one flip-flop per state: more flip-flops, but the next-state logic becomes trivial and fast — the usual choice in FPGAs.
5. **Derive the equations** for each flip-flop's D input and each output, with [[karnaugh-maps]] or by hand.
6. **Handle the unused codes**: six states in three flip-flops leave two codes; noise or a brown-out could land the machine in one, so make every unused code lead to a safe state.

### The traffic light
The simulation is a Moore machine with six states: main green, main amber, all red, side green with the pedestrian WALK signal, side amber, all red. Each state has a minimum duration kept by a small timer (a counter that is part of the state), and the main road stays green until a pedestrian request arrives. The encoding can be switched between binary, Gray and one-hot to see that the machine — the diagram — does not change, only its representation in flip-flops.

### Inputs from the outside world
An FSM is synchronous; its inputs often are not. A button or a sensor can change a nanosecond before a clock edge, and then some flip-flops of the state register may see the old value and some the new: a one-hot machine can end up with two states active, or none. Every asynchronous input must first pass through a **synchroniser**, two flip-flops in series ([[timing-clocks]]), so that the whole machine sees one clean value per clock.

### In software
On a microcontroller the same design becomes a \`switch\` on a state variable, executed on every pass of the main loop or on every timer tick. The discipline is the same, and it is what keeps firmware readable: explicit states, explicit transitions, and a default branch for the impossible. CNC firmware such as grbl is organised exactly this way, around states like Idle, Run, Hold, Jog, Homing and Alarm.
`,
  ideas: [
    'An FSM is a state register, next-state logic and output logic.',
    'Moore outputs depend only on the state (clean, one clock late); Mealy outputs also on the inputs (fast, can glitch).',
    'Draw the state diagram first; check every state handles every input.',
    'Binary encoding needs ⌈log₂S⌉ flip-flops; one-hot needs S but simpler logic.',
    'Synchronise asynchronous inputs, and give every unused state code a way out.'
  ],
  pitfalls: [
    'Unused state codes can be ignored — A glitch can put the machine there; if nothing leads out, the controller hangs. Route every code to a safe state.',
    'Inputs can go straight into the next-state logic — An input that changes near a clock edge can be seen differently by different flip-flops; synchronise it first.',
    'One-hot wastes flip-flops, so binary is always better — In FPGAs flip-flops are plentiful and one-hot gives smaller, faster next-state logic.'
  ],
  formulas: [
    {
      name: 'States that n flip-flops can hold (binary encoding)',
      expr: 'S = 2^n', tex: 'S = 2^{n}',
      vars: {
        S: { name: 'number of states', q: 'count' },
        n: { name: 'number of flip-flops', q: 'count', value: 3 }
      },
      note: 'Solving for $n$ gives $\\log_2 S$: round it up. One-hot encoding needs $S$ flip-flops instead.',
      stories: { n: 'A controller has {S} states. How many flip-flops does binary encoding need (round up)?', S: 'How many states can a register of {n} flip-flops encode?' }
    }
  ],
  examples: [
    {
      title: 'A 101 sequence detector',
      q: 'Design a Moore machine that watches a serial bit stream x (one bit per clock) and outputs Z = 1 for one clock whenever the last three bits were 1, 0, 1. Overlapping sequences count: 10101 contains two.',
      steps: [
        'States by what has been seen: A (nothing useful), B (…1), C (…10), D (…101, Z = 1).',
        'Transitions: A: x = 1 → B, x = 0 → A. B: x = 0 → C, x = 1 → B. C: x = 1 → D, x = 0 → A. D: x = 0 → C (the final 1 can start a new 10…), x = 1 → B.',
        'Four states: two flip-flops in binary. Encode A = 00, B = 01, C = 10, D = 11 and Z = Q₁Q₀.',
        'Fill a state table (present state, x → next state) and minimise each D input with a Karnaugh map.'
      ],
      a: 'Four states A–D, Z = 1 in D; from D a 0 leads to C so overlapping patterns are caught.'
    },
    {
      title: 'Counting flip-flops',
      q: 'The traffic-light controller has 6 states. How many flip-flops does it need in binary, Gray and one-hot encoding, and how many codes are unused?',
      steps: [
        'Binary and Gray: $\\lceil \\log_2 6 \\rceil = 3$ flip-flops, 8 codes, 2 unused.',
        'One-hot: 6 flip-flops, 64 codes, of which only 6 are legal — 58 unused (any pattern with no 1 or several 1s).',
        'In both cases the unused codes must lead back to a safe state, for example all red.'
      ],
      a: '3 flip-flops (2 unused codes) or 6 flip-flops one-hot (58 unused codes).'
    }
  ],
  quiz: [
    { q: 'In a Moore machine the outputs depend on…', choices: ['the inputs only', 'the present state only', 'the present state and the inputs', 'the clock only'], a: 1,
      why: 'That is the definition of Moore. Mealy outputs also depend directly on the inputs.' },
    { q: 'A controller has 10 states. How many flip-flops for binary encoding, and for one-hot?', choices: ['3 and 10', '4 and 10', '4 and 16', '10 and 4'], a: 1,
      why: '2³ = 8 < 10 ≤ 16 = 2⁴, so 4 flip-flops in binary; one-hot uses one per state, 10.' },
    { q: 'A Mealy machine can react to an input change without waiting for a clock edge, but its outputs may glitch when the inputs do.', a: true,
      why: 'Its outputs are combinational functions of the inputs, so they follow input changes — and input glitches — immediately.' },
    { q: 'An FSM with 6 states in 3 flip-flops has 2 unused codes. Good practice is to…', choices: ['ignore them: they never occur', 'make each lead to a known safe state', 'use them as extra outputs', 'add a fourth flip-flop'], a: 1,
      why: 'Noise, radiation or a brown-out can put the register anywhere. A machine that can escape from any code recovers by itself.' },
    { q: 'A push-button feeds the next-state logic of a one-hot FSM directly. What can go wrong?', choices: ['Nothing, if the button is debounced', 'If it changes near a clock edge some flip-flops see it and others do not: two states or none become active', 'The FSM runs faster', 'The button\'s pull-up draws too much current'], a: 1,
      why: 'Debouncing removes bounces, not the timing problem. A two-flip-flop synchroniser gives the machine one clean value per clock.' }
  ],
  applications: ['Traffic lights, lifts, vending machines and washing-machine sequencers.', 'Machine control: homing cycles, tool changers and alarm handling in CNC controllers.', 'Protocol engines: UART receivers, I²C and USB state machines, command parsers.', 'Button handling in firmware: debouncing, long press, double click.'],
  sim: 'dig-fsm'
},

{
  id: 'timing-clocks', parent: 'sequential', title: 'Clocks, propagation delay, setup and hold', level: 3,
  short: 'Why a synchronous circuit works: every path between flip-flops must settle within a clock period (set-up) but not change too soon (hold), and signals from outside must be synchronised to survive metastability.',
  keywords: ['clock', 'propagation delay', 'contamination delay', 'setup time', 'hold time', 'clock-to-Q', 'critical path', 'maximum clock frequency', 'clock skew', 'jitter', 'metastability', 'synchroniser', 'MTBF', 'clock domain crossing', 'static timing analysis'],
  prereq: ['flip-flops', 'binary-adders', 'math:exponential-functions'],
  related: ['state-machines', 'counters', 'crystal-oscillators', 'logic-families'],
  body: `
A synchronous circuit is flip-flops separated by clouds of combinational logic, all clocked together. At each edge every flip-flop captures its input; then the new outputs ripple through the logic and must settle at the next flip-flops' inputs before the following edge. If that holds everywhere, the circuit behaves exactly like its logic diagram, whatever the delays of individual gates. Timing design is making sure it holds.

### The delays
- **Propagation delay** $t_{pd}$: the longest time from an input change until the output is final.
- **Contamination delay** $t_{cd}$: the shortest time until the output *starts* to change.
- **Clock-to-Q** $t_{cq}$, **set-up** $t_{su}$ and **hold** $t_h$ of the flip-flops ([[flip-flops]]).

### The set-up constraint: how fast
Data leaves a flip-flop $t_{cq}$ after an edge, crosses the logic in up to $t_{logic}$, and must arrive $t_{su}$ before the next edge — and the next edge may arrive early by the **clock skew** $t_{skew}$. So

$$T_{clk} \\ge t_{cq} + t_{logic} + t_{su} + t_{skew}$$

The slowest path in the design, the **critical path**, fixes the maximum clock frequency. A carry chain is a typical culprit ([[binary-adders]]); in the adder simulation, move the clock edge before the sum has settled and the register captures a wrong value. If a design fails set-up, slowing the clock always fixes it — or the path is shortened, or split across two clock cycles by a register in the middle (**pipelining**).

### The hold constraint: not too fast
The *new* data must not arrive so soon that it corrupts the capture of the *old* data at the same edge:

$$t_{cq,\\min} + t_{cd} \\ge t_h + t_{skew}$$

The clock period does not appear: a hold violation cannot be fixed by slowing down, only by adding delay to the short path or reducing skew. It bites where one flip-flop feeds the next directly — shift registers, especially across two chips whose clocks arrive at different times.

Use **worst-case** datasheet values: maximum delays (at high temperature and low supply) for set-up, minimum delays for hold. "Typical" is not a guarantee. Clock **jitter** — the edge-to-edge wobble of the period — eats into the set-up margin as well.

### Metastability
The rules assume inputs obey set-up and hold. An asynchronous input — a button, a sensor, a signal from another clock domain — will sooner or later change inside the window. The flip-flop may then enter a **metastable** state, balanced between 0 and 1, and leave it after a time that is usually short but has no upper bound: the probability of still being undecided after a time $t_r$ decays as $e^{-t_r/\\tau}$, with $\\tau$ a property of the flip-flop. The mean time between failures is

$$\\text{MTBF} = \\frac{e^{t_r/\\tau}}{T_0\\,f_{clk}\\,f_{data}}$$

The standard defence is the **two-flip-flop synchroniser**: the asynchronous signal goes into one flip-flop and its output into a second, and only the second's output is used. The first gets a whole clock period to resolve, and because the dependence is exponential, each extra nanosecond multiplies the MTBF by $e^{1\\,\\mathrm{ns}/\\tau}$ — often by a factor of a hundred or more.

### Crossing clock domains
A synchroniser handles one bit. A multi-bit value (a counter, a FIFO pointer) must never be synchronised bit by bit — the bits can be caught on different sides of a change and form a number that never existed. Pass it in **Gray code**, so only one bit changes at a time ([[decoders-encoders]]), or with a handshake, or through a dual-clock FIFO. Resets need the same care: assert them asynchronously if you like, but release them synchronously, or different flip-flops leave reset on different clock cycles.
`,
  ideas: [
    'Between two flip-flops the data must settle within one clock period: T ≥ t_cq + t_logic + t_su + t_skew.',
    'The critical path sets the maximum clock frequency; pipelining splits it.',
    'Hold: t_cq,min + t_cd ≥ t_h + t_skew, independent of the clock period.',
    'Asynchronous inputs cause metastability; MTBF grows exponentially with the resolution time.',
    'Synchronise single bits with two flip-flops; pass multi-bit values in Gray code or with a handshake.'
  ],
  pitfalls: [
    'A slower clock fixes every timing problem — It fixes set-up violations only; hold violations do not depend on the period, and slower clocks help metastability only through the resolution time.',
    'Typical datasheet delays are the ones to design with — Use the worst case: maximum delays for set-up, minimum delays for hold, over temperature and supply.',
    'A synchroniser eliminates metastability — It makes failures improbable, not impossible; the MTBF grows exponentially with the time allowed to resolve.'
  ],
  formulas: [
    {
      name: 'Maximum clock frequency (set-up constraint)',
      expr: 'fmax = 1/(tcq + tlogic + tsu + tskew)', tex: 'f_{\\text{max}} = \\frac{1}{t_{cq} + t_{\\text{logic}} + t_{su} + t_{\\text{skew}}}',
      vars: {
        fmax: { name: 'maximum clock frequency', q: 'frequency', unit: 'MHz', tex: 'f_{\\text{max}}' },
        tcq: { name: 'clock-to-Q delay (maximum)', q: 'time', unit: 'ns', value: 20, tex: 't_{cq}' },
        tlogic: { name: 'logic delay of the longest path', q: 'time', unit: 'ns', value: 64, tex: 't_{\\text{logic}}' },
        tsu: { name: 'set-up time', q: 'time', unit: 'ns', value: 15, tex: 't_{su}' },
        tskew: { name: 'clock skew', q: 'time', unit: 'ns', value: 2, tex: 't_{\\text{skew}}' }
      },
      practice: { unknowns: ['fmax', 'tlogic'] },
      stories: { fmax: 'Flip-flops with {tcq} clock-to-Q and {tsu} set-up are joined by logic with a worst-case delay of {tlogic}; the clock skew is {tskew}. What is the fastest safe clock?', tlogic: 'A design must run at {fmax}. With {tcq} clock-to-Q, {tsu} set-up and {tskew} skew, how much logic delay is allowed between registers?' }
    },
    {
      name: 'Hold-time slack',
      expr: 'slack = tcq + tcd - th - tskew', tex: '\\text{slack} = t_{cq} + t_{cd} - t_h - t_{\\text{skew}}',
      vars: {
        slack: { name: 'hold slack (must be positive)', q: 'time', unit: 'ns', signed: true, tex: '\\text{slack}' },
        tcq: { name: 'clock-to-Q delay (minimum)', q: 'time', unit: 'ns', value: 5, tex: 't_{cq}' },
        tcd: { name: 'contamination delay of the path', q: 'time', unit: 'ns', value: 2, tex: 't_{cd}' },
        th: { name: 'hold time', q: 'time', unit: 'ns', value: 3, tex: 't_h' },
        tskew: { name: 'clock skew (receiver clock late)', q: 'time', unit: 'ns', value: 1, tex: 't_{\\text{skew}}' }
      },
      note: 'No clock period appears: a negative slack is fixed by adding delay to the path or reducing skew, never by slowing the clock.',
      practice: { unknowns: ['slack', 'tskew'] }
    },
    {
      name: 'Mean time between synchroniser failures',
      expr: 'MTBF = exp(tr/tau)/(T0*fclk*fdata)', tex: '\\text{MTBF} = \\frac{e^{t_r/\\tau}}{T_0\\,f_{clk}\\,f_{data}}',
      vars: {
        MTBF: { name: 'mean time between failures', q: 'time', unit: 'day', tex: '\\text{MTBF}' },
        tr: { name: 'time allowed to resolve', q: 'time', unit: 'ns', value: 5, tex: 't_r' },
        tau: { name: 'resolution time constant of the flip-flop', q: 'time', unit: 'ns', value: 0.2, tex: '\\tau' },
        T0: { name: 'metastability window constant', q: 'time', unit: 'ns', value: 0.1, tex: 'T_0' },
        fclk: { name: 'clock frequency', q: 'frequency', unit: 'MHz', value: 50, tex: 'f_{clk}' },
        fdata: { name: 'rate of asynchronous input changes', q: 'frequency', unit: 'MHz', value: 1, tex: 'f_{data}' }
      },
      note: 'τ and T₀ come from the device (FPGA vendors publish them); the values here are illustrative. Note how the MTBF explodes as $t_r$ grows.',
      practice: { unknowns: ['MTBF', 'tr'] },
      stories: { MTBF: 'A flip-flop with τ = {tau} and T₀ = {T0} samples a signal changing at {fdata} with a {fclk} clock, leaving {tr} to resolve. What is the mean time between failures?', tr: 'How much resolution time is needed for an MTBF of {MTBF}, with τ = {tau}, T₀ = {T0}, a {fclk} clock and {fdata} of input changes?' }
    }
  ],
  examples: [
    {
      title: 'How fast can the adder datapath run?',
      q: 'A register feeds a 4-bit ripple-carry adder (8 gate delays of 8 ns) whose result is captured by a second register. The flip-flops have $t_{cq} = 20$ ns and $t_{su} = 15$ ns; skew is 2 ns. What is the maximum clock?',
      steps: [
        'Logic delay: $8 \\times 8 = 64\\ \\mathrm{ns}$.',
        '$T_{clk} \\ge 20 + 64 + 15 + 2 = 101\\ \\mathrm{ns}$.',
        '$f_{\\text{max}} = 1/101\\ \\mathrm{ns} = 9.9\\ \\mathrm{MHz}$. Most of the budget is the carry chain: carry lookahead or a pipeline register would raise it.'
      ],
      a: 'About 9.9 MHz, limited by the carry chain.'
    },
    {
      title: 'One flip-flop or two?',
      q: 'An asynchronous signal changing about $10^6$ times a second is sampled at 50 MHz by a flip-flop with τ = 0.2 ns and T₀ = 0.1 ns. With a single flip-flop the logic after it leaves 5 ns to resolve; with a second flip-flop there are about 18 ns. Compare the MTBFs.',
      steps: [
        'Denominator: $T_0 f_{clk} f_{data} = 10^{-10} \\times 5\\times10^{7} \\times 10^{6} = 5\\times10^{3}\\ \\mathrm{s^{-1}}$.',
        'One flip-flop: $e^{5/0.2} = e^{25} = 7.2\\times10^{10}$, so MTBF $= 1.4\\times10^{7}\\ \\mathrm{s}$ — about 167 days. A field failure a few times a year.',
        'Two flip-flops: $e^{18/0.2} = e^{90} = 1.2\\times10^{39}$, so MTBF $\\approx 2.4\\times10^{35}\\ \\mathrm{s}$ — some $10^{27}$ years.',
        'Thirteen extra nanoseconds bought a factor of $e^{65} \\approx 10^{28}$.'
      ],
      a: 'About 167 days with one flip-flop; vastly longer than the age of the universe with two.'
    },
    {
      title: 'A hold violation between two chips',
      q: 'The output of a shift register in chip 1 drives the first stage of chip 2 directly ($t_{cd} = 0$). Minimum $t_{cq} = 3$ ns, $t_h = 3$ ns, and chip 2\'s clock arrives 4 ns after chip 1\'s. Is hold met?',
      steps: [
        'Slack $= 3 + 0 - 3 - 4 = -4\\ \\mathrm{ns}$: negative.',
        'Chip 1\'s new bit reaches chip 2 before chip 2 has finished capturing the old one, so a bit can skip a stage.',
        'Slowing the clock does not help. Route the clock so it reaches chip 2 first (skew in the safe direction), or add delay in the data path.'
      ],
      a: 'No: −4 ns of hold slack; fix the skew or delay the data, not the clock rate.'
    }
  ],
  quiz: [
    { q: 'A path has t_cq = 5 ns, logic delay 12 ns and t_su = 3 ns (no skew). The fastest clock is…', choices: ['33 MHz', '50 MHz', '83 MHz', '200 MHz'], a: 1,
      why: 'T ≥ 5 + 12 + 3 = 20 ns, so f_max = 50 MHz.' },
    { q: 'A hold-time violation can be fixed by lowering the clock frequency.', a: false,
      why: 'The hold constraint compares two delays at the same clock edge; the period does not enter it. Add delay to the short path or reduce the skew.' },
    { q: 'Why bring an asynchronous button signal in through two flip-flops in series?', choices: ['To debounce the button', 'To give a possibly metastable first flip-flop a whole clock period to settle before the value is used', 'To double the input\'s frequency', 'To invert the signal twice'], a: 1,
      why: 'The second flip-flop samples the first a full period later; the chance that the first is still undecided by then is exponentially small.' },
    { q: 'For a flip-flop with τ = 0.2 ns, each extra nanosecond of resolution time multiplies the MTBF by about…', choices: ['1.2', '5', '150', '10⁶'], a: 2,
      why: 'The factor is e^(1/0.2) = e⁵ ≈ 148.' },
    { q: 'A 4-bit counter value is passed to another clock domain by synchronising each bit separately. What is the risk?', choices: ['None', 'The bits can be caught on different sides of a change, giving a value that never existed', 'The value arrives one cycle late', 'The counter stops'], a: 1,
      why: 'From 0111 to 1000 all four bits change; sampled mid-change any mixture appears. Gray code changes one bit per step, so the worst case is the old or the new value.' }
  ],
  applications: ['Choosing the clock of an FPGA design from its critical path (static timing analysis).', 'Synchronising buttons, encoders and interrupt lines into a clocked system.', 'Passing data between clock domains with Gray-coded FIFO pointers.', 'Board-level timing between chips: skew, hold and clock routing.'],
  sim: [{ id: 'dig-adder', params: { tclk: 6 }, title: 'A clock edge before the sum has settled' }]
}

);
