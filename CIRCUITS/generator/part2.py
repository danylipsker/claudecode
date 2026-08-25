"""Circuits 15-28 from Mims' 555 Timer IC Circuits."""

from lib import Cir, Timer, bjt_posts, fet_posts, opamp_posts, spdt_posts
from common import VP_Y, GND_Y, SRC_X, Rail, frame, support, astable_timing, titled
from part1 import chip_power, ctl_cap, strap_67, strap_62, out_arrow, vprobe

BUILD = []


def circuit(fn):
    BUILD.append(fn)
    return fn


def xfmr_posts(a, width=32):
    """Horizontal transformer at a=(x,y), length 64: returns
    (pri_top, sec_top, pri_bot, sec_bot)."""
    x, y = a
    return (x, y), (x + 64, y), (x, y + width), (x + 64, y + width)


def speaker(c, gr, x, y_top, series_r=8, label="SPKR"):
    """8 ohm speaker load plus an Audio Output tap so it can be heard."""
    c.r((x, y_top), (x, y_top + 64), series_r)
    c.node((x, y_top + 32), (x + 64, y_top + 32), label)
    c.audio((x, y_top + 64))
    c.w((x, y_top + 64), (x, gr.y))
    gr.tap(x)


# --------------------------------------------------------------- 15
@circuit
def c15():
    c = Cir("Toy Organ", vr=9, ic=400)
    T = Timer(560, 208)
    vr, gr = frame(c, 9, x1=1024, gnd_y=720)
    titled(c, "TOY ORGAN", 19)

    r1 = c.r((432, VP_Y), (432, T.dis[1]), 100000, ref="R1")
    c.w((432, T.dis[1]), T.dis)
    c.r((432, T.dis[1]), (432, T.th[1]), 10000, ref="R2")
    strap_62(c, T, 432)
    vr.tap(432)

    # Seven keys.  On the page each key comes FIRST, then its capacitor to
    # ground: pins 2/6 -> Sn -> Cn -> gnd.
    notes = [(0.22e-6, "1"), (0.15e-6, "2"), (0.1e-6, "3"), (0.068e-6, "4"),
             (0.047e-6, "5"), (0.033e-6, "6"), (0.022e-6, "7")]
    bus_x, ret_x = 432, 208
    prev, prev_ret = (bus_x, T.th[1]), None
    for i, (cap, key) in enumerate(notes):
        y = 400 + i * 32
        c.w(prev, (bus_x, y))
        prev = (bus_x, y)
        c.sw((bus_x, y), (bus_x - 112, y), key=key, momentary=True, label="S" + key)
        c.c((bus_x - 112, y), (ret_x, y), cap, ref="C" + key)
        if prev_ret:                      # one return bus, segment per key
            c.w(prev_ret, (ret_x, y))
        prev_ret = (ret_x, y)
    c.w(prev_ret, (ret_x, gr.y))
    gr.tap(ret_x)

    c.add(T.xml())
    chip_power(c, T, vr, gr, reset_x=816)   # p.19 draws no capacitor on pin 5

    # pin 3 -> 8 ohm speaker -> C8 -> ground
    c.w(T.out, (880, T.out[1]))
    c.r((880, T.out[1]), (880, 336), 8)
    c.text((904, 290), "8 ohm SPKR", 12, "#c8c8c8")
    c.pc((880, 336), (880, gr.y), 4.7e-6, ref="C8")
    gr.tap(880)

    p = vprobe(c, T.out, gr)
    c.scope(p, 0, ((0, 2),), label="pin 3 out")
    c.slider(r1, "Resistance (ohms)", 10000, 500000, "R1 master pitch")
    vr.build(); gr.build()
    return "15-toy-organ", c


# --------------------------------------------------------------- 16
@circuit
def c16():
    c = Cir("Gated Oscillator", vr=9, ic=400)
    T = Timer(464, 240)
    vr, gr = frame(c, 9, x1=832)
    titled(c, "GATED OSCILLATOR", 20)

    # The logic gate drives Q1's gate.  Q1 switches only the feed to R1 --
    # pins 8 and 4 go straight to the rail, as p.20 draws them.
    # The post of a logic input sits at its FIRST coordinate, so the element is
    # drawn right-to-left to put that post against Q1's gate.  hi="9" because the
    # page powers the logic gate from the same rail as the 555: a 5 V default
    # cannot lift the source follower above the chip's 6 V threshold.
    c.add('<L x="240 176 176 176" f="0" key="g" hi="9"/>')
    c.text((104, 148), "ANY LOGIC GATE  (press G)", 11, "#e0e0a0")
    g, src, drn = fet_posts((272, 176), (336, 176))
    c.w((240, 176), (272, 176))
    c.nmos((272, 176), (336, 176), ref="Q1")
    c.w(drn, (drn[0], VP_Y)); vr.tap(drn[0])

    r1 = c.r((336, 208), (336, T.dis[1]), 1000000, ref="R1")
    c.w(src, (336, 208))
    c.w((336, T.dis[1]), T.dis)
    c.r((336, T.dis[1]), (336, T.th[1]), 1000, ref="R2")
    strap_62(c, T, 336)
    c1 = c.c((336, T.th[1]), (336, gr.y), 1e-8, ref="C1")
    gr.tap(336)

    c.add(T.xml())
    chip_power(c, T, vr, gr, reset_x=720)   # p.20 draws no capacitor on pin 5

    c.w(T.out, (784, T.out[1]))
    c.r((784, T.out[1]), (784, 400), 8)
    c.text((808, 356), "8 ohm SPKR", 12, "#c8c8c8")
    c.pc((784, 400), (784, gr.y), 4.7e-6, ref="C2")
    gr.tap(784)

    p = vprobe(c, T.out, gr)
    c.scope(p, 0, ((0, 2),), label="pin 3 out")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    c.slider(r1, "Resistance (ohms)", 100000, 2000000, "R1 tone")
    vr.build(); gr.build()
    return "16-gated-oscillator", c


