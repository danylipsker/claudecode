"""Shared layout scaffolding for the Mims 555 circuit set."""

from lib import Cir, Timer, bjt_posts, fet_posts, opamp_posts, spdt_posts

VP_Y = 96        # +V rail
GND_Y = 560      # ground rail
SRC_X = 96       # supply column


class Rail:
    """A horizontal bus.  Every tap becomes a wire endpoint, so taps really
    connect -- CircuitJS only joins elements at shared post coordinates."""

    def __init__(self, cir, y, x0, x1):
        self.cir, self.y = cir, y
        self.taps = {x0, x1}

    def tap(self, x):
        self.taps.add(x)
        return (x, self.y)

    def build(self):
        xs = sorted(self.taps)
        for i in range(len(xs) - 1):
            self.cir.w((xs[i], self.y), (xs[i + 1], self.y))


def frame(cir, volts=9, x0=SRC_X, x1=640, gnd_y=GND_Y):
    """Supply + both rails.  Returns (vplus_rail, gnd_rail).  gnd_y lets a tall
    circuit push its ground rail down so nothing has to sit on top of it."""
    cir.dc((SRC_X, gnd_y), (SRC_X, VP_Y), volts)
    cir.gnd((SRC_X, gnd_y))
    return Rail(cir, VP_Y, x0, x1), Rail(cir, gnd_y, x0, x1)


def support(cir, T, vr, gr, ctl_cap=1e-8, reset=True, reset_x=None, ctl_ref="C2"):
    """Pin 8 -> +V, pin 1 -> gnd, pin 5 -> ctl cap, pin 4 -> +V."""
    cir.w(T.vcc, (T.vcc[0], vr.y));  vr.tap(T.vcc[0])
    cir.w(T.gnd, (T.gnd[0], gr.y));  gr.tap(T.gnd[0])
    if ctl_cap:
        cir.c(T.ctl, (T.ctl[0], gr.y), ctl_cap, ref=ctl_ref)
        gr.tap(T.ctl[0])
    if reset:
        rx = reset_x if reset_x else T.rst[0] + 48
        cir.w(T.rst, (rx, T.rst[1]))
        cir.w((rx, T.rst[1]), (rx, vr.y))
        vr.tap(rx)


def astable_timing(cir, T, r1, r2, c1, gr, col=272):
    """Mims' basic astable network: R1 +V->pin7, R2 pin7->pin6, C1 pin6->gnd,
    pin 2 strapped to pin 6.  Returns (r1_idx, r2_idx, c1_idx)."""
    i1 = cir.r((col, VP_Y), (col, T.dis[1]), r1, ref="R1")
    cir.w((col, T.dis[1]), T.dis)
    i2 = cir.r((col, T.dis[1]), (col, T.th[1]), r2, ref="R2")
    tie = T.th[0] - 32
    cir.w((col, T.th[1]), (tie, T.th[1]))
    cir.w((tie, T.th[1]), T.th)
    cir.w(T.tr, (tie, T.tr[1]))
    cir.w((tie, T.tr[1]), (tie, T.th[1]))
    i3 = cir.c((col, T.th[1]), (col, gr.y), c1, ref="C1")
    gr.tap(col)
    return i1, i2, i3


def out_probe(cir, T, gr, x=592, label="OUT"):
    """Bring pin 3 out to a labelled node with a scope probe across it."""
    cir.w(T.out, (x, T.out[1]))
    cir.node((x, T.out[1]), (x, T.out[1] - 32), label)
    p = cir.probe((x, T.out[1]), (x, gr.y))
    gr.tap(x)
    return p


def titled(cir, title, page, notes=()):
    """Page heading.  The explanation, formulas and tables come from content.py
    so the book text lives in one place; `notes` is kept for signature
    compatibility and is no longer drawn."""
    cir.text((SRC_X, 32), title, 22, "#ffffff")
    cir.text((SRC_X, 58), "Forrest M. Mims III  -  Engineer's Mini-Notebook: 555 Timer IC Circuits,  p." + str(page), 12, "#98a8b8")
