"""
Persistent JSON-line "server" for the WPF app to drive without paying Python
interpreter/shapely-import startup cost on every parameter tweak.

Protocol: one JSON object per line on stdin, one JSON object per line on
stdout, in the same order (no request IDs needed -- strictly request/response,
one at a time). Every response is either {"ok": true, ...} or {"ok": false,
"error": "..."}. Never let an exception kill the process -- always answer.

Commands (request "cmd"):
  "ping"          -> {"ok": true, "pong": true}
  "outline"       -> params -> {"ok": true, "outline": [[x,y], ...], "derived": {...}, "warnings": [...]}
  "export_step"   -> params + "path" -> {"ok": true, "path": "..."}
  "export_dxf"    -> params + "path" -> {"ok": true, "path": "..."}

params (all optional except z and module_mm/diametral_pitch):
  unit: "metric" | "inch"
  z: int
  module_mm: float          (metric)
  diametral_pitch: float    (inch, 1/in)
  pressure_angle_deg: float
  profile_shift: float
  addendum_coeff, dedendum_coeff, root_fillet_coeff: float
  face_width_mm: float
  backlash_mm: float
  bore_diameter_mm: float
"""
import json
import math
import sys
import traceback

from involute import GearParams, full_gear_outline, single_tooth_polygon
from bevel import BevelGearParams
from worm import WormParams, thread_axial_profile
from rack import RackParams, rack_outline
from internal import InternalGearParams, internal_gear_outline


def params_from_request(p: dict) -> GearParams:
    unit = p.get("unit", "metric")
    z = int(p["z"])
    kw = dict(
        pressure_angle_deg=float(p.get("pressure_angle_deg", 20.0)),
        profile_shift=float(p.get("profile_shift", 0.0)),
        addendum_coeff=float(p.get("addendum_coeff", 1.0)),
        dedendum_coeff=float(p.get("dedendum_coeff", 1.25)),
        root_fillet_coeff=float(p.get("root_fillet_coeff", 0.38)),
        face_width_mm=float(p.get("face_width_mm", 10.0)),
        backlash_mm=float(p.get("backlash_mm", 0.0)),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
        helix_angle_deg=float(p.get("helix_angle_deg", 0.0)),
        hand=str(p.get("hand", "right")),
    )
    if unit == "inch":
        return GearParams.from_inch(z=z, diametral_pitch=float(p["diametral_pitch"]), **kw)
    return GearParams.from_metric(z=z, module_mm=float(p["module_mm"]), **kw)


def derived_values(gp: GearParams) -> dict:
    warnings = []
    is_helical = abs(gp.helix_angle_deg) > 1e-9
    pa_label = "transverse pressure angle" if is_helical else "pressure angle"

    if gp.z < 4:
        warnings.append("Tooth count below 4 is not supported.")
    # z_min uses alpha_rad, which is already the TRANSVERSE pressure angle for
    # a helical gear (docs/gear-math.md 7.1-7.2) -- this warning is correct
    # for both spur and helical without any extra branching.
    z_min_eff = 2.0 * max(gp.addendum_coeff - gp.profile_shift, 0.01) / (math.sin(gp.alpha_rad) ** 2)
    if gp.z < z_min_eff:
        warnings.append(
            f"z={gp.z} is below the undercut cutoff (~{z_min_eff:.1f} teeth at "
            f"{math.degrees(gp.alpha_rad):.1f}deg {pa_label}, shift={gp.profile_shift:g}) -- "
            f"this gear WILL show real undercut at the tooth root."
        )
    if gp.dedendum_radius <= 0:
        warnings.append("Root (dedendum) circle radius is zero or negative -- reduce dedendum or increase teeth/module.")
    if gp.bore_diameter_mm > 0 and gp.bore_diameter_mm >= 2 * gp.dedendum_radius * 0.9:
        warnings.append("Bore diameter is close to or exceeds the root diameter.")
    if is_helical and abs(math.degrees(gp.twist_total_rad)) > 170:
        warnings.append(
            f"This helix angle and face width twist the tooth by "
            f"{abs(math.degrees(gp.twist_total_rad)):.0f}deg end to end -- unusually large; "
            f"double-check the helix angle and face width."
        )

    return {
        "pitch_diameter_mm": 2 * gp.pitch_radius,
        "base_diameter_mm": 2 * gp.base_radius,
        "addendum_diameter_mm": 2 * gp.addendum_radius,
        "dedendum_diameter_mm": 2 * gp.dedendum_radius,
        "circular_tooth_thickness_mm": gp.circular_tooth_thickness,
        "module_mm": gp.module_mm,
        "diametral_pitch": 25.4 / gp.module_mm,
        "z_min_no_undercut": z_min_eff,
        "transverse_module_mm": gp.transverse_module_mm,
        "transverse_pressure_angle_deg": math.degrees(gp.transverse_pressure_angle_rad),
        "twist_total_deg": math.degrees(gp.twist_total_rad),
        "lead_mm": (2 * math.pi * gp.pitch_radius / math.tan(gp.helix_angle_rad)) if is_helical else 0.0,
    }, warnings


