"""Circuits 01-14, rebuilt connection-by-connection from the page scans.

Every net here was read off the zoomed scan of the page named in titled(), not
inferred.  Where the book shows an external input arrow it is driven by a source
whose internal resistance (ir) stands in for the generator's output impedance --
that keeps the solver happy without putting a resistor on the schematic that
Mims never drew.
"""

from lib import Cir, Timer, bjt_posts, fet_posts, spdt_posts
from common import VP_Y, GND_Y, SRC_X, Rail, frame, titled

BUILD = []


def circuit(fn):
    BUILD.append(fn)
    return fn


def chip_power(c, T, vr, gr, reset_x=None):
    """Pin 8 -> +V, pin 4 -> +V, pin 1 -> gnd.  Nothing else: pin 5 only gets a
    capacitor on the pages that actually draw one."""
    c.w(T.vcc, (T.vcc[0], vr.y));  vr.tap(T.vcc[0])
    c.w(T.gnd, (T.gnd[0], gr.y));  gr.tap(T.gnd[0])
    rx = reset_x if reset_x else T.rst[0] + 64
    c.w(T.rst, (rx, T.rst[1]))
    c.w((rx, T.rst[1]), (rx, vr.y));  vr.tap(rx)


def ctl_cap(c, T, gr, farads, ref="C2"):
    c.c(T.ctl, (T.ctl[0], gr.y), farads, ref=ref)
    gr.tap(T.ctl[0])


def strap_67(c, T, col):
    """Book monostable: pins 7 and 6 tied to the timing node in the left column.
    In CircuitJS the left-hand pin order is 7, 2, 6, so this run passes pin 2's
    lane -- exactly as Mims' own drawing crosses the trigger line."""
    c.w((col, T.dis[1]), T.dis)
    c.w((col, T.dis[1]), (col, T.th[1]))
    c.w((col, T.th[1]), T.th)


def strap_62(c, T, col):
    """Book astable: pins 6 and 2 strapped and taken to the timing column."""
    tie = T.th[0] - 32
    c.w((col, T.th[1]), (tie, T.th[1]))
    c.w((tie, T.th[1]), T.th)
    c.w(T.tr, (tie, T.tr[1]))
    c.w((tie, T.tr[1]), (tie, T.th[1]))


def vprobe(c, node, gr, lane=None):
    """A scope probe, always axis-aligned.  Drops straight down from the node it
    measures; given a separate lane it jogs horizontally just above the ground
    rail first, so no element is ever drawn on a diagonal."""
    if lane is None or lane == node[0]:
        p = c.probe(node, (node[0], gr.y))
        gr.tap(node[0])
        return p
    c.w(node, (lane, node[1]))
    p = c.probe((lane, node[1]), (lane, gr.y))
    gr.tap(lane)
    return p


def out_arrow(c, T, gr, x=640, label="OUT"):
    """Pin 3 taken out to a labelled terminal, with a scope probe across it.
    The probe is a simulator instrument, not a book part -- it is high impedance
    and changes nothing."""
    c.w(T.out, (x, T.out[1]))
    c.node((x, T.out[1]), (x, T.out[1] - 32), label)
    p = c.probe((x, T.out[1]), (x, gr.y))
    gr.tap(x)
    return p


# --------------------------------------------------------------- 01
@circuit
def c01():
    c = Cir("Basic Monostable", vr=9)
    T = Timer(400, 208)
    vr, gr = frame(c, 9, x1=704)
    titled(c, "BASIC MONOSTABLE CIRCUIT", 6)

    r1 = c.r((272, VP_Y), (272, T.dis[1]), 100000, ref="R1")
    strap_67(c, T, 272)
    c1 = c.pc((272, T.th[1]), (272, gr.y), 1e-5, ref="C1")
    vr.tap(272); gr.tap(272)

    # pin 2: TRIGGER PULSE IN -- idles at Vcc, dips low, as the book draws it
    c.w(T.tr, (192, T.tr[1]))
    c.add('<v x="192 %d 192 %d" f="0" wf="2" fr="0.7" maxv="4.5" bias="4.5" '
          'dutyCycle="0.93" ir="100"/>' % (gr.y, T.tr[1]))
    c.text((104, T.tr[1] - 26), "TRIGGER PULSE IN", 12, "#e0e0a0")
    gr.tap(192)

    c.add(T.xml())
    chip_power(c, T, vr, gr)
    ctl_cap(c, T, gr, 1e-8)
    p = out_arrow(c, T, gr, label="MONOSTABLE PULSE OUT")
    c.scope(p, 0, ((0, 2),), label="pin 3 out")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    c.slider(r1, "Resistance (ohms)", 10000, 1000000, "R1")
    vr.build(); gr.build()
    return "01-basic-monostable", c


