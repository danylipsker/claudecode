"""
One-time generation of representative 3D thumbnail images for the gear-family
gallery (GearGen.UI's mosaic selector). Not part of the live app -- run once,
commit the PNGs as UI assets.
"""
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import build123d as bd

from involute import GearParams
from bevel import BevelGearParams
from worm import WormParams
from rack import RackParams
from internal import InternalGearParams
from build_gear import (
    build_gear_solid, build_bevel_gear_solid, build_worm_solid,
    build_rack_solid, build_internal_gear_solid, build_double_helical_solid,
)


def render_solid_thumbnail(solid, out_path, elev=22, azim=35, color="#60A5FA", edge="#1D4ED8"):
    import tempfile, os
    with tempfile.NamedTemporaryFile(suffix=".stl", delete=False) as f:
        stl_path = f.name
    bd.export_stl(solid, stl_path, tolerance=0.03, angular_tolerance=0.4)

    # minimal ASCII/binary STL triangle reader (avoid extra deps)
    import struct
    with open(stl_path, "rb") as f:
        data = f.read()
    n = struct.unpack("<I", data[80:84])[0]
    tris = []
    off = 84
    for i in range(n):
        vs = struct.unpack("<9f", data[off + 12: off + 48])
        tris.append([(vs[0], vs[1], vs[2]), (vs[3], vs[4], vs[5]), (vs[6], vs[7], vs[8])])
        off += 50
    os.unlink(stl_path)

    fig = plt.figure(figsize=(4, 4), dpi=110)
    ax = fig.add_subplot(111, projection="3d")
    coll = Poly3DCollection(tris, facecolor=color, edgecolor=edge, linewidths=0.05, alpha=1.0)
    ax.add_collection3d(coll)

    pts = np.array([p for t in tris for p in t])
    mins, maxs = pts.min(axis=0), pts.max(axis=0)
    center = (mins + maxs) / 2
    span = (maxs - mins).max() / 2 * 1.1
    ax.set_xlim(center[0] - span, center[0] + span)
    ax.set_ylim(center[1] - span, center[1] + span)
    ax.set_zlim(center[2] - span, center[2] + span)
    ax.set_box_aspect([1, 1, 1])
    ax.view_init(elev=elev, azim=azim)
    ax.set_axis_off()
    fig.patch.set_alpha(0)
    ax.set_facecolor("none")
    fig.subplots_adjust(left=0, right=1, top=1, bottom=0)
    fig.savefig(out_path, dpi=110, transparent=True)
    plt.close(fig)
    print("wrote", out_path)


if __name__ == "__main__":
    out_dir = "../src/GearGen.UI/Assets"
    import os
    os.makedirs(out_dir, exist_ok=True)

    spur = GearParams.from_metric(z=16, module_mm=3.0, face_width_mm=14.0, bore_diameter_mm=10.0)
    render_solid_thumbnail(build_gear_solid(spur), f"{out_dir}/thumb_spur.png")

    helical = GearParams.from_metric(z=18, module_mm=2.5, face_width_mm=16.0,
                                      bore_diameter_mm=8.0, helix_angle_deg=25.0, hand="right")
    render_solid_thumbnail(build_gear_solid(helical), f"{out_dir}/thumb_helical.png")

    bevel = BevelGearParams(z=16, module_mm=3.0, mate_teeth=16, shaft_angle_deg=90.0,
                             face_width_mm=10.0, bore_diameter_mm=6.0)
    render_solid_thumbnail(build_bevel_gear_solid(bevel, n_phi=120, simplify_tolerance_mm=0.05),
                            f"{out_dir}/thumb_bevel.png")

    worm = WormParams(starts=2, axial_module_mm=2.0, pitch_diameter_mm=20.0, length_mm=30.0, bore_diameter_mm=6.0)
    render_solid_thumbnail(build_worm_solid(worm, n_per_turn=40), f"{out_dir}/thumb_worm.png")

    rack = RackParams(z=8, module_mm=3.0, face_width_mm=12.0, backing_height_mm=6.0)
    render_solid_thumbnail(build_rack_solid(rack), f"{out_dir}/thumb_rack.png", elev=28, azim=-35)

    internal = InternalGearParams(z=32, module_mm=2.5, face_width_mm=12.0, rim_thickness_mm=6.0, cutter_teeth=16)
    render_solid_thumbnail(build_internal_gear_solid(internal), f"{out_dir}/thumb_internal.png")

    herringbone = GearParams.from_metric(z=18, module_mm=2.5, face_width_mm=20.0,
                                          bore_diameter_mm=8.0, helix_angle_deg=30.0, hand="right")
    render_solid_thumbnail(build_double_helical_solid(herringbone, gap_mm=0.0), f"{out_dir}/thumb_herringbone.png")

    print("done")