# --------------------------------------------------------------- 17
@circuit
def c17():
    c = Cir("Chirp Generator", vr=9, ic=120)
    A = Timer(352, 208)
    B = Timer(816, 208)
    vr, gr = frame(c, 9, x1=1216)
    titled(c, "CHIRP GENERATOR  (556)", 21)

    # timer 1: astable, R1 to pin 1, R2 to pins 2/6, C1 to ground
    r1 = c.r((272, VP_Y), (272, A.dis[1]), 1000000, ref="R1")
    c.w((272, A.dis[1]), A.dis)
    c.r((272, A.dis[1]), (272, A.th[1]), 1000, ref="R2")
    strap_62(c, A, 272)
    c.pc((272, A.th[1]), (272, gr.y), 4.7e-6, ref="C1")
    vr.tap(272); gr.tap(272)
    c.add(A.xml())
    chip_power(c, A, vr, gr, reset_x=592)
    ctl_cap(c, A, gr, 1e-8, ref="C2")

    # pin 5 (OUT1) wired straight to pin 8 (TRIG2), as drawn
    c.w(A.out, (656, A.out[1]))
    c.w((656, A.out[1]), (656, 464))
    c.w((656, 464), (752, 464))
    c.w((752, 464), (752, B.tr[1]))
    c.w((752, B.tr[1]), B.tr)

    # timer 2: R3 10K and C3 .01uF set the chirp length
    r3 = c.r((736, VP_Y), (736, B.dis[1]), 10000, ref="R3")
    strap_67(c, B, 736)
    c3 = c.c((736, B.th[1]), (736, gr.y), 1e-8, ref="C3")
    vr.tap(736); gr.tap(736)
    c.add(B.xml())
    chip_power(c, B, vr, gr, reset_x=1024)
    ctl_cap(c, B, gr, 1e-8, ref="C2b")

    # Q1 across C3, gated from the OUT1/TRIG2 node, with R4 pulling that node down.
    # The base wire is split at 1088 so R4 hangs off a real three-way node -- a wire
    # ending part-way along another wire looks joined but is not.
    c.w((752, 464), (1088, 464))
    c.w((1088, 464), (1152, 464))
    c.r((1088, 464), (1088, gr.y), 10000, ref="R4")
    gr.tap(1088)
    b, coll, emit = bjt_posts((1152, 464), (1152, 528))
    c.npn((1152, 464), (1152, 528), ref="Q1")
    c.w(emit, (emit[0], gr.y))
    gr.tap(emit[0])
    c.w(coll, (coll[0], 496))
    c.w((coll[0], 496), (704, 496))
    c.w((704, 496), (704, 336))
    c.w((704, 336), (736, 336))
    c.text((1176, 470), "Q1 2N3904", 12, "#e0e0a0")

    # piezo buzzer on OUT2
    c.w(B.out, (1184, B.out[1]))
    c.r((1184, B.out[1]), (1184, gr.y), 1000)
    gr.tap(1184)
    c.text((1208, 300), "PIEZO BUZZER\\n(1k load stands in)", 11, "#c8c8c8")

    p1 = vprobe(c, A.out, gr)
    p2 = vprobe(c, B.out, gr)
    c.scope(p1, 0, ((0, 2),), label="chirp rate")
    c.scope(p2, 1, ((0, 2),), label="chirp gate")
    c.slider(r1, "Resistance (ohms)", 100000, 2000000, "R1 chirp rate")
    c.slider(c3, "Capacitance (F)", 1e-9, 2.2e-7, "C3 chirp length", log=True)
    c.text((96, 700), "Mims labels Q1's leads E to pins 12/13 and C to ground; built here the "
                      "conventional way round -- collector on C3, emitter grounded -- which is the "
                      "discharge switch across C3 that the page's text describes.", 11, "#c08080")
    vr.build(); gr.build()
    return "17-chirp-generator", c