# --------------------------------------------------------------- 02
@circuit
def c02():
    c = Cir("Basic Astable", vr=9)
    T = Timer(400, 208)
    vr, gr = frame(c, 9, x1=704)
    titled(c, "BASIC ASTABLE CIRCUIT", 7)

    r1 = c.r((272, VP_Y), (272, T.dis[1]), 10000, ref="R1")
    c.w((272, T.dis[1]), T.dis)
    r2 = c.r((272, T.dis[1]), (272, T.th[1]), 100000, ref="R2")
    strap_62(c, T, 272)
    c1 = c.pc((272, T.th[1]), (272, gr.y), 1e-6, ref="C1")
    vr.tap(272); gr.tap(272)

    c.add(T.xml())
    chip_power(c, T, vr, gr)          # p.7 draws no capacitor on pin 5
    p = out_arrow(c, T, gr)
    c.scope(p, 0, ((0, 2),), label="output pulses")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    c.slider(r1, "Resistance (ohms)", 1000, 100000, "R1")
    c.slider(r2, "Resistance (ohms)", 1000, 1000000, "R2")
    vr.build(); gr.build()
    return "02-basic-astable", c


# --------------------------------------------------------------- 03
@circuit
def c03():
    c = Cir("Bouncefree Switch", vr=9)
    T = Timer(400, 208)
    vr, gr = frame(c, 9, x1=704)
    titled(c, "BOUNCEFREE SWITCH", 8)

    c.r((272, VP_Y), (272, T.dis[1]), 100000, ref="R1")
    strap_67(c, T, 272)
    c1 = c.pc((272, T.th[1]), (272, gr.y), 1e-7, ref="C1")
    vr.tap(272); gr.tap(272)

    # R2 and S1 are both on the page: pull-up to +V, button to ground
    c.w(T.tr, (192, T.tr[1]))
    c.r((192, VP_Y), (192, T.tr[1]), 100000, ref="R2")
    c.sw((192, T.tr[1]), (192, gr.y), key="s", momentary=True, label="S1")
    vr.tap(192); gr.tap(192)

    c.add(T.xml())
    chip_power(c, T, vr, gr)
    ctl_cap(c, T, gr, 1e-8)
    p = out_arrow(c, T, gr, label="OUTPUT PULSE")
    c.scope(p, 0, ((0, 2),), label="output pulse")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    c.slider(c1, "Capacitance (F)", 1e-8, 1e-5, "C1 delay", log=True)
    vr.build(); gr.build()
    return "03-bouncefree-switch", c


# --------------------------------------------------------------- 04
@circuit
def c04():
    c = Cir("Touch-Activated Switch", vr=9)
    T = Timer(400, 208)
    vr, gr = frame(c, 9, x1=704)
    titled(c, "TOUCH-ACTIVATED SWITCH", 8)

    c.r((272, VP_Y), (272, T.dis[1]), 100000, ref="R1")
    strap_67(c, T, 272)
    c1 = c.pc((272, T.th[1]), (272, gr.y), 1e-6, ref="C1")
    vr.tap(272); gr.tap(272)

    # Two touch plates on pin 2.  Mims draws no pull-up -- a real pin 2 floats
    # near Vcc on leakage.  The solver needs the node defined, so a 10M stands
    # in for that leakage; it is the one part here that is not on the page.
    c.w(T.tr, (192, T.tr[1]))
    c.r((192, VP_Y), (192, T.tr[1]), 1e7)
    c.text((88, T.tr[1] - 46), "10M = pin 2 leakage\\n(not on the page)", 11, "#c08080")
    c.r((192, T.tr[1]), (192, 448), 47000, ref="R3")
    c.text((104, 424), "SKIN RESISTANCE", 11, "#e0e0a0")
    c.sw((192, 448), (192, gr.y), key="t", momentary=True, label="TOUCH PLATES")
    vr.tap(192); gr.tap(192)

    c.add(T.xml())
    chip_power(c, T, vr, gr)
    ctl_cap(c, T, gr, 1e-8)
    p = out_arrow(c, T, gr, label="OUTPUT PULSE")
    c.scope(p, 0, ((0, 2),), label="output pulse")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    vr.build(); gr.build()
    return "04-touch-activated-switch", c