def herringbone_derived_values(gp: GearParams, gap_mm: float) -> tuple[dict, list]:
    """A double-helical gear is two helical halves (docs/gear-math.md 7.4):
    the cylindrical derived values apply unchanged (same transverse profile,
    same lead), plus the per-half numbers the build actually uses."""
    derived, warnings = derived_values(gp)
    fw = gp.face_width_mm
    if abs(gp.helix_angle_deg) < 1e-9:
        warnings.append("A double-helical gear needs a helix angle -- at 0deg this is just a spur gear.")
    if gap_mm < 0 or gap_mm >= fw:
        warnings.append(f"Centre gap ({gap_mm:g} mm) must be smaller than the face width ({fw:g} mm).")
        gap_mm = 0.0
    half = (fw - gap_mm) / 2.0
    derived["gap_mm"] = gap_mm
    derived["half_face_width_mm"] = half
    derived["twist_per_half_deg"] = derived["twist_total_deg"] * half / fw if fw > 0 else 0.0
    # Every twist warning derived_values() emits is about the WHOLE face; for
    # a herringbone each half only twists by half the gap-less amount, so
    # re-issue it against the per-half figure instead.
    warnings = [w for w in warnings if not w.startswith("This helix angle and face width twist")]
    if abs(derived["twist_per_half_deg"]) > 170:
        warnings.append(
            f"This helix angle and face width twist each half by "
            f"{abs(derived['twist_per_half_deg']):.0f}deg -- unusually large; "
            f"double-check the helix angle and face width.")
    return derived, warnings


def bevel_params_from_request(p: dict) -> BevelGearParams:
    return BevelGearParams(
        z=int(p["z"]),
        module_mm=float(p["module_mm"]),
        mate_teeth=int(p.get("mate_teeth", p["z"])),
        shaft_angle_deg=float(p.get("shaft_angle_deg", 90.0)),
        pressure_angle_deg=float(p.get("pressure_angle_deg", 20.0)),
        addendum_coeff=float(p.get("addendum_coeff", 1.0)),
        dedendum_coeff=float(p.get("dedendum_coeff", 1.25)),
        root_fillet_coeff=float(p.get("root_fillet_coeff", 0.38)),
        face_width_mm=float(p.get("face_width_mm", 10.0)),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
        pitch_angle_deg_override=(float(p["pitch_angle_deg_override"])
                                   if p.get("pitch_angle_deg_override") is not None else None),
    )