# --------------------------------------------------------------- 18
@circuit
def c18():
    """556 Atari Punk Console: astable clocking a one-shot."""
    c = Cir("Stepped-Tone Generator", vr=9, ic=500)
    A = Timer(352, 208)
    B = Timer(816, 208)
    vr, gr = frame(c, 9, x1=1216)
    titled(c, "STEPPED-TONE GENERATOR  (556)", 22)

    r1 = c.r((272, VP_Y), (272, A.dis[1]), 500000, ref="R1")
    c.w((272, A.dis[1]), A.dis)
    c.r((272, A.dis[1]), (272, A.th[1]), 1000, ref="R2")
    strap_62(c, A, 272)
    c.c((272, A.th[1]), (272, gr.y), 1e-8, ref="C1")
    vr.tap(272); gr.tap(272)
    c.add(A.xml())
    chip_power(c, A, vr, gr, reset_x=592)

    # pin 5 -> pin 8 direct
    c.w(A.out, (656, A.out[1]))
    c.w((656, A.out[1]), (656, 464))
    c.w((656, 464), (752, 464))
    c.w((752, 464), (752, B.tr[1]))
    c.w((752, B.tr[1]), B.tr)

    r3 = c.r((736, VP_Y), (736, B.dis[1]), 500000, ref="R3")
    strap_67(c, B, 736)
    c.c((736, B.th[1]), (736, gr.y), 1e-7, ref="C2")
    vr.tap(736); gr.tap(736)
    c.add(B.xml())
    chip_power(c, B, vr, gr, reset_x=1024)

    # OUT2 -> C3 -> R4 -> speaker -> +V   (the speaker returns to the rail)
    # OUT2 -> C3 -> R4 -> speaker -> +V, stacked upward in one clean lane
    c.w(B.out, (1152, B.out[1]))
    c.pc((1152, B.out[1]), (1152, 224), 1e-5, ref="C3")
    r4 = c.r((1152, 224), (1152, 160), 5000, ref="R4")
    c.r((1152, 160), (1152, VP_Y), 8)
    c.text((1176, 128), "8 ohm SPKR", 12, "#c8c8c8")
    vr.tap(1152)

    p1 = vprobe(c, A.out, gr)
    p2 = vprobe(c, B.out, gr)
    c.scope(p1, 0, ((0, 2),), label="timer 1")
    c.scope(p2, 1, ((0, 2),), label="stepped output")
    c.slider(r1, "Resistance (ohms)", 10000, 500000, "R1")
    c.slider(r3, "Resistance (ohms)", 3100, 500000, "R3 step")
    vr.build(); gr.build()
    return "18-stepped-tone-generator", c


# --------------------------------------------------------------- 19
@circuit
def c19():
    c = Cir("3-State Tone Generator", vr=9, ic=400)
    A = Timer(352, 208)
    B = Timer(880, 208)
    vr, gr = frame(c, 9, x1=1280)
    titled(c, "3-STATE TONE GENERATOR  (556)", 23)

    # timer 1: slow modulator
    c.r((272, VP_Y), (272, A.dis[1]), 2200, ref="R1")
    c.w((272, A.dis[1]), A.dis)
    r2 = c.r((272, A.dis[1]), (272, A.th[1]), 100000, ref="R2")
    strap_62(c, A, 272)
    c.pc((272, A.th[1]), (272, gr.y), 3.3e-6, ref="C1")
    vr.tap(272); gr.tap(272)
    c.add(A.xml())
    chip_power(c, A, vr, gr, reset_x=592)

    # timer 2: audio astable.  R4 -> pin 13, R5 -> pin 12, pins 8 and 12 strapped
    r4 = c.r((800, VP_Y), (800, B.dis[1]), 5000, ref="R4")
    c.w((800, B.dis[1]), B.dis)
    c.r((800, B.dis[1]), (800, B.th[1]), 5000, ref="R5")
    strap_62(c, B, 800)
    c.c((800, B.th[1]), (800, gr.y), 1e-7, ref="C2")
    vr.tap(800); gr.tap(800)

    c.add(B.xml())
    c.w(B.vcc, (B.vcc[0], vr.y)); vr.tap(B.vcc[0])
    c.w(B.gnd, (B.gnd[0], gr.y)); gr.tap(B.gnd[0])
    c.c((704, VP_Y), (704, 176), 1e-7, ref="C3")   # supply decoupling
    c.w((704, 176), (704, 240))
    c.gnd((704, 240), 40)
    vr.tap(704)

    # S1: common is OUT1.  Position 0 -> RESET2 (burst).  Position 1 -> R3 into
    # the threshold/trigger node (two-tone).  Centre-off -> steady tone.
    c.w(A.out, (656, A.out[1]))
    c.w((656, A.out[1]), (656, 464))
    common, t0, t1 = spdt_posts((656, 464), (720, 464))
    c.spdt((656, 464), (720, 464), key="1", position=0)
    c.text((592, 512), "S1   1 = burst   2 = two-tone", 11, "#e0e0a0")
    c.w(t0, (1056, t0[1]))
    c.w((1056, t0[1]), (1056, B.rst[1]))
    c.w((1056, B.rst[1]), B.rst)
    c.r(t1, (t1[0], t1[1] + 96), 100000, ref="R3")
    c.w((t1[0], t1[1] + 96), (736, t1[1] + 96))
    c.w((736, t1[1] + 96), (736, B.th[1]))
    c.w((736, B.th[1]), (800, B.th[1]))

    # OUT2 -> R6 -> speaker -> ground
    c.w(B.out, (1152, B.out[1]))
    c.r((1152, B.out[1]), (1152, 352), 270, ref="R6")
    c.r((1152, 352), (1152, gr.y), 8)
    c.text((1176, 400), "8 ohm SPKR", 12, "#c8c8c8")
    gr.tap(1152)

    p1 = vprobe(c, A.out, gr)
    p2 = vprobe(c, B.out, gr)
    c.scope(p1, 0, ((0, 2),), label="modulator")
    c.scope(p2, 1, ((0, 2),), label="audio out")
    c.slider(r2, "Resistance (ohms)", 10000, 500000, "R2 modulation rate")
    c.slider(r4, "Resistance (ohms)", 1000, 20000, "R4 pitch")
    vr.build(); gr.build()
    return "19-3-state-tone-generator", c


