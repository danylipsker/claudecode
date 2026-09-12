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


def pointed_cutter_warning(alpha_rad: float, dedendum_coeff: float, label: str) -> list:
    """At standard depth the generating rack's tooth is pointed once
    tan(alpha) >= pi / (4 hf*) -- 32.1deg for hf* = 1.25 (involute.
    rack_cutter_tooth_points then cuts it off at its point): the gear's
    root becomes a sharp V and the flanks are cut short of full depth."""
    if math.pi / 4.0 - dedendum_coeff * math.tan(alpha_rad) > 1e-9:
        return []
    limit = math.degrees(math.atan(math.pi / (4.0 * dedendum_coeff)))
    return [f"{label} {math.degrees(alpha_rad):.1f}deg is beyond {limit:.1f}deg, where the generating rack's tooth "
            f"becomes pointed at this dedendum: the root is a sharp V and the flanks are cut short. "
            f"Reduce the pressure angle (or the helix/spiral angle that raises the transverse one)."]


def derived_values(gp: GearParams) -> dict:
    warnings = []
    is_helical = abs(gp.helix_angle_deg) > 1e-9
    pa_label = "transverse pressure angle" if is_helical else "pressure angle"

    if gp.z < 4:
        warnings.append("Tooth count below 4 is not supported.")
    warnings += pointed_cutter_warning(gp.alpha_rad, gp.dedendum_coeff, pa_label.capitalize())
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


def screw_params_from_request(p: dict):
    """Crossed-helical (screw) pair -- docs/gear-math.md 7.5. z = gear 1,
    mate_teeth = gear 2, helix_angle_deg/hand = gear 1's, shaft_angle_deg =
    Sigma; gear 2's helix and hand follow. module_mm is the NORMAL module,
    already converted client-side for inch input (as bevel/worm/rack)."""
    from crossed_helical import CrossedHelicalPairParams
    return CrossedHelicalPairParams(
        z1=int(p["z"]),
        z2=int(p.get("mate_teeth") or p["z"]),
        module_mm=float(p["module_mm"]),
        helix1_deg=float(p.get("helix_angle_deg", 45.0)),
        shaft_angle_deg=float(p.get("shaft_angle_deg", 90.0)),
        hand=str(p.get("hand", "right")),
        pressure_angle_deg=float(p.get("pressure_angle_deg", 20.0)),
        profile_shift=float(p.get("profile_shift", 0.0)),
        addendum_coeff=float(p.get("addendum_coeff", 1.0)),
        dedendum_coeff=float(p.get("dedendum_coeff", 1.25)),
        root_fillet_coeff=float(p.get("root_fillet_coeff", 0.38)),
        backlash_mm=float(p.get("backlash_mm", 0.0)),
        face_width_mm=float(p.get("face_width_mm", 10.0)),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
    )


def screw_derived_values(pp) -> tuple[dict, list]:
    """Gear 1's own cylindrical derived values plus the pair relationship."""
    derived, warnings = derived_values(pp.gear1_params())
    derived.update({
        "shaft_angle_deg": pp.shaft_angle_deg,
        "helix2_deg": pp.helix2_deg,
        "hand2_is_left": 1.0 if pp.hand2 == "left" else 0.0,
        "pitch_diameter2_mm": pp.pitch_diameter2_mm,
        "center_distance_mm": pp.center_distance_mm,
        "ratio": pp.ratio,
    })
    if abs(pp.helix1_deg) < 1e-9:
        warnings.append("Gear 1 has no helix angle -- a crossed pair needs at least one helical member.")
    if pp.helix2_deg < 1e-9:
        warnings.append("Shaft angle equals gear 1's helix angle, so gear 2 comes out as a spur gear (0deg helix).")
    elif pp.hand2 != pp.hand:
        warnings.append(f"Shaft angle is smaller than gear 1's helix angle, so gear 2 takes the OPPOSITE hand "
                        f"({pp.hand2}-hand, {pp.helix2_deg:.1f}deg).")
    if pp.helix2_deg > 60.0:
        warnings.append(f"Gear 2's helix angle comes out at {pp.helix2_deg:.1f}deg -- screw gears above ~60deg are "
                        f"rarely practical (very low efficiency); consider a smaller shaft angle or a larger helix on gear 1.")
    return derived, warnings


def cycloidal_drive_params_from_request(p: dict):
    """Cycloidal drive -- docs/gear-math.md 15. z = lobes (= ratio); no
    module or pressure angle. Lengths already in mm (converted client-side)."""
    from cycloidal_drive import CycloidalDriveParams
    return CycloidalDriveParams(
        lobes=max(2, int(p.get("z", 10))),
        pin_circle_diameter_mm=float(p.get("pin_circle_diameter_mm") or 60.0),
        roller_diameter_mm=float(p.get("roller_diameter_mm") or 6.0),
        eccentricity_mm=float(p.get("eccentricity_mm") or 1.5),
        face_width_mm=float(p.get("face_width_mm", 10.0)),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
        output_pin_count=int(p.get("output_pin_count") or 0),
        output_pin_diameter_mm=float(p.get("output_pin_diameter_mm") or 6.0),
        output_circle_diameter_mm=float(p.get("output_circle_diameter_mm") or 30.0),
    )


def cycloidal_drive_derived_values(dp) -> tuple[dict, list]:
    from cycloidal_drive import min_radius_of_curvature, disc_profile
    warnings = []
    if dp.E >= dp.max_eccentricity_mm:
        warnings.append(f"Eccentricity {dp.E:g} mm reaches the cusp limit R/N = {dp.max_eccentricity_mm:.3f} mm "
                        f"(pin circle radius / roller count): the profile develops cusps. Reduce it.")
    rho = min_radius_of_curvature(dp)
    if rho <= dp.R_r:
        warnings.append(f"Roller radius {dp.R_r:g} mm exceeds the profile's minimum radius of curvature "
                        f"({rho:.3f} mm): the flanks would undercut. Use smaller rollers or a smaller eccentricity.")
    radii = [math.hypot(x, y) for x, y in disc_profile(dp, n_samples=1200)]
    r_min, r_max = min(radii), max(radii)
    if dp.bore_diameter_mm > 0 and dp.bore_diameter_mm / 2.0 >= r_min - 1.0:
        warnings.append("Bore diameter leaves less than 1 mm of disc below the lobe roots.")
    if dp.output_pin_count > 0:
        hole_r = dp.output_hole_diameter_mm / 2.0
        rc = dp.output_circle_diameter_mm / 2.0
        if rc - hole_r <= dp.bore_diameter_mm / 2.0:
            warnings.append("Output holes break into the central bore: move the output circle out or shrink the pins.")
        if rc + hole_r >= r_min:
            warnings.append("Output holes break through the lobe roots: move the output circle in or shrink the pins.")
        if dp.output_pin_count > 1 and 2.0 * rc * math.sin(math.pi / dp.output_pin_count) <= 2.0 * hole_r:
            warnings.append("Adjacent output holes overlap: fewer pins, or a larger output circle.")
    return {
        "ratio": dp.ratio,
        "pin_count": float(dp.n_pins),
        "disc_outer_diameter_mm": 2.0 * r_max,
        "disc_root_diameter_mm": 2.0 * r_min,
        "max_eccentricity_mm": dp.max_eccentricity_mm,
        "min_curvature_radius_mm": rho,
        "output_hole_diameter_mm": dp.output_hole_diameter_mm,
        "pin_circle_diameter_mm": dp.pin_circle_diameter_mm,
        "roller_diameter_mm": dp.roller_diameter_mm,
        "eccentricity_mm": dp.E,
    }, warnings