def bevel_derived_values(bp: BevelGearParams) -> dict:
    warnings = []
    if bp.z < 4:
        warnings.append("Tooth count below 4 is not supported.")
    if bp.pitch_angle_deg <= 1.0 or bp.pitch_angle_deg >= 89.0:
        warnings.append(
            f"Pitch angle is {bp.pitch_angle_deg:.1f}deg -- very close to the flat (crown, 90deg) or "
            f"thin (0deg) limit where Tredgold's approximation and this geometry break down; "
            f"try a mate tooth count closer to this gear's own, or a shaft angle nearer 90deg."
        )
    if bp.face_width_mm >= bp.outer_cone_distance * 0.5:
        warnings.append(
            f"Face width ({bp.face_width_mm:g} mm) is unusually large relative to the cone distance "
            f"({bp.outer_cone_distance:.1f} mm) -- real bevel gears typically keep face width under "
            f"about 1/3 of the cone distance so the tooth doesn't taper to nothing near the toe."
        )
    # NOTE: these must be the REAL, physically-measurable radii at the heel
    # (what a caliper would read), not flat_gp.addendum_radius/dedendum_radius
    # -- those use the flat/virtual pitch radius (m*z_v/2) and are only
    # meaningful as inputs to the tooth-shape construction, not as a
    # real-world dimension (caught by checking against a hand-computed value
    # -- z_v-based radii came out ~50% too large). A first "fix" attempt used
    # a naive planar offset (pitch_radius +/- module*coeff), which is ALSO
    # wrong for a cone: the standard bevel formula projects the addendum
    # through cos(gamma) (Do = D + 2*cos(gamma)*ha), since the offset is
    # measured perpendicular to the pitch cone, not purallel to the axis.
    # Rather than encode that formula a third time (and risk a third
    # inconsistency), reuse flat_point_to_cone directly -- the exact function
    # the actual solid is built from -- at dr_heel = +/-addendum/dedendum
    # height, s=Re, theta=0.
    from bevel import flat_point_to_cone
    gamma = bp.pitch_angle_rad
    re = bp.outer_cone_distance
    r_pitch_flat_heel = bp.heel_pitch_radius / math.cos(gamma)
    ha = bp.module_mm * bp.addendum_coeff
    hf = bp.module_mm * bp.dedendum_coeff
    ax, ay, _ = flat_point_to_cone(0.0, r_pitch_flat_heel + ha, re, gamma, re, bp.heel_pitch_radius)
    dx, dy, _ = flat_point_to_cone(0.0, r_pitch_flat_heel - hf, re, gamma, re, bp.heel_pitch_radius)
    heel_addendum_radius = math.hypot(ax, ay)
    heel_dedendum_radius = math.hypot(dx, dy)
    if heel_dedendum_radius <= 0:
        warnings.append("Root (dedendum) radius at the heel is zero or negative -- reduce dedendum or increase teeth/module.")

    return {
        "pitch_angle_deg": bp.pitch_angle_deg,
        "heel_pitch_diameter_mm": 2 * bp.heel_pitch_radius,
        "outer_cone_distance_mm": bp.outer_cone_distance,
        "z_virtual": bp.z_virtual,
        "heel_addendum_diameter_mm": 2 * heel_addendum_radius,
        "heel_dedendum_diameter_mm": 2 * heel_dedendum_radius,
    }, warnings


def bevel_heel_tooth_outline(bp: BevelGearParams, simplify_tolerance_mm: float = 0.01):
    flat_gp = bp.to_flat_gear_params()
    tooth = single_tooth_polygon(flat_gp, z_virtual=bp.z_virtual)
    if simplify_tolerance_mm > 0:
        tooth = tooth.simplify(simplify_tolerance_mm, preserve_topology=True)
    coords = list(tooth.exterior.coords)
    if coords and coords[0] == coords[-1]:
        coords = coords[:-1]
    rf_flat = flat_gp.dedendum_radius
    return [(x, y) for (x, y) in coords if math.hypot(x, y) >= rf_flat - 1e-6]