# --------------------------------------------------------------- 20
@circuit
def c20():
    c = Cir("Tone Burst Generator", vr=9, ic=400)
    T = Timer(432, 208)
    vr, gr = frame(c, 9, x1=896)
    titled(c, "TONE BURST GENERATOR", 24)

    r1 = c.r((304, VP_Y), (304, T.dis[1]), 1000, ref="R1")
    c.w((304, T.dis[1]), T.dis)
    c.r((304, T.dis[1]), (304, T.th[1]), 22000, ref="R2")
    strap_62(c, T, 304)
    c.c((304, T.th[1]), (304, gr.y), 1e-7, ref="C1")
    vr.tap(304); gr.tap(304)

    c.add(T.xml())
    c.w(T.vcc, (T.vcc[0], vr.y)); vr.tap(T.vcc[0])
    c.w(T.gnd, (T.gnd[0], gr.y)); gr.tap(T.gnd[0])

    # S1 feeds pin 4 directly; R3 sits between pin 4 and the C2/R4 node
    c.sw((656, VP_Y), (656, 176), key="s", momentary=True, label="S1")
    vr.tap(656)
    c.w((656, 176), (656, T.rst[1]))
    c.w((656, T.rst[1]), T.rst)
    c.r((656, 176), (752, 176), 4700, ref="R3")
    c2 = c.pc((752, 176), (752, 400), 1e-4, ref="C2")
    c.r((816, 176), (816, 400), 10000, ref="R4")
    c.w((752, 176), (816, 176))
    c.w((752, 400), (816, 400))
    c.w((752, 400), (752, gr.y)); gr.tap(752)

    # pin 3 -> R5 -> Q1 base; R6 in the collector, speaker in the emitter
    c.w(T.out, (560, T.out[1]))
    c.r((560, T.out[1]), (560, 400), 10000, ref="R5")
    b, coll, emit = bjt_posts((560, 400), (560, 464))
    c.npn((560, 400), (560, 464), ref="Q1")
    c.r(coll, (coll[0], 208), 100, ref="R6")
    c.w((coll[0], 208), (coll[0], VP_Y)); vr.tap(coll[0])
    c.r(emit, (emit[0], gr.y), 8)
    c.text((emit[0] + 24, 500), "8 ohm SPKR", 12, "#c8c8c8")
    gr.tap(emit[0])

    p = vprobe(c, T.out, gr, lane=624)
    c.scope(p, 0, ((0, 2),), label="tone out")
    c.scope(c2, 1, ((0, 2),), label="C2 burst envelope")
    c.slider(c2, "Capacitance (F)", 1e-5, 1e-3, "C2 burst length", log=True)
    vr.build(); gr.build()
    return "20-tone-burst-generator", c


# --------------------------------------------------------------- 21
@circuit
def c21():
    c = Cir("Sound Effects Generator", vr=9, ic=400)
    A = Timer(304, 208)
    B = Timer(832, 208)
    vr, gr = frame(c, 9, x1=1152)
    titled(c, "SOUND EFFECTS GENERATOR", 25)

    # 555 (1): slow astable
    r1 = c.r((224, VP_Y), (224, A.dis[1]), 100000, ref="R1")
    c.w((224, A.dis[1]), A.dis)
    c.r((224, A.dis[1]), (224, A.th[1]), 1000, ref="R2")
    strap_62(c, A, 224)
    c.pc((224, A.th[1]), (224, gr.y), 4.7e-6, ref="C1")
    vr.tap(224); gr.tap(224)
    c.add(A.xml())
    chip_power(c, A, vr, gr, reset_x=560)

    # OUT1 -> R3 -> C2 -> gnd, and that node drives pin 5 of 555 (2)
    c.w(A.out, (592, A.out[1]))
    r3 = c.r((592, A.out[1]), (688, A.out[1]), 22000, ref="R3")
    c.w((688, A.out[1]), (688, 448))
    c2 = c.pc((688, 448), (688, gr.y), 2.2e-6, ref="C2")
    gr.tap(688)
    c.w((688, 448), (B.ctl[0], 448))
    c.w((B.ctl[0], 448), B.ctl)

    # 555 (2): audio astable, pitch pushed by pin 5
    r7 = c.r((752, VP_Y), (752, B.dis[1]), 100000, ref="R7")
    c.w((752, B.dis[1]), B.dis)
    c.r((752, B.dis[1]), (752, B.th[1]), 1000, ref="R6")
    strap_62(c, B, 752)
    c.c((752, B.th[1]), (752, gr.y), 4.7e-8, ref="C3")
    vr.tap(752); gr.tap(752)
    c.add(B.xml())
    c.w(B.vcc, (B.vcc[0], vr.y)); vr.tap(B.vcc[0])
    c.w(B.gnd, (B.gnd[0], gr.y)); gr.tap(B.gnd[0])
    c.w(B.rst, (B.rst[0] + 32, B.rst[1]))
    c.w((B.rst[0] + 32, B.rst[1]), (B.rst[0] + 32, vr.y)); vr.tap(B.rst[0] + 32)

    # speaker from +V through R4 down to pin 3 of 555 (2)
    c.r((1056, VP_Y), (1056, 208), 8)
    c.text((1080, 170), "8 ohm SPKR", 12, "#c8c8c8")
    c.r((1056, 208), (1056, B.out[1]), 220, ref="R4")
    c.w((1056, B.out[1]), B.out)
    vr.tap(1056)

    p1 = vprobe(c, (688, 448), gr, lane=640)
    p2 = vprobe(c, B.out, gr)
    c.scope(p1, 0, ((0, 2),), label="charge on C2")
    c.scope(p2, 1, ((0, 2),), label="speaker tone")
    c.slider(r1, "Resistance (ohms)", 10000, 500000, "R1 sweep rate")
    c.slider(r7, "Resistance (ohms)", 10000, 500000, "R7 pitch")
    c.slider(r3, "Resistance (ohms)", 1000, 200000, "R3 warble depth")
    vr.build(); gr.build()
    return "21-sound-effects-generator", c