def cycloidal_params_from_request(p: dict):
    """Cycloidal gear -- docs/gear-math.md 14. No pressure angle; the tooth
    form is set by the rolling circle (0 = auto: r_g = R/2, radial flanks).
    module_mm already converted client-side for inch input."""
    from cycloidal import CycloidalGearParams
    return CycloidalGearParams(
        z=int(p["z"]),
        module_mm=float(p["module_mm"]),
        rolling_circle_diameter_mm=float(p.get("rolling_circle_diameter_mm") or 0.0),
        addendum_coeff=float(p.get("addendum_coeff", 1.0)),
        dedendum_coeff=float(p.get("dedendum_coeff", 1.25)),
        backlash_mm=float(p.get("backlash_mm", 0.0)),
        face_width_mm=float(p.get("face_width_mm", 10.0)),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
    )


def cycloidal_derived_values(cp) -> tuple[dict, list]:
    warnings = []
    requested = cp.rolling_circle_diameter_mm / 2.0 if cp.rolling_circle_diameter_mm > 0 else cp.pitch_radius / 2.0
    if abs(requested - cp.rolling_radius) > 1e-9:
        warnings.append(f"Rolling circle clamped to diameter {2 * cp.rolling_radius:.3f} mm: it must be at least the "
                        f"dedendum depth (so the hypocycloid reaches the root) and smaller than the pitch diameter.")
    if cp.bore_diameter_mm > 0 and cp.bore_diameter_mm >= 2 * cp.dedendum_radius * 0.9:
        warnings.append("Bore diameter is close to or exceeds the root diameter.")
    if cp.z < 4:
        warnings.append("Tooth count below 4 is not supported.")
    return {
        "pitch_diameter_mm": 2 * cp.pitch_radius,
        "addendum_diameter_mm": 2 * cp.addendum_radius,
        "dedendum_diameter_mm": 2 * cp.dedendum_radius,
        "circular_tooth_thickness_mm": cp.circular_tooth_thickness,
        "circular_pitch_mm": cp.circular_pitch,
        "module_mm": cp.module_mm,
        "diametral_pitch": 25.4 / cp.module_mm,
        "rolling_circle_diameter_mm": 2 * cp.rolling_radius,
        "dedendum_is_radial": 1.0 if cp.dedendum_is_radial else 0.0,
    }, warnings


def planetary_params_from_request(p: dict):
    """Planetary set -- docs/gear-math.md 11.4. z = sun, mate_teeth = planet,
    planet_count, rim_thickness_mm = the ring's rim; the ring's tooth count
    follows (z_s + 2 z_p). module_mm already converted client-side for
    inch input (as bevel/worm/rack)."""
    from planetary import PlanetaryParams
    return PlanetaryParams(
        z_sun=int(p["z"]),
        z_planet=int(p.get("mate_teeth") or 9),
        n_planets=max(1, int(p.get("planet_count") or 3)),
        module_mm=float(p["module_mm"]),
        pressure_angle_deg=float(p.get("pressure_angle_deg", 20.0)),
        addendum_coeff=float(p.get("addendum_coeff", 1.0)),
        dedendum_coeff=float(p.get("dedendum_coeff", 1.25)),
        root_fillet_coeff=float(p.get("root_fillet_coeff", 0.38)),
        backlash_mm=float(p.get("backlash_mm", 0.0)),
        face_width_mm=float(p.get("face_width_mm", 10.0)),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
        rim_thickness_mm=float(p.get("rim_thickness_mm", 6.0)),
    )


def planetary_derived_values(pp) -> tuple[dict, list]:
    derived, warnings = derived_values(pp.sun_params())
    derived.update({
        "ring_teeth": float(pp.z_ring),
        "planet_count": float(pp.n_planets),
        "center_distance_mm": pp.center_distance_mm,
        "ring_outer_diameter_mm": 2.0 * pp.ring_params().outer_radius,
        "ratio_ring_fixed": pp.ratio_ring_fixed,
        "ratio_sun_fixed": pp.ratio_sun_fixed,
        "ratio_carrier_fixed": pp.ratio_carrier_fixed,
        "assembly_ok": 1.0 if pp.assembly_ok else 0.0,
        "planet_gap_mm": pp.planet_gap_mm,
    })
    if not pp.assembly_ok:
        warnings.append(f"{pp.n_planets} equally spaced planets cannot all mesh: (z_sun + z_ring) = "
                        f"{pp.z_sun + pp.z_ring} is not divisible by {pp.n_planets}. Change a tooth count or the planet count.")
    if pp.planet_gap_mm <= 0:
        warnings.append(f"Adjacent planets collide (tip circles overlap by {-pp.planet_gap_mm:.2f} mm): "
                        f"fewer planets, or a bigger sun relative to the planets.")
    return derived, warnings


def face_gear_params_from_request(p: dict):
    """Face gear -- docs/gear-math.md 17. z = the face gear's teeth,
    mate_teeth = the pinion's, cutter_teeth = the shaper's (0 = pinion's),
    face_inner/outer_radius_mm (0 = auto), rim_thickness_mm."""
    from face_gear import FaceGearParams
    return FaceGearParams(
        z=int(p["z"]),
        pinion_teeth=int(p.get("mate_teeth") or 20),
        module_mm=float(p["module_mm"]),
        pressure_angle_deg=float(p.get("pressure_angle_deg", 20.0)),
        addendum_coeff=float(p.get("addendum_coeff", 1.0)),
        dedendum_coeff=float(p.get("dedendum_coeff", 1.25)),
        root_fillet_coeff=float(p.get("root_fillet_coeff", 0.38)),
        shaper_teeth=int(p.get("cutter_teeth") or 0),
        inner_radius_mm=float(p.get("face_inner_radius_mm") or 0.0),
        outer_radius_mm=float(p.get("face_outer_radius_mm") or 0.0),
        rim_thickness_mm=float(p.get("rim_thickness_mm", 6.0)),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
    )


