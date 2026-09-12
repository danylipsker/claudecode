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

    helical_rack = RackParams(z=8, module_mm=3.0, face_width_mm=14.0, backing_height_mm=6.0, helix_angle_deg=30.0)
    render_solid_thumbnail(build_rack_solid(helical_rack), f"{out_dir}/thumb_helical_rack.png", elev=28, azim=-35)

    internal = InternalGearParams(z=32, module_mm=2.5, face_width_mm=12.0, rim_thickness_mm=6.0, cutter_teeth=16)
    render_solid_thumbnail(build_internal_gear_solid(internal), f"{out_dir}/thumb_internal.png")

    herringbone = GearParams.from_metric(z=18, module_mm=2.5, face_width_mm=20.0,
                                          bore_diameter_mm=8.0, helix_angle_deg=30.0, hand="right")
    render_solid_thumbnail(build_double_helical_solid(herringbone, gap_mm=0.0), f"{out_dir}/thumb_herringbone.png")

    from crossed_helical import CrossedHelicalPairParams, build_crossed_helical_pair
    screw = CrossedHelicalPairParams(z1=18, z2=24, module_mm=2.0, helix1_deg=45.0, shaft_angle_deg=90.0,
                                     face_width_mm=12.0, bore_diameter_mm=6.0)
    s1, s2 = build_crossed_helical_pair(screw)
    render_solid_thumbnail(bd.Compound(children=[s1, s2]), f"{out_dir}/thumb_screw.png", elev=25, azim=-60)

    from planetary import PlanetaryParams, build_planetary_set
    planetary = PlanetaryParams(z_sun=12, z_planet=9, n_planets=3, module_mm=2.0, face_width_mm=8.0,
                                bore_diameter_mm=5.0, rim_thickness_mm=5.0)
    sun, planets, ring = build_planetary_set(planetary)
    render_solid_thumbnail(bd.Compound(children=[sun, *planets, ring]), f"{out_dir}/thumb_planetary.png", elev=40, azim=-50)

    from cycloidal import CycloidalGearParams, build_cycloidal_gear_solid
    cycloidal = CycloidalGearParams(z=8, module_mm=3.0, face_width_mm=10.0, bore_diameter_mm=6.0)
    render_solid_thumbnail(build_cycloidal_gear_solid(cycloidal), f"{out_dir}/thumb_cycloidal.png")

    from cycloidal_drive import CycloidalDriveParams, build_drive_assembly
    drive = CycloidalDriveParams(lobes=10, pin_circle_diameter_mm=60.0, roller_diameter_mm=6.0, eccentricity_mm=1.5,
                                 face_width_mm=8.0, bore_diameter_mm=20.0,
                                 output_pin_count=6, output_pin_diameter_mm=6.0, output_circle_diameter_mm=30.0)
    disc, rollers, out_pins = build_drive_assembly(drive)
    render_solid_thumbnail(bd.Compound(children=[disc, *rollers, *out_pins]), f"{out_dir}/thumb_cycdrive.png", elev=45, azim=-50)

    from spiral_bevel import SpiralBevelParams, build_spiral_bevel_gear_solid
    spiral = SpiralBevelParams(z=16, module_mm=3.0, mate_teeth=16, shaft_angle_deg=90.0,
                               face_width_mm=10.0, bore_diameter_mm=6.0, spiral_angle_deg=35.0)
    render_solid_thumbnail(build_spiral_bevel_gear_solid(spiral, n_stations=8, n_phi=120, simplify_tolerance_mm=0.05),
                           f"{out_dir}/thumb_spiral_bevel.png")
    zerol = SpiralBevelParams(z=16, module_mm=3.0, mate_teeth=16, shaft_angle_deg=90.0,
                              face_width_mm=10.0, bore_diameter_mm=6.0, spiral_angle_deg=0.0)
    render_solid_thumbnail(build_spiral_bevel_gear_solid(zerol, n_stations=8, n_phi=120, simplify_tolerance_mm=0.05),
                           f"{out_dir}/thumb_zerol_bevel.png")

    from face_gear import FaceGearParams, build_face_gear_solid, place_pinion
    face = FaceGearParams(z=32, pinion_teeth=16, module_mm=2.5, rim_thickness_mm=5.0, bore_diameter_mm=14.0)
    fg = build_face_gear_solid(face, simplify_tolerance_mm=0.05)
    fp_pin = place_pinion(build_gear_solid(face.pinion_params(), simplify_tolerance_mm=0.05), face)
    render_solid_thumbnail(bd.Compound(children=[fg, fp_pin]), f"{out_dir}/thumb_face_gear.png", elev=28, azim=-55)

    from sprocket import SprocketParams
    from build_gear import build_sprocket_solid
    sprocket = SprocketParams.from_ansi_chain_number("40", z=20, face_width_mm=8.0, bore_diameter_mm=10.0)
    render_solid_thumbnail(build_sprocket_solid(sprocket), f"{out_dir}/thumb_sprocket.png", elev=35, azim=-25)

    from chain_link import ChainLinkParams, build_chain_link_assembly
    link = ChainLinkParams(chain_pitch_mm=12.7, roller_diameter_mm=7.9248)
    render_solid_thumbnail(build_chain_link_assembly(link), f"{out_dir}/thumb_chain_link.png", elev=25, azim=-40)

    from timing_belt import TimingWheelParams, TimingBeltParams, build_pulley_solid, build_timing_belt_solid
    wheel = TimingWheelParams.from_standard("T5", z=20, face_width_mm=8.0, bore_diameter_mm=6.0)
    render_solid_thumbnail(build_pulley_solid(wheel), f"{out_dir}/thumb_timing_wheel.png", elev=35, azim=-25)
    belt = TimingBeltParams.from_standard("T5", n_teeth=8, belt_width_mm=8.0)
    render_solid_thumbnail(build_timing_belt_solid(belt), f"{out_dir}/thumb_timing_belt.png", elev=20, azim=-30)

    from hypoid import HypoidParams
    from build_gear import build_hypoid_pair_solid
    hyp = HypoidParams(z=30, pinion_teeth=12, module_mm=2.0, face_width_mm=8.0, offset_mm=6.0, spiral_angle_deg=35.0, bore_diameter_mm=10.0)
    render_solid_thumbnail(build_hypoid_pair_solid(hyp, n_positions=60, n_stations=5, n_profile=60, n_phi=120, simplify_tolerance_mm=0.04),
                           f"{out_dir}/thumb_hypoid.png", elev=25, azim=-50)

    from globoid_worm import GloboidWormParams
    from build_gear import build_globoid_pair_solid
    glob = GloboidWormParams(starts=1, wheel_teeth=30)
    render_solid_thumbnail(build_globoid_pair_solid(glob, n_positions=48, n_stations=7, n_profile=60), f"{out_dir}/thumb_globoid_worm.png", elev=25, azim=-50)

    from ec_gear import ECGearParams
    from build_gear import build_ec_pair_solid
    render_solid_thumbnail(build_ec_pair_solid(ECGearParams()), f"{out_dir}/thumb_ec_gear.png", elev=30, azim=-50)

    print("done")