# --------------------------------------------------------------- 22
@circuit
def c22():
    c = Cir("LED Flasher", vr=9, ic=60)
    T = Timer(400, 208)
    vr, gr = frame(c, 9, x1=832)
    titled(c, "LED FLASHER", 26)

    r1 = c.r((272, VP_Y), (272, T.dis[1]), 100000, ref="R1")
    c.w((272, T.dis[1]), T.dis)
    c.r((272, T.dis[1]), (272, T.th[1]), 1000, ref="R2")
    strap_62(c, T, 272)
    c1 = c.pc((272, T.th[1]), (272, gr.y), 4.7e-5, ref="C1")
    vr.tap(272); gr.tap(272)

    c.add(T.xml())
    chip_power(c, T, vr, gr)          # p.26 draws no capacitor on pin 5

    # pin 3 -> R3 -> Q1 base.  R4 feeds a node shared by Q1's collector and the
    # LED, so Q1 shunts the LED rather than sitting in series with it.
    c.w(T.out, (608, T.out[1]))
    c.r((608, T.out[1]), (672, T.out[1]), 1000, ref="R3")
    b, coll, emit = bjt_posts((672, T.out[1]), (736, T.out[1]))
    c.npn((672, T.out[1]), (736, T.out[1]), ref="Q1")
    c.r((736, VP_Y), (736, coll[1]), 270, ref="R4")
    vr.tap(736)
    c.w(coll, (736, coll[1]))
    c.w(emit, (emit[0], gr.y)); gr.tap(emit[0])
    c.w((736, coll[1]), (800, coll[1]))
    c.led((800, coll[1]), (800, gr.y))
    gr.tap(800)

    p = vprobe(c, T.out, gr)
    c.scope(p, 0, ((0, 2),), label="pin 3 out")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    c.slider(r1, "Resistance (ohms)", 1000, 200000, "R1 flash rate")
    vr.build(); gr.build()
    return "22-led-flasher", c


# --------------------------------------------------------------- 23
@circuit
def c23():
    c = Cir("Power FET Lamp Dimmer", vr=9, ic=500)
    T = Timer(400, 208)
    vr, gr = frame(c, 9, x1=896)
    titled(c, "POWER FET LAMP DIMMER", 27)

    c.r((272, VP_Y), (272, 176), 100, ref="R1")
    r2 = c.r((272, 176), (272, T.dis[1]), 2500, ref="R2")
    c.w((272, T.dis[1]), T.dis)
    c.r((272, T.dis[1]), (272, T.th[1]), 1000, ref="R3")
    strap_62(c, T, 272)
    c1 = c.c((272, T.th[1]), (272, gr.y), 4.7e-8, ref="C1")
    vr.tap(272); gr.tap(272)

    c.add(T.xml())
    chip_power(c, T, vr, gr, reset_x=624)

    # pin 3 -> R4 -> gate.  Lamp runs on its own +6 V rail, as p.27 draws it.
    c.w(T.out, (672, T.out[1]))
    c.r((672, T.out[1]), (736, T.out[1]), 10000, ref="R4")
    g, src, drn = fet_posts((736, T.out[1]), (800, T.out[1]))
    c.nmos((736, T.out[1]), (800, T.out[1]), ref="Q1")
    c.lamp(drn, (drn[0], 208), nv=6, np=3)
    c.text((824, 176), "L1  6 V lamp", 12, "#c8c8c8")
    c.dc((864, gr.y), (864, 208), 6)
    c.w((drn[0], 208), (864, 208))
    c.text((824, 130), "+6V", 12, "#e0e0a0")
    gr.tap(864)
    c.w(src, (src[0], gr.y)); gr.tap(src[0])

    p = vprobe(c, T.out, gr)
    c.scope(p, 0, ((0, 2),), label="gate drive")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    c.slider(r2, "Resistance (ohms)", 100, 5000, "R2 brightness")
    vr.build(); gr.build()
    return "23-power-fet-lamp-dimmer", c