def face_gear_derived_values(fp) -> tuple[dict, list]:
    warnings = []
    r0 = fp.nominal_radius
    l1, l2 = fp.undercut_radius, fp.pointing_radius
    if fp.inner_radius >= fp.outer_radius:
        warnings.append("Inner radius must be smaller than the outer radius.")
    if l2 - l1 < 0.5 * fp.module_mm:
        warnings.append(f"Almost no usable ring: undercut limit L1 = {l1:.1f} mm and pointing limit L2 = {l2:.1f} mm "
                        f"nearly coincide -- use a higher ratio (more face-gear teeth per pinion tooth) or a "
                        f"larger pressure angle.")
    if fp.inner_radius < l1 - 1e-6:
        warnings.append(f"Inner radius {fp.inner_radius:.1f} mm is inside the undercut limit L1 = {l1:.1f} mm: "
                        f"the shaper's fillet cuts into the tooth tops there (the generated geometry shows it).")
    if fp.outer_radius > l2 + 1e-6:
        warnings.append(f"Outer radius {fp.outer_radius:.1f} mm is beyond the pointing limit L2 = {l2:.1f} mm: "
                        f"the teeth come to a knife edge there (the generated geometry shows it).")
    if fp.z_shaper < fp.pinion_teeth:
        warnings.append("A shaper with fewer teeth than the pinion cuts a space the pinion cannot enter; "
                        "use the pinion's count or a few more.")
    if fp.z_shaper > fp.pinion_teeth + 3:
        warnings.append("More than three extra shaper teeth is unusual (contact becomes very localized).")
    if fp.bore_diameter_mm > 0 and fp.bore_diameter_mm / 2.0 >= fp.inner_radius:
        warnings.append("Bore reaches the toothed ring.")
    warnings += pointed_cutter_warning(math.radians(fp.pressure_angle_deg), fp.dedendum_coeff, "Pressure angle")
    return {
        "nominal_radius_mm": r0,
        "inner_radius_mm": fp.inner_radius,
        "outer_radius_mm": fp.outer_radius,
        "face_width_mm": fp.outer_radius - fp.inner_radius,
        "undercut_radius_mm": l1,
        "pointing_radius_mm": l2,
        # the rack-equivalent top-land width at the ring's ends (0 = pointed or no involute contact)
        "top_land_inner_mm": max(0.0, fp.top_land_at(fp.inner_radius)) if fp.top_land_at(fp.inner_radius) == fp.top_land_at(fp.inner_radius) else 0.0,
        "top_land_outer_mm": max(0.0, fp.top_land_at(fp.outer_radius)) if fp.top_land_at(fp.outer_radius) == fp.top_land_at(fp.outer_radius) else 0.0,
        "pinion_teeth": float(fp.pinion_teeth),
        "shaper_teeth": float(fp.z_shaper),
        "pinion_pitch_diameter_mm": 2.0 * fp.pinion_pitch_radius,
        "ratio": fp.ratio,
        "addendum_height_mm": fp.addendum,
        "dedendum_height_mm": fp.dedendum,
        "module_mm": fp.module_mm,
        "diametral_pitch": 25.4 / fp.module_mm,
    }, warnings


def sprocket_params_from_request(p: dict):
    """Sprocket wheel for roller chain -- docs/gear-math.md 18. chain_pitch_mm
    / roller_diameter_mm come from the client's own chain-number table (or
    direct override); outside_diameter_mm 0 = auto."""
    from sprocket import SprocketParams
    return SprocketParams(
        z=int(p["z"]),
        chain_pitch_mm=float(p.get("chain_pitch_mm") or p["module_mm"]),
        roller_diameter_mm=float(p.get("roller_diameter_mm") or 0.625 * float(p.get("chain_pitch_mm") or p["module_mm"])),
        face_width_mm=float(p.get("face_width_mm", 6.0)),
        outside_diameter_mm=float(p.get("outside_diameter_mm") or 0.0),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
        clearance_mm=float(p.get("clearance_mm", 0.05)),
        flank_angle_deg=float(p.get("flank_angle_deg", 20.0)),
    )


def sprocket_derived_values(sp) -> tuple[dict, list]:
    warnings = []
    if sp.root_clearance_mm <= 0:
        warnings.append(f"Roller diameter {sp.roller_diameter_mm:.2f} mm leaves no clearance within one chain "
                        f"pitch of {sp.chain_pitch_mm:.2f} mm -- the chain itself cannot close up; check the pitch "
                        f"and roller diameter (they should come from the same chain number).")
    if sp.z < 6:
        warnings.append(f"z={sp.z} is unusually low for a roller-chain sprocket (rough running, high chordal "
                        f"action); 15+ teeth is typical for a driver.")
    if sp.bore_diameter_mm > 0 and sp.bore_diameter_mm / 2.0 >= sp.pitch_radius - sp.seat_radius:
        warnings.append("Bore reaches the tooth root.")
    return {
        "pitch_diameter_mm": sp.pitch_diameter,
        "outside_diameter_mm": sp.outside_diameter,
        "root_diameter_mm": 2.0 * (sp.pitch_radius - sp.seat_radius),
        "chain_pitch_mm": sp.chain_pitch_mm,
        "roller_diameter_mm": sp.roller_diameter_mm,
        "root_clearance_mm": sp.root_clearance_mm,
    }, warnings


def chain_link_params_from_request(p: dict):
    """One roller-chain link -- docs/gear-math.md 19. Same chain_pitch_mm /
    roller_diameter_mm request fields as a sprocket; the two are meant to
    be built from the same values (chain_link.ChainLinkParams.from_sprocket_params)."""
    from chain_link import ChainLinkParams
    return ChainLinkParams(
        chain_pitch_mm=float(p.get("chain_pitch_mm") or p["module_mm"]),
        roller_diameter_mm=float(p.get("roller_diameter_mm") or 0.625 * float(p.get("chain_pitch_mm") or p["module_mm"])),
    )


def chain_link_derived_values(cp) -> tuple[dict, list]:
    warnings = []
    if cp.chain_pitch_mm - cp.roller_diameter_mm <= cp.pin_diameter:
        warnings.append("Roller diameter leaves little room for the pin between adjacent rollers; "
                        "check the pitch and roller diameter (they should come from the same chain number).")
    return {
        "chain_pitch_mm": cp.chain_pitch_mm,
        "roller_diameter_mm": cp.roller_diameter_mm,
        "pin_diameter_mm": cp.pin_diameter,
        "plate_thickness_mm": cp.plate_thickness,
        "total_width_mm": cp.total_width,
        "bushing_outer_diameter_mm": cp.bushing_outer_diameter,
    }, warnings


