"""tools/check-step.py -- read the generated STEP files back with OpenCascade
and check each one is a single, valid, watertight solid of the right size.

Volume is taken from a fine triangulation via the divergence theorem, NOT from
BRepGProp's analytic integrator: on a surface of linear extrusion over a
several-hundred-knot spline that integrator is wildly inaccurate (measured:
8465 and 16408 for the same body whose true volume is 10125). The mesh route
also proves the shell is closed and outward-facing, which is what actually
matters for a CAD import.

    python tools/check-step.py [outdir]
"""
import json
import math
import os
import sys
from collections import defaultdict

from OCP.STEPControl import STEPControl_Reader
from OCP.IFSelect import IFSelect_RetDone
from OCP.TopExp import TopExp_Explorer
from OCP.TopAbs import TopAbs_SOLID, TopAbs_SHELL, TopAbs_FACE, TopAbs_REVERSED
from OCP.TopoDS import TopoDS
from OCP.BRep import BRep_Tool
from OCP.BRepCheck import BRepCheck_Analyzer
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.TopLoc import TopLoc_Location
from OCP.Bnd import Bnd_Box
from OCP.BRepBndLib import BRepBndLib


def mesh_stats(shape, relative=4.0e-4):
    """Volume from the triangulation, plus whether the shell is watertight.

    The deflection is scaled to the model: a fixed absolute value that suits a
    20 mm test part makes a 130 mm gear take minutes to mesh for no extra
    accuracy."""
    box = Bnd_Box()
    BRepBndLib.Add_s(shape, box)
    x0, y0, z0, x1, y1, z1 = box.Get()
    diag = math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2 + (z1 - z0) ** 2)
    BRepMesh_IncrementalMesh(shape, max(diag * relative, 1e-4), False, 0.15, True)
    vol = 0.0
    tris = 0
    edge_use = defaultdict(int)
    ex = TopExp_Explorer(shape, TopAbs_FACE)
    while ex.More():
        face = TopoDS.Face_s(ex.Current())
        loc = TopLoc_Location()
        tri = BRep_Tool.Triangulation_s(face, loc)
        if tri is not None:
            trsf = loc.Transformation()
            rev = face.Orientation() == TopAbs_REVERSED
            for i in range(1, tri.NbTriangles() + 1):
                t = tri.Triangle(i)
                a, b, c = t.Get()
                if rev:
                    b, c = c, b
                pa = tri.Node(a).Transformed(trsf)
                pb = tri.Node(b).Transformed(trsf)
                pc = tri.Node(c).Transformed(trsf)
                vol += (pa.X() * (pb.Y() * pc.Z() - pc.Y() * pb.Z())
                        - pa.Y() * (pb.X() * pc.Z() - pc.X() * pb.Z())
                        + pa.Z() * (pb.X() * pc.Y() - pc.X() * pb.Y())) / 6.0
                tris += 1
                key = lambda p: (round(p.X(), 5), round(p.Y(), 5), round(p.Z(), 5))
                for u, v in ((pa, pb), (pb, pc), (pc, pa)):
                    ku, kv = key(u), key(v)
                    edge_use[(ku, kv) if ku < kv else (kv, ku)] += 1
        ex.Next()
    open_edges = sum(1 for n in edge_use.values() if n != 2)
    return vol, tris, open_edges


def count(shape, kind):
    n = 0
    ex = TopExp_Explorer(shape, kind)
    while ex.More():
        n += 1
        ex.Next()
    return n


out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "out")
manifest = json.load(open(os.path.join(out, "manifest.json")))

hdr = (f'{"case":<17}{"solids":<8}{"faces":<7}{"valid":<7}{"tight":<7}'
       f'{"volume":>12}{"expected":>12}{"err":>9}')
print(hdr)
print("-" * len(hdr))

bad = 0
for m in manifest:
    name = m["name"]
    rd = STEPControl_Reader()
    if rd.ReadFile(m["file"]) != IFSelect_RetDone:
        print(f'{name:<17}READ FAILED')
        bad += 1
        continue
    rd.TransferRoots()
    shape = rd.OneShape()

    solids = count(shape, TopAbs_SOLID)
    faces = count(shape, TopAbs_FACE)
    valid = BRepCheck_Analyzer(shape).IsValid()
    vol, tris, open_edges = mesh_stats(shape)

    exp = m["expectVolume"]
    err = abs(vol - exp) / abs(exp) * 100 if exp else float("nan")
    ok = (valid and solids == m.get("solids", 1) and open_edges == 0
          and vol > 0 and err < 1.0)
    if not ok:
        bad += 1
    print(f'{name:<17}{solids:<8}{faces:<7}{str(valid):<7}'
          f'{"yes" if open_edges == 0 else str(open_edges):<7}'
          f'{vol:>12.3f}{exp:>12.3f}{err:>8.3f}%{"" if ok else "   <-- PROBLEM"}')

print()
print("PROBLEM cases:", bad)
sys.exit(1 if bad else 0)
