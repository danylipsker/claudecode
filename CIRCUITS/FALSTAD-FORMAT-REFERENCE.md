# CircuitJS1 (falstad.com/circuit) — Authoring Reference

Verified against **CircuitJS1 v4.1.4** source (`github.com/pfalstad/circuitjs1`, HEAD 2026-08-02)
and against the **live deployed app** at https://www.falstad.com/circuit/circuitjs.html.

## 1. Two file formats

`CircuitLoader.readCircuit()` branches on the first character:

| Format | Detection | Status |
|---|---|---|
| **XML** | text starts with `<` | Current. What the app exports today. **Use this.** |
| **Legacy text** | anything else | Still imported for backward compat. Cannot store switch key shortcuts. |

**Author in XML.** The legacy `s` (switch) text dump has no field for `keyShortcut`, so
keyboard-operated switches only survive in XML.

## 2. Root element

```xml
<cir f="1" ts="0.000005" ic="10.2" cb="50" pb="43" vr="5" mts="5e-11"> ... </cir>
```

| Attr | Meaning |
|---|---|
| `f` | display flags: 1=show current dots, 2=small grid, 4=**hide** voltage colors, 8=show power, 16=**hide** values, 64=adaptive timestep, 128=auto-DC-on-reset |
| `ts` | max timestep (s) |
| `ic` | sim speed (`getIterCount()`) |
| `cb` / `pb` | current-dot-speed / power-brightness slider positions (0-100) |
| `vr` | voltage range for coloring |
| `mts` | min timestep |
| `st` | solver type (omit for auto) |

Children, in order: elements -> `<o>` scopes -> `<adj>` sliders -> `<h>` hint.
**Element order defines element indices** (0-based) used by `<o en=...>`, `<p e=...>`, `<adj e=...>`.

## 3. Element tag naming rule

`CircuitElm.getXmlDumpType()`:
- dump code in range 65-126 -> the **character itself** (`r`, `c`, `l`, `v`, `w`, `g`, `s`, `t`, `d`, `a`, `p`, `x`, `i`, `f`, `j`, `m`, `z`, `O`, `R`, `T`, `L`, `M`, `I`, `S`, `A`, `b`)
- otherwise -> **class name minus `Elm`** (`Ammeter`, `Lamp`, `Relay`, `Timer`, `SevenSeg`...)
- unless the class **overrides** it (see table below).

Every element carries `x="x1 y1 x2 y2"` and `f="flags"`.

### Overridden tags
`pt`=Pot · `ln`=LabeledNode · `rl`=Relay · `ssd`=SevenSeg · `ctr`=Counter · `ctr2`=Counter2 ·
`mux`=Multiplexer · `dmux`=DeMultiplexer · `dd`=DecimalDisplay · `as`/`as2`=AnalogSwitch ·
`ain`=AudioInput · `aout`=AudioOutput · `cr`=Crystal · `cc`=CustomComposite · `cl`=CustomLogic ·
`dpdt`=DPDTSwitch · `dar`=Darlington · `pc`=PolarCapacitor · `sw`=Sweep · `tl`=TransLine ·
`tt`=TappedTransformer · `ts`=TriState · `bs`=BusSplitter · `bli`=BusLogicInput · `rw`=RoutedWire ·
`nor`=NortonAmp · `ins`=InstructionDisplay · gates -> `And`, `Nand`, `Or`, `Nor`, `Xor`, `Xnor`