def hyperboloidal_params_from_request(p: dict):
    """Hyperboloidal pair -- docs/gear-math.md 24. z = gear 1, mate_teeth =
    gear 2, shaft_angle_deg = Sigma, module_mm = the NORMAL module (already
    in mm), face_width_mm = gear 1's, mate_face_width_mm = gear 2's (0 =
    the contact line's reach), bore_diameter_mm / mate_bore_diameter_mm."""
    from hyperboloidal import HyperboloidalParams
    return HyperboloidalParams(
        z1=int(p["z"]),
        z2=int(p.get("mate_teeth") or p["z"]),
        shaft_angle_deg=float(p.get("shaft_angle_deg") or 90.0),
        normal_module_mm=float(p["module_mm"]),
        pressure_angle_deg=float(p.get("pressure_angle_deg", 20.0)),
        face_width_mm=float(p.get("face_width_mm") or 0.0),
        mate_face_width_mm=float(p.get("mate_face_width_mm") or 0.0),
        addendum_coeff=float(p.get("addendum_coeff", 1.0)),
        dedendum_coeff=float(p.get("dedendum_coeff", 1.25)),
        hand=str(p.get("hand", "right")),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
        mate_bore_diameter_mm=float(p.get("mate_bore_diameter_mm", 0.0)),
    )


def hyperboloidal_derived_values(hp) -> tuple[dict, list]:
    import math as _m
    hp.validate()
    warnings = []
    s1, s2 = _m.degrees(hp.sigma1_rad), _m.degrees(hp.sigma2_rad)
    if s1 < 5.0 or s2 < 5.0:
        warnings.append(f"The screw axis is within {min(s1, s2):.1f} degrees of a shaft: the pair is nearly a parallel-axis helical pair; "
                        f"a hyperboloidal pair earns its keep at larger skews.")
    if hp.face_width(2) < 1.5 * hp.m_n:
        warnings.append(f"Gear 2's face, {hp.face_width(2):.2f} mm at the contact line's reach, is under 1.5 modules -- a wider gear 1 face "
                        f"(or an explicit mate face width) is usual.")
    derived = {
        "module_mm": hp.m_n,
        "diametral_pitch": 25.4 / hp.m_n,
        "ratio": hp.ratio,
        "shaft_angle_deg": hp.shaft_angle_deg,
        "sigma1_deg": s1,
        "sigma2_deg": s2,
        "centre_distance_mm": hp.centre_distance,
        "throat_pitch_diameter_mm": 2.0 * hp.a1,
        "mate_throat_pitch_diameter_mm": 2.0 * hp.a2,
        "throat_radius_ratio": hp.a2 / hp.a1,
        "transverse_module_mm": hp.m_n / _m.cos(hp.sigma1_rad),
        "mate_transverse_module_mm": hp.m_n / _m.cos(hp.sigma2_rad),
        "tip_diameter_mm": 2.0 * (hp.a1 + hp.addendum),
        "root_diameter_mm": 2.0 * (hp.a1 - hp.dedendum),
        "mate_tip_diameter_mm": 2.0 * (hp.a2 + hp.addendum),
        "mate_root_diameter_mm": 2.0 * (hp.a2 - hp.dedendum),
        "face_width_mm": hp.face_width(1),
        "mate_face_width_mm": hp.face_width(2),
        "face_tip_diameter_mm": 2.0 * hp.radius_at(1, hp.a1 + hp.addendum, 0.5 * hp.face_width(1)),
        "mate_face_tip_diameter_mm": 2.0 * hp.radius_at(2, hp.a2 + hp.addendum, 0.5 * hp.face_width(2)),
    }
    return derived, warnings


def ec_gear_params_from_request(p: dict):
    """Eccentrically-cycloidal pair -- docs/gear-math.md 23. teeth = the
    wheel's; centre_distance_mm; eccentricity_mm, pinion_diameter_mm and
    lead_mm at 0 mean auto (0.6 of the pinion's pitch radius, 0.8 of the
    largest the profile allows, the face width)."""
    from ec_gear import ECGearParams
    return ECGearParams(
        wheel_teeth=int(p.get("z") or 20),
        centre_distance_mm=float(p.get("centre_distance_mm") or 50.0),
        eccentricity_mm=float(p.get("eccentricity_mm") or 0.0),
        pinion_diameter_mm=float(p.get("pinion_diameter_mm") or 0.0),
        face_width_mm=float(p.get("face_width_mm") or 20.0),
        lead_mm=float(p.get("lead_mm") or 0.0),
        hand=str(p.get("hand", "right")),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
        pinion_bore_diameter_mm=float(p.get("pinion_bore_diameter_mm", 0.0)),
    )


def ec_gear_derived_values(ep) -> tuple[dict, list]:
    import math as _m
    ep.validate()
    warnings = []
    if ep.face_width_mm < ep.lead - 1e-9:
        warnings.append(f"The eccentric turns {ep.face_width_mm / ep.lead:.2f} of a turn across the {ep.face_width_mm:g} mm face -- "
                        f"less than a turn, so the contact does not wrap all the way round and the wheel is not held in both directions; "
                        f"a face of at least one lead ({ep.lead:g} mm) is usual.")
    if ep.e > 0.85 * ep.max_eccentricity:
        warnings.append(f"Eccentricity {ep.e:.3f} mm is close to the {ep.max_eccentricity:.3f} mm at which the eccentric centre's path loops.")
    if ep.r_c > 0.95 * ep.max_pinion_radius:
        warnings.append(f"Pinion radius {ep.r_c:.3f} mm is close to the {ep.max_pinion_radius:.3f} mm at which the wheel's tips go sharp.")
    derived = {
        "ratio": ep.ratio,
        "wheel_teeth": float(ep.z),
        "centre_distance_mm": ep.a,
        "pinion_pitch_diameter_mm": 2.0 * ep.pinion_pitch_radius,
        "wheel_pitch_diameter_mm": 2.0 * ep.wheel_pitch_radius,
        "eccentricity_mm": ep.e,
        "max_eccentricity_mm": ep.max_eccentricity,
        "pinion_diameter_mm": 2.0 * ep.r_c,
        "max_pinion_diameter_mm": 2.0 * ep.max_pinion_radius,
        "tooth_height_mm": ep.tooth_height,
        "wheel_tip_diameter_mm": 2.0 * ep.wheel_tip_radius,
        "wheel_root_diameter_mm": 2.0 * ep.wheel_root_radius,
        "face_width_mm": ep.face_width_mm,
        "lead_mm": ep.lead,
        "pinion_twist_deg": _m.degrees(ep.pinion_twist_rad),
        "wheel_twist_deg": _m.degrees(ep.wheel_twist_rad),
        "helix_angle_deg": _m.degrees(ep.helix_angle_rad),
    }
    return derived, warnings


