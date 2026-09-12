"""
Automated checks for one roller-chain link (docs/gear-math.md section 19).
Run with: python -m pytest gear_step/tests/test_chain_link.py -v
"""
import math
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import pytest

from chain_link import ChainLinkParams, build_chain_link_parts, build_chain_link_assembly
from sprocket import SprocketParams
from build_gear import build_sprocket_solid
from meshcheck import interpenetration_volume


def _cp(**kw) -> ChainLinkParams:
    base = dict(chain_pitch_mm=12.7, roller_diameter_mm=7.9248)
    base.update(kw)
    return ChainLinkParams(**base)


def test_pin_and_roller_spacing_is_exactly_the_chain_pitch():
    cp = _cp()
    parts = build_chain_link_parts(cp)
    for a, b in (("pin_0", "pin_1"), ("bushing_0", "bushing_1"), ("roller_0", "roller_1")):
        ca, cb = parts[a].center(), parts[b].center()
        assert abs(ca.Y - cb.Y) < 1e-9 and abs(ca.Z - cb.Z) < 1e-9
        assert abs((cb.X - ca.X) - cp.chain_pitch_mm) < 1e-9, (a, b, cb.X - ca.X)


def test_all_ten_parts_are_valid_manifold_solids():
    parts = build_chain_link_parts(_cp())
    assert len(parts) == 10
    for name, p in parts.items():
        sol = p.solids()
        assert len(sol) == 1 and sol[0].is_manifold and p.is_valid, name
    asm = build_chain_link_assembly(_cp())
    assert len(asm.solids()) == 10 and asm.is_valid


def test_rotating_pairs_clear_and_press_fit_pairs_are_flush():
    """The two things a real link's fits must satisfy: a pin turns freely
    inside its bushing and a bushing turns freely inside its roller (zero
    interpenetration, a real running clearance, not touching); a pin is a
    press fit in the outer plates and a bushing a press fit in the inner
    plates (also zero interpenetration here -- a nominal, non-interference
    fit, not modelled as literally overlapping material)."""
    cp = _cp()
    parts = build_chain_link_parts(cp)
    for a, b in (("pin_0", "bushing_0"), ("pin_1", "bushing_1"),
                 ("bushing_0", "roller_0"), ("bushing_1", "roller_1"),
                 ("pin_0", "outer_plate_a"), ("pin_0", "outer_plate_b"),
                 ("pin_1", "outer_plate_a"), ("pin_1", "outer_plate_b"),
                 ("bushing_0", "inner_plate_a"), ("bushing_0", "inner_plate_b"),
                 ("bushing_1", "inner_plate_a"), ("bushing_1", "inner_plate_b")):
        v = interpenetration_volume(parts[a], parts[b])
        assert v < 1e-6, (a, b, v)


@pytest.mark.parametrize("chain_pitch,roller_dia", [(12.7, 7.9248), (19.05, 11.91)])
def test_roller_seats_in_a_matching_sprocket_and_collides_half_a_pitch_off(chain_pitch, roller_dia):
    """The check that matters most: the real link's own roller, built by
    this module, seated in a sprocket built by sprocket.py from the SAME
    chain_pitch_mm/roller_diameter_mm -- not a stand-in circle on either
    side. Near-zero overlap at several gaps, a real collision half a pitch
    off (squarely on a tooth)."""
    sp = SprocketParams(z=20, chain_pitch_mm=chain_pitch, roller_diameter_mm=roller_dia, face_width_mm=6.0)
    gear = build_sprocket_solid(sp)
    cp = ChainLinkParams.from_sprocket_params(sp)
    roller = build_chain_link_parts(cp)["roller_0"]

    def seat(k: float):
        ang = k * sp.pitch_angle_rad
        x, y = sp.pitch_radius * math.sin(ang), sp.pitch_radius * math.cos(ang)
        return roller.translate((x, y, sp.face_width_mm / 2.0))

    worst = max(interpenetration_volume(gear, seat(k)) for k in (0, 1, sp.z // 2))
    bad = interpenetration_volume(gear, seat(0.5))
    assert worst < 1e-6 * roller.volume, worst
    assert bad > 0.1 * roller.volume and bad > 5.0, (bad, roller.volume)


def test_solid_builds_and_round_trips_as_step():
    from build_gear import export_chain_link_step
    cp = _cp()
    asm = build_chain_link_assembly(cp)
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "chain_link.step"
        export_chain_link_step(cp, path)
        imported = bd.import_step(str(path))
        assert len(imported.solids()) == 10


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