# --------------------------------------------------------------- 05
@circuit
def c05():
    c = Cir("Timer Plus Relay", vr=12, ic=60)
    T = Timer(400, 208)
    vr, gr = frame(c, 12, x1=896)
    titled(c, "TIMER PLUS RELAY", 9)
    c.relay_model("mims-relay", coil_r=250, pull_in=0.02, drop_out=0.012)

    r1 = c.r((272, VP_Y), (272, T.dis[1]), 1000000, ref="R1")
    strap_67(c, T, 272)
    c1 = c.pc((272, T.th[1]), (272, gr.y), 1e-5, ref="C1")
    vr.tap(272); gr.tap(272)

    c.w(T.tr, (192, T.tr[1]))
    c.r((192, VP_Y), (192, T.tr[1]), 10000, ref="R2")
    c.sw((192, T.tr[1]), (192, gr.y), key="s", momentary=True, label="S1")
    vr.tap(192); gr.tap(192)

    c.add(T.xml())
    chip_power(c, T, vr, gr)
    ctl_cap(c, T, gr, 1e-8)

    # pin 3 -> D1 -> coil -> gnd, D2 across the coil, contacts left open
    c.w(T.out, (624, T.out[1]))
    c.diode((624, T.out[1]), (688, T.out[1]), ref="D1")
    c.w((688, T.out[1]), (752, T.out[1]))
    c.relay((752, T.out[1]), (752, 448))
    c.w((752, 448), (752, gr.y)); gr.tap(752)
    c.diode((688, 448), (688, T.out[1]), ref="D2")
    c.w((688, 448), (752, 448))
    c.text((792, 470), "RELAY\\n5 to 9 V\\n250 to 500 ohms", 12, "#c8c8c8")
    c.text((792, 200), "contacts to\\nexternal terminals\\n(open, as drawn)", 11, "#9fb8c8")

    p = vprobe(c, T.out, gr)
    c.scope(p, 0, ((0, 4),), label="pin 3 out")
    c.scope(c1, 1, ((0, 4),), label="charge on C1")
    c.slider(r1, "Resistance (ohms)", 100000, 2000000, "R1 delay")
    vr.build(); gr.build()
    return "05-timer-plus-relay", c