def globoid_worm_params_from_request(p: dict):
    """Double-enveloping worm + throated wheel -- docs/gear-math.md 22.
    starts, mate_teeth = the wheel's, module_mm = axial at the throat,
    pitch_diameter_mm = the worm's throat pitch diameter, envelope_teeth =
    wheel pitches wrapped (sets the worm's length)."""
    from globoid_worm import GloboidWormParams
    return GloboidWormParams(
        starts=int(p.get("starts") or 1),
        wheel_teeth=int(p.get("mate_teeth") or 30),
        axial_module_mm=float(p["module_mm"]),
        pitch_diameter_mm=float(p.get("pitch_diameter_mm") or 24.0),
        pressure_angle_deg=float(p.get("pressure_angle_deg", 20.0)),
        addendum_coeff=float(p.get("addendum_coeff", 1.0)),
        dedendum_coeff=float(p.get("dedendum_coeff", 1.25)),
        envelope_teeth=float(p.get("envelope_teeth") or 4.0),
        hand=str(p.get("hand", "right")),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
    )


def globoid_worm_derived_values(gp) -> tuple[dict, list]:
    import math as _m
    from throated_wheel import wheel_outer_radius_at, wheel_rim_radius, wheel_blank_radius_at
    warnings = []
    if gp.wheel_teeth < 20:
        warnings.append(f"A {gp.wheel_teeth}-tooth wheel is few for a worm drive (undercut risk); 24+ is usual.")
    if _m.degrees(gp.wrap_angle_rad) > 90.0:
        warnings.append(f"Wrapping {gp.envelope_teeth:g} pitches of a {gp.wheel_teeth}-tooth wheel is a {_m.degrees(gp.wrap_angle_rad):.0f} degree wrap -- "
                        f"long worms are hard to make and mount; 3-5 pitches is usual.")
    derived = {
        "module_mm": gp.axial_module_mm,
        "diametral_pitch": 25.4 / gp.axial_module_mm,
        "starts": float(gp.starts),
        "wheel_teeth": float(gp.wheel_teeth),
        "ratio": gp.ratio,
        "centre_distance_mm": gp.centre_distance,
        "lead_angle_deg": _m.degrees(gp.lead_angle_rad),
        "envelope_teeth": gp.envelope_teeth,
        "wrap_angle_deg": _m.degrees(gp.wrap_angle_rad),
        "worm_length_mm": gp.length,
        "worm_throat_pitch_diameter_mm": gp.pitch_diameter_mm,
        "worm_throat_tip_diameter_mm": gp.pitch_diameter_mm + 2.0 * gp.addendum,
        "worm_throat_root_diameter_mm": gp.pitch_diameter_mm - 2.0 * gp.dedendum,
        "wheel_pitch_diameter_mm": 2.0 * gp.wheel_pitch_radius,
        "wheel_face_width_mm": gp.wheel_face_width,
        "wheel_throat_outer_diameter_mm": 2.0 * wheel_outer_radius_at(gp, 0.0),
        "wheel_outside_diameter_mm": 2.0 * wheel_rim_radius(gp),
        "wheel_face_outer_diameter_mm": 2.0 * wheel_blank_radius_at(gp, 0.5 * gp.wheel_face_width),
    }
    return derived, warnings


def hypoid_params_from_request(p: dict):
    """Hypoid pair -- docs/gear-math.md 21. z = the gear's teeth, mate_teeth
    = the pinion's, offset_mm the hypoid offset (0 = an ordinary spiral
    bevel pair), spiral_angle_deg the GEAR's; the pinion's spiral angle,
    pitch angle and size follow from the offset."""
    from hypoid import HypoidParams
    return HypoidParams(
        z=int(p["z"]),
        pinion_teeth=int(p.get("mate_teeth") or 12),
        module_mm=float(p["module_mm"]),
        offset_mm=float(p.get("offset_mm") or 0.0),
        spiral_angle_deg=float(p.get("spiral_angle_deg", 35.0)),
        pressure_angle_deg=float(p.get("pressure_angle_deg", 20.0)),
        addendum_coeff=float(p.get("addendum_coeff", 1.0)),
        dedendum_coeff=float(p.get("dedendum_coeff", 1.25)),
        root_fillet_coeff=float(p.get("root_fillet_coeff", 0.38)),
        face_width_mm=float(p.get("face_width_mm", 10.0)),
        cutter_radius_mm=float(p.get("cutter_radius_mm") or 0.0),
        hand=str(p.get("hand", "right")),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
    )


def hypoid_derived_values(hp) -> tuple[dict, list]:
    """The gear's spiral bevel values plus the pinion's pitch geometry --
    the numbers a hypoid is designed by (docs 21.1)."""
    import math as _m
    gp = hp.gear_params()
    derived, warnings = spiral_bevel_derived_values(gp)
    geo = hp.pitch_geometry()
    gear_pitch_diameter = 2.0 * gp.heel_pitch_radius
    derived.update({
        "module_mm": hp.module_mm,                    # the EQUIVALENT row (the bevel values carry neither)
        "diametral_pitch": 25.4 / hp.module_mm,
        "gear_pitch_diameter_mm": gear_pitch_diameter,
        "gear_pitch_angle_deg": _m.degrees(geo.gamma_g),
        "offset_mm": hp.offset_mm,
        "offset_ratio": hp.offset_mm / gear_pitch_diameter,
        "ratio": hp.z / hp.pinion_teeth,
        "pinion_teeth": float(hp.pinion_teeth),
        "pinion_pitch_angle_deg": _m.degrees(geo.gamma_p),
        "pinion_spiral_angle_deg": _m.degrees(geo.psi_p),
        "pinion_mean_pitch_radius_mm": geo.r_p,
        "bevel_pinion_mean_pitch_radius_mm": geo.r_g * hp.pinion_teeth / hp.z,
        "pinion_mean_cone_distance_mm": geo.A_mp,
        "gear_mean_cone_distance_mm": geo.A_m,
        "offset_below": 1.0 if geo.offset_signed < 0 else 0.0,
    })
    if hp.offset_mm == 0:
        warnings.append("Offset 0 makes this an ordinary spiral bevel pair -- the Spiral bevel card builds that directly.")
    elif hp.offset_mm > 0.25 * gear_pitch_diameter:
        warnings.append(f"Offset {hp.offset_mm:g} mm is over a quarter of the gear pitch diameter ({gear_pitch_diameter:.1f} mm); "
                        f"automotive practice stays under that (pinion spiral angle here {_m.degrees(geo.psi_p):.0f}deg).")
    return derived, warnings