### Common element attributes
| Tag | Attributes |
|---|---|
| `r` resistor | `r` |
| `c` capacitor | `c`, `iv` (initial V), `sr` (series R), `vd` (state) |
| `l` inductor | `l`, `ic` (initial I), `isat`, `i` (state) |
| `v` voltage source | `wf`, `fr` (Hz), `maxv`, `bias`, `phaseShift`, `dutyCycle`, `riseTime`, `ir` (internal R) |
| `w` wire, `g` ground | `g` also takes `sy` (symbol type) |
| `s` switch | `p` (0=closed,1=open), `mm` (momentary), `lab`, **`key`**, `r` |
| `S` SPDT switch | + `li` (link), `th` (throw count) — **throw posts are not at `point2`, see 4.3** |
| `Timer` 555 | **must be `f="6"`** (reset + ground pins), see 4.2 |
| `pt` potentiometer | `ma` (max R), `po` (0..1 position), `sl` (slider label), `li` (link) |
| `d` diode / `z` zener | `mo` (model name) |
| `t` transistor | `pn`, `be` (beta), `mo`, `vbe`, `vbc` |
| `f` mosfet | `mo`; **flag bit 0 (`FLAG_PNP`) = P-channel** — N and P both dump as `f` (type 102) |
| `a` opamp | `ma`, `mi`, `ga` |
| `p` voltmeter | `me` (mode), `sc` (scale), `re` |
| `Ammeter` | `me`, `sc` |
| `ln` labeled node | `te` |
| `x` text | `te`, `si` (size), `co` (color) |
| `O` output / `i` current src | `sc` / `cu`,`mv` |
| `LED` | `cr`,`cg`,`cb`, `mbc` |

**Waveforms (`wf`)**: 0=DC, 1=AC, 2=square, 3=triangle, 4=sawtooth, 5=pulse, 6=noise, 7=variable.

## 4. Element geometry (non-obvious)

### 4.1 Potentiometer

`PotElm.setPoints()`: the track runs `point1 -> point2` **snapped to the dominant axis**;
the wiper post is offset perpendicular by the *minor* axis delta.

```xml
<pt x="592 128 624 288" ma="10000" po="0.5" sl="Load Pot"/>
```
-> vertical track (592,128)->(592,288); `dx=32` becomes the wiper offset -> wiper post at **(624,208)**.
If the minor delta is 0 the offset defaults to one grid unit (16 px).
A pot creates **its own labelled slider** in the right-hand panel — no `<adj>` needed.

### 4.2 555 timer (`Timer`) — must be dumped with `f="6"`

`TimerElm.getDefaultFlags()` returns **6** = `2` (reset pin present) | `4` (ground pin
present), and the post count is:

```
getPostCount() = (flags & 4) ? 8 : ((flags & 2) || (flags & 4)) ? 7 : 6
```

With `f="0"` the chip **still simulates** — it falls back to the global ground node and
`startIteration()` skips the reset test altogether — but posts 6 (`rst`) and 7 (`gnd`)
never get positions, so any wire you run to them dangles and RESET silently does
nothing. Symptom: a gated or reset-controlled oscillator that refuses to gate, with no
error anywhere.

Pin posts for element origin `(x, y)` at default size (`sizeX=3, sizeY=5, cspc2=32`):

| Pin | Name | Side | Post |
|---|---|---|---|
| 7 | `dis` discharge | left | `(x, y+32)` |
| 2 | `tr` trigger | left | `(x, y+96)` |
| 6 | `th` threshold | left | `(x, y+128)` |
| 8 | `Vcc` | top | `(x+64, y-32)` |
| 5 | `ctl` control | bottom | `(x+64, y+160)` |
| 1 | `gnd` | bottom | `(x+96, y+160)` |
| 4 | `rst` reset | right | `(x+128, y+32)` |
| 3 | `out` output | right | `(x+128, y+64)` |

Body rectangle runs `(x+16, y-16)` to `(x+112, y+144)`. Reset is active low, asserted
when `V(rst) < 0.7 V` above the chip's own ground pin — a low threshold worth
remembering when a divider drives it.

The same rule governs every `ChipElm`: posts come from `setupPins()` as
`Pin(pos, side, name)` with side **0=top, 1=bottom, 2=left, 3=right**, positions
advancing by `cspc2` (32 px at default size). Pins beyond `getPostCount()` are
allocated but never placed.

### 4.3 SPDT (`S` / `Switch2Elm`) — neither throw sits at `point2`

`swposts[i] = interpPoint(point1, point2, 1, hs)` with `hs = +16` for throw 0 and
`hs = -16` for throw 1, offset along the perpendicular `(dy, -dx)/|d|`. So for a switch
drawn `(208,208) -> (272,208)`:

| Post | Coordinate |
|---|---|
| common | `(208, 208)` = `point1` |
| throw 0 (`p="0"`) | `(272, 192)` |
| throw 1 (`p="1"`) | `(272, 224)` |