def worm_params_from_request(p: dict) -> WormParams:
    return WormParams(
        starts=int(p.get("starts", 2)),
        axial_module_mm=float(p["module_mm"]),
        pitch_diameter_mm=float(p["pitch_diameter_mm"]),
        pressure_angle_deg=float(p.get("pressure_angle_deg", 20.0)),
        addendum_coeff=float(p.get("addendum_coeff", 1.0)),
        dedendum_coeff=float(p.get("dedendum_coeff", 1.25)),
        root_fillet_coeff=float(p.get("root_fillet_coeff", 0.2)),
        length_mm=float(p.get("face_width_mm", 30.0)),
        hand=str(p.get("hand", "right")),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
    )


def worm_derived_values(wp: WormParams, wheel_teeth: int = 0) -> dict:
    warnings = []
    if wp.dedendum_radius_mm <= 0:
        warnings.append("Root (dedendum) radius is zero or negative -- reduce dedendum or increase pitch diameter/module.")
    if wp.starts < 1:
        warnings.append("Number of starts must be at least 1.")
    if wp.lead_angle_deg < 2 or wp.lead_angle_deg > 45:
        warnings.append(
            f"Lead angle is {wp.lead_angle_deg:.1f}deg -- unusually low or high for a worm; "
            f"double check starts, module and pitch diameter (typical worms run roughly 5-30deg)."
        )
    if wp.length_mm < wp.axial_pitch_mm * 3:
        warnings.append("Length is quite short relative to the axial pitch -- fewer than 3 full threads will fit.")

    return {
        "pitch_diameter_mm": wp.pitch_diameter_mm,
        "lead_mm": wp.lead_mm,
        "lead_angle_deg": wp.lead_angle_deg,
        "axial_pitch_mm": wp.axial_pitch_mm,
        "addendum_diameter_mm": 2 * wp.addendum_radius_mm,
        "dedendum_diameter_mm": 2 * wp.dedendum_radius_mm,
        "wheel_module_mm": wp.axial_module_mm,
        "wheel_helix_angle_deg": wp.lead_angle_deg,
        "center_distance_mm": wp.center_distance(wheel_teeth) if wheel_teeth > 0 else 0.0,
    }, warnings


def worm_axial_outline(wp: WormParams):
    """The thread's own flat axial-section profile (a genuine flat pattern,
    unlike bevel's heel-only reference -- see export_worm_profile_dxf)."""
    return thread_axial_profile(wp)


def rack_params_from_request(p: dict) -> RackParams:
    return RackParams(
        z=int(p.get("z", 10)),
        module_mm=float(p["module_mm"]),
        pressure_angle_deg=float(p.get("pressure_angle_deg", 20.0)),
        addendum_coeff=float(p.get("addendum_coeff", 1.0)),
        dedendum_coeff=float(p.get("dedendum_coeff", 1.25)),
        root_fillet_coeff=float(p.get("root_fillet_coeff", 0.38)),
        backlash_mm=float(p.get("backlash_mm", 0.0)),
        face_width_mm=float(p.get("face_width_mm", 10.0)),
        backing_height_mm=float(p.get("backing_height_mm", 5.0)),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
        helix_angle_deg=float(p.get("helix_angle_deg", 0.0)),
        hand=str(p.get("hand", "right")),
    )


def rack_derived_values(rp: RackParams) -> dict:
    warnings = []
    if rp.z < 2:
        warnings.append("Fewer than 2 teeth -- a rack needs at least 2 to be meaningful.")
    is_helical = abs(rp.helix_angle_deg) > 1e-9
    # circular_pitch/tooth_thickness/total_length are along the rack's own
    # length -- transverse values for a helical rack (docs/gear-math.md 10.4)
    return {
        "circular_pitch_mm": rp.circular_pitch_mm,
        "circular_tooth_thickness_mm": rp.circular_tooth_thickness_mm,
        "addendum_height_mm": rp.addendum_height_mm,
        "dedendum_height_mm": rp.dedendum_height_mm,
        "total_length_mm": rp.total_length_mm,
        "total_height_mm": rp.total_height_mm,
        "module_mm": rp.module_mm,
        "diametral_pitch": 25.4 / rp.module_mm,
        "helix_angle_deg": rp.helix_angle_deg,
        "transverse_module_mm": rp.transverse_module_mm,
        "transverse_pressure_angle_deg": math.degrees(rp.transverse_pressure_angle_rad),
        "normal_pitch_mm": rp.normal_pitch_mm,
        "normal_tooth_thickness_mm": rp.circular_tooth_thickness_mm * math.cos(rp.helix_angle_rad) if is_helical
                                     else rp.circular_tooth_thickness_mm,
    }, warnings


