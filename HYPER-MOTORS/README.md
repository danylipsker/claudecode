# Hyper Motors

Every kind of motor, explained for choosing and using one — the thirteenth Hyper app, on the same
engine as the others (`../HYPER-CORE`). DC, brushless and pancake, three-phase and single-phase
induction, synchronous and reluctance, stepper and servo motors; their drives, encoders, limit
switches, starters, soft starters and VFDs; gearing, screws and belts and how to size a motor for a
load; heat, friction, noise, vibration and failure; special motors; hydraulic motors as part of a
whole hydraulic system; air motors; and how to choose between them. All text, questions and
simulations are original; manufacturers' manuals are not copied and no brand is promoted.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-MOTORS/>. No installation, no network.

> Mains voltages kill. Work on mains wiring, terminal boxes, capacitors and drives is for qualified
> electricians: isolate, lock off and prove dead; capacitors and a VFD's DC bus stay charged for
> minutes. Hydraulic systems store pressure. The machine's own diagrams, the motor's nameplate and
> the drive's manual govern — the diagrams here are for understanding.

## What is in it

**154 concepts** in 14 branches and 24 topics, with **544 formula calculators**,
**153 simulations** (used 181 times across the pages), **738 quiz questions**,
**373 worked examples** and **285 problems**. Almost every page ends with an **"Is it right for
your application?"** panel (153 of them): what the motor, drive or method is a good choice for, when
to think twice, and what to check before you choose. The power-factor page explains why "COP"
belongs to heat pumps and what cos φ and efficiency mean on a motor's nameplate.

| Branch | Concepts | Topics |
|---|---:|---|
| How Motors Work | 14 | electromagnetic principles · ratings and the nameplate |
| Brushed DC Motors | 12 | kinds of DC motor · controlling DC motors |
| Brushless and Pancake Motors | 8 | brushless motors |
| AC Induction Motors | 17 | three-phase induction motors · single-phase motors |
| Starting and Speed Control of AC Motors | 12 | starting and protection · variable-frequency drives |
| Synchronous and Reluctance Motors | 5 | synchronous motors |
| Stepper Motors | 11 | the stepper motor · stepper drivers and control |
| Servo Motors and Drives | 11 | servo systems · control and tuning |
| Encoders, Sensors and Limit Switches | 11 | feedback devices · limit switches and safety |
| Mechanics: Loads, Gears and Motion | 11 | transmissions · motion and sizing |
| Motors in the Real World | 14 | heat, friction, noise and failure · special motors |
| Hydraulic Motors and Systems | 13 | hydraulic motors · the hydraulic system |
| Air Motors | 6 | air motors |
| Choosing the Right Motor | 9 | comparing and applying |

## Tools

- **Motor lab** (Tools → Motor lab): a DC motor from its datasheet with your load and PWM; a
  three-phase cage motor of any size on the mains or a VFD (torque, current, power factor,
  efficiency, starting); a stepper's torque against speed at three supply voltages; a hydraulic
  motor with the pump and electric motor behind it; an air motor's power curve and running cost.
- **Sizing & selection**: a linear axis (move profile, peak and RMS torque, inertia ratio); a
  conveyor; a hoist with its brake and regenerated energy; a pump or fan throttled or on a VFD; cable
  voltage drop; and "Which motor?", which scores every family against your task, supply, power and
  environment.
- **Wiring diagrams**: the three-phase terminal box (star, delta, dual voltage, reversing — with a
  verdict on your connection); single-phase capacitor motors and the Steinmetz connection; DOL and
  star–delta control circuits you can operate; stepper leads (4, 6, 8 wires; series, parallel,
  unipolar); proximity sensors (PNP/NPN), NO/NC limit switches and encoder signals.
- **Drives & signals**: PWM and current ripple; step, direction and a clickable DIP-switch block (a
  generic table — every driver has its own); VFD ramps and V/f; DOL, star–delta, soft starter and
  VFD starts compared; homing an axis.

The models are `HYPER-CORE/js/motors.js` (`kit.motor`: the DC motor line and transients, the
induction motor's equivalent circuit with deep-bar rotors, V/f, a voltage-limited stepper model,
move profiles and inertia, screws, encoders, heating and duty, IE classes and frames, hydraulic and
air motors, cables, braking), tested by `HYPER-CORE/tools/test-motors.js`. The pages' own
simulations add models of brushless, synchronous, reluctance and single-phase motors, encoders and
resolvers, bearings and faults, solenoids and more; hydraulic circuits are drawn in ISO 1219 symbols
by `HYPER-CORE/js/fluidsym.js`.

## Files and checks

Same layout as the other Hyper apps: `content/outline.js`, `content/reference.js` (the DC
torque–speed line: the reference page the authors followed), `sims/reference.js` (a DC motor on the
bench; an induction motor on the mains or a VFD), one `content/*.js` per topic group, `sims/*.js`,
and a generated `catalog.js`. Run

```bash
node HYPER-CORE/tools/test-motors.js
node HYPER-CORE/tools/validate.js HYPER-MOTORS --final
node HYPER-CORE/tools/simtest.js HYPER-MOTORS
node HYPER-CORE/tools/catalog.js --all
```