**`point2` itself — `(272, 208)` — is not a post.** A wire ending there connects to
nothing; the branch just goes open with no error and no dropped element. Verified on
the deployed `circuitjs109a` build by sweeping candidate coordinates and reading back
node voltages.

`li="n"` links every switch sharing the same non-zero `n` so they throw together (use
this for multi-pole switches). `th` is the throw count; flag bit 0 together with
`th="2"` gives a centre-off third position.

### 4.4 Multi-terminal post geometry

Everything below offsets from `point2` (or `point1`) along the perpendicular unit
vector `u = (dy, -dx) / |d|` — the convention `CircuitElm.interpPoint` uses.
`dsign` is `sign(dy)`, or `sign(dx)` when the element is horizontal.

| Element | Posts, in `getPost` order |
|---|---|
| `t` BJT | 0 base = `point1` · 1 collector = `point2 + u*(16*dsign*pnp)` · 2 emitter = `point2 - u*(16*dsign*pnp)` |
| `f` MOSFET | 0 gate = `point1` · 1 source = `point2 - u*(16*dsign)` · 2 drain = `point2 + u*(16*dsign)` |
| `a` op amp | 0 in- and 1 in+ = `point1 ± u*16` · 2 out = `point2` (flag bit 1 swaps the inputs) |
| `T` transformer | 0 pri top = `point1` · 1 sec top = `point2` · 2 pri bottom · 3 sec bottom, both offset by `wi` (default 32) |
| `S` SPDT | see 4.3 |
| `pt` pot | see 4.1 |

Worked example — NPN drawn left to right from `(240,240)` to `(304,240)`:
`u = (0,-1)`, `pnp = 1`, `dsign = 1`, so the **collector `(304,224)` sits above the
emitter `(304,256)`**, base at `(240,240)`. A PNP (`pn="-1"`) swaps those two.

Transformers are forced onto one axis: `setPoints` overwrites `point2.y` with
`point1.y`, or `point2.x` with `point1.x` when flag 8 is set.

### 4.5 Junctions, crossings and wire loops

Elements connect **only where posts share exact coordinates**. Two consequences:

* A wire crossing another wire mid-span does **not** connect. Crossings are free, and a
  schematic full of them is electrically fine.
* A T-junction must be built by **splitting** the through-wire into two segments meeting
  at the junction, so all three endpoints coincide. A stub ending on the middle of an
  unsplit wire connects to nothing, silently.

Overlapping collinear wires are a trap: two segments covering the same span but sharing
no endpoint stay electrically separate — confusing to read but harmless — while a wire
chain that doubles back on itself can stop the wire resolver converging and halt the sim
with `wire loop detected`. Build buses by sorting the tap coordinates and emitting one
segment between consecutive taps: every tap is then an endpoint, and no segment is ever
duplicated.

## 5. Scopes — the measurement instruments

```xml
<o en="4" sp="64" f="x420b" p="0">
  <p v="0" sc="5"/>
  <p v="3" sc="0.01"/>
</o>
```

`<o>`: `en`=element index the scope watches · `sp`=speed (timesteps/pixel, 64 typical) ·
`p`=scope slot position · `f`=flags (`x`+hex, or decimal) · `md`=manual divisions ·
`xy2x`/`xy2y`/`tp`=XY-plot options · `x`=custom title text.

`<p>` plot: `v`=quantity · `sc`=scale/div · `e`=element index if different from `en` ·
`f`=plot flags hex (1 = AC coupled) · `ms`/`mp`=manual scale/position.

### Plot quantity `v`
`0`=voltage · `3`=current · `7`=power · `8`=charge · `2`=resistance
(transistors: `1`=Ib, `2`=Ic, `3`=Ie, `4`=Vbe, `5`=Vbc, `6`=Vce)