def internal_params_from_request(p: dict) -> InternalGearParams:
    return InternalGearParams(
        z=int(p.get("z", 40)),
        module_mm=float(p["module_mm"]),
        pressure_angle_deg=float(p.get("pressure_angle_deg", 20.0)),
        addendum_coeff=float(p.get("addendum_coeff", 1.0)),
        dedendum_coeff=float(p.get("dedendum_coeff", 1.25)),
        root_fillet_coeff=float(p.get("root_fillet_coeff", 0.38)),
        cutter_teeth=int(p.get("cutter_teeth", 0)),
        face_width_mm=float(p.get("face_width_mm", 10.0)),
        rim_thickness_mm=float(p.get("rim_thickness_mm", 6.0)),
        backlash_mm=float(p.get("backlash_mm", 0.0)),
    )


def internal_derived_values(ip: InternalGearParams, pinion_teeth: int = 0) -> dict:
    warnings = []
    if ip.cutter_teeth >= ip.z:
        warnings.append("Construction cutter tooth count should be smaller than the ring's own tooth count.")
    if pinion_teeth > 0 and pinion_teeth >= ip.z:
        warnings.append("Mating pinion must have fewer teeth than the ring gear.")
    center_distance = (ip.pitch_radius - (ip.module_mm * pinion_teeth / 2.0)) if pinion_teeth > 0 else 0.0
    return {
        "pitch_diameter_mm": 2 * ip.pitch_radius,
        "base_diameter_mm": 2 * ip.base_radius,
        "addendum_diameter_mm": 2 * ip.addendum_radius,
        "dedendum_diameter_mm": 2 * ip.dedendum_radius,
        "outer_diameter_mm": 2 * ip.outer_radius,
        "cutter_teeth": ip.cutter_teeth,
        "center_distance_mm": center_distance,
    }, warnings


