# Hyper Pneumatics

Compressed air at work — the ninth Hyper app, on the same engine as the others (`../HYPER-CORE`).
The physics of air and water vapour; making, drying and distributing compressed air; cylinders and
actuators; valves and their flow; circuits and sequences drawn in ISO 1219 symbols;
electro-pneumatics; vacuum; sizing and dynamics; energy efficiency; safety and applications. All
text, questions and simulations are original.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-PNEUMATICS/>. No installation, no network.

> Compressed air stores energy and can injure. Never point it at a person or use it to blow dust
> off skin or clothes; release the pressure and lock out a machine before working on it; expect
> cylinders to move when a system is first pressurised.

## What is in it

**137 concepts** in 13 branches and 22 topics, with **350 formula calculators**,
**85 simulations** (used 133 times across the pages), **669 quiz questions**,
**306 worked examples** and **119 problems**.

| Branch | Concepts | Topics |
|---|---:|---|
| Air and Gas Physics | 13 | gas laws · measuring air |
| Producing Compressed Air | 12 | compressors · control and storage |
| Air Treatment | 10 | water and drying · air quality |
| Distributing Air | 7 | air networks |
| Cylinders and Actuators | 13 | cylinders · other actuators |
| Valves | 17 | directional control valves · valve flow capacity · function valves · symbols |
| Pneumatic Circuits | 13 | basic control · sequences (cascade, step sequencers) · safety circuits |
| Electro-pneumatics | 9 | electrical control · proportional and servo pneumatics |
| Vacuum Technology | 10 | vacuum · vacuum handling |
| Sizing and Dynamics | 10 | cylinder dynamics · sizing a system |
| Energy and Efficiency | 7 | the cost of air |
| Safety and Maintenance | 6 | safety and maintenance |
| Applications | 10 | pneumatics at work |

## Tools

- **Pneumatics calculators** (Tools → Pneumatics calculators): a cylinder's forces, free air per
  cycle (tubes included) and yearly cost; valve flow by ISO 6358 (sonic conductance and critical
  pressure ratio, with rough Cv and Kv); the water in compressed air (dew point, pressure dew point,
  condensate per day); leaks and what they cost; suction-cup holding force; receiver sizing.
- **ISO 1219 symbols** (Tools → ISO 1219 symbols): the graphic symbols of pneumatic and hydraulic
  circuits, drawn by the same code as the simulations; click a valve to switch it.

The moving simulations are computed, not animated: `kit.fluid.pneuCylinder` in
`HYPER-CORE/js/fluid.js` integrates the air in each chamber (adiabatic filling and emptying, valve
flow by ISO 6358) and the motion of the piston; circuits are drawn with `HYPER-CORE/js/fluidsym.js`.
Both are tested by `HYPER-CORE/tools/test-fluid.js`.

## Files and checks

Same layout as the other Hyper apps: `content/outline.js`, `content/reference.js` (the pneumatic
cylinder: the reference page the authors followed), `sims/reference.js` (a cylinder with a 5/2 valve,
meter-out flow controls and a service unit, and an air-cost calculator), one `content/*.js` per topic
group, `sims/*.js`, and a generated `catalog.js`. Run

```bash
node HYPER-CORE/tools/test-fluid.js
node HYPER-CORE/tools/validate.js HYPER-PNEUMATICS --final
node HYPER-CORE/tools/simtest.js HYPER-PNEUMATICS
node HYPER-CORE/tools/catalog.js --all
```
