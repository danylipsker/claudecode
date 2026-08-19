"""CircuitJS1 XML authoring helpers.

Geometry and tags verified against the deployed build (circuitjs109a) --
see FALSTAD-FORMAT-REFERENCE.md in the CIRCUITS folder.

Grid is 16 px.  Every post below lands on a grid multiple when the element
origin does, so wires always meet cleanly.
"""

G = 16


def _fmt(v):
    """Format a number the way the app does (no stray float noise)."""
    if isinstance(v, float):
        if v == int(v):
            return str(int(v))
        return repr(v)
    return str(v)


# --------------------------------------------------------------------------
# 555 timer chip.  sizeX=3, sizeY=5, cspc=16, cspc2=32.
# (x, y) is the element origin; the drawn body runs (x+16, y-16)..(x+112, y+144)
# --------------------------------------------------------------------------
class Timer:
    def __init__(self, x, y, label=None):
        self.x, self.y = x, y
        self.label = label

    # left side
    @property
    def dis(self):   return (self.x, self.y + 32)        # pin 7  discharge
    @property
    def tr(self):    return (self.x, self.y + 96)        # pin 2  trigger
    @property
    def th(self):    return (self.x, self.y + 128)       # pin 6  threshold
    # top / bottom
    @property
    def vcc(self):   return (self.x + 64, self.y - 32)   # pin 8
    @property
    def ctl(self):   return (self.x + 64, self.y + 160)  # pin 5  control
    @property
    def gnd(self):   return (self.x + 96, self.y + 160)  # pin 1
    # right side
    @property
    def rst(self):   return (self.x + 128, self.y + 32)  # pin 4  reset
    @property
    def out(self):   return (self.x + 128, self.y + 64)  # pin 3  output

    def xml(self):
        # flags 6 = 2 (reset pin present) | 4 (ground pin present).  This is the
        # app's own getDefaultFlags(); with f="0" the chip drops to six posts and
        # the reset pin silently does nothing.
        # flags 14 = 2 (reset pin) | 4 (ground pin) | 8 (label pins by number).
        # Bit 8 makes the chip read 1..8 exactly as Mims draws it; without bits
        # 2 and 4 the chip drops to six posts and pins 4 and 1 do not exist.
        return '<Timer x="%d %d %d %d" f="14"/>' % (self.x, self.y, self.x + 32, self.y)