def handle(req: dict) -> dict:
    cmd = req.get("cmd")
    if cmd == "ping":
        return {"ok": True, "pong": True}

    gear_type = req.get("gear_type", "cylindrical")  # "cylindrical" | "herringbone" | "bevel" | "worm" | "rack" | "internal"
    # A herringbone is the cylindrical family's transverse profile built
    # into two opposite-hand halves (docs/gear-math.md 7.4) -- same params
    # plus the centre gap.
    gap_mm = float(req.get("gap_mm", 0.0) or 0.0)

    if cmd == "outline":
        if gear_type == "herringbone":
            gp = params_from_request(req)
            outline = full_gear_outline(gp, simplify_tolerance_mm=float(req.get("simplify_tolerance_mm", 0.01)))
            derived, warnings = herringbone_derived_values(gp, gap_mm)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "bevel":
            bp = bevel_params_from_request(req)
            outline = bevel_heel_tooth_outline(bp)
            derived, warnings = bevel_derived_values(bp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "worm":
            wp = worm_params_from_request(req)
            outline = worm_axial_outline(wp)
            derived, warnings = worm_derived_values(wp, wheel_teeth=int(req.get("mate_teeth", 0)))
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "rack":
            rp = rack_params_from_request(req)
            outline = rack_outline(rp)
            derived, warnings = rack_derived_values(rp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "internal":
            ip = internal_params_from_request(req)
            outline = internal_gear_outline(ip)
            derived, warnings = internal_derived_values(ip, pinion_teeth=int(req.get("mate_teeth", 0)))
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        gp = params_from_request(req)
        outline = full_gear_outline(gp, simplify_tolerance_mm=float(req.get("simplify_tolerance_mm", 0.01)))
        derived, warnings = derived_values(gp)
        return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}

    if cmd == "export_step":
        path = req["path"]
        if gear_type == "bevel":
            from build_gear import export_bevel_step
            bp = bevel_params_from_request(req)
            export_bevel_step(bp, path)
        elif gear_type == "worm":
            from build_gear import export_worm_step
            wp = worm_params_from_request(req)
            export_worm_step(wp, path)
        elif gear_type == "rack":
            from build_gear import export_rack_step
            rp = rack_params_from_request(req)
            export_rack_step(rp, path)
        elif gear_type == "internal":
            from build_gear import export_internal_gear_step
            ip = internal_params_from_request(req)
            export_internal_gear_step(ip, path)
        elif gear_type == "herringbone":
            from build_gear import export_double_helical_step
            gp = params_from_request(req)
            export_double_helical_step(gp, gap_mm, path)
        else:
            from build_gear import export_step
            gp = params_from_request(req)
            export_step(gp, path)
        return {"ok": True, "path": path}

    if cmd == "export_dxf":
        path = req["path"]
        if gear_type == "bevel":
            from build_gear import export_bevel_heel_profile_dxf
            bp = bevel_params_from_request(req)
            export_bevel_heel_profile_dxf(bp, path)
        elif gear_type == "worm":
            from build_gear import export_worm_profile_dxf
            wp = worm_params_from_request(req)
            export_worm_profile_dxf(wp, path)
        elif gear_type == "rack":
            from build_gear import export_rack_profile_dxf
            rp = rack_params_from_request(req)
            export_rack_profile_dxf(rp, path)
        elif gear_type == "internal":
            from build_gear import export_internal_gear_profile_dxf
            ip = internal_params_from_request(req)
            export_internal_gear_profile_dxf(ip, path)
        else:
            # cylindrical AND herringbone: the DXF is the transverse section,
            # which a double-helical gear shares with its helical halves
            from build_gear import export_dxf_profile
            gp = params_from_request(req)
            export_dxf_profile(gp, path)
        return {"ok": True, "path": path}

    if cmd == "export_mesh":
        # STL tessellation of the actual 3D solid, for the live 3D viewer
        # (GearGen.UI's HelixViewport3D) -- NOT the flat 2D outline, so bore,
        # helix twist, cone taper etc. are all visible exactly as they'll
        # export, not just implied by 2D parameters.
        path = req["path"]
        if gear_type == "bevel":
            from build_gear import build_bevel_gear_solid
            import build123d as bd
            bp = bevel_params_from_request(req)
            solid = build_bevel_gear_solid(bp, n_phi=150, simplify_tolerance_mm=0.04)
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "worm":
            from build_gear import build_worm_solid, build_gear_solid
            import build123d as bd
            wp = worm_params_from_request(req)
            solid = build_worm_solid(wp, n_per_turn=40)
            # If a mating wheel tooth count is set (MateTeeth, already sent
            # with every worm request for the center-distance hint text --
            # no new UI wiring needed), show the two the way every reference
            # illustration of a worm gear actually draws it: worm AND wheel
            # together, correctly meshing, not the worm in isolation.
            # wheel_gear_params() already computes the exact matching wheel
            # (same module/hand, helix = worm's lead angle); the wheel's own
            # axis is Z like the worm's own, so rotating it 90deg onto Y and
            # translating out by the center distance puts the two pitch
            # circles exactly tangent -- a real, geometrically correct mesh
            # position, not just a schematic placeholder. STEP/DXF export is
            # untouched (still the worm alone, per the existing "build the
            # wheel separately via the Helical card" convention) -- this
            # only changes what the live preview shows.
            mate_teeth = int(req.get("mate_teeth", 0))
            if mate_teeth > 0:
                wheel_gp = wp.wheel_gear_params(mate_teeth)
                wheel_gp.face_width_mm = max(6.0, 8.0 * wp.axial_module_mm)
                wheel_gp.bore_diameter_mm = wp.bore_diameter_mm
                wheel_solid = build_gear_solid(wheel_gp)
                # build_gear_solid's own extrusion is NOT centered on its
                # sketch plane -- it spans local Z=[0, face_width_mm], not
                # [-face_width/2, +face_width/2] (confirmed by checking the
                # built solid's own bounding box, not assumed) -- so
                # rotating it as-is lands the wheel offset by a whole
                # face-width to one side of the worm's own center instead of
                # straddling it, which is what actually produced the
                # confusing, seemingly-non-meshing render this was caught
                # from. Center it first.
                wheel_centered = wheel_solid.translate((0, 0, -wheel_gp.face_width_mm / 2.0))
                cd = wp.center_distance(mate_teeth)
                wheel_positioned = wheel_centered.rotate(bd.Axis.X, 90).translate((cd, 0, 0))
                solid = bd.Compound(children=[solid, wheel_positioned])
            # The preview wheel is a helical gear (helix = lead angle), so
            # its twisted flanks need the same finer tessellation the
            # cylindrical branch below uses for helical gears, or they band.
            # The worm's own flanks are flat loft strips and tessellate
            # exactly at any tolerance, so tightening costs it little.
            tol = 0.002 if mate_teeth > 0 else 0.02
            bd.export_stl(solid, path, tolerance=tol, angular_tolerance=0.3)
        elif gear_type == "rack":
            from build_gear import build_rack_solid
            import build123d as bd
            rp = rack_params_from_request(req)
            solid = build_rack_solid(rp)
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "internal":
            from build_gear import build_internal_gear_solid
            import build123d as bd
            ip = internal_params_from_request(req)
            solid = build_internal_gear_solid(ip)
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "herringbone":
            from build_gear import build_double_helical_solid
            import build123d as bd
            gp = params_from_request(req)
            if abs(gp.helix_angle_deg) < 1e-9:
                gp.helix_angle_deg = 30.0  # the outline/derived call already warned; still show SOMETHING sensible
            if gap_mm < 0 or gap_mm >= gp.face_width_mm:
                gap_mm = 0.0
            solid = build_double_helical_solid(gp, gap_mm=gap_mm, simplify_tolerance_mm=0.03)
            # curved helicoidal flanks: same fine tessellation as the helical branch below
            bd.export_stl(solid, path, tolerance=0.002, angular_tolerance=0.3)
        else:
            from build_gear import build_gear_solid
            import build123d as bd
            gp = params_from_request(req)
            solid = build_gear_solid(gp, simplify_tolerance_mm=0.03)
            # A helical gear's flanks are now an exact helicoidal sweep
            # (build_gear_solid) -- genuinely curved, and the viewer flat-
            # shades each triangle, so how smooth the twist LOOKS is purely
            # how finely that curved surface is tessellated here. Measured,
            # not guessed: at the 0.02 mm used for everything else the
            # surface comes out at ~1.4k triangles (it tessellates
            # economically -- each is within tolerance, but the normal jumps
            # between them read as bands); 0.002 mm gives ~4-9k triangles
            # and an in-tolerance mesh in ~0.05 s. Angular tolerance turned
            # out to have no effect on this surface at all (identical
            # output at 0.3/0.1/0.05). Spur gears keep 0.02: flat faces
            # tessellate exactly regardless.
            tol = 0.002 if abs(gp.twist_total_rad) > 1e-9 else 0.02
            bd.export_stl(solid, path, tolerance=tol, angular_tolerance=0.3)
        return {"ok": True, "path": path}

    return {"ok": False, "error": f"unknown cmd: {cmd!r}"}


def main():
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            resp = handle(req)
        except Exception as e:
            resp = {"ok": False, "error": f"{type(e).__name__}: {e}", "traceback": traceback.format_exc()}
        sys.stdout.write(json.dumps(resp) + "\n")
        sys.stdout.flush()


if __name__ == "__main__":
    main()