### Scope flags (bitwise OR, dump as `x`+hex)
| Bit | Value | Meaning |
|---|---|---|
| 0 | 1 | show current |
| 1 | 2 | show voltage |
| 2 | 4 | **hide** peak value (inverted) |
| 3 | 8 | **show frequency** |
| 4 | 16 | manual scale |
| 6 | 64 | 2-D plot |
| 7 | 128 | X-Y plot |
| 8 | 256 | show min |
| 9 | 512 | show scale/gridlines |
| 10 | 1024 | FFT |
| 13 | 8192 | max scale |
| 14 | 16384 | show RMS |
| 15 | 32768 | show duty cycle |
| 16 | 65536 | log spectrum |
| 17 | 131072 | show average |
| 20 | 1048576 | show element info |
| 22 | 4194304 | show peak-to-peak |
| 23 | 8388608 | FFT phase angle |

Useful combo: `1|2|8|512|16384 = 16907 = x420b` -> V + I + frequency + scale + RMS.

A scope can also be placed **on the canvas** as an element: `<Scope ...>` (dump code 403).

## 6. Sliders — `<adj>`

```xml
<adj e="3" ei="0" en="Resistance (ohms)" mn="100" mx="10000" st="Series R" stp="0" log="0"/>
```
`e`=element index · `ei`=index into that element's `getEditInfo()` list · `en`=edit-item **name**
(preferred; survives reordering) · `mn`/`mx`=range · `st`=slider label shown in the right panel ·
`stp`=step (0 = continuous) · `ss`=share another slider · `log`=1 for log scale.

## 7. User controls

- **Keyboard shortcuts** work on `SwitchElm` and every subclass — SPST `s`, SPDT `S`,
  DPDT `dpdt`, cross switch, MBB switch, `L` logic input. Add `key="a"` (one lowercase char, 32-126).
  On key press -> `toggle()`. If `mm="true"` (momentary), key **up** releases it.
  A circuit's own shortcut takes priority over the built-in element-placement shortcut.
- **Never put the same `key` on two switches that are also `li`-linked — they cancel.**
  The dispatcher toggles *every* switch whose `key` matches, and `Switch2Elm.toggle()`
  then **assigns** its own new position to every switch sharing its `li` group. So with
  two linked switches both keyed `l`: the first toggles and pushes its position onto the
  second; the second then toggles *from that pushed value* and pushes the result back.
  Both land where they started and the key does **nothing at all** — no error, no visible
  clue. Put the key on **one** switch of a linked group and let `li` gang the rest.
  (Two switches sharing a key while *not* linked is fine — each toggles once. Ganging via
  matching `lab` is also safe: `SwitchElm.toggle()` skips itself when propagating.)
- **Sliders** (pots and `<adj>`) are **mouse/touch/scroll-wheel only** — `Scrollbar` is a
  canvas widget with no key handlers. There is no way to bind a key to a slider.
  Keyboard-driven stepped control must be built from keyed switches selecting fixed taps.
- **Right-click -> Edit** on any element opens its property dialog at runtime.
- Hovering any element shows live V / I / P in the lower-right info panel.

## 8. Meter modes

**Voltmeter `p` — `me`**: 0=voltage, 1=RMS, 2=max, 3=min, 4=peak-to-peak, 5=binary,
6=frequency, 7=period, 8=pulse width, 9=duty cycle, 10=average.

WARNING: **Modes 6 (frequency) and 7 (period) are dead in v4.1.4** — the `frequency` field is
never computed and the `TP_PER` display line is commented out. Both render blank / 0 Hz.
**Use a scope with flag bit 3 for frequency.** Modes 0-5, 8-10 all work.

**Ammeter — `me`**: 0=current, 1=RMS current. `sc`: 0=auto, 1=A, 2=mA, 3=uA.

Other instruments: `OhmMeter`(216), `Wattmeter`(420), `TestPoint`(368), `DecimalDisplay`(419),
`DataRecorder`(210), `StopTrigger`(408), `O` analog output, `M` logic output.

## 9. Delivery / verification workflow

Shareable link (LZString, verified round-trip):
```
https://www.falstad.com/circuit/circuitjs.html?ctz=<LZString.compressToEncodedURIComponent(dump)>
https://www.falstad.com/circuit/circuitjs.html?cct=<url-encoded plain dump>
```

The deployed page exposes a JS API on `window.CircuitJS1` — use it to **verify** a generated circuit:

