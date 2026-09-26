# Hyper Electronics

Practical electronics as a map of connected concepts — the third Hyper app, on the same
engine as Hyper Physics and Hyper Math (`../HYPER-CORE`). The physics underneath is
linked into Hyper Physics, the mathematics into Hyper Math. All text, questions and
simulations are original.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-ELECTRONICS/>. No installation, no network.

## What is in it

**143 concepts** in 10 branches and 28 topics, with **464 formula calculators**,
**58 simulations** (used 136 times across the pages), **703 quiz questions** and
**285 worked examples**.

| Branch | Concepts | Topics |
|---|---:|---|
| Circuit Fundamentals | 18 | voltage, current and resistance · circuit analysis · measurement |
| Components | 14 | passive components · switches, relays and protection · sensors and transducers |
| AC and Signals | 14 | signals and waveforms · transients · AC circuit analysis |
| Filters and Frequency Response | 8 | transfer functions, Bode plots, RC and active filters, decoupling |
| Diodes | 16 | the diode · diode circuits · optoelectronics |
| Transistors | 15 | bipolar transistors · MOSFETs · transistor circuits |
| Operational Amplifiers | 16 | the op-amp · op-amp circuits · real op-amps |
| Power Electronics | 10 | power supplies · switching converters · batteries and motors |
| Digital Electronics | 21 | logic · combinational · sequential · between analogue and digital |
| Oscillators and RF | 11 | oscillators and timers · radio and transmission lines |

## Circuits that really compute

Every electrical simulation is built as a netlist and solved by the engine's circuit
simulator (`HYPER-CORE/js/circuit.js`: modified nodal analysis with DC, transient and AC
analyses; resistors, capacitors, inductors, sources, diodes, LEDs, Zeners, switches,
transformers, bipolar transistors, MOSFETs and op-amps), then drawn with the schematic
kit (`HYPER-CORE/js/schematic.js`): standard symbols, moving current, meters and an
oscilloscope screen. The simulator is tested against textbook results
(`node HYPER-CORE/tools/test-circuit.js`), and several authors checked their simulations'
read-outs against hand calculations.

The 555 timer page links to the repository's own
[555 Timer Sims](../CIRCUITS/555-circuitjs-sims/index.html) collection.

## Files and checks

Same layout as the other Hyper apps: `content/outline.js` (branches, topics, planned
concepts), `content/reference.js` (the reference page authors followed), one
`content/*.js` per topic, `sims/*.js`, and a generated `catalog.js`. See
`../HYPER-CORE/AUTHORING.md`, and run

```bash
node HYPER-CORE/tools/validate.js HYPER-ELECTRONICS
node HYPER-CORE/tools/simtest.js HYPER-ELECTRONICS
node HYPER-CORE/tools/catalog.js --all
```