def _belt_standard_fields(p: dict) -> dict:
    """belt_type (a timing_belt.TIMING_BELT_STANDARDS key, e.g. "GT2",
    "HTD 8M", "T5") picks the standard's pitch and its trapezoidal-vs-
    curvilinear profile; an explicit belt_pitch_mm / curvilinear in the
    request overrides either (the UI sends the pitch it displays, so a
    user's edited pitch wins -- same "standard default, freely
    overridable" contract as the sprocket's chain number)."""
    from timing_belt import TIMING_BELT_STANDARDS
    belt_type = str(p.get("belt_type") or "")
    entry = TIMING_BELT_STANDARDS.get(belt_type)
    pitch = p.get("belt_pitch_mm") or (entry["pitch_mm"] if entry else None) or p["module_mm"]
    curvilinear = p["curvilinear"] if p.get("curvilinear") is not None else (entry["curvilinear"] if entry else False)
    return dict(belt_pitch_mm=float(pitch), belt_type=belt_type, curvilinear=bool(curvilinear))


def timing_wheel_params_from_request(p: dict):
    """Timing pulley -- docs/gear-math.md 20. z = groove count; belt
    standard / pitch / profile per _belt_standard_fields (belt_pitch_mm
    reuses module_mm's request slot as a last resort, as sprocket reuses
    it for chain_pitch_mm)."""
    from timing_belt import TimingWheelParams
    return TimingWheelParams(
        z=int(p["z"]),
        **_belt_standard_fields(p),
        face_width_mm=float(p.get("face_width_mm", 10.0)),
        bore_diameter_mm=float(p.get("bore_diameter_mm", 0.0)),
    )


def timing_wheel_derived_values(tp) -> tuple[dict, list]:
    warnings = []
    if tp.z < 10:
        warnings.append(f"z={tp.z} is unusually low for a timing pulley (rough running); 10+ teeth is typical.")
    if tp.bore_diameter_mm > 0 and tp.bore_diameter_mm / 2.0 >= tp.root_radius:
        warnings.append("Bore reaches the tooth root.")
    bp = tp._belt()
    return {
        "pitch_diameter_mm": tp.pitch_diameter,
        "outside_diameter_mm": 2.0 * tp.outside_radius,
        "root_diameter_mm": 2.0 * tp.root_radius,
        "belt_pitch_mm": tp.belt_pitch_mm,
        "tooth_height_mm": bp.tooth_height,
        "fillet_radius_mm": bp.fillet_radius,
        "tip_fillet_mm": bp.tip_fillet,
        "root_fillet_mm": bp.root_fillet,
        "curvilinear": 1.0 if bp.curvilinear else 0.0,
    }, warnings


def timing_belt_params_from_request(p: dict):
    """Timing belt -- docs/gear-math.md 20. Same belt standard / pitch /
    profile fields as the matching pulley (_belt_standard_fields); n_teeth
    is just how many teeth the modelled segment shows, not a meshing
    dimension."""
    from timing_belt import TimingBeltParams
    return TimingBeltParams(
        **_belt_standard_fields(p),
        belt_width_mm=float(p.get("face_width_mm", 10.0)),
        n_teeth=int(p.get("cutter_teeth") or 12),
    )


def timing_belt_derived_values(bp) -> tuple[dict, list]:
    return {
        "belt_pitch_mm": bp.belt_pitch_mm,
        "tooth_height_mm": bp.tooth_height,
        "belt_thickness_mm": bp.belt_thickness,
        "segment_length_mm": bp.n_teeth * bp.belt_pitch_mm,
        "fillet_radius_mm": bp.fillet_radius,
        "tip_fillet_mm": bp.tip_fillet,
        "root_fillet_mm": bp.root_fillet,
        "curvilinear": 1.0 if bp.curvilinear else 0.0,
    }, []


def spiral_bevel_params_from_request(p: dict):
    """Spiral / zerol bevel -- docs/gear-math.md 16. The straight bevel's
    request fields plus spiral_angle_deg (0 = zerol), cutter_radius_mm (0 =
    auto: the mean cone distance) and hand."""
    from spiral_bevel import SpiralBevelParams
    return SpiralBevelParams(
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
        spiral_angle_deg=float(p.get("spiral_angle_deg", 35.0)),
        cutter_radius_mm=float(p.get("cutter_radius_mm") or 0.0),
        hand=str(p.get("hand", "right")),
    )