# --------------------------------------------------------------- 24
@circuit
def c24():
    c = Cir("Light / Dark Detector", vr=9, ic=400)
    T = Timer(400, 208)
    vr, gr = frame(c, 9, x1=960)
    titled(c, "LIGHT / DARK DETECTOR", 28)

    r1 = c.r((272, VP_Y), (272, T.dis[1]), 47000, ref="R1")
    c.w((272, T.dis[1]), T.dis)
    c.r((272, T.dis[1]), (272, T.th[1]), 1000, ref="R2")
    strap_62(c, T, 272)
    c1 = c.c((272, T.th[1]), (272, gr.y), 4.7e-8, ref="C1")
    vr.tap(272); gr.tap(272)

    c.add(T.xml())
    c.w(T.vcc, (T.vcc[0], vr.y)); vr.tap(T.vcc[0])
    c.w(T.gnd, (T.gnd[0], gr.y)); gr.tap(T.gnd[0])

    # Photoresistor / R3 divider on RESET, with S1 swapping the rail ends so
    # the same circuit answers light or dark.
    sense = (688, T.rst[1])
    c.w(T.rst, sense)
    ldr = c.ldr((688, 240), (688, 336), 0.34, "Light on LDR")
    r3 = c.r((688, 336), (688, 432), 4700, ref="R3")
    c.text((712, 260), "PHOTORESISTOR", 11, "#c8c8c8")
    _, a0, a1 = spdt_posts((688, 240), (688, 176))
    c.spdt((688, 240), (688, 176), key="l", link=1)
    c.w(a0, (a0[0], VP_Y)); vr.tap(a0[0])
    c.w(a1, (784, a1[1]))
    c.w((784, a1[1]), (784, gr.y)); gr.tap(784)
    _, b0, b1 = spdt_posts((688, 432), (688, 496))
    # No key on this pole.  The dispatcher toggles EVERY switch matching a
    # pressed key, and Switch2Elm.toggle() then reassigns position across its
    # whole li group -- so two linked poles sharing a key cancel each other and
    # the key goes silently inert.  One key, and li="1" gangs the rest.
    c.spdt((688, 432), (688, 496), link=1)
    c.w(b0, (b0[0], gr.y)); gr.tap(b0[0])
    c.w(b1, (624, b1[1]))
    c.w((624, b1[1]), (624, VP_Y)); vr.tap(624)
    c.node(sense, (sense[0] - 48, sense[1]), "SENSE")
    c.text((96, 660), "S1 is drawn as two linked poles (a) and (b).  Their exact wiring does not "
                      "resolve at this scan resolution; this is the swap that produces the L and D "
                      "behaviour the page describes.", 11, "#c08080")

    # pin 3 -> C2 -> speaker -> ground
    c.w(T.out, (880, T.out[1]))
    c.pc((880, T.out[1]), (880, 352), 4.7e-6, ref="C2")
    c.r((880, 352), (880, gr.y), 8)
    c.text((904, 400), "8 ohm SPKR", 12, "#c8c8c8")
    gr.tap(880)

    p = vprobe(c, T.out, gr)
    c.scope(p, 0, ((0, 2),), label="speaker drive")
    c.slider(r1, "Resistance (ohms)", 10000, 200000, "R1 tone")
    c.slider(r3, "Resistance (ohms)", 1000, 100000, "R3 trip point", log=True)
    vr.build(); gr.build()
    return "24-light-dark-detector", c


# --------------------------------------------------------------- 25
@circuit
def c25():
    c = Cir("Infrared Security Alarm", vr=9, ic=200)
    A = Timer(352, 208)          # transmitter
    B = Timer(880, 240)          # receiver
    vr, gr = frame(c, 9, x1=1216)
    titled(c, "INFRARED SECURITY ALARM", 29)

    # --- transmitter: R1 47K to pin 7, R2 1K to pins 6/2, C1 4.7uF to ground
    r1 = c.r((272, VP_Y), (272, A.dis[1]), 47000, ref="R1")
    c.w((272, A.dis[1]), A.dis)
    c.r((272, A.dis[1]), (272, A.th[1]), 1000, ref="R2")
    strap_62(c, A, 272)
    c.pc((272, A.th[1]), (272, gr.y), 4.7e-6, ref="C1")
    vr.tap(272); gr.tap(272)
    c.add(A.xml())
    chip_power(c, A, vr, gr, reset_x=592)   # p.29 draws no capacitor on pin 5

    # LED runs from +V through R3 down to pin 3, so it lights when pin 3 is low
    c.r((640, VP_Y), (640, 240), 220, ref="R3")
    c.led((640, 240), (640, A.out[1]), cr=0.7, cg=0.1, cb=0.7)
    c.w((640, A.out[1]), A.out)
    vr.tap(640)
    c.text((664, 250), "LED  (infrared emitter)", 11, "#c8c8c8")

    # --- the optical path.  CircuitJS has no phototransistor, so the beam is a
    # switch: press B to break it.
    c.w((640, A.out[1]), (704, A.out[1]))
    c.sw((704, A.out[1]), (768, A.out[1]), key="b", label="BEAM", closed=True)
    c.text((664, 200), "BEAM  (press B to break)", 11, "#e0e0a0")

    # --- receiver: R4 pulls the detector node up; Q2 dumps C3 on every pulse
    c.r((768, VP_Y), (768, A.out[1]), 10000, ref="R4")
    vr.tap(768)
    b2, coll2, emit2 = bjt_posts((800, 464), (864, 464), pnp=True)
    c.pnp((800, 464), (864, 464), ref="Q2")
    c.w((768, A.out[1]), (768, 464))
    c.w((768, 464), (800, 464))

    r5 = c.r((784, VP_Y), (784, B.dis[1]), 1000000, ref="R5")
    c.w((784, B.dis[1]), B.dis)
    c.w((784, B.dis[1]), (784, B.th[1]))
    c.w((784, B.th[1]), (864, B.th[1]))      # junction where Q2's emitter joins
    c.w((864, B.th[1]), B.th)
    c3 = c.c((784, B.th[1]), (784, gr.y), 4.7e-8, ref="C3")
    vr.tap(784); gr.tap(784)
    c.w(emit2, (emit2[0], B.th[1]))
    c.w(coll2, (coll2[0], gr.y)); gr.tap(coll2[0])
    c.w(B.tr, (816, B.tr[1]))
    c.w((816, B.tr[1]), (816, 528))
    c.w((816, 528), (768, 528))
    c.w((768, 528), (768, 464))

    c.add(B.xml())
    c.w(B.vcc, (B.vcc[0], vr.y)); vr.tap(B.vcc[0])
    c.w(B.gnd, (B.gnd[0], gr.y)); gr.tap(B.gnd[0])
    c.w(B.rst, (B.rst[0] + 32, B.rst[1]))
    c.w((B.rst[0] + 32, B.rst[1]), (B.rst[0] + 32, vr.y)); vr.tap(B.rst[0] + 32)
    c.c(B.ctl, (B.ctl[0], gr.y), 1e-8, ref="C2")
    gr.tap(B.ctl[0])

    c.w(B.out, (1184, B.out[1]))
    c.r((1184, B.out[1]), (1184, 208), 1000)
    c.w((1184, 208), (1184, VP_Y)); vr.tap(1184)
    c.text((1208, 300), "PIEZO BUZZER\\n(1k load stands in)", 11, "#c8c8c8")

    p = vprobe(c, (1184, B.out[1]), gr)
    c.scope(p, 0, ((0, 2),), label="buzzer drive")
    c.scope(c3, 1, ((0, 2),), label="charge on C3")
    c.slider(r5, "Resistance (ohms)", 100000, 4000000, "R5 alarm delay")
    c.text((96, 700), "The transmitter is as drawn.  The receiver's phototransistor stage does not "
                      "resolve at this scan resolution; it is built as the missing-pulse detector "
                      "the page's text describes, with the beam modelled by switch BEAM.",
           11, "#c08080")
    vr.build(); gr.build()
    return "25-infrared-security-alarm", c