# --------------------------------------------------------------- 06
@circuit
def c06():
    """556 drawn as two 555s.  Pin map: 1=DIS1 2=THR1 3=CTL1 4=RST1 5=OUT1
    6=TRIG1 7=GND 8=TRIG2 9=OUT2 10=RST2 11=CTL2 12=THR2 13=DIS2 14=Vcc."""
    c = Cir("Cascaded Timer", vr=9, ic=60)
    A = Timer(352, 208)
    B = Timer(816, 208)
    vr, gr = frame(c, 9, x1=1152)
    titled(c, "CASCADED TIMER  (556)", 10)

    # --- timer 1 one-shot: R1 to pins 1/2, C1 to ground
    r1 = c.r((272, VP_Y), (272, A.dis[1]), 1000000, ref="R1")
    strap_67(c, A, 272)
    c.pc((272, A.th[1]), (272, gr.y), 1e-5, ref="C1")
    vr.tap(272); gr.tap(272)

    # --- pin 6 (TRIG1): R2 22K pull-up, R5 1M and C2 .005 down to TRIGGER IN
    c.w(A.tr, (176, A.tr[1]))
    c.r((176, VP_Y), (176, A.tr[1]), 22000, ref="R2")
    c.r((112, A.tr[1]), (112, 480), 1000000, ref="R5")
    c.w((112, A.tr[1]), (176, A.tr[1]))
    c.c((176, A.tr[1]), (176, 480), 5e-9, ref="C2")
    c.w((112, 480), (176, 480))
    c.sw((176, 480), (176, gr.y), key="t", momentary=True, label="TRIGGER IN")
    vr.tap(176); gr.tap(176)

    c.add(A.xml())
    chip_power(c, A, vr, gr, reset_x=576)
    ctl_cap(c, A, gr, 5e-8, ref="C4")        # pin 3 = CTL1

    # --- OUT1 (pin 5) to its terminal, and through C3 to TRIG2 (pin 8)
    c.w(A.out, (640, A.out[1]))
    c.node((640, A.out[1]), (640, A.out[1] - 32), "OUT 1")
    c.c((640, A.out[1]), (704, A.out[1]), 5e-8, ref="C3")
    c.r((704, VP_Y), (704, A.out[1]), 22000, ref="R3")
    c.w((704, A.out[1]), (704, B.tr[1]))
    c.w((704, B.tr[1]), B.tr)
    vr.tap(704)

    # --- timer 2 one-shot: R4 to pins 12/13, C6 to ground
    r4 = c.r((736, VP_Y), (736, B.dis[1]), 1000000, ref="R4")
    strap_67(c, B, 736)
    c.pc((736, B.th[1]), (736, gr.y), 1e-5, ref="C6")
    vr.tap(736); gr.tap(736)

    c.add(B.xml())
    chip_power(c, B, vr, gr, reset_x=1024)
    ctl_cap(c, B, gr, 5e-8, ref="C5")        # pin 11 = CTL2

    p1 = vprobe(c, A.out, gr)
    c.w(B.out, (1120, B.out[1]))
    c.node((1120, B.out[1]), (1120, B.out[1] - 32), "OUT 2")
    p2 = vprobe(c, (1120, B.out[1]), gr)
    c.scope(p1, 0, ((0, 2),), label="OUT 1")
    c.scope(p2, 1, ((0, 2),), label="OUT 2")
    c.slider(r1, "Resistance (ohms)", 100000, 2000000, "R1 delay 1")
    c.slider(r4, "Resistance (ohms)", 100000, 2000000, "R4 delay 2")
    vr.build(); gr.build()
    return "06-cascaded-timer", c