def _perp(a, b):
    """Unit perpendicular used by CircuitElm.interpPoint: (dy, -dx)/|d|."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    n = (dx * dx + dy * dy) ** 0.5
    return (dy / n, -dx / n)


def _off(p, u, k):
    return (int(round(p[0] + u[0] * k)), int(round(p[1] + u[1] * k)))


def bjt_posts(a, b, pnp=False, flip=False):
    """Return (base, collector, emitter) for a transistor drawn a -> b."""
    u = _perp(a, b)
    dsign = -1 if flip else 1
    hs2 = 16 * dsign * (-1 if pnp else 1)
    return a, _off(b, u, hs2), _off(b, u, -hs2)


def fet_posts(a, b, flip=False):
    """Return (gate, source, drain) for a MOSFET drawn a -> b."""
    u = _perp(a, b)
    hs2 = 16 * (-1 if flip else 1)
    return a, _off(b, u, -hs2), _off(b, u, hs2)


def opamp_posts(a, b, plus_top=False):
    """Return (in_minus, in_plus, out) for an op amp drawn a -> b."""
    u = _perp(a, b)
    hs = 16 if not plus_top else -16
    return _off(a, u, hs), _off(a, u, -hs), b


def spdt_posts(a, b):
    """Return (common, throw0, throw1) for an SPDT drawn a -> b.

    Verified against the running app: Switch2Elm puts BOTH throws at point2
    offset perpendicular by +/-16 -- neither one sits at point2 itself.
    p="0" selects throw0, p="1" selects throw1."""
    u = _perp(a, b)
    return a, _off(b, u, 16), _off(b, u, -16)


# --------------------------------------------------------------------------
class Cir:
    """Accumulates elements in order; index == element index for scopes."""

    def __init__(self, title, vr=9, ic=100, ts=5e-6, mts=5e-11, flags=1):
        self.title = title
        self.models = []
        self.parts = []
        self.scopes = []
        self.adjs = []
        self.hdr = dict(f=flags, ts=ts, ic=ic, cb=50, pb=43, vr=vr, mts=mts)

    # -- raw -------------------------------------------------------------
    def add(self, xml):
        self.parts.append(xml)
        return len(self.parts) - 1

    def model(self, xml):
        self.models.append(xml)

    # -- passives / wiring ----------------------------------------------
    def w(self, a, b):
        return self.add('<w x="%d %d %d %d" f="0"/>' % (a[0], a[1], b[0], b[1]))

    def path(self, *pts):
        return [self.w(pts[i], pts[i + 1]) for i in range(len(pts) - 1)]

    def ref(self, a, b, name, size=13, color="#e0e0a0"):
        """Draw a designator (R1, C2, Q1 ...) beside an element running a->b,
        the way Mims letters every part on his schematics."""
        if not name:
            return None
        mx, my = (a[0] + b[0]) // 2, (a[1] + b[1]) // 2
        if abs(b[0] - a[0]) >= abs(b[1] - a[1]):        # horizontal part
            pos = (mx - 6 * len(name) // 2, my - 22)
        else:                                            # vertical part
            pos = (mx - 14 - 7 * len(name), my - 6)
        return self.text(pos, name, size, color)

    def r(self, a, b, ohms, ref=None):
        idx = self.add('<r x="%d %d %d %d" f="0" r="%s"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(ohms)))
        self.ref(a, b, ref)
        return idx

    def c(self, a, b, farads, iv=0, sr=0, ref=None):
        idx = self.add('<c x="%d %d %d %d" f="0" c="%s" iv="%s" sr="%s" vd="0"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(farads), _fmt(iv), _fmt(sr)))
        self.ref(a, b, ref)
        return idx

    def pc(self, a, b, farads, iv=0, ref=None):
        """Polarised (electrolytic) capacitor."""
        idx = self.add('<pc x="%d %d %d %d" f="0" c="%s" iv="%s" sr="0" vd="0"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(farads), _fmt(iv)))
        self.ref(a, b, ref)
        return idx

    def l(self, a, b, henries):
        return self.add('<l x="%d %d %d %d" f="0" l="%s" ic="0"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(henries)))

    # -- sources ---------------------------------------------------------
    def dc(self, a, b, volts):
        """a = negative end, b = positive end."""
        return self.add('<v x="%d %d %d %d" f="0" wf="0" maxv="%s"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(volts)))

    def square(self, a, b, volts, hz, bias=0, duty=0.5):
        return self.add('<v x="%d %d %d %d" f="0" wf="2" fr="%s" maxv="%s" bias="%s" dc="%s"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(hz), _fmt(volts),
                           _fmt(bias), _fmt(duty)))

    def gnd(self, a, drop=48):
        return self.add('<g x="%d %d %d %d" f="0"/>' % (a[0], a[1], a[0], a[1] + drop))

    # -- semiconductors --------------------------------------------------
    def npn(self, a, b, beta=100, ref=None):
        idx = self.add('<t x="%d %d %d %d" f="0" pn="1" be="%s" mo="default" vbe="0" vbc="0"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(beta)))
        self.ref(a, b, ref)
        return idx

    def pnp(self, a, b, beta=100, ref=None):
        idx = self.add('<t x="%d %d %d %d" f="0" pn="-1" be="%s" mo="default" vbe="0" vbc="0"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(beta)))
        self.ref(a, b, ref)
        return idx

    def nmos(self, a, b, ref=None):
        idx = self.add('<f x="%d %d %d %d" f="0" mo="default-nodiode"/>'
                        % (a[0], a[1], b[0], b[1]))
        self.ref(a, b, ref)
        return idx

    def diode(self, a, b, ref=None):
        idx = self.add('<d x="%d %d %d %d" f="0" mo="default"/>'
                        % (a[0], a[1], b[0], b[1]))
        self.ref(a, b, ref)
        return idx

    def led(self, a, b, cr=1, cg=0, cb=0, ref=None):
        idx = self.add('<LED x="%d %d %d %d" f="0" mo="default-led" cr="%s" cg="%s" cb="%s" mbc="0.01"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(cr), _fmt(cg), _fmt(cb)))
        self.ref(a, b, ref)
        return idx

    def lamp(self, a, b, nv=6, np=3, ref=None):
        idx = self.add('<Lamp x="%d %d %d %d" f="0" te="300" np="%s" nv="%s" wa="0.4" co="0.4"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(np), _fmt(nv)))
        self.ref(a, b, ref)
        return idx

    def ldr(self, a, b, ps=0.34, label="Light on LDR", ref=None):
        idx = self.add('<LDR x="%d %d %d %d" f="0" ps="%s" st="%s"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(ps), label))
        self.ref(a, b, ref)
        return idx

    def opamp(self, a, b, hi=15, lo=-15, plus_top=False):
        fl = 2 if plus_top else 0
        return self.add('<a x="%d %d %d %d" f="%d" ma="%s" mi="%s" ga="100000"/>'
                        % (a[0], a[1], b[0], b[1], fl, _fmt(hi), _fmt(lo)))

    def xfmr(self, a, b, henries=4, ratio=1, coupling=0.999, ref=None):
        idx = self.add('<T x="%d %d %d %d" f="0" in="%s" ra="%s" co="%s" wi="32" c0="0" c1="0"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(henries), _fmt(ratio), _fmt(coupling)))
        self.ref(a, b, ref)
        return idx

    # -- switches / controls --------------------------------------------
    def sw(self, a, b, key=None, momentary=False, closed=False, label=None, ron=0):
        att = ' p="%d"' % (0 if closed else 1)
        if momentary:
            att += ' mm="true"'
        if label:
            att += ' lab="%s"' % label
        if key:
            att += ' key="%s"' % key
        return self.add('<s x="%d %d %d %d" f="0"%s/>'
                        % (a[0], a[1], b[0], b[1], att))

    def spdt(self, a, b, key=None, position=0, link=0):
        att = ' li="%d" th="2"' % link
        if key:
            att += ' key="%s"' % key
        if position:
            att += ' p="%d"' % position
        return self.add('<S x="%d %d %d %d" f="0"%s/>'
                        % (a[0], a[1], b[0], b[1], att))

    def pot(self, a, b, maxr, pos=0.5, label="Pot"):
        return self.add('<pt x="%d %d %d %d" f="0" ma="%s" po="%s" sl="%s"/>'
                        % (a[0], a[1], b[0], b[1], _fmt(maxr), _fmt(pos), label))

    def relay(self, a, b, model="mims-relay"):
        return self.add('<rl x="%d %d %d %d" f="0" mo="%s" i="0" ip="0"/>'
                        % (a[0], a[1], b[0], b[1], model))

    def relay_model(self, name="mims-relay", coil_r=250, pull_in=0.02, drop_out=0.015):
        self.model('<rlm nm="%s" f="0" in="0.2" ron="0.05" rof="1000000" on="%s" of="%s" coR="%s" sw="0.005" cs="1"/>'
                   % (name, _fmt(pull_in), _fmt(drop_out), _fmt(coil_r)))

    # -- instruments / annotation ---------------------------------------
    def probe(self, a, b, mode=0):
        return self.add('<p x="%d %d %d %d" f="1" me="%d" sc="0" re="0"/>'
                        % (a[0], a[1], b[0], b[1], mode))

    def ammeter(self, a, b, mode=0, scale=0, ref=None):
        idx = self.add('<Ammeter x="%d %d %d %d" f="1" me="%d" sc="%d"/>'
                        % (a[0], a[1], b[0], b[1], mode, scale))
        self.ref(a, b, ref)
        return idx

    def node(self, a, b, name):
        return self.add('<ln x="%d %d %d %d" f="0" te="%s"/>'
                        % (a[0], a[1], b[0], b[1], name))

    def audio(self, a, name="Speaker"):
        return self.add('<aout x="%d %d %d %d" f="0" du="1" sa="8000" la="1"/>'
                        % (a[0], a[1], a[0] + 32, a[1]))

    def text(self, a, s, size=16, color=None):
        """One text element.  `s` may be a list of lines, or contain \n --
        TextElm splits on the two-character escape and draws each line below
        the last.  The font is proportional SansSerif, so never try to align
        columns with spaces: use table() instead."""
        if isinstance(s, (list, tuple)):
            s = "\\n".join(s)
        wide = max(len(t) for t in s.split("\\n"))
        co = ' co="%s"' % color if color else ''
        return self.add('<x x="%d %d %d %d" f="0" si="%d" te="%s"%s/>'
                        % (a[0], a[1], a[0] + int(size * 0.55 * wide),
                           a[1] + 4, size, s, co))

    def label(self, a, s, size=13, color="#d0d0d0"):
        """A component designator such as R1 or C2, drawn next to the part."""
        return self.text(a, s, size, color)

    def table(self, a, caption, columns, size=12, col_w=104, color="#c8c8c8"):
        """Render a table as one multi-line text element per column, so the
        columns line up despite the proportional font.

        `columns` is a list of lists: [[header, cell, cell...], [...], ...]"""
        x, y = a
        if caption:
            self.text((x, y), caption, size + 2, "#ffffff")
            y += size + 12
        for i, col in enumerate(columns):
            self.text((x + i * col_w, y), list(col), size, color)
        return y + (size + 3) * max(len(c) for c in columns)

    # -- scopes / sliders ------------------------------------------------
    def scope(self, elem, slot, plots=((0, 2),), flags="x20a", speed=64, label=None):
        """plots: sequence of (quantity, scale).  0=voltage 3=current 7=power."""
        ps = "".join('<p v="%d" sc="%s"/>' % (v, _fmt(sc)) for v, sc in plots)
        lab = ' x="%s"' % label if label else ""
        self.scopes.append('<o en="%d" sp="%d" f="%s" p="%d"%s>%s</o>'
                           % (elem, speed, flags, slot, lab, ps))

    def slider(self, elem, name, lo, hi, label, step=0, log=False, ei=0):
        self.adjs.append('<adj e="%d" ei="%d" en="%s" mn="%s" mx="%s" st="%s" stp="%s" log="%d"/>'
                         % (elem, ei, name, _fmt(lo), _fmt(hi), label, _fmt(step), 1 if log else 0))

    # -- output ----------------------------------------------------------
    def dump(self):
        h = self.hdr
        head = ('<cir f="%s" ts="%s" ic="%s" cb="%s" pb="%s" vr="%s" mts="%s">'
                % (h["f"], _fmt(h["ts"]), _fmt(h["ic"]), h["cb"], h["pb"],
                   _fmt(h["vr"]), _fmt(h["mts"])))
        body = self.models + self.parts + self.scopes + self.adjs
        return head + "\n" + "\n".join("  " + p for p in body) + "\n</cir>\n"

    def write(self, path):
        with open(path, "w", encoding="ascii", newline="\n") as f:
            f.write(self.dump())
