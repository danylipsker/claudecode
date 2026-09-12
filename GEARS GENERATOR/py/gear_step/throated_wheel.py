"""
The throated wheel of a double-enveloping worm drive, generated from the
built worm -- the worm is the hob. docs/gear-math.md section 22.2.

Frames. The worm is built in its own frame (globoid_worm.py): axis Z,
throat at z = 0, the wheel centre C on +X at the centre distance a. The
wheel is built in ITS own frame: axis Z through its centre, the worm's
axis the line {X = a, Z = 0} along Y, so the worm's throat centre is at
(a, 0, 0) and the space this module generates is centred on +X. The map
from the worm frame to the wheel frame is a half-turn about the axis
(0, 1, 1) followed by the translation (a, 0, 0) -- place_worm -- which
sends (x, y, z) to (a - x, z, y). Turning the worm by theta_w about its
axis turns the wheel by theta_g = -theta_w z_w / z_g about its axis for a
right-hand worm (wheel_turn_rad) -- the relation thread_stations builds
the thread with, so the wheel generated here is conjugate to that thread.

Generation, on generation.py's machinery (the hypoid pinion's, section
21.2): the wheel's transverse station planes Z = h are invariant under the
wheel's own rotation, so in the wheel's rotating frame only the worm
moves -- placed at worm turn theta_w by R_Z(-theta_g) o place_worm o
R_Z(theta_w). The station plane pulled back through the INVERSE of that
map is an inclined plane in the worm's own frame; the static thread
solids (globoid_worm.thread_solids -- the very lofts the worm is fused
from) are sectioned by it, the section's local coordinates being the
wheel frame's because the plane carries the wheel's axes through the same
rigid map. The union over the worm turns, clipped to the throated blank's
outline at that height, is the material the worm removes there; one
space lofted through the stations, patterned z_g times, cut from the
throated blank.

The first version of this module sliced the thread analytically (each
station of the thread meets a transverse plane where its radius is
h / sin(psi), a z-interval or two per station) and unioned those bands;
it was never conjugate to better than ~1000 mm^3 of overlap at any phase
and was set aside (sessions/2026-09-11-223025.md). Sectioning the real
solid makes the generator and the mesh check's worm the same surface to
the micron, and the pipeline's every detail has already earned its keep
on the hypoid pinion.

The check that matters (tests/test_globoid_worm.py): the built worm,
placed in the wheel frame at several turn angles with the wheel turned
by the ratio, overlaps the built wheel by sliver amounts only, and turned
half a wheel pitch off collides.
"""
from __future__ import annotations

import math

import build123d as bd
import numpy as np

from generation import MeshSectioner, swept_station, space_tool, cut_spaces
from globoid_worm import GloboidWormParams, thread_solids


HOB_ROOT_OVERLAP_MM = 1.0     # past the station margin, so every section reaches the clip disc
STATION_MARGIN_MM = 0.3       # the tool reaches this far past the blank's surface


def wheel_turn_rad(gp: GloboidWormParams, worm_turn_rad: float) -> float:
    """theta_g for a worm turn theta_w: the wheel's tooth space in the
    central plane moves by -sign theta_w z_w / z_g (thread_stations)."""
    sign = 1.0 if gp.hand != "left" else -1.0
    return -sign * worm_turn_rad * gp.starts / gp.wheel_teeth


def place_worm(worm, gp: GloboidWormParams, worm_turn_deg: float = 0.0):
    """The worm solid (its own frame) turned by worm_turn_deg about its own
    axis and placed in the wheel frame."""
    return (worm.rotate(bd.Axis.Z, worm_turn_deg)
                .rotate(bd.Axis((0, 0, 0), (0, 1, 1)), 180.0)
                .translate((gp.centre_distance, 0.0, 0.0)))


def wheel_outer_radius_at(gp: GloboidWormParams, h: float) -> float:
    """The throat: the wheel's tip radius at height h (about its axis) on
    the torus the wheel's addendum circle sweeps -- the revolve, about the
    wheel axis, of the circle of radius r_w - h_a about the worm's axis,
    which clears the worm's root by the clearance."""
    r = gp.pitch_radius - gp.addendum
    return gp.centre_distance - math.sqrt(max(0.0, r * r - h * h))