# --------------------------------------------------------------- 07
@circuit
def c07():
    c = Cir("Intervalometer", vr=12, ic=60)
    A = Timer(352, 208)
    B = Timer(816, 208)
    vr, gr = frame(c, 12, x1=1152)
    titled(c, "INTERVALOMETER  (556)", 11)
    c.relay_model("mims-relay", coil_r=250, pull_in=0.02, drop_out=0.012)

    # --- timer 1 astable: R1 to pin 1, R2 to pins 2/6, C1 to ground
    r1 = c.r((272, VP_Y), (272, A.dis[1]), 1000000, ref="R1")
    c.w((272, A.dis[1]), A.dis)
    c.r((272, A.dis[1]), (272, A.th[1]), 1000, ref="R2")
    strap_62(c, A, 272)
    c.pc((272, A.th[1]), (272, gr.y), 1e-4, ref="C1")
    vr.tap(272); gr.tap(272)

    c.add(A.xml())
    chip_power(c, A, vr, gr, reset_x=576)
    ctl_cap(c, A, gr, 5e-8, ref="C3")

    # --- pin 5 (OUT1) wired straight to pin 8 (TRIG2); no coupling capacitor
    c.w(A.out, (640, A.out[1]))
    c.w((640, A.out[1]), (640, 480))
    c.w((640, 480), (752, 480))
    c.w((752, 480), (752, B.tr[1]))
    c.w((752, B.tr[1]), B.tr)

    # --- timer 2 one-shot: R3 100K to pins 12/13, C2 22uF to ground
    r3 = c.r((736, VP_Y), (736, B.dis[1]), 100000, ref="R3")
    strap_67(c, B, 736)
    c.pc((736, B.th[1]), (736, gr.y), 2.2e-5, ref="C2")
    vr.tap(736); gr.tap(736)

    c.add(B.xml())
    chip_power(c, B, vr, gr, reset_x=1024)
    ctl_cap(c, B, gr, 5e-8, ref="C4")

    # --- OUT2 -> D1 -> coil -> gnd, D2 across the coil, contacts open
    c.w(B.out, (944, B.out[1]))
    c.diode((944, B.out[1]), (1008, B.out[1]), ref="D1")
    c.w((1008, B.out[1]), (1056, B.out[1]))
    c.relay((1056, B.out[1]), (1056, 448))
    c.w((1056, 448), (1056, gr.y)); gr.tap(1056)
    c.diode((1008, 448), (1008, B.out[1]), ref="D2")
    c.w((1008, 448), (1056, 448))
    c.text((1096, 470), "RELAY\\n5 to 9 V\\n250 to 500 ohms", 12, "#c8c8c8")

    p1 = vprobe(c, A.out, gr)
    c.scope(p1, 0, ((0, 4),), label="timer 1, pin 5")
    c.slider(r1, "Resistance (ohms)", 100000, 2000000, "R1 interval")
    c.slider(r3, "Resistance (ohms)", 10000, 500000, "R3 relay time")
    vr.build(); gr.build()
    return "07-intervalometer", c


# --------------------------------------------------------------- 08
@circuit
def c08():
    c = Cir("Missing Pulse Detector", vr=9, ic=200)
    T = Timer(432, 208)
    vr, gr = frame(c, 9, x1=768)
    titled(c, "MISSING PULSE DETECTOR", 12)

    # R2 and C1 set the delay; pins 7 and 6 strapped
    r2 = c.r((304, VP_Y), (304, T.dis[1]), 1000000, ref="R2")
    strap_67(c, T, 304)
    c1 = c.pc((304, T.th[1]), (304, gr.y), 1e-7, ref="C1")
    vr.tap(304); gr.tap(304)

    # Q1 2N3906 across C1: base on the input node, emitter on the timing node,
    # collector to ground -- exactly as p.12 draws it
    b, coll, emit = bjt_posts((208, 416), (272, 416), pnp=True)
    c.pnp((208, 416), (272, 416), ref="Q1")
    c.w(emit, (emit[0], T.th[1]))
    c.w((emit[0], T.th[1]), (304, T.th[1]))
    c.w(coll, (coll[0], gr.y)); gr.tap(coll[0])

    # R1 holds Q1 off; the same node is pin 2 and the IN terminal
    c.r((176, VP_Y), (176, 416), 4700, ref="R1")
    c.w((176, 416), (208, 416))
    vr.tap(176)
    c.w(T.tr, (208, T.tr[1]))
    c.w((208, T.tr[1]), (208, 416))
    c.add('<v x="128 %d 128 416" f="0" wf="2" fr="20" maxv="4.5" bias="4.5" '
          'dutyCycle="0.5" ir="1000"/>' % gr.y)
    c.w((128, 416), (176, 416))
    c.node((128, 416), (128, 384), "IN")
    gr.tap(128)

    c.add(T.xml())
    chip_power(c, T, vr, gr, reset_x=672)
    ctl_cap(c, T, gr, 1e-8)
    p = out_arrow(c, T, gr, x=720)
    c.scope(p, 0, ((0, 2),), label="OUT")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    c.slider(r2, "Resistance (ohms)", 100000, 4000000, "R2 window")
    vr.build(); gr.build()
    return "08-missing-pulse-detector", c