```js
CircuitJS1.importCircuit(xml);           // load
CircuitJS1.setSimRunning(true);
CircuitJS1.getElements()[3].getInfo();   // ["resistor","I = 2.02 mA","Vd = 2.02 V","R = 1 kOhm",...]
CircuitJS1.getNodeVoltage("VOUT");       // read a <ln> labeled node
CircuitJS1.exportCircuit();              // round-trip check
```
Also: `getTime`, `getTimeStep`/`setTimeStep`, `getMaxTimeStep`/`setMaxTimeStep`, `isRunning`,
`setExtVoltage`, `getCircuitAsSVG`.

**Always import-and-read-back before delivering** — parse errors are silent (the element is
just skipped, logging `unrecognized dump type` to the console).


### 9.1 A verification loop that actually works

Four traps, each of which fails quietly rather than loudly:

**Read back asynchronously.** `getNodeVoltage` and `getVoltageDiff` return whatever the
solver last produced. Called on the same tick as `importCircuit` they hand back values
from the *previous* circuit — a plausible wrong answer, not an error. Let at least one
animation frame run (hook `CircuitJS1.onupdate`, or wait ~200 ms) before believing
anything.

**Clear a halted sim before the next import.** When a circuit fails — singular matrix,
convergence, wire loop — the simulator stops, and the *next* circuit imported starts
stopped too, sitting at `t = 0`, so a healthy circuit looks broken. Before each test:

```js
iframe.contentWindow.app_0.stopMessage = null;
CircuitJS1.setSimRunning(false);
CircuitJS1.setSimRunning(true);
```

**Read the actual error.** The halt reason lives on the app object, not the console:

```js
iframe.contentWindow.app_0.stopMessage   // "Singular matrix!", "wire loop detected", ...
iframe.contentWindow.app_0.stopElm       // the element blamed, where there is one
```

The GWT build keeps readable names, so `app_0`, `sim_0` and the raw element list
(`app_0.elmList.arrayList.array`) are all reachable from the host page.

**Count elements; do not trust the load.** An unrecognised tag is skipped with no error
and no visible gap. Compare the element lines in your file against
`CircuitJS1.getElements().length` — they must match exactly. `<o>`, its `<p>` plot rows,
`<adj>` and `<rlm>` are *not* elements and must be excluded from that count; element
indices used by `<o en=...>` and `<adj e=...>` skip them too.

**`getType()` does not report polarity.** A PNP dumped as `<t pn="-1">` still reports
`NTransistorElm`; only `getInfo()[0]` says `transistor (PNP)`. Never use `getType()` to
confirm a part loaded the way you meant.

**Bulk verification: mirror the app.** A page served from `falstad.com` is HTTPS, and
the browser blocks its `fetch` to `http://localhost`, so a local circuit library is
unreachable from the live app. Copy `circuitjs.html`, `lz-string.min.js` and the
`circuitjs109a/` directory onto a local static server and the app and the circuits share
one origin, so the whole set can be driven from a single script.

**Failure modes seen in practice**

| Symptom | Cause |
|---|---|
| `Singular matrix!` | a transistor base driven straight from a stiff source — add a series base resistor |
| `wire loop detected` | a duplicated or doubled-back wire segment in a bus |
| Runs fine, but one pin does nothing | a wire ending on a coordinate that is not a post (4.2, 4.3, 4.5) |
| Element count short | unrecognised tag — e.g. `PTransistor` or `PMosfet`, neither of which exists |

## 10. Component quirks

* **Photoresistor (`LDR`)** spans roughly **5.9 kΩ** at `ps="0.95"` down to **98 kΩ** at
  `ps="0.02"` — about 16:1, where a real cadmium-sulphide cell covers several orders of
  magnitude. Dividers copied from paper designs often fail to cross their threshold;
  expect to retune the fixed resistor, or put it on an `<adj>` slider.
* **The 555's reset threshold is 0.7 V** above its ground pin — very low. A sensor
  divider on a 9 V rail has to get genuinely close to ground before the chip mutes.
* **`<rlm>` relay model blocks** are definitions, not elements: they take a line in the
  file but never appear in `getElements()` and never consume an element index.