# --------------------------------------------------------------- 26
@circuit
def c26():
    c = Cir("Analog Lightwave Transmitter", vr=9, ic=300)
    T = Timer(432, 208)
    vr, gr = frame(c, 9, x1=832)
    titled(c, "ANALOG LIGHTWAVE TRANSMITTER", 30)

    # R1 is any variable-resistance sensor; here CircuitJS's photoresistor
    r1 = c.ldr((304, VP_Y), (304, T.dis[1]), 0.34, "Light on R1")
    c.w((304, T.dis[1]), T.dis)
    c.r((304, T.dis[1]), (304, T.th[1]), 1000, ref="R2")
    strap_62(c, T, 304)
    c1 = c.c((304, T.th[1]), (304, gr.y), 2.2e-7, ref="C1")
    vr.tap(304); gr.tap(304)
    c.text((176, 150), "R1  photoresistor", 12, "#e0e0a0")

    c.add(T.xml())
    chip_power(c, T, vr, gr, reset_x=656)   # p.30 draws no capacitor on pin 5

    # +9V -> R3 220 -> LED -> pin 3
    c.r((720, VP_Y), (720, 240), 220, ref="R3")
    c.led((720, 240), (720, T.out[1]), cr=0.7, cg=0.1, cb=0.7)
    c.w((720, T.out[1]), T.out)
    vr.tap(720)
    c.text((744, 250), "LED  (infrared emitter)\\nlens -> infrared beam", 11, "#c8c8c8")

    p = vprobe(c, T.out, gr)
    c.scope(p, 0, ((0, 2),), label="LED drive")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    vr.build(); gr.build()
    return "26-analog-lightwave-transmitter", c