# --------------------------------------------------------------- 09
@circuit
def c09():
    c = Cir("Event Failure Alarm", vr=9, ic=60)
    T = Timer(432, 208)
    vr, gr = frame(c, 9, x1=768)
    titled(c, "EVENT FAILURE ALARM", 13)

    r2 = c.r((304, VP_Y), (304, T.dis[1]), 1000000, ref="R2")
    strap_67(c, T, 304)
    c1 = c.pc((304, T.th[1]), (304, gr.y), 4.7e-6, ref="C1")
    vr.tap(304); gr.tap(304)

    b, coll, emit = bjt_posts((208, 416), (272, 416), pnp=True)
    c.pnp((208, 416), (272, 416), ref="Q1")
    c.w(emit, (emit[0], T.th[1]))
    c.w((emit[0], T.th[1]), (304, T.th[1]))
    c.w(coll, (coll[0], gr.y)); gr.tap(coll[0])

    c.r((176, VP_Y), (176, 416), 4700, ref="R1")
    c.w((176, 416), (208, 416))
    vr.tap(176)
    c.w(T.tr, (208, T.tr[1]))
    c.w((208, T.tr[1]), (208, 416))
    c.sw((176, 416), (176, gr.y), key="s", momentary=True, label="S1")
    gr.tap(176)

    c.add(T.xml())
    chip_power(c, T, vr, gr, reset_x=672)
    ctl_cap(c, T, gr, 1e-8)

    # piezo buzzer: + to the rail, - to pin 3, so it sounds when pin 3 goes low
    c.w(T.out, (720, T.out[1]))
    c.r((720, T.out[1]), (720, 176), 1000)
    c.w((720, 176), (720, VP_Y)); vr.tap(720)
    c.text((744, 240), "PIEZO BUZZER\\n(a 1k load stands in --\\nCircuitJS has no buzzer)",
           11, "#c8c8c8")
    p = vprobe(c, (720, T.out[1]), gr)
    c.scope(p, 0, ((0, 2),), label="buzzer drive")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    c.slider(r2, "Resistance (ohms)", 100000, 4000000, "R2 deadline")
    vr.build(); gr.build()
    return "09-event-failure-alarm", c


# --------------------------------------------------------------- 10
@circuit
def c10():
    c = Cir("Frequency Divider", vr=9, ic=300)
    T = Timer(400, 208)
    vr, gr = frame(c, 9, x1=704)
    titled(c, "FREQUENCY DIVIDER", 14)

    r1 = c.r((272, VP_Y), (272, T.dis[1]), 1000000, ref="R1")
    strap_67(c, T, 272)
    c1 = c.c((272, T.th[1]), (272, gr.y), 1e-7, ref="C1")
    vr.tap(272); gr.tap(272)

    # pin 2 is driven straight from the pulse train -- no coupling cap, no pull-up
    c.w(T.tr, (176, T.tr[1]))
    c.add('<v x="176 %d 176 %d" f="0" wf="2" fr="30" maxv="4.5" bias="4.5" '
          'dutyCycle="0.5" ir="1000"/>' % (gr.y, T.tr[1]))
    c.node((176, T.tr[1]), (176, T.tr[1] - 32), "IN")
    gr.tap(176)

    c.add(T.xml())
    chip_power(c, T, vr, gr)
    ctl_cap(c, T, gr, 4.7e-8)
    pin = vprobe(c, (176, T.tr[1]), gr, lane=112)
    p = out_arrow(c, T, gr)
    c.scope(pin, 0, ((0, 2),), label="IN")
    c.scope(p, 1, ((0, 2),), label="OUT")
    c.slider(r1, "Resistance (ohms)", 10000, 2000000, "R1 divide ratio")
    vr.build(); gr.build()
    return "10-frequency-divider", c


