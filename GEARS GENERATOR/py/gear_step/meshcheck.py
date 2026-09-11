"""
Boolean interpenetration of two multi-body shapes -- the check every
multi-member family's tests use ("(near) zero for the correct placement, a
clear collision with one member turned half a pitch").

Done solid by solid with a bounding-box prefilter, NOT as one compound-
versus-compound boolean: OpenCASCADE's common of two compounds whose
members touch tangentially (meshing teeth do) silently returns nothing,
which reads as "no interpenetration" for the correct placement AND for a
mis-phased one -- measured on a straight bevel pair: 0.000 mm^3 both ways
as compounds, 0.12 mm^3 (in phase) versus 111 mm^3 (mis-phased) solid by
solid. A test built on the compound result could never fail.
"""
from __future__ import annotations

import build123d as bd


def volume_of(shape) -> float:
    if shape is None:
        return 0.0
    if isinstance(shape, bd.ShapeList):
        return sum(volume_of(s) for s in shape)
    solids = shape.solids()
    return sum(s.volume for s in solids) if solids else 0.0


def _boxes_overlap(a, b, margin: float = 0.0) -> bool:
    return not (a.max.X + margin < b.min.X or b.max.X + margin < a.min.X or
                a.max.Y + margin < b.min.Y or b.max.Y + margin < a.min.Y or
                a.max.Z + margin < b.min.Z or b.max.Z + margin < a.min.Z)


def interpenetration_volume(a: bd.Shape, b: bd.Shape) -> float:
    """Total volume of a ∩ b, summed over every pair of solids whose
    bounding boxes overlap."""
    total = 0.0
    solids_b = [(s, s.bounding_box()) for s in b.solids()]
    for sa in a.solids():
        box_a = sa.bounding_box()
        for sb, box_b in solids_b:
            if _boxes_overlap(box_a, box_b):
                total += volume_of(sa.intersect(sb))
    return total


def total_volume(shape: bd.Shape) -> float:
    return sum(s.volume for s in shape.solids())
