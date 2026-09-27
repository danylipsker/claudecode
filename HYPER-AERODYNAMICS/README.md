# Hyper Aerodynamics

How air flows and what it does to everything that moves through it — the seventh Hyper app, on the
same engine as Hyper Physics, Math, Electronics, Chemistry, Finances and Medicine (`../HYPER-CORE`).
The atmosphere, flow and boundary layers, airfoils and wings, drag, high-speed flight, aircraft
performance, stability and control, propulsion, rotors, wind energy and flight in nature, and how
aerodynamicists test and compute. All text, questions and simulations are original.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-AERODYNAMICS/>. No installation, no network.

> For learning only: aircraft figures are typical, rounded values. Flight planning and aircraft
> operation follow the aircraft's approved manuals and the rules of the air; drones follow local rules.

## What is in it

**171 concepts** in 13 branches and 31 topics, with **535 formula calculators**,
**103 simulations** (used 193 times across the pages), **849 quiz questions**,
**400 worked examples** and **187 problems**.

| Branch | Concepts | Topics |
|---|---:|---|
| Air and Flow Basics | 12 | air as a fluid · dimensionless numbers |
| The Atmosphere | 11 | the standard atmosphere · wind and weather |
| How Air Flows | 15 | describing flow · measuring airspeed · potential flow |
| Viscosity and Boundary Layers | 11 | boundary layers · separation and wakes |
| Airfoils | 15 | airfoil shape and lift · airfoil behaviour |
| Wings | 14 | wing geometry · the finite wing |
| Drag | 13 | kinds of drag · drag in everyday life |
| High-Speed Flight | 17 | compressible flow · shocks and expansions · flying fast |
| Flight Performance | 14 | forces in flight · climb, glide and range |
| Stability and Control | 14 | static stability · control and dynamics |
| Propulsion | 12 | thrust · engines |
| Rotors, Wind and Nature | 12 | rotorcraft and drones · wind energy and sails · flight in nature |
| Testing, Computing and Structures | 11 | wind tunnels and experiments · computational aerodynamics · wind on structures |

## Tools

- **Airfoil lab** (Tools → Airfoil lab): any NACA four-digit section solved by a panel method —
  the pressure distribution, the lift curve against thin-airfoil theory, the moment, the suction
  peak and the critical Mach number (Kármán–Tsien) — and its coordinates to download, as a
  Selig `.dat` file or as X Y Z points in millimetres for "Curve Through XYZ Points" in SOLIDWORKS.
- **Atmosphere & flight** (Tools → Atmosphere & flight): the standard atmosphere to 84 km with hot
  and cold days and density altitude; calibrated, equivalent and true airspeed and Mach number with
  the compressible pitot relations; isentropic flow, normal and oblique shocks (with the θ–β–M chart);
  a finite wing by lifting-line theory.

The physics behind the tools and the simulations is `HYPER-CORE/js/fluid.js` — the standard
atmosphere, gas dynamics, NACA airfoils and a Hess–Smith panel method, thin-airfoil and lifting-line
theory, boundary layers — tested by `HYPER-CORE/tools/test-fluid.js` against published tables
(NACA 1135, the ICAO atmosphere, inviscid airfoil results).

## Files and checks

Same layout as the other Hyper apps: `content/outline.js`, `content/reference.js` (the lift
equation: the reference page the authors followed), `sims/reference.js` (an airfoil in a stream and
a lift balance), one `content/*.js` per branch, `sims/*.js`, and a generated `catalog.js`. Run

```bash
node HYPER-CORE/tools/test-fluid.js
node HYPER-CORE/tools/validate.js HYPER-AERODYNAMICS --final
node HYPER-CORE/tools/simtest.js HYPER-AERODYNAMICS
node HYPER-CORE/tools/catalog.js --all
```