# --------------------------------------------------------------- 11
@circuit
def c11():
    c = Cir("Voltage-Controlled Oscillator", vr=9, ic=400)
    T = Timer(496, 208)
    vr, gr = frame(c, 9, x1=832)
    titled(c, "VOLTAGE-CONTROLLED OSCILLATOR", 15)

    # CircuitJS puts pins 7, 2 and 6 on the chip's left face, so the timing
    # network sits on the left here where Mims draws it on the right.  Same
    # parts, same connections, mirrored placement.
    r2 = c.r((400, VP_Y), (400, T.dis[1]), 100000, ref="R2")
    c.w((400, T.dis[1]), T.dis)
    c.r((400, T.dis[1]), (400, T.th[1]), 1000, ref="R3")
    strap_62(c, T, 400)
    c1 = c.c((400, T.th[1]), (400, gr.y), 1e-8, ref="C1")
    vr.tap(400); gr.tap(400)

    c.add(T.xml())
    c.w(T.vcc, (T.vcc[0], vr.y)); vr.tap(T.vcc[0])
    c.w(T.gnd, (T.gnd[0], gr.y)); gr.tap(T.gnd[0])
    c.w(T.rst, (688, T.rst[1]))
    c.w((688, T.rst[1]), (688, vr.y)); vr.tap(688)

    # +V -> R1 220 -> 8 ohm speaker -> pin 3
    c.r((768, VP_Y), (768, 176), 220, ref="R1")
    c.r((768, 176), (768, 240), 8)
    c.text((792, 200), "8 ohm SPKR", 12, "#c8c8c8")
    c.w((768, 240), (768, T.out[1]))
    c.w((768, T.out[1]), T.out)
    vr.tap(768)

    # 100K control pot, wiper up into pin 5
    c.pot((208, 432), (240, gr.y), 100000, 0.5, "Control Voltage")
    c.w((208, 432), (208, VP_Y)); vr.tap(208)
    gr.tap(208)
    c.w((240, 496), (T.ctl[0], 496))
    c.w((T.ctl[0], 496), T.ctl)
    c.text((96, 400), "INPUT (CONTROL) VOLTAGE", 11, "#e0e0a0")

    p = vprobe(c, T.out, gr)
    c.scope(p, 0, ((0, 2),), label="pin 3 / speaker")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    c.slider(r2, "Resistance (ohms)", 10000, 200000, "R2 pitch")
    vr.build(); gr.build()
    return "11-voltage-controlled-oscillator", c


# --------------------------------------------------------------- 12
@circuit
def c12():
    c = Cir("Pulse Generator", vr=9, ic=400)
    T = Timer(400, 208)
    vr, gr = frame(c, 9, x1=704)
    titled(c, "PULSE GENERATOR", 16)

    r1 = c.r((272, VP_Y), (272, T.dis[1]), 1000000, ref="R1")
    c.w((272, T.dis[1]), T.dis)
    c.r((272, T.dis[1]), (272, T.th[1]), 1000, ref="R2")
    strap_62(c, T, 272)
    c1 = c.c((272, T.th[1]), (272, gr.y), 1e-8, ref="C1")
    vr.tap(272); gr.tap(272)

    c.add(T.xml())
    chip_power(c, T, vr, gr)          # p.16 draws no capacitor on pin 5
    p = out_arrow(c, T, gr)
    c.scope(p, 0, ((0, 2),), label="pin 3 pulses")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    c.slider(r1, "Resistance (ohms)", 10000, 1000000, "R1", log=True)
    c.slider(c1, "Capacitance (F)", 2e-9, 1e-6, "C1", log=True)
    vr.build(); gr.build()
    return "12-pulse-generator", c