# --------------------------------------------------------------- 27
@circuit
def c27():
    c = Cir("Analog Lightwave Receiver", vr=9, ic=300)
    T = Timer(816, 240)
    vr, gr = frame(c, 9, x1=1216)
    titled(c, "ANALOG LIGHTWAVE RECEIVER", 31)

    # Q1 phototransistor: collector on R1, emitter to ground.  CircuitJS has no
    # phototransistor, so the received pulses come from a source in its place.
    c.add('<v x="128 %d 128 304" f="0" wf="2" fr="700" maxv="0.35" bias="0.2" '
          'dutyCycle="0.5" ir="2000"/>' % gr.y)
    c.node((128, 304), (128, 272), "IR IN")
    gr.tap(128)
    c.r((208, VP_Y), (208, 304), 100000, ref="R1")
    c.w((128, 304), (208, 304))
    vr.tap(208)
    c.text((88, 340), "Q1 phototransistor stands in as a pulse source", 11, "#c08080")

    # C1 / R2 into op amp 1, inverting, R3 1M feedback
    c.c((208, 304), (288, 304), 1e-7, ref="C1")
    c.r((288, 304), (368, 304), 100, ref="R2")
    inm, inp, outp = opamp_posts((432, 320), (528, 320))
    c.w((368, 304), (368, inm[1]))
    c.w((368, inm[1]), inm)
    c.r((368, inm[1]), (368, 192), 1000000, ref="R3")
    c.w((368, 192), (560, 192))
    c.w((560, 192), (560, 320))
    c.w((560, 320), outp)
    c.w(inp, (inp[0], 448))
    c.w((inp[0], 448), (inp[0], gr.y)); gr.tap(inp[0])
    c.opamp((432, 320), (528, 320))

    # op amp 2: non-inverting input from stage 1, inverting from the R4 pot
    inm2, inp2, outp2 = opamp_posts((624, 336), (720, 336))
    c.w((560, 320), (560, inp2[1]))
    c.w((560, inp2[1]), inp2)
    # A PotElm's three posts are point1, point1+(0,128) and the wiper at
    # point1+(32,64) -- the drawn end point only sets the wiper's side.  Wiring to
    # the drawn coordinates instead of these misses every one of them.
    c.pot((496, 432), (528, 560), 10000, 0.5, "R4 bias")
    c.w((496, 432), (496, VP_Y)); vr.tap(496)
    gr.tap(496)
    c.w((528, 496), (592, 496))
    c.w((592, 496), (592, inm2[1]))
    c.w((592, inm2[1]), inm2)
    c.opamp((624, 336), (720, 336))

    # C3 couples stage 2 into the 555 one-shot's trigger
    c.c(outp2, (784, 336), 1e-7, ref="C3")
    c.w((784, 336), (784, T.tr[1]))
    c.w((784, T.tr[1]), T.tr)
    c.r((784, VP_Y), (784, T.tr[1]), 4700, ref="R5")
    c.r((784, T.tr[1]), (784, gr.y), 4700, ref="R6")
    vr.tap(784); gr.tap(784)

    r7 = c.r((736, VP_Y), (736, T.dis[1]), 10000, ref="R7")
    strap_67(c, T, 736)
    c.c((736, T.th[1]), (736, gr.y), 1e-7, ref="C5")
    vr.tap(736); gr.tap(736)

    c.add(T.xml())
    c.w(T.vcc, (T.vcc[0], vr.y)); vr.tap(T.vcc[0])
    c.w(T.gnd, (T.gnd[0], gr.y)); gr.tap(T.gnd[0])
    c.w(T.rst, (T.rst[0] + 32, T.rst[1]))
    c.w((T.rst[0] + 32, T.rst[1]), (T.rst[0] + 32, vr.y)); vr.tap(T.rst[0] + 32)
    c.c(T.ctl, (T.ctl[0], gr.y), 1e-7, ref="C4")
    gr.tap(T.ctl[0])

    # R8 pulls pin 3 up; R9 calibrates; R10 and M1 read the average
    c.w(T.out, (1152, T.out[1]))
    c.r((1152, VP_Y), (1152, T.out[1]), 4700, ref="R8")
    vr.tap(1152)
    r9 = c.r((1152, T.out[1]), (1152, 432), 10000, ref="R9")
    c.r((1152, 432), (1152, 496), 220, ref="R10")
    c.ammeter((1152, 496), (1152, gr.y), mode=1)
    gr.tap(1152)
    c.text((1176, 440), "R9 CALIBRATE", 11, "#e0e0a0")
    c.text((1176, 510), "M1  0-1 mA", 12, "#c8c8c8")

    p = vprobe(c, T.out, gr)
    c.scope(p, 0, ((0, 2),), label="one-shot output")
    c.slider(r9, "Resistance (ohms)", 1000, 50000, "R9 calibrate")
    c.text((96, 660), "The 1458's two halves are drawn as two ideal op amps.  The 555 stage follows "
                      "the same arrangement as the frequency meter on p.17.", 11, "#9fb8c8")
    vr.build(); gr.build()
    return "27-analog-lightwave-receiver", c


# --------------------------------------------------------------- 28
@circuit
def c28():
    c = Cir("DC-DC Converter", vr=9, ic=800)
    T = Timer(400, 208)
    vr, gr = frame(c, 9, x1=1024)
    titled(c, "DC-DC CONVERTER", 32)

    r1 = c.r((272, VP_Y), (272, T.dis[1]), 47000, ref="R1")
    c.w((272, T.dis[1]), T.dis)
    c.r((272, T.dis[1]), (272, T.th[1]), 1000, ref="R2")
    strap_62(c, T, 272)
    c1 = c.c((272, T.th[1]), (272, gr.y), 1e-8, ref="C1")
    vr.tap(272); gr.tap(272)

    c.add(T.xml())
    chip_power(c, T, vr, gr)          # p.32 draws no capacitor on pin 5

    # pin 3 -> 6.3 V winding -> ground;  120 V winding -> D1 -> C2 || R3
    pri_t, sec_t, pri_b, sec_b = xfmr_posts((672, 272))
    c.w(T.out, (608, T.out[1]))
    c.w((608, T.out[1]), (608, 272))
    c.w((608, 272), pri_t)
    c.xfmr((672, 272), (736, 272), henries=0.05, ratio=19, ref="T1")
    c.w(pri_b, (pri_b[0], gr.y)); gr.tap(pri_b[0])
    c.text((600, 220), "T1  6.3 V : 120 V", 12, "#e0e0a0")

    c.diode(sec_t, (816, 272), ref="D1")
    c.w((816, 272), (864, 272))
    c.node((864, 272), (864, 240), "HV OUT")
    c2 = c.c((864, 272), (864, 432), 1e-7, ref="C2")
    c.r((960, 272), (960, 432), 1000000, ref="R3")
    c.w((864, 272), (960, 272))
    c.w((864, 432), (960, 432))
    c.w(sec_b, (sec_b[0], 432))
    c.w((sec_b[0], 432), (864, 432))
    # the book leaves the secondary floating; the solver needs one end referenced
    c.w((864, 432), (864, gr.y)); gr.tap(864)
    c.text((888, 470), "secondary tied to ground here:\\nthe page leaves it floating, which\\n"
                       "the solver cannot reference", 11, "#c08080")

    c.w((960, 272), (1024, 272))
    p = vprobe(c, (1024, 272), gr)
    c.scope(p, 0, ((0, 20),), label="HV output")
    c.scope(c1, 1, ((0, 2),), label="charge on C1")
    c.slider(r1, "Resistance (ohms)", 10000, 200000, "R1 switching rate")
    vr.build(); gr.build()
    return "28-dc-dc-converter", c
