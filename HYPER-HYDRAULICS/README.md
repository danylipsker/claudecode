# Hyper Hydraulics

Liquids that carry, lift and push — the eighth Hyper app, on the same engine as the others
(`../HYPER-CORE`). Hydraulic engineering — fluid properties, pressure at rest, flow in pipes and
open channels, pumps and turbines, water hammer — and oil hydraulics, the fluid power that moves
excavators, presses and aircraft controls: pumps, motors, cylinders, valves and circuits drawn in
ISO 1219 symbols, their design, care and control. All text, questions and simulations are original.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-HYDRAULICS/>. No installation, no network.

> Hydraulic systems store energy — in pressurised oil, accumulators and raised loads. The pages
> explain how systems work; work on a real machine follows its manual, lock-out procedures and the
> safety standards (ISO 4413). Oil escaping from a pinhole at high pressure can pierce the skin: an
> injection injury is a surgical emergency.

## What is in it

**163 concepts** in 14 branches and 29 topics, with **485 formula calculators**,
**96 simulations** (used 159 times across the pages), **800 quiz questions**,
**322 worked examples** and **212 problems**.

| Branch | Concepts | Topics |
|---|---:|---|
| Fluid Properties | 11 | properties of liquids · hydraulic fluids |
| Hydrostatics | 12 | pressure at rest · forces on surfaces |
| Liquids in Motion | 14 | describing flow · momentum and forces · measuring flow |
| Pipe Flow | 13 | friction in pipes · pipe systems |
| Pumps and Turbines | 15 | centrifugal pumps · cavitation and NPSH · turbines and hydropower |
| Water Hammer and Transients | 6 | water hammer (with a method-of-characteristics simulation) |
| Open Channels and Water | 13 | open-channel flow · water resources |
| Hydraulic Power | 9 | what hydraulic power is · symbols and diagrams |
| Hydraulic Pumps and Motors | 12 | pumps · motors |
| Cylinders and Actuators | 10 | cylinders · rotary actuators and intensifiers |
| Hydraulic Valves | 17 | directional control valves · pressure control valves · flow control and proportional valves |
| Hydraulic Circuits | 11 | basic circuits · system circuits |
| Design, Conditioning and Maintenance | 11 | components and sizing · contamination and maintenance |
| Control and Applications | 9 | electro-hydraulics and control · applications |

## Tools

- **Pipes, pumps & channels** (Tools → Pipes, pumps & channels): pipe friction by Darcy–Weisbach
  and Colebrook with minor losses, on a Moody chart; a pump against a system curve with the
  affinity laws; uniform flow, critical depth and specific energy in an open channel; the water-hammer
  surge (wave speed, Joukowsky, slow closure).
- **Fluid-power calculators** (Tools → Fluid-power calculators): cylinder forces, speeds, area
  ratio, regeneration and a buckling check; pump flow, torque and power; motor speed and torque;
  orifice flow; accumulator sizing (isothermal and adiabatic); oil viscosity against temperature by
  ISO VG grade.
- **ISO 1219 symbols** (Tools → ISO 1219 symbols): the graphic symbols of hydraulic and pneumatic
  circuits, drawn by the same code as the simulations; click a valve to switch it.

The simulations draw their circuits with `HYPER-CORE/js/fluidsym.js` (ISO 1219 symbols with
sliding valve boxes, lines coloured by what they carry and moving flow dots) and compute with
`HYPER-CORE/js/fluid.js`, tested by `HYPER-CORE/tools/test-fluid.js`.

## Files and checks

Same layout as the other Hyper apps: `content/outline.js`, `content/reference.js` (the hydraulic
cylinder: the reference page the authors followed), `sims/reference.js` (a working pump, relief
valve, 4/3 valve and cylinder circuit, and a cylinder calculator), one `content/*.js` per topic
group, `sims/*.js`, and a generated `catalog.js`. Run

```bash
node HYPER-CORE/tools/test-fluid.js
node HYPER-CORE/tools/validate.js HYPER-HYDRAULICS --final
node HYPER-CORE/tools/simtest.js HYPER-HYDRAULICS
node HYPER-CORE/tools/catalog.js --all
```