def wheel_rim_radius(gp: GloboidWormParams) -> float:
    """The outside radius, DIN 3975's d_e2 = d_a2 + m: the throat torus is
    turned down to this cylinder beyond the height where they meet. It is
    what keeps the teeth from running pointed toward the faces: off the
    central plane the far turns of the thread widen every space (measured
    on the reference set: 10.8 deg of the 12 deg pitch at the torus at
    h = 5 mm, the spaces merging at h = 5.5), so a blank that followed the
    torus out to the faces would have no tooth land there."""
    return gp.wheel_pitch_radius + gp.addendum + 0.5 * gp.module


def wheel_blank_radius_at(gp: GloboidWormParams, h: float) -> float:
    """The blank's outer radius at height h: the throat, capped at the rim."""
    return min(wheel_outer_radius_at(gp, h), wheel_rim_radius(gp))


def wheel_throat_half_height(gp: GloboidWormParams) -> float:
    """Where the throat torus meets the outside cylinder (0 if the rim is
    below the throat everywhere)."""
    r = gp.pitch_radius - gp.addendum
    d = gp.centre_distance - wheel_rim_radius(gp)
    return math.sqrt(max(0.0, r * r - d * d))


def wheel_blank_solid(gp: GloboidWormParams) -> bd.Part:
    """The throated blank: revolve about Z of the outline whose outer edge
    is the arc of wheel_outer_radius_at between the two faces -- one
    toroidal face (the arc is a true circle, the worm's root circle about
    its axis), which the z_g space cuts meet 30x faster than the 32
    conical facets a polyline gave -- bored if asked."""
    b = gp.wheel_face_width
    r_in = gp.wheel_bore_diameter_mm / 2.0
    h_t = min(wheel_throat_half_height(gp), 0.5 * b)
    lo, mid, hi = ((wheel_outer_radius_at(gp, h), h) for h in (-h_t, 0.0, h_t))
    r_e = wheel_rim_radius(gp)
    with bd.BuildPart() as part:
        with bd.BuildSketch(bd.Plane.XZ):
            with bd.BuildLine():
                if h_t < 0.5 * b:
                    bd.Line((r_in, -0.5 * b), (r_e, -0.5 * b))
                    bd.Line((r_e, -0.5 * b), lo)
                    bd.ThreePointArc(lo, mid, hi)
                    bd.Line(hi, (r_e, 0.5 * b))
                    bd.Line((r_e, 0.5 * b), (r_in, 0.5 * b))
                else:
                    bd.Line((r_in, -0.5 * b), lo)
                    bd.ThreePointArc(lo, mid, hi)
                    bd.Line(hi, (r_in, 0.5 * b))
                bd.Line((r_in, 0.5 * b), (r_in, -0.5 * b))
            bd.make_face()
        bd.revolve(axis=bd.Axis.Z, revolution_arc=360)
    return part.part


# ---- the station plane, pulled back into the worm's frame ----

def _rot(axis, angle_rad: float) -> np.ndarray:
    u = np.asarray(axis, dtype=float)
    u = u / np.linalg.norm(u)
    K = np.array([[0.0, -u[2], u[1]], [u[2], 0.0, -u[0]], [-u[1], u[0], 0.0]])
    return np.eye(3) + math.sin(angle_rad) * K + (1.0 - math.cos(angle_rad)) * (K @ K)


_HALF_TURN = _rot((0.0, 1.0, 1.0), math.pi)     # place_worm's rotation; its own inverse


def station_plane_in_worm_frame(gp: GloboidWormParams, h: float, worm_turn_rad: float) -> bd.Plane:
    """The wheel's station plane Z = h at worm turn theta_w, in the worm's
    own (static) frame, its axes the wheel's X and Z carried through the
    same rigid map -- so a section read in this plane's local coordinates
    is already in the wheel frame at that station.  The wheel-frame
    placement of the worm is T = R_Z(-theta_g) o place_worm o R_Z(theta_w);
    the plane is pulled back by T^-1 = R_Z(-theta_w) o place_worm^-1 o
    R_Z(theta_g), place_worm^-1 being the translation by (-a, 0, 0)
    followed by the half-turn."""
    theta_g = wheel_turn_rad(gp, worm_turn_rad)
    lin = _rot((0, 0, 1), -worm_turn_rad) @ _HALF_TURN @ _rot((0, 0, 1), theta_g)
    origin = _rot((0, 0, 1), theta_g) @ np.array([0.0, 0.0, h])
    origin = _rot((0, 0, 1), -worm_turn_rad) @ (_HALF_TURN @ (origin - np.array([gp.centre_distance, 0.0, 0.0])))
    return bd.Plane(origin=tuple(origin), x_dir=tuple(lin @ np.array([1.0, 0.0, 0.0])), z_dir=tuple(lin @ np.array([0.0, 0.0, 1.0])))