* **Open switches leave the matrix.** `SwitchElm` stamps nothing at all when open rather
  than a large resistance, so anything reachable only through it becomes undriven. A
  high-value bleed resistor across the switch keeps such nodes defined.
* **There is no 556, no phototransistor, no piezo buzzer.** Two `Timer` elements, a
  switch or pulse source standing in for the optical path, and a resistive load are the
  usual substitutions.

## 11. URL parameters

Read out of the deployed build; booleans accept `true` or `1`.

| Parameter | Effect |
|---|---|
| `ctz=` | LZString-compressed circuit, as produced by *Export As Link* |
| `cct=` | circuit text inline, URL-encoded |
| `startCircuit=` | name of a circuit file hosted alongside the app |
| `startCircuitLink=` | URL of a circuit file to fetch |
| `startLabel=` | name shown in the sidebar's "Current Circuit" |
| `running=` | `false` starts paused |
| `hideSidebar=` `hideMenu=` `hideInfoBox=` | drop those panels; the canvas takes the space |
| `editable=` | `false` for a read-only embed |
| `mouseMode=` | initial mouse mode |
| `whiteBackground=` `conventionalCurrent=` `mouseWheelEdit=` | display options |
| `euroResistors=` `usResistors=` `IECGates=` | symbol styles |
| `positiveColor=` `negativeColor=` `neutralColor=` `selectColor=` `currentColor=` | palette overrides |
| `lang=` | interface language |

The toolbar auto-hides unless the window is taller than 700 px *and* menu, sidebar and
editing are all enabled — worth knowing when an embed looks wrong.

## 12. Full dump-code table (for legacy text format and class lookup)

Char codes: `r`=Resistor `c`=Capacitor `l`=Inductor `v`=Voltage `w`=Wire `g`=Ground `s`=Switch
`S`=Switch2(SPDT) `t`=Transistor `d`=Diode `z`=Zener `f`=Mosfet `j`=Jfet `a`=OpAmp `p`=Probe
`x`=Text `i`=Current `m`=Memristor `n`=Noise `b`=Box `A`=Antenna `T`=Transformer `R`=Rail
`L`=LogicInput `M`=LogicOutput `I`=Inverter `O`=Output

Numeric codes: 150=And 151=Nand 152=Or 153=Nor 154=Xor 155=DFlipFlop 156=JKFlipFlop 157=SevenSeg
158=VCO 159=AnalogSwitch 160=AnalogSwitch2 161=PhaseComp 162=LED 163=RingCounter 164=Counter
165=Timer 166=DAC 167=ADC 168=Latch 169=TappedTransformer 170=Sweep 171=TransLine 172=VarRail
173=Triode 174=Pot 175=TunnelDiode 176=Varactor 177=SCR 178=Relay 179=CC2 180=TriState
181=Lamp 182=Schmitt 183=InvertingSchmitt 184=Multiplexer 185=DeMultiplexer 186=PisoShift
187=SparkGap 188=SeqGen 189=SipoShift 193=TFlipFlop 194=Monostable 195=HalfAdder 196=FullAdder
197=SevenSegDecoder 200=AM 201=FM 203=Diac 206=Triac 207=LabeledNode 208=CustomLogic
209=PolarCapacitor 210=DataRecorder 211=AudioOutput 212=VCVS 213=VCCS 214=CCVS 215=CCCS
216=OhmMeter 350=ThermistorNTC 368=TestPoint 370=Ammeter 374=LDR 400=Darlington 401=Comparator
402=OTA 403=Scope 404=Fuse 405=LEDArray 406=CustomTransformer 407=Optocoupler 408=StopTrigger
409=OpAmpReal 410=CustomComposite 411=AudioInput 412=Crystal 413=SRAM 414=TimeDelayRelay
415=DCMotor 416=MBBSwitch 417=Unijunction 418=ExtVoltage 419=DecimalDisplay 420=Wattmeter
421=Counter2 422=DelayBuffer 423=Line 424=DataInput 425=RelayCoil 426=RelayContact
427=ThreePhaseMotor 428=MotorProtectionSwitch 429=DPDTSwitch 430=CrossSwitch 431=Xnor
432=AnalogMux 433=BusSplitter 436=ROM
