# Forrest Mims — *555 Timer IC Circuits*, as CircuitJS1 circuits

All 28 circuits from Forrest M. Mims III's *Engineer's Mini-Notebook: 555 Timer IC
Circuits* (Radio Shack), rebuilt as runnable [CircuitJS1](https://www.falstad.com/circuit/)
files — one `.txt` per circuit, in the app's current XML format.

Source PDF: `C:\books\Forrest Mims - 555 Timer IC Circuits.pdf` (pages 6–32).

## Loading a circuit

In the simulator: **File ▸ Import From Text…**, paste the file's contents, OK.
Or **File ▸ Open File…** and pick the `.txt` directly.

Every file is self-contained: supply, component values, scopes, sliders and
on-canvas notes all travel with it.

## The circuits

| # | File | Book p. | Interactive controls |
|---|------|--------:|----------------------|
| 01 | `01-basic-monostable.txt` | 6 | **T** = trigger · R1 slider |
| 02 | `02-basic-astable.txt` | 7 | R1, R2 sliders |
| 03 | `03-bouncefree-switch.txt` | 8 | **S** = S1 · C1 dead-time slider |
| 04 | `04-touch-activated-switch.txt` | 8 | **T** = touch |
| 05 | `05-timer-plus-relay.txt` | 9 | **S** = start · R1 delay slider · relay + lamp |
| 06 | `06-cascaded-timer.txt` | 10 | **T** = trigger · two delay sliders |
| 07 | `07-intervalometer.txt` | 11 | R1 interval, R3 relay-time sliders |
| 08 | `08-missing-pulse-detector.txt` | 12 | R2 window slider |
| 09 | `09-event-failure-alarm.txt` | 13 | **S** = the event · R2 deadline slider |
| 10 | `10-frequency-divider.txt` | 14 | R1 divide-ratio slider |
| 11 | `11-voltage-controlled-oscillator.txt` | 15 | Control Voltage pot · R2 pitch slider |
| 12 | `12-pulse-generator.txt` | 16 | R1, C1 sliders (log) |
| 13 | `13-frequency-meter.txt` | 17 | R3 range slider · 0–1 mA meter |
| 14 | `14-audio-oscillator-metronome.txt` | 18 | R1 pitch, C1 tone/metronome sliders |
| 15 | `15-toy-organ.txt` | 19 | **1**–**7** = the seven keys · R1 master pitch |
| 16 | `16-gated-oscillator.txt` | 20 | **G** = gate on/off · R1 tone slider |
| 17 | `17-chirp-generator.txt` | 21 | R1 chirp rate, C3 chirp length sliders |
| 18 | `18-stepped-tone-generator.txt` | 22 | R1, R3 sliders (the Atari Punk Console) |
| 19 | `19-3-state-tone-generator.txt` | 23 | **1** = S1 mode · R2 modulation-rate slider |
| 20 | `20-tone-burst-generator.txt` | 24 | **S** = S1 · C2 burst-length slider |
| 21 | `21-sound-effects-generator.txt` | 25 | R1 sweep, R7 pitch, R3 warble sliders |
| 22 | `22-led-flasher.txt` | 26 | R1 flash-rate slider · live LED |
| 23 | `23-power-fet-lamp-dimmer.txt` | 27 | R2 brightness slider · live lamp |
| 24 | `24-light-dark-detector.txt` | 28 | **L** = swap L/D · Light slider · R3 trip point |
| 25 | `25-infrared-security-alarm.txt` | 29 | **B** = break the beam · R5 alarm-delay slider |
| 26 | `26-analog-lightwave-transmitter.txt` | 30 | Light slider drives the pulse rate |
| 27 | `27-analog-lightwave-receiver.txt` | 31 | R9 calibrate slider · 0–1 mA meter |
| 28 | `28-dc-dc-converter.txt` | 32 | R1 switching-rate slider · ~230 V output |

Keyboard letters are the per-switch shortcuts stored in each file; they work as
soon as the circuit is loaded. Sliders appear in the right-hand panel.

## Each file reproduces its book page

Loading a circuit gives you the whole page, not just a runnable schematic:

* **Numbered 555 pins.** The chip is dumped with `f="14"`, so it labels its pins
  **1–8** exactly as Mims draws them, instead of CircuitJS's usual `dis`/`tr`/`th`.
* **Component designators.** Every part the book names carries its label — R1, R2,
  C1, Q1, D1, T1, M1 — drawn beside it, with the value alongside from *Show Values*.
  Parts that are only in this build (bleed resistors, base resistors, the speaker
  load) are deliberately left unlabelled, because Mims doesn't name them either.
* **The explanation**, under the schematic, carrying the same technical content as
  the page's prose.
* **The formulas**, in yellow — `t = 1.1 × R1 × C1`, `f = 1.44 / ((R1 + 2R2)C1)`
  and so on, for the pages that print them.
* **The data tables**, to the right of the schematic, reproduced entry for entry:
  the pulse generator's 13-row × 3-column frequency table, the audio oscillator's
  two R1/frequency tables, the toy organ's 15 capacitor/note pairs, the relay
  timer's typical delays, the LED flasher's rates, and the rest.
* **The graphs.** CircuitJS can't draw Mims' log-log plots, so where a page has one
  it is described in blue — axes, ranges and what the traces do — next to the
  formula that generates it, plus a table of representative values where that
  reads better than prose.
* **Scopes** matching the page's waveform diagram, usually pin 3 and the charge on
  the timing capacitor, labelled the way the book labels its traces.

## Conventions

* **Layout** — supply column at the far left, +V rail across the top, ground rail
  along the bottom, the 555 in the middle, output and load to the right. Page text
  sits below the schematic; tables sit to the right of it.
* **Every element is axis-aligned** — no diagonal runs anywhere, and no two
  components share a lane. The one deliberate exception is the potentiometer:
  CircuitJS derives the wiper position from the minor-axis delta in its `x`
  attribute, so `pt x="176 96 208 400"` draws a vertical track with the wiper
  offset 32 px to the side. Removing that offset would break the part.
* Scope probes get their own vertical lane, jogging horizontally at the node's
  own y first where the lane below it is occupied.
* **Component values** are the book's, except where noted below.
* **Speakers** are an 8 Ω resistor plus an Audio Output tap, so the tone circuits
  can actually be heard.

## Fidelity to the drawings

**All 28 circuits have been rebuilt connection-by-connection** against 3× zoomed
crops of the page scans, using a netlist extractor that collapses wires into nodes
so each file can be diffed against the drawing rather than eyeballed.

Corrections that pass found, among others:

* **06 cascaded timer** — R2 22K is the pin-6 pull-up (not R5 1M); C2 .005 µF and
  R5 1M run to the TRIGGER IN terminal; control caps are .05 µF on pins 3 and 11.
* **07 intervalometer** — pins 5 and 8 are wired **directly**; R3 100K is timer 2's
  timing resistor, not a pull-up.
* **11 VCO** — the speaker runs from **+V through R1 to pin 3**, not to ground.
* **15 toy organ** — each key comes **first**, then its capacitor to ground.
* **16 gated oscillator** — pins 8 and 4 go straight to the rail; Q1 switches only
  the feed to R1, which removes the node-keeper resistor entirely.
* **18 stepped-tone** — pins 5→8 direct; output is C3 → R4 → speaker → **+V**.
* **20 tone burst** — S1 feeds pin 4 directly with R3 between pin 4 and C2/R4;
  Q1 is an emitter follower with R6 in the collector, speaker in the emitter.
* **21 sound effects** — speaker from **+9 V** through R4 down to pin 3.
* **22 LED flasher** — Q1 **shunts** the LED; both hang off R4.
* **26 lightwave transmitter** — the LED runs from **+9 V through R3 down to pin 3**,
  not from pin 3 to ground.
* **28 DC-DC converter** — pin 3 drives the 6.3 V winding to ground; the 120 V
  winding feeds D1, with C2 and R3 in parallel across the output.
* **02, 12, 14, 15, 16, 22, 26** — no capacitor on pin 5, because those pages
  don't draw one.
* Pull-ups, coupling capacitors and base resistors that were never on the page have
  been removed throughout; where a source needed an output impedance to keep the
  solver stable, that now lives in the source's own `ir` parameter rather than as a
  resistor on the schematic.

### Where the scan will not resolve the wiring

The PDF holds one 1206×944 image per two-page spread — about 600 px per page — and
two details do not resolve even at 7×. Both are marked on the canvas:

| Circuit | What is unclear | What was built |
|---|---|---|
| 17 chirp generator | Q1's E/C labelling | the discharge switch across C3 that the page's text describes |
| 24 light / dark detector | the exact wiring of S1(a) and S1(b) | the rail swap that produces the L and D behaviour the page describes |
| 25 infrared security alarm | the phototransistor / Q2 stage | the missing-pulse detector the page's text describes, with switch BEAM in the optical path |

A higher-resolution scan would settle both.

### Substitutions forced by missing CircuitJS elements

| Book | Here | Reason |
|------|------|--------|
| 556 dual timer (06, 07, 17, 18, 19) | Two 555s | No 556 element. The halves are wired exactly as the 556 pinout connects them. |
| Piezo buzzer (09, 17) | 1 kΩ load, labelled | No self-oscillating buzzer element. |
| Piezo element (14) | 4.7 kΩ load, labelled | As above. |
| Phototransistor (25, 27) | switch / pulse source | No phototransistor element. |
| 1458 dual op amp (27) | two ideal op amps | No 1458 model; the gain-setting resistors are the book's. |
| Neon-lamp flasher (28) | omitted | No neon lamp element. |
| Floating secondary (28) | one end tied to ground | The page leaves the 120 V winding floating; the solver needs a reference. Marked on the canvas. |
| Scope probes (all) | added | The book draws output arrows; CircuitJS needs an element to hang a scope on. Probes are high-impedance and change nothing electrically. |

## Notes for anyone authoring more of these

Three things cost real debugging time and are worth writing down:

* **The 555 needs `f="6"` at minimum.** `TimerElm.getPostCount()` returns 6 posts unless
  flag 2 (reset pin) or flag 4 (ground pin) is set — `getDefaultFlags()` is 6.
  With `f="0"` the chip still simulates, but pins 4 and 1 do not exist and any
  wire you run to them dangles, so RESET silently does nothing. These files use
  `f="14"` — the same two bits plus bit 8, which labels the pins **1–8** as Mims
  draws them rather than `dis`/`tr`/`th`.
* **An SPDT's throws are both offset.** `Switch2Elm` puts throw 0 at
  `point2 + perp·16` and throw 1 at `point2 − perp·16`. Neither is at `point2`.
  Wiring to `point2` connects to nothing at all.
* **One `key` per linked switch group.** A keypress toggles *every* switch carrying that
  key, and `Switch2Elm.toggle()` then assigns its new position to everything in its `li`
  group. Two linked switches sharing one key therefore toggle each other back and the key
  does nothing whatsoever — silently. Circuit 24 shipped this way and was fixed by
  dropping `key="l"` from the second pole; `li="1"` alone still gangs them.

Pin geometry for the 555, with the element origin at `(x, y)` and default size:

| Pin | Name | Post |
|-----|------|------|
| 7 | discharge | `(x, y+32)` |
| 2 | trigger | `(x, y+96)` |
| 6 | threshold | `(x, y+128)` |
| 8 | Vcc | `(x+64, y−32)` |
| 5 | control | `(x+64, y+160)` |
| 1 | ground | `(x+96, y+160)` |
| 4 | reset | `(x+128, y+32)` |
| 3 | output | `(x+128, y+64)` |

See `../FALSTAD-FORMAT-REFERENCE.md` for the full file-format reference.