def hob_threads(gp: GloboidWormParams, n_per_turn: int = 48) -> list[bd.Solid]:
    """The hob: the worm's own thread lofts (the same stations, the same
    flank lines) with the tip carried the root clearance c = h_f - h_a
    further toward the wheel centre -- so the wheel's root clears the
    worm's tip by c, as the wheel's tip clears the worm's root -- and the
    root side carried HOB_ROOT_OVERLAP_MM into the core, past the station
    margin, so every station section reaches the clip disc's rim (the
    hypoid's extended gear tooth, section 21.2)."""
    return thread_solids(gp, n_per_turn, tip_extension_mm=gp.dedendum - gp.addendum,
                         root_overlap_mm=HOB_ROOT_OVERLAP_MM)


def worm_turns_rad(gp: GloboidWormParams, n_positions: int) -> np.ndarray:
    """The worm turns sampled: one period 2 pi / z_w, end excluded. A period
    later the worm is the same solid, and the spaces its other turns cut
    at any one phase are this space at the phases a period apart (pitch
    folding in swept_station), so one period with the folds is the whole
    sweep."""
    period = 2.0 * math.pi / gp.starts
    return -0.5 * period + period * np.arange(n_positions) / n_positions


def fold_copies(gp: GloboidWormParams) -> int:
    """Spaces either side of the target the thread reaches: half the wrap
    in pitches, plus the thread's own end margin, plus one."""
    pitch = 2.0 * math.pi / gp.wheel_teeth
    return int(math.ceil(0.5 * gp.wrap_angle_rad / pitch)) + 2


def wheel_space_sections(gp: GloboidWormParams, hob, z_stations, disc_radii, n_positions: int, tolerance: float = 0.005):
    turns = worm_turns_rad(gp, n_positions)
    pitch = 2.0 * math.pi / gp.wheel_teeth
    return [swept_station(hob, [station_plane_in_worm_frame(gp, h, t) for t in turns], R, R + 1.0, h, tolerance,
                          fold_pitch_rad=pitch, fold_copies=fold_copies(gp), wedge_half_angle_rad=0.5 * pitch)
            for h, R in zip(z_stations, disc_radii)]


def wheel_stations(gp: GloboidWormParams, n_stations: int):
    """Station heights from one face to the other, a margin past each, and
    the clip radius at each: the blank's outer radius there plus the margin
    (the hob's root overlap reaches further, so the section always meets it)."""
    b, margin = gp.wheel_face_width, STATION_MARGIN_MM
    z_st = [-0.5 * b - margin + (b + 2.0 * margin) * i / (n_stations - 1) for i in range(n_stations)]
    return z_st, [wheel_blank_radius_at(gp, h) + margin for h in z_st]


def build_throated_wheel_solid(gp: GloboidWormParams, n_positions: int = 120, n_stations: int = 13, n_profile: int = 80,
                               n_per_turn: int = 48, hob=None, mesh_tolerance: float = 0.005):
    """The throated wheel: the blank minus z_g patterned copies of the one
    space the hob's threads sweep. `hob` is a MeshSectioner of hob_threads
    (built here if not passed)."""
    hob = hob if hob is not None else MeshSectioner(hob_threads(gp, n_per_turn), mesh_tolerance)
    z_st, radii = wheel_stations(gp, n_stations)
    sections = wheel_space_sections(gp, hob, z_st, radii, n_positions)
    tool = space_tool(sections, radii, z_st, n_profile)
    return cut_spaces(wheel_blank_solid(gp), tool, gp.wheel_teeth)


def build_globoid_pair(gp: GloboidWormParams, worm_turn_deg: float = 0.0, phase_error_deg: float = 0.0,
                       n_positions: int = 120, n_stations: int = 13, n_profile: int = 80, n_per_turn: int = 48):
    """(worm, wheel) in the wheel frame, in mesh for the worm turned by
    worm_turn_deg: the worm placed by place_worm, the wheel turned by the
    ratio (plus phase_error_deg, for the tests' deliberate mis-mesh)."""
    from globoid_worm import build_globoid_worm_solid
    worm = build_globoid_worm_solid(gp, n_per_turn)
    wheel = build_throated_wheel_solid(gp, n_positions, n_stations, n_profile, n_per_turn)
    wheel = wheel.rotate(bd.Axis.Z, math.degrees(wheel_turn_rad(gp, math.radians(worm_turn_deg))) + phase_error_deg)
    return place_worm(worm, gp, worm_turn_deg), wheel
