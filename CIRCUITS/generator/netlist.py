"""Extract a real netlist from a generated CircuitJS file.

Wires are collapsed: every set of coordinates joined by <w> becomes one node,
so what comes out is the electrical topology, directly comparable with the
connection list read off Mims' drawing.
"""
import re, sys, glob, os, io

TIMER_PINS = [("7 dis", 0, 32), ("2 tr", 0, 96), ("6 th", 0, 128),
              ("8 Vcc", 64, -32), ("5 ctl", 64, 160), ("1 gnd", 96, 160),
              ("4 rst", 128, 32), ("3 out", 128, 64)]

SKIP = {"x", "o", "adj", "rlm", "cir", "/cir"}


def perp(a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]
    n = (dx * dx + dy * dy) ** 0.5
    return (dy / n, -dx / n)


def off(p, u, k):
    return (int(round(p[0] + u[0] * k)), int(round(p[1] + u[1] * k)))


def posts(tag, x, flags):
    """Return the post coordinates for one element."""
    a, b = (x[0], x[1]), (x[2], x[3])
    if tag == "Timer":
        return [(n, (a[0] + dx, a[1] + dy)) for n, dx, dy in TIMER_PINS]
    if tag in ("t",):
        u = perp(a, b)
        pnp = -1 if flags.get("pn") == "-1" else 1
        return [("B", a), ("C", off(b, u, 16 * pnp)), ("E", off(b, u, -16 * pnp))]
    if tag == "f":
        u = perp(a, b)
        return [("G", a), ("S", off(b, u, -16)), ("D", off(b, u, 16))]
    if tag == "a":
        u = perp(a, b)
        return [("-", off(a, u, 16)), ("+", off(a, u, -16)), ("OUT", b)]
    if tag == "S":
        u = perp(a, b)
        return [("COM", a), ("T0", off(b, u, 16)), ("T1", off(b, u, -16))]
    if tag == "T":
        w = int(flags.get("wi", 32))
        return [("P+", a), ("S+", b), ("P-", (a[0], a[1] + w)), ("S-", (b[0], b[1] + w))]
    if tag == "pt":
        # Verified against the running app: the track runs from point1 along the
        # major axis, and the drawn end point only supplies the wiper's sideways
        # offset -- the wiper sits at the track's midpoint, not at point2.
        dx, dy = b[0] - a[0], b[1] - a[1]
        if abs(dy) >= abs(dx):
            sgn = 1 if dy >= 0 else -1
            return [("A", a), ("B", (a[0], a[1] + dy)),
                    ("W", (a[0] + dx, a[1] + sgn * (abs(dy) // 2)))]
        sgn = 1 if dx >= 0 else -1
        return [("A", a), ("B", (a[0] + dx, a[1])),
                ("W", (a[0] + sgn * (abs(dx) // 2), a[1] + dy))]
    if tag in ("g", "ln", "aout", "L", "M"):
        return [("1", a)]
    return [("1", a), ("2", b)]


def load(path):
    elems = []
    for line in io.open(path, encoding="ascii"):
        line = line.strip()
        m = re.match(r"<(\w+|/cir)\b(.*?)/?>$", line)
        if not m:
            continue
        tag, rest = m.group(1), m.group(2)
        if tag in SKIP:
            continue
        attrs = dict(re.findall(r'(\w+)="([^"]*)"', rest))
        if "x" not in attrs:
            continue
        xs = [int(float(v)) for v in attrs["x"].split()]
        while len(xs) < 4:
            xs.append(xs[-1])
        elems.append((tag, xs, attrs))
    return elems


def netlist(path):
    elems = load(path)
    parent = {}

    def find(p):
        parent.setdefault(p, p)
        while parent[p] != p:
            parent[p] = parent[parent[p]]
            p = parent[p]
        return p

    def union(p, q):
        rp, rq = find(p), find(q)
        if rp != rq:
            parent[rp] = rq

    # register every post
    for tag, xs, at in elems:
        for _, p in posts(tag, xs, at):
            find(p)
    # wires short their two ends together
    for tag, xs, at in elems:
        if tag == "w":
            union((xs[0], xs[1]), (xs[2], xs[3]))

    # name the nodes
    names, n = {}, [0]
    for tag, xs, at in elems:
        if tag == "g":
            names[find((xs[0], xs[1]))] = "GND"
        if tag == "ln":
            names[find((xs[0], xs[1]))] = at.get("te", "?")

    def nodename(p):
        r = find(p)
        if r not in names:
            n[0] += 1
            names[r] = "n%d" % n[0]
        return names[r]

    out = []
    for tag, xs, at in elems:
        if tag in ("w", "ln"):
            continue
        val = (at.get("r") or at.get("c") or at.get("l") or at.get("maxv")
               or at.get("ma") or at.get("ra") or "")
        conns = ["%s=%s" % (nm, nodename(p)) for nm, p in posts(tag, xs, at)]
        out.append("%-9s %-12s %s" % (tag, val, " ".join(conns)))
    return out


if __name__ == "__main__":
    for f in sorted(glob.glob(sys.argv[1])):
        print("=" * 70)
        print(os.path.basename(f))
        print("=" * 70)
        for line in netlist(f):
            print("  " + line)
        print()
