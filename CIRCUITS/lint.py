"""Layout lint for the generated CircuitJS files.

Finds three things the eye catches but a netlist check does not:

  OVERLAP   two collinear segments sharing a lane and covering the same span
  T-JOINT   an endpoint sitting part-way along another segment: it looks like a
            junction but CircuitJS only joins at shared endpoints, so it is not
            connected -- a genuine trap as well as a drawing error
  THRU-CHIP a wire crossing the body rectangle of a 555
"""
import glob, re, io, os, sys, collections

SKIP = {"cir", "x", "o", "adj", "rlm"}
# a Timer's drawn body, relative to its origin
CHIP = (16, -16, 112, 144)


def load(path):
    segs, chips = [], []
    for ln in io.open(path, encoding="ascii"):
        ln = ln.strip()
        m = re.match(r"<(\w+)\b(.*?)/?>$", ln)
        if not m:
            continue
        tag, rest = m.group(1), m.group(2)
        if tag in SKIP:
            continue
        am = re.search(r'x="([-\d ]+)"', rest)
        if not am:
            continue
        v = [int(t) for t in am.group(1).split()]
        if len(v) < 4:
            continue
        if tag == "Timer":
            chips.append((v[0] + CHIP[0], v[1] + CHIP[1], v[0] + CHIP[2], v[1] + CHIP[3]))
            continue
        if tag in ("g", "ln", "aout", "L", "M"):
            continue                      # single-post decorations
        if tag == "pt":
            continue                      # wiper offset is meaningful, not a diagonal
        segs.append((tag, (v[0], v[1]), (v[2], v[3])))
    return segs, chips


def horiz(s): return s[1][1] == s[2][1]
def vert(s):  return s[1][0] == s[2][0]


def span(s):
    """(lane, lo, hi, axis) for an axis-aligned segment; None if diagonal."""
    (x1, y1), (x2, y2) = s[1], s[2]
    if y1 == y2 and x1 != x2:
        return (y1, min(x1, x2), max(x1, x2), "h")
    if x1 == x2 and y1 != y2:
        return (x1, min(y1, y2), max(y1, y2), "v")
    return None


def on_segment(pt, s):
    """True when pt lies strictly between s's endpoints on an axis-aligned run."""
    sp = span(s)
    if not sp:
        return False
    lane, lo, hi, ax = sp
    if ax == "h":
        return pt[1] == lane and lo < pt[0] < hi
    return pt[0] == lane and lo < pt[1] < hi


def in_chip(pt, box):
    x0, y0, x1, y1 = box
    return x0 < pt[0] < x1 and y0 < pt[1] < y1


def crosses_chip(s, box):
    sp = span(s)
    if not sp:
        return False
    x0, y0, x1, y1 = box
    lane, lo, hi, ax = sp
    if ax == "h":
        return y0 < lane < y1 and lo < x1 and hi > x0
    return x0 < lane < x1 and lo < y1 and hi > y0


def lint(path):
    segs, chips = load(path)
    out = []
    for i in range(len(segs)):
        for j in range(i + 1, len(segs)):
            a, b = segs[i], segs[j]
            sa, sb = span(a), span(b)
            if not sa or not sb:
                continue
            if sa[3] == sb[3] and sa[0] == sb[0]:
                o = min(sa[2], sb[2]) - max(sa[1], sb[1])
                if o > 0:
                    out.append(("OVERLAP", "%s %s-%s  vs  %s %s-%s  (%dpx)"
                                % (a[0], a[1], a[2], b[0], b[1], b[2], o)))
    for i, a in enumerate(segs):
        for j, b in enumerate(segs):
            if i == j:
                continue
            for pt in (a[1], a[2]):
                if on_segment(pt, b):
                    out.append(("T-JOINT", "%s endpoint %s sits inside %s %s-%s"
                                % (a[0], pt, b[0], b[1], b[2])))
    for s in segs:
        for box in chips:
            if crosses_chip(s, box):
                out.append(("THRU-CHIP", "%s %s-%s crosses chip body %s"
                            % (s[0], s[1], s[2], box)))
    # de-duplicate the symmetric T-JOINT reports
    seen, uniq = set(), []
    for kind, msg in out:
        if msg in seen:
            continue
        seen.add(msg)
        uniq.append((kind, msg))
    return uniq


if __name__ == "__main__":
    pattern = sys.argv[1]
    tally = collections.Counter()
    for f in sorted(glob.glob(pattern)):
        issues = lint(f)
        if not issues:
            continue
        print(os.path.basename(f))
        for kind, msg in issues:
            tally[kind] += 1
            print("   %-10s %s" % (kind, msg))
        print()
    print("totals:", dict(tally) or "clean")