def spiral_bevel_derived_values(sp) -> tuple[dict, list]:
    """The straight bevel's derived values (SpiralBevelParams is a
    BevelGearParams) plus the trace: spiral angle at toe/mean/heel, cutter
    radius, transverse pressure angle."""
    derived, warnings = bevel_derived_values(sp)
    re = sp.outer_cone_distance
    toe = re - sp.face_width_mm
    derived.update({
        "mean_cone_distance_mm": sp.mean_cone_distance,
        "cutter_radius_mm": sp.cutter_radius,
        "spiral_angle_mean_deg": sp.spiral_angle_deg,
        "spiral_angle_toe_deg": math.degrees(sp.spiral_angle_at(toe)),
        "spiral_angle_heel_deg": math.degrees(sp.spiral_angle_at(re)),
        "transverse_pressure_angle_deg": math.degrees(sp.transverse_pressure_angle_rad),
        "hand_is_left": 1.0 if sp.hand == "left" else 0.0,
    })
    if sp.spiral_angle_deg > 50.0:
        warnings.append(f"Spiral angle {sp.spiral_angle_deg:g}deg is unusually large (35deg is the common choice); "
                        f"the transverse pressure angle is already {derived['transverse_pressure_angle_deg']:.1f}deg.")
    warnings += pointed_cutter_warning(sp.transverse_pressure_angle_rad, sp.dedendum_coeff, "Transverse pressure angle")
    if abs(math.degrees(sp.spiral_angle_at(re))) > 60.0 or abs(math.degrees(sp.spiral_angle_at(toe))) > 60.0:
        warnings.append("The tooth trace exceeds 60deg at one end of the face: use a larger cutter radius "
                        "or a narrower face.")
    if sp.cutter_radius < sp.face_width_mm:
        warnings.append("Cutter radius is smaller than the face width -- the tooth trace curls tightly; "
                        "0 (automatic = mean cone distance) or a larger value is usual.")
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
    # the normal angle: a spiral bevel's transverse one is checked by its own derived values
    warnings += pointed_cutter_warning(math.radians(bp.pressure_angle_deg), bp.dedendum_coeff, "Pressure angle")
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
        if gear_type == "hyperboloidal":
            from hyperboloidal import throat_outline
            hp = hyperboloidal_params_from_request(req)
            derived, warnings = hyperboloidal_derived_values(hp)
            outline = throat_outline(hp, 1, 0.01)                   # gear 1's transverse section at the throat
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "ec_gear":
            from ec_gear import wheel_outline
            ep = ec_gear_params_from_request(req)
            derived, warnings = ec_gear_derived_values(ep)
            outline = wheel_outline(ep, simplify_tolerance_mm=0.01)     # the wheel's transverse profile
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "globoid_worm":
            from globoid_worm import thread_section
            gp = globoid_worm_params_from_request(req)
            outline = [(z, r) for (z, r) in thread_section(gp, 0.0, n_arc=24)]   # the thread's axial section at the throat
            derived, warnings = globoid_worm_derived_values(gp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "hypoid":
            hp = hypoid_params_from_request(req)
            outline = bevel_heel_tooth_outline(hp.gear_params())   # the gear's heel section, as the spiral bevel card
            derived, warnings = hypoid_derived_values(hp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "timing_wheel":
            from timing_belt import full_pulley_outline
            tp = timing_wheel_params_from_request(req)
            outline = full_pulley_outline(tp)
            derived, warnings = timing_wheel_derived_values(tp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "timing_belt":
            from timing_belt import belt_strip_polygon
            bp = timing_belt_params_from_request(req)
            poly = belt_strip_polygon(bp).simplify(0.001, preserve_topology=True)
            outline = [tuple(p) for p in poly.exterior.coords][:-1]
            derived, warnings = timing_belt_derived_values(bp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "chain_link":
            from chain_link import _stadium_polygon
            cp = chain_link_params_from_request(req)
            outline = _stadium_polygon(cp.outer_lobe_diameter, cp.chain_pitch_mm)  # the outer plate's own profile
            derived, warnings = chain_link_derived_values(cp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "sprocket":
            from sprocket import full_sprocket_outline
            sp = sprocket_params_from_request(req)
            outline = full_sprocket_outline(sp)
            derived, warnings = sprocket_derived_values(sp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "face_gear":
            fp = face_gear_params_from_request(req)
            outline = full_gear_outline(fp.pinion_params(), simplify_tolerance_mm=0.01)  # the pinion's section
            derived, warnings = face_gear_derived_values(fp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "spiral_bevel":
            sp = spiral_bevel_params_from_request(req)
            outline = bevel_heel_tooth_outline(sp)  # the heel section, at the transverse pressure angle
            derived, warnings = spiral_bevel_derived_values(sp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "herringbone":
            gp = params_from_request(req)
            outline = full_gear_outline(gp, simplify_tolerance_mm=float(req.get("simplify_tolerance_mm", 0.01)))
            derived, warnings = herringbone_derived_values(gp, gap_mm)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "screw":
            pp = screw_params_from_request(req)
            outline = full_gear_outline(pp.gear1_params(), simplify_tolerance_mm=float(req.get("simplify_tolerance_mm", 0.01)))
            derived, warnings = screw_derived_values(pp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "planetary":
            pp = planetary_params_from_request(req)
            outline = full_gear_outline(pp.sun_params(), simplify_tolerance_mm=float(req.get("simplify_tolerance_mm", 0.01)))
            derived, warnings = planetary_derived_values(pp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "cycloidal":
            from cycloidal import cycloidal_gear_outline
            cp = cycloidal_params_from_request(req)
            outline = cycloidal_gear_outline(cp, simplify_tolerance_mm=float(req.get("simplify_tolerance_mm", 0.005)))
            derived, warnings = cycloidal_derived_values(cp)
            return {"ok": True, "outline": outline, "derived": derived, "warnings": warnings}
        if gear_type == "cycloidal_drive":
            from cycloidal_drive import disc_outline
            dp = cycloidal_drive_params_from_request(req)
            outline = disc_outline(dp, simplify_tolerance_mm=float(req.get("simplify_tolerance_mm", 0.005)))
            derived, warnings = cycloidal_drive_derived_values(dp)
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
        if gear_type == "hyperboloidal":
            from build_gear import export_hyperboloidal_step
            export_hyperboloidal_step(hyperboloidal_params_from_request(req), path)   # the pair, gear 2 generated at export quality
        elif gear_type == "ec_gear":
            from build_gear import export_ec_step
            export_ec_step(ec_gear_params_from_request(req), path)     # the pair
        elif gear_type == "globoid_worm":
            from build_gear import export_globoid_worm_step
            export_globoid_worm_step(globoid_worm_params_from_request(req), path)   # the pair, generated at export quality
        elif gear_type == "hypoid":
            from build_gear import export_hypoid_step
            export_hypoid_step(hypoid_params_from_request(req), path)   # the pair, generated at export quality
        elif gear_type == "timing_wheel":
            from build_gear import export_timing_wheel_step
            export_timing_wheel_step(timing_wheel_params_from_request(req), path)
        elif gear_type == "timing_belt":
            from build_gear import export_timing_belt_step
            export_timing_belt_step(timing_belt_params_from_request(req), path)
        elif gear_type == "chain_link":
            from build_gear import export_chain_link_step
            export_chain_link_step(chain_link_params_from_request(req), path)
        elif gear_type == "sprocket":
            from build_gear import export_sprocket_step
            export_sprocket_step(sprocket_params_from_request(req), path)
        elif gear_type == "bevel":
            from build_gear import export_bevel_step
            bp = bevel_params_from_request(req)
            export_bevel_step(bp, path)
        elif gear_type == "spiral_bevel":
            from build_gear import export_spiral_bevel_step
            export_spiral_bevel_step(spiral_bevel_params_from_request(req), path)
        elif gear_type == "face_gear":
            from build_gear import export_face_gear_step
            export_face_gear_step(face_gear_params_from_request(req), path)
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
        elif gear_type == "screw":
            from build_gear import export_crossed_helical_pair_step
            export_crossed_helical_pair_step(screw_params_from_request(req), path)  # both members, in mesh
        elif gear_type == "planetary":
            from build_gear import export_planetary_step
            export_planetary_step(planetary_params_from_request(req), path)  # sun + planets + ring, in mesh
        elif gear_type == "cycloidal":
            from build_gear import export_cycloidal_step
            export_cycloidal_step(cycloidal_params_from_request(req), path)
        elif gear_type == "cycloidal_drive":
            from build_gear import export_cycloidal_drive_step
            export_cycloidal_drive_step(cycloidal_drive_params_from_request(req), path)  # disc + rollers + output pins
        else:
            from build_gear import export_step
            gp = params_from_request(req)
            export_step(gp, path)
        return {"ok": True, "path": path}

    if cmd == "export_dxf":
        path = req["path"]
        if gear_type == "hyperboloidal":
            from build_gear import export_hyperboloidal_profile_dxf
            export_hyperboloidal_profile_dxf(hyperboloidal_params_from_request(req), path)
        elif gear_type == "ec_gear":
            from build_gear import export_ec_profile_dxf
            export_ec_profile_dxf(ec_gear_params_from_request(req), path)
        elif gear_type == "globoid_worm":
            from build_gear import export_globoid_worm_profile_dxf
            export_globoid_worm_profile_dxf(globoid_worm_params_from_request(req), path)
        elif gear_type == "hypoid":
            from build_gear import export_hypoid_profile_dxf
            export_hypoid_profile_dxf(hypoid_params_from_request(req), path)
        elif gear_type == "timing_wheel":
            from build_gear import export_timing_wheel_profile_dxf
            export_timing_wheel_profile_dxf(timing_wheel_params_from_request(req), path)
        elif gear_type == "timing_belt":
            from build_gear import export_timing_belt_profile_dxf
            export_timing_belt_profile_dxf(timing_belt_params_from_request(req), path)
        elif gear_type == "chain_link":
            from build_gear import export_chain_link_plate_dxf
            export_chain_link_plate_dxf(chain_link_params_from_request(req), path)
        elif gear_type == "sprocket":
            from build_gear import export_sprocket_profile_dxf
            export_sprocket_profile_dxf(sprocket_params_from_request(req), path)
        elif gear_type == "bevel":
            from build_gear import export_bevel_heel_profile_dxf
            bp = bevel_params_from_request(req)
            export_bevel_heel_profile_dxf(bp, path)
        elif gear_type == "spiral_bevel":
            from build_gear import export_spiral_bevel_heel_profile_dxf
            export_spiral_bevel_heel_profile_dxf(spiral_bevel_params_from_request(req), path)
        elif gear_type == "face_gear":
            from build_gear import export_face_gear_profile_dxf
            export_face_gear_profile_dxf(face_gear_params_from_request(req), path)
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
        elif gear_type == "screw":
            from build_gear import export_dxf_profile
            export_dxf_profile(screw_params_from_request(req).gear1_params(), path)  # gear 1's transverse section
        elif gear_type == "planetary":
            from build_gear import export_planetary_profile_dxf
            export_planetary_profile_dxf(planetary_params_from_request(req), path)  # the whole set's section
        elif gear_type == "cycloidal":
            from build_gear import export_cycloidal_profile_dxf
            export_cycloidal_profile_dxf(cycloidal_params_from_request(req), path)
        elif gear_type == "cycloidal_drive":
            from build_gear import export_cycloidal_drive_profile_dxf
            export_cycloidal_drive_profile_dxf(cycloidal_drive_params_from_request(req), path)
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
        if gear_type == "hyperboloidal":
            from build_gear import build_hyperboloidal_pair_solid
            import build123d as bd
            solid = build_hyperboloidal_pair_solid(hyperboloidal_params_from_request(req), n_positions=48, n_stations=7, n_profile=60)
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "ec_gear":
            from build_gear import build_ec_pair_solid
            import build123d as bd
            solid = build_ec_pair_solid(ec_gear_params_from_request(req))
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "globoid_worm":
            from build_gear import build_globoid_pair_solid
            import build123d as bd
            solid = build_globoid_pair_solid(globoid_worm_params_from_request(req), n_positions=48, n_stations=7, n_profile=60)
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "hypoid":
            from build_gear import build_hypoid_pair_solid
            import build123d as bd
            # the preview is the pair in mesh, generated coarsely (60 sweep
            # positions, 5 stations: ridges of a few hundredths of a mm on
            # the pinion flanks, invisible here; the export uses 240 x 8)
            solid = build_hypoid_pair_solid(hypoid_params_from_request(req), n_positions=60, n_stations=5, n_profile=60,
                                            n_phi=120, simplify_tolerance_mm=0.04)
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "timing_wheel":
            from timing_belt import build_pulley_solid
            import build123d as bd
            solid = build_pulley_solid(timing_wheel_params_from_request(req))
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "timing_belt":
            from timing_belt import build_timing_belt_solid
            import build123d as bd
            solid = build_timing_belt_solid(timing_belt_params_from_request(req))
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "chain_link":
            from chain_link import build_chain_link_assembly
            import build123d as bd
            solid = build_chain_link_assembly(chain_link_params_from_request(req))
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "sprocket":
            from build_gear import build_sprocket_solid
            import build123d as bd
            solid = build_sprocket_solid(sprocket_params_from_request(req))
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "bevel":
            from build_gear import build_bevel_gear_solid
            import build123d as bd
            bp = bevel_params_from_request(req)
            solid = build_bevel_gear_solid(bp, n_phi=150, simplify_tolerance_mm=0.04)
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "spiral_bevel":
            from spiral_bevel import build_spiral_bevel_gear_solid
            import build123d as bd
            sp = spiral_bevel_params_from_request(req)
            solid = build_spiral_bevel_gear_solid(sp, n_stations=8, n_phi=150, simplify_tolerance_mm=0.04)
            bd.export_stl(solid, path, tolerance=0.01, angular_tolerance=0.3)  # curved flanks: finer than straight bevel
        elif gear_type == "face_gear":
            from face_gear import build_face_gear_solid, place_pinion
            from build_gear import build_gear_solid
            import build123d as bd
            fp = face_gear_params_from_request(req)
            # the preview shows the pair in mesh (the way the worm shows its
            # wheel); STEP export is the face gear alone. Fewer sweep positions,
            # stations and profile points than the export (11 s vs 25 s for z = 40): this is rebuilt on every tweak.
            gear = build_face_gear_solid(fp, n_positions=120, n_stations=6, simplify_tolerance_mm=0.05, n_profile=40)
            pinion = place_pinion(build_gear_solid(fp.pinion_params(), simplify_tolerance_mm=0.04), fp)
            bd.export_stl(bd.Compound(children=[gear, pinion]), path, tolerance=0.02, angular_tolerance=0.3)
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
        elif gear_type == "screw":
            from crossed_helical import build_crossed_helical_pair
            import build123d as bd
            pp = screw_params_from_request(req)
            s1, s2 = build_crossed_helical_pair(pp, simplify_tolerance_mm=0.03)
            bd.export_stl(bd.Compound(children=[s1, s2]), path, tolerance=0.002, angular_tolerance=0.3)
        elif gear_type == "planetary":
            from planetary import build_planetary_set
            import build123d as bd
            pp = planetary_params_from_request(req)
            sun, planets, ring = build_planetary_set(pp, simplify_tolerance_mm=0.03)
            bd.export_stl(bd.Compound(children=[sun, *planets, ring]), path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "cycloidal":
            from cycloidal import build_cycloidal_gear_solid
            import build123d as bd
            solid = build_cycloidal_gear_solid(cycloidal_params_from_request(req), simplify_tolerance_mm=0.01)
            bd.export_stl(solid, path, tolerance=0.02, angular_tolerance=0.3)
        elif gear_type == "cycloidal_drive":
            from cycloidal_drive import build_drive_assembly
            import build123d as bd
            disc, rollers, out_pins = build_drive_assembly(cycloidal_drive_params_from_request(req), simplify_tolerance_mm=0.01)
            bd.export_stl(bd.Compound(children=[disc, *rollers, *out_pins]), path, tolerance=0.02, angular_tolerance=0.3)
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