# --------------------------------------------------------------- 13
@circuit
def c13():
    c = Cir("Frequency Meter", vr=9, ic=400)
    T = Timer(560, 208)
    vr, gr = frame(c, 9, x1=1024)
    titled(c, "FREQUENCY METER", 17)

    # input: C1 into an R1/R2 divider that biases pin 2 at half rail
    c.add('<v x="128 %d 128 304" f="0" wf="2" fr="1000" maxv="1.75" bias="2.5" '
          'dutyCycle="0.5" ir="600"/>' % gr.y)
    c.node((128, 304), (128, 272), "IN")
    gr.tap(128)
    c.c((128, 304), (240, 304), 1e-8, ref="C1")
    c.w((240, 304), (240, T.tr[1]))
    c.w((240, T.tr[1]), T.tr)
    c.r((240, VP_Y), (240, T.tr[1]), 4700, ref="R1")
    c.r((240, T.tr[1]), (240, gr.y), 4700, ref="R2")
    vr.tap(240); gr.tap(240)

    # R3 and C3 set the one-shot width, hence the frequency range.  Left of the
    # chip, because pins 6 and 7 are on its left face.
    r3 = c.r((432, VP_Y), (432, T.dis[1]), 4700, ref="R3")
    c.w((432, T.dis[1]), T.dis)
    c.w((432, T.dis[1]), (432, T.th[1]))
    c.w((432, T.th[1]), T.th)
    c3 = c.c((432, T.th[1]), (432, gr.y), 1e-7, ref="C3")
    vr.tap(432); gr.tap(432)

    c.add(T.xml())
    c.w(T.vcc, (T.vcc[0], vr.y)); vr.tap(T.vcc[0])
    c.w(T.gnd, (T.gnd[0], gr.y)); gr.tap(T.gnd[0])
    c.w(T.rst, (752, T.rst[1]))
    c.w((752, T.rst[1]), (752, vr.y)); vr.tap(752)
    ctl_cap(c, T, gr, 1e-7)                       # C2 .1uF on pin 5

    # R4 pulls pin 3 up; R5 calibrates; R6 and M1 read the average
    c.w(T.out, (880, T.out[1]))
    c.r((880, VP_Y), (880, T.out[1]), 4700, ref="R4")
    vr.tap(880)
    r5 = c.r((880, T.out[1]), (880, 416), 10000, ref="R5")
    c.r((880, 416), (880, 480), 100, ref="R6")
    c.ammeter((880, 480), (880, gr.y), mode=1)
    gr.tap(880)
    c.text((904, 430), "R5 CALIBRATE METER", 11, "#e0e0a0")
    c.text((904, 500), "M1  0-1 mA", 12, "#c8c8c8")

    p = vprobe(c, T.out, gr)
    c.scope(p, 0, ((0, 2),), label="pin 3 pulses")
    c.slider(r3, "Resistance (ohms)", 2200, 10000, "R3 range")
    c.slider(r5, "Resistance (ohms)", 1000, 20000, "R5 calibrate")
    vr.build(); gr.build()
    return "13-frequency-meter", c


# --------------------------------------------------------------- 14
@circuit
def c14():
    c = Cir("Audio Oscillator / Metronome", vr=9, ic=400)
    T = Timer(400, 208)
    vr, gr = frame(c, 9, x1=896)
    titled(c, "AUDIO OSCILLATOR / METRONOME", 18)

    r1 = c.r((272, VP_Y), (272, T.dis[1]), 1000000, ref="R1")
    c.w((272, T.dis[1]), T.dis)
    c.r((272, T.dis[1]), (272, T.th[1]), 1000, ref="R2")
    strap_62(c, T, 272)
    c1 = c.c((272, T.th[1]), (272, gr.y), 1e-8, ref="C1")
    vr.tap(272); gr.tap(272)

    c.add(T.xml())
    chip_power(c, T, vr, gr)          # p.18 draws no capacitor on pin 5

    # pin 3 drives the piezo element (up to +9V) and the speaker leg (down)
    c.w(T.out, (640, T.out[1]))
    c.r((640, T.out[1]), (640, 176), 4700)
    c.w((640, 176), (640, VP_Y)); vr.tap(640)
    c.text((664, 150), "PIEZO ELEMENT  (black to pin 3, red to +9V)", 11, "#c8c8c8")

    c.r((640, T.out[1]), (720, T.out[1]), 100, ref="R3")
    c.r((720, T.out[1]), (720, 400), 8)
    c.text((744, 330), "8 ohm SPKR", 12, "#c8c8c8")
    c.pc((720, 400), (720, gr.y), 4.7e-6, ref="C2")
    gr.tap(720)

    p = vprobe(c, T.out, gr)
    c.scope(p, 0, ((0, 2),), label="pin 3 out")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    c.slider(r1, "Resistance (ohms)", 1000, 1000000, "R1 pitch", log=True)
    c.slider(c1, "Capacitance (F)", 1e-8, 1e-6, "C1 tone / metronome", log=True)
    vr.build(); gr.build()
    return "14-audio-oscillator-metronome", c
