"""Render the globoid (double-enveloping) worm drive -- the worm and its
throated wheel in mesh -- as shaded PNGs from a few angles, for docs and
quick visual checks of the geometry the export produces.

Not part of the live app: run it directly, from this directory.

    python render_globoid.py [out_dir]      # out_dir default: the current dir

It reads the built solids' surface triangles from a binary STL export and
draws them two-toned (bronze worm, steel-blue wheel) with a simple two-sided
diffuse shade. matplotlib has no depth buffer, so the result is flat-lit and
can show minor face-ordering artefacts where the members mesh -- open the
.sldprt for a photoreal view. It is enough to read the form: the worm's
concave hourglass throat and the wheel's teeth waisted to wrap it.
"""
import os
import struct
import sys
import tempfile

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import build123d as bd

from globoid_worm import GloboidWormParams
from throated_wheel import build_globoid_pair

WORM_COLOR = (0.86, 0.53, 0.20)    # bronze
WHEEL_COLOR = (0.42, 0.55, 0.72)   # steel-blue
VIEWS = (("iso", 26, 40), ("top", 60, 25), ("side", 8, 90))   # (tag, elevation, azimuth) degrees


def triangles(solid, tolerance: float = 0.02, angular_tolerance: float = 0.3) -> np.ndarray:
    """The solid's surface triangles as an (n, 3, 3) array, via a binary STL."""
    with tempfile.NamedTemporaryFile(suffix=".stl", delete=False) as f:
        stl = f.name
    try:
        bd.export_stl(solid, stl, tolerance=tolerance, angular_tolerance=angular_tolerance)
        data = open(stl, "rb").read()
    finally:
        os.unlink(stl)
    n = struct.unpack("<I", data[80:84])[0]
    tris = np.empty((n, 3, 3))
    off = 84
    for i in range(n):
        tris[i] = np.array(struct.unpack("<9f", data[off + 12:off + 48])).reshape(3, 3)
        off += 50
    return tris


def shaded(tris: np.ndarray, base, light=(0.35, 0.45, 0.82)) -> np.ndarray:
    """Per-triangle colours: the base colour scaled by a two-sided diffuse
    term |face-normal . light|, so the form reads without a real renderer."""
    light = np.array(light) / np.linalg.norm(light)
    nrm = np.cross(tris[:, 1] - tris[:, 0], tris[:, 2] - tris[:, 0])
    ln = np.linalg.norm(nrm, axis=1, keepdims=True)
    ln[ln == 0] = 1.0
    diffuse = np.abs((nrm / ln) @ light)[:, None]
    return np.clip(np.array(base)[None, :] * (0.35 + 0.65 * diffuse), 0.0, 1.0)


def render_globoid_pair(gp: GloboidWormParams, out_dir: str, views=VIEWS) -> list:
    """Build the pair in mesh and save one shaded PNG per view; returns the paths."""
    worm, wheel = build_globoid_pair(gp, worm_turn_deg=0.0)
    wt, ht = triangles(worm), triangles(wheel)
    pts = np.vstack([wt.reshape(-1, 3), ht.reshape(-1, 3)])
    centre = (pts.min(0) + pts.max(0)) / 2.0
    span = (pts.max(0) - pts.min(0)).max() / 2.0 * 1.05
    paths = []
    for tag, elev, azim in views:
        fig = plt.figure(figsize=(7, 7), dpi=150)
        fig.patch.set_facecolor("white")
        ax = fig.add_subplot(111, projection="3d")
        ax.set_facecolor("white")
        ax.add_collection3d(Poly3DCollection(wt, facecolors=shaded(wt, WORM_COLOR), linewidths=0))
        ax.add_collection3d(Poly3DCollection(ht, facecolors=shaded(ht, WHEEL_COLOR), linewidths=0))
        ax.set_xlim(centre[0] - span, centre[0] + span)
        ax.set_ylim(centre[1] - span, centre[1] + span)
        ax.set_zlim(centre[2] - span, centre[2] + span)
        ax.set_box_aspect([1, 1, 1])
        ax.view_init(elev=elev, azim=azim)
        ax.set_axis_off()
        fig.subplots_adjust(left=0, right=1, top=1, bottom=0)
        path = os.path.join(out_dir, f"globoid_{tag}.png")
        fig.savefig(path, dpi=150, facecolor="white")
        plt.close(fig)
        paths.append(path)
    return paths


if __name__ == "__main__":
    out_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(out_dir, exist_ok=True)
    # the card's default double-enveloping set: 2 starts, 20 wheel teeth
    gp = GloboidWormParams(starts=2, wheel_teeth=20, axial_module_mm=2.0,
                           pitch_diameter_mm=20.0, envelope_teeth=4.0)
    for path in render_globoid_pair(gp, out_dir):
        print("wrote", path)
